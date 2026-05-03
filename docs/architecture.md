# Architecture

## Overview

Arcanum is a Node.js web application written in TypeScript, built on the Express framework. It is split into a public-facing password generator and a protected admin panel. Authentication is delegated entirely to Microsoft Entra ID via OpenID Connect, meaning no credentials are stored by the application itself.

## Stack

- **Runtime**: Node.js 20
- **Language**: TypeScript, compiled to CommonJS via `tsc`
- **Framework**: Express
- **Authentication**: Microsoft Authentication Library (MSAL) Node with OIDC
- **Frontend**: Vanilla HTML, CSS, and JavaScript with Tailwind CSS via CDN
- **Session storage**: Express Session with in-memory store
- **Persistence**: JSON files on disk for counter and settings

## Directory Structure

```
PasswordGenerator/
├── src/
│   ├── app.ts                  # Application entry point, middleware registration
│   ├── auth/
│   │   └── msalClient.ts       # MSAL ConfidentialClientApplication instance
│   ├── middleware/
│   │   ├── auth.ts             # requireAuth and requireRole middleware
│   │   ├── maintenance.ts      # Maintenance mode middleware
│   │   └── rateLimit.ts        # express-rate-limit configuration
│   ├── routes/
│   │   ├── public.ts           # Public routes: /, /generate, /api/me, /health
│   │   ├── auth.ts             # Auth routes: /auth/login, /auth/callback, /auth/logout
│   │   └── admin.ts            # Protected admin routes: /admin/*
│   └── utils/
│       ├── counter.ts          # Read/write generation counter to disk
│       ├── generator.ts        # Password, passphrase, and PIN generation logic
│       └── settings.ts         # Read/write application settings to disk
├── static/
│   ├── scripts.js              # Public frontend logic
│   ├── admin.js                # Admin panel frontend logic
│   └── style.css               # Shared stylesheet
├── views/
│   ├── index.html              # Public generator page
│   ├── admin.html              # Admin panel
│   ├── 401.html                # Unauthorised error page
│   ├── 404.html                # Not found error page
│   ├── logout.html             # Logout confirmation page
│   └── maintenance.html        # Maintenance mode page
├── dictionaries/
│   ├── en_GB-ise.txt           # SCOWL word list
│   ├── symbol_dictionary.json  # Symbol character set
│   └── dic_cleanup.ps1         # Dictionary cleanup tool
├── data/                       # Runtime data, not committed to source control
│   ├── counter.json            # Generation counter
│   └── settings.json           # Application settings
├── Dockerfile
├── .env
├── nodemon.json
├── tsconfig.json
└── package.json
```

## Request Lifecycle

### Public generation request

1. Browser loads `index.html` from `views/` via the public router
2. `scripts.js` fetches `/defaults` to populate the counter and `/api/me` to check login state
3. User configures options and clicks Generate
4. `scripts.js` POSTs to `/generate` with options as JSON
5. Maintenance middleware checks whether the service is available
6. Rate limiter checks request frequency
7. Server validates input, calls `generator.ts`, increments counter, returns result as JSON
8. `scripts.js` renders the result and updates the counter display

### Authentication and admin access

1. User navigates to `/auth/login`
2. MSAL builds an Entra ID authorisation URL and redirects the browser
3. User authenticates with Microsoft
4. Entra ID redirects to `/auth/callback` with an authorisation code
5. MSAL exchanges the code for tokens
6. Account details and role claims are written to the Express session
7. Browser is redirected to `/admin`
8. `requireAuth` middleware checks for a valid session on every admin request
9. `requireRole("admin")` checks the roles claim in the session

## Data Persistence

Arcanum uses flat JSON files rather than a database. This is appropriate for the scale of the application and keeps the deployment simple.

- `data/counter.json` stores the total number of passwords generated
- `data/settings.json` stores application settings, currently limited to maintenance mode state

Both files are mounted as a Docker volume so they persist across container rebuilds.

## Session Management

Sessions are stored in memory using the Express Session default store. This means sessions are lost on server restart. A persistent store such as Redis would be required if session persistence across restarts becomes a requirement. Sessions are signed using a secret key, expire after five hours, and are protected with `sameSite: lax`.

## Security Considerations

- Passwords are never logged or persisted
- Authentication is handled entirely by Microsoft Entra ID, no credentials are stored
- Access to the admin panel requires both a valid session and the `admin` role claim
- The `data/` directory is excluded from source control
- Rate limiting is applied to the `/generate` endpoint
- All generation uses `crypto.randomInt`, a cryptographically secure random number generator
- Maintenance mode protects the public surface while keeping admin and auth routes accessible
# Authentication

## Overview

Arcanum delegates authentication entirely to Microsoft Entra ID using OpenID Connect (OIDC). No passwords or credentials are stored by the application. The public password generator is accessible without authentication. The admin panel requires both a valid Microsoft login and the `admin` role assigned in the Password Generator Enterprise Application in the `pickering.cloud` tenant.

## How it works

When a user navigates to `/auth/login`, the application redirects them to the Microsoft login page. After a successful login, Microsoft redirects back to `/auth/callback` with an authorisation code. The application exchanges this code for an ID token using MSAL, extracts the user's account details and role claims, and writes them to a server-side session. The session cookie is then used to identify the user on subsequent requests.

The flow in sequence is:

```
User → /auth/login
     → Microsoft login page (login.microsoftonline.com)
     → /auth/callback?code=...
     → Session created
     → /admin
```

## App Registration

The application is registered in Entra ID under the `pickering.cloud` tenant. The registration uses the following configuration:

- **Supported account types**: Single tenant (pickering.cloud only)
- **Redirect URI**: `https://pickering.cloud/auth/callback` for production, `http://localhost:3000/auth/callback` for development
- **Client secret**: Used by MSAL to exchange authorisation codes for tokens server-side
- **API permissions**: Microsoft Graph delegated permissions for `openid`, `profile`, and `email`

## App Roles

Access to the admin panel is controlled by an app role defined on the Arcanum App Registration in Entra ID.

| Role | Value | Description |
|---|---|---|
| Admin | `admin` | Full access to the admin panel |

Roles are assigned to users via the Arcanum Enterprise Application in the `pickering.cloud` tenant under **Users and groups**. A user without the `admin` role assigned will receive a 403 Forbidden response when attempting to access the admin panel, even if they successfully authenticate with Microsoft.

**Assignment required** is enabled on the Enterprise Application, meaning only explicitly assigned users can log in at all. Any account outside the `pickering.cloud` tenant is rejected by Entra ID before it reaches the application.

## Session

After a successful login, the user's account details and role claims are stored in a server-side Express session. The session:

- Is signed with a secret key to prevent tampering
- Expires after five hours
- Is protected with `sameSite: lax` to guard against CSRF
- Uses the `secure` flag in production to prevent transmission over plain HTTP

Sessions are stored in memory by default and are lost on server restart.

## Logout

Navigating to `/auth/logout` presents a confirmation page. Confirming destroys the server-side session and redirects to the home page. This is a local logout only - the user's Microsoft session remains active, so re-authenticating will not require them to re-enter their Microsoft credentials unless their Microsoft session has also expired.
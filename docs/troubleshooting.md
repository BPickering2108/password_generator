# Troubleshooting

## Authentication

### Redirected to Microsoft login on every request

The session is not persisting between requests. Check the following:

- `SESSION_SECRET` is set in `.env` and is not empty
- `NODE_ENV` is not set to `production` on localhost - this enables the `secure` cookie flag which requires HTTPS and will silently drop the cookie on plain HTTP
- The session middleware is registered in `app.ts` before the routers

### 403 Forbidden after logging in

The authenticated user does not have the `admin` role assigned. In Entra ID:

1. Go to **Enterprise Applications** > Password Generator
2. Go to **Users and groups**
3. Confirm the user is listed and has the `admin` role assigned

If the user was recently assigned, try logging out and back in to get a fresh token with the updated claims.

### MSAL callback error / 401 page after login

The authorisation code exchange failed. Common causes:

- The redirect URI in `.env` does not exactly match the one registered in the App Registration in Entra ID, including trailing slashes
- The client secret has expired - check **Certificates & secrets** in the App Registration
- The authorisation code was already used or has expired - codes are single-use and expire quickly. Refreshing the callback URL will always fail; start a fresh login from `/auth/login`

### Login loop - redirected back to Microsoft immediately after authenticating

Entra ID is rejecting the user before the callback is reached. Check:

- **Assignment required** is enabled on the Enterprise Application and the user has not been assigned
- The user's account is from outside the `pickering.cloud` tenant and single-tenant restriction is blocking them

---

## Generation

### "No characters available after applying exclusions"

The combination of unchecked options and additional exclusions has eliminated all characters from the charset. Reduce the number of exclusions or enable additional character sets.

### "Word list is empty or could not be loaded"

The `en_GB-ise.txt` file is missing or empty. Verify it exists at `dictionaries/en_GB-ise.txt` and has content:

```bash
wc -l dictionaries/en_GB-ise.txt
```

If it is missing, re-run the dictionary setup script.

### Generation returns 429 Too Many Requests

The rate limiter has been triggered. The limit is 30 requests per minute per IP address. Wait a minute and try again.

### Generation returns 503 during maintenance

Maintenance mode is enabled. Log in to the admin panel at `/admin` and disable it using the maintenance toggle.

---

## Server

### Server fails to start - TypeScript compilation errors

Run the build step manually to see the full error output:

```bash
npm run build
```

Address any errors in `src/` before attempting to start the server.

### Nodemon restarts unexpectedly during development

Check `nodemon.json` is present in the project root and the `watch` field is set to `["src"]` only. Changes to `data/` should not trigger a restart.

### Container exits immediately after starting

Check the container logs:

```bash
docker compose logs arcanum
```

Common causes:

- Missing or malformed `.env` file on the server
- TypeScript compilation failure during the Docker build
- Port 3000 already in use on the host

### Health check failing

```bash
curl http://localhost:3000/health
```

If this returns a connection error, the container is not running. If it returns a non-200 response, check the container logs. If it returns HTML rather than JSON, a middleware is intercepting the request - check whether maintenance mode is enabled.

### Counter or settings not persisting across restarts

The `data/` directory must be mounted as a volume in `docker-compose.yml`:

```yaml
volumes:
  - ./data:/app/data
```

If the volume is missing, `data/` lives inside the container and is lost on every rebuild.

---

## Cloudflare Tunnel

### Site unreachable externally but working on localhost

- Confirm the tunnel is running: `cloudflared tunnel list`
- Confirm the public hostname in the tunnel config points to `localhost:3000`
- Check the tunnel logs for connection errors

### Auth callback fails in production but works locally

The `REDIRECT_URI` in the production `.env` must match the redirect URI registered in the Entra ID App Registration exactly, including the protocol and domain. Ensure `https://yourdomain.com/auth/callback` is listed under **Authentication** > **Redirect URIs** in the App Registration.
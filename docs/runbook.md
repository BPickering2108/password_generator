# Runbook

## Prerequisites

- Node.js 20 or later
- npm 9 or later
- Docker and Docker Compose (production deployment)
- A Microsoft Entra ID App Registration (see [AUTHENTICATION.md](AUTHENTICATION.md))

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Pickering-Cloud/Password-Generator.git /opt/arcanum
cd /opt/arcanum
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` from the project root and populate the required values:

To generate a secure `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start the development server

```bash
npm run dev
```

The server will start at `http://localhost:3000`. Nodemon watches `src/` for TypeScript changes and restarts automatically. Changes to `data/` and `static/` do not trigger a restart.

---

## Production Deployment

### Prerequisites on the server

- Docker
- Docker Compose
- A Cloudflare Tunnel configured to route your domain to `localhost:3000`
- nginx (optional, if proxying through nginx before the tunnel)

### 1. Clone the repository

```bash
git clone https://github.com/Pickering-Cloud/Password-Generator.git /opt/arcanum
cd /opt/arcanum
```

### 2. Configure environment variables

Copy `.env.example` from the project root and populate the required values:

To generate a secure `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Build and start the container

```bash
cd /opt/arcanum
docker compose up -d --build
```

The `data/` directory is mounted as a volume so the counter and settings persist across rebuilds.

### 4. Verify the deployment

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok", "uptime": 12, "version": "1.0.0" }
```

### 5. Subsequent deployments

SSH into the server and pull the latest changes:

```bash
cd /opt/arcanum
git pull
docker compose up -d --build
```

---

## Common Operations

### View container logs

```bash
docker compose logs -f arcanum
```

### Restart the container

```bash
docker compose restart arcanum
```

### Stop the container

```bash
docker compose down
```

### Rebuild without cache

```bash
docker compose build --no-cache
docker compose up -d
```

### Enable maintenance mode

Log in to the admin panel at `/admin` and use the maintenance mode toggle. Alternatively, edit `data/settings.json` directly on the server and restart the container:

```json
{ "maintenance": true }
```

### Reset the generation counter

Log in to the admin panel and use the counter reset section. Alternatively, edit `data/counter.json` directly:

```json
{ "count": 0 }
```

### Invalidate all sessions

Log in to the admin panel and click **Invalidate all sessions**. Note this will also invalidate your own session and redirect you to the home page.

### Rotate the session secret

Update `SESSION_SECRET` in `.env` on the server and restart the container. All existing sessions will be invalidated as they can no longer be verified against the new secret.

```bash
docker compose restart arcanum
```

### Rotate the client secret

1. Generate a new client secret in the Entra ID App Registration under **Certificates & secrets**
2. Update `CLIENT_SECRET` in `.env` on the server
3. Restart the container
4. Delete the old secret from Entra ID

---

## Updating Dependencies

```bash
npm audit
npm update
npm audit fix
```

For breaking changes flagged by `npm audit fix --force`, review the changelog of the affected package before applying.
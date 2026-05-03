# Arcanum #
 
A cryptographically secure password generator built with TypeScript and Express. Generates random character passwords, passphrases using a British English word list, and PINs. Access to the admin panel is controlled via Microsoft Entra ID.
 
**Version 1.0.0**
 
### Prerequisites
 
- Node.js 20 or later
- npm 9 or later
- A Microsoft Entra ID App Registration (for admin panel access)
- Docker and Docker Compose (for production deployment)

---

## Installation ##
 
### Windows ###
 
1. Install [Node.js 20](https://nodejs.org/)
2. Clone the repository:
```powershell
git clone https://github.com/Pickering-Cloud/Password-Generator.git arcanum
cd arcanum
```
3. Install dependencies:
```powershell
npm install
```
4. Create a `.env` file in the project root (see [Configuration](#configuration))
5. Start the development server:
```powershell
npm run dev
```
 
### MacOS ###
 
1. Install Node.js via [Homebrew](https://brew.sh/):
```bash
brew install node@20
```
2. Clone the repository:
```bash
git clone https://github.com/Pickering-Cloud/Password-Generator.git /opt/arcanum
cd /opt/arcanum
```
3. Install dependencies:
```bash
npm install
```
4. Create a `.env` file in the project root (see [Configuration](#configuration))
5. Start the development server:
```bash
npm run dev
```
 
### Linux ###
 
1. Install Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
2. Clone the repository:
```bash
git clone https://github.com/Pickering-Cloud/Password-Generator.git /opt/arcanum
cd /opt/arcanum
```
3. Install dependencies:
```bash
npm install
```
4. Create a `.env` file in the project root (see [Configuration](#configuration))
5. Start the development server:
```bash
npm run dev
```
 
The server will start at `http://localhost:3000`.
 
For production deployment, Docker, and server setup see [RUNBOOK.md](RUNBOOK.md).

## Usage
 
The public generator is available at `/` with no authentication required. Select a generation type, configure the options, and click Generate. The result can be copied to the clipboard directly from the page.
 
The admin panel is available at `/admin`. Access requires a Microsoft account assigned the `admin` role in the Password Generator Enterprise Application in the `pickering.cloud` tenant. See [AUTHENTICATION.md](AUTHENTICATION.md) for details.

## Configuration
 
Create a `.env` file in the project root with the following values:
 
| Variable | Description |
|---|---|
| `TENANT_ID` | Entra ID tenant ID |
| `CLIENT_ID` | App Registration client ID |
| `CLIENT_SECRET` | App Registration client secret |
| `REDIRECT_URI` | OAuth callback URI - `http://localhost:3000/auth/callback` for development |
| `SESSION_SECRET` | Random string used to sign session cookies |
| `NODE_ENV` | Set to `production` on the server, leave unset for development |
| `PORT` | Port to listen on, defaults to `3000` |
 
To generate a secure `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
 
For a full breakdown of the application architecture see [ARCHITECTURE.md](ARCHITECTURE.md).

## Roadmap

---

Software written by **Bradley Pickering**  
Licensed under [MIT License](LICENSE)

## Acknowledgements
 
- [SCOWL](http://wordlist.aspell.net/) by Kevin Atkinson - British English word list used for passphrase generation, used under the SCOWL licence
- [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js) - OpenID Connect authentication
- [Express](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DM Serif Display, DM Sans, DM Mono](https://fonts.google.com/) by Colophon Foundry - Typography via Google Fonts
# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and the format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added
- Placeholder for features merged but not yet released

---

## [1.0.0] - 2026-05-03
 
### Added
- Public password generator with three modes: passphrase, random character, and PIN
- Passphrase generation using SCOWL en_GB-ise word list with configurable word count and delimiter
- Random character generation with configurable length, character sets, and exclusions
- PIN generation with configurable length
- Options for uppercase, numbers, symbols, and ambiguous character inclusion
- Cryptographically secure generation using Node.js `crypto.randomInt`
- Copy to clipboard and clear clipboard functionality
- Persistent generation counter stored to disk
- Light and dark mode with preference saved to localStorage
- Microsoft Entra ID (Azure AD) authentication via MSAL Node and OIDC
- Role-based access control using Entra ID app roles
- Protected admin panel accessible to users with the `admin` role
- Admin panel with generation stats, uptime display, and maintenance status
- Counter reset functionality from the admin panel
- Maintenance mode toggle with dedicated public-facing maintenance page
- Session invalidation from the admin panel
- Rate limiting on the `/generate` endpoint
- Server-side input validation on all generation requests
- Health check endpoint at `/GET /health`
- Custom 404 and 401 error pages
- Logout confirmation page
- Docker support with persistent data volume
- Cache warming for word list and symbol dictionary at server startup
- Browser cache headers for static assets in production

---


[1.0.0]: https://github.com/Pickering-Cloud/Password-Generator/releases/tag/v1.0.0
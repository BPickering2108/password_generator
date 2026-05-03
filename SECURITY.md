# Security policy

## Supported versions

Only the versions listed below are currently receiving security updates.

| Version | Supported |
|---|---|
| 1.0.x | Yes |

---

## Reporting a vulnerability

**Please do not report security vulnerabilities via public GitHub issues.**

If you believe you have found a security vulnerability in this project, please disclose it responsibly by contacting us privately:

- **Email**: security@pickering.cloud
- **Subject line**: `[SECURITY] Brief description`

If you would like to encrypt your report, our PGP public key is available at [link or fingerprint here].

### What to include

To help us triage and reproduce the issue quickly, please provide:

- A description of the vulnerability and its potential impact
- The affected version(s)
- Step-by-step reproduction instructions
- Any proof-of-concept code (please keep this responsible -- do not use it against systems you do not own)
- Your suggested severity assessment, if you have one

---

## Response process

You can expect the following after submitting a report:

| Timeframe | Action |
|---|---|
| Within 7 business days | Acknowledgement of your report |
| Within 14 business days | Initial assessment and severity rating |
| Within 90 days | Patch released or documented mitigation provided |

We will keep you informed of progress throughout. If you do not receive an acknowledgement within 7 business days, please follow up via email.

---

## Disclosure policy

We follow a coordinated disclosure model:

- We ask that you give us a reasonable window (up to 90 days) to investigate and release a fix before any public disclosure.
- We will credit you in the release notes and changelog unless you prefer to remain anonymous.
- We will not pursue legal action against researchers acting in good faith under this policy.

---

## Scope

The following are in scope for vulnerability reports:

- All code in this repository
- The build and release pipeline where it could affect distributed artefacts

The following are out of scope:

- Vulnerabilities in third-party dependencies (please report these to the dependency maintainer directly; we will update our dependency once a fix is available upstream)
- Issues in infrastructure or hosting not managed by this project
- Social engineering or phishing attacks

---

## Known issues and mitigations

| CVE / Reference | Affected versions | Status | Notes |
|---|---|---|---|
|  |  |  |  |

---

## Security best practices for users

- Always use the latest supported release
- Do not run this tool with elevated privileges unless explicitly required
- Review `.env.example` carefully and ensure secrets are never committed to source control
- If deploying in a CI/CD pipeline, use short-lived tokens and the principle of least privilege
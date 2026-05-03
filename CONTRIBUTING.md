# Contributing

Thank you for taking the time to contribute. The following guidelines help keep the project maintainable and the review process straightforward for everyone.

---

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Getting started](#getting-started)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)
- [Development workflow](#development-workflow)
- [Commit messages](#commit-messages)
- [Pull requests](#pull-requests)
- [Coding standards](#coding-standards)

---

## Code of conduct

This project follows a standard code of conduct. Be respectful, constructive, and collaborative. Harassment or exclusionary behaviour of any kind will not be tolerated.

---

## Getting started

1. Fork the repository and clone your fork locally.
2. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
.venv\Scripts\Activate.ps1       # Windows (PowerShell)
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and populate any required values.
4. Confirm the test suite passes before making changes:

```bash
pytest
```

---

## Reporting bugs

Before opening an issue, please search existing issues to avoid duplicates.

When filing a bug report, include:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected behaviour versus actual behaviour
- Version of the project, Python/PowerShell version, and OS
- Any relevant log output or error messages (use code blocks)

---

## Suggesting features

Open an issue with the `enhancement` label. Describe the problem you are trying to solve rather than jumping straight to a proposed solution -- this makes it easier to discuss alternatives. Features that align with the project's existing scope are more likely to be accepted.

---

## Development workflow

Branch naming convention:

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/add-json-output` |
| Bug fix | `fix/short-description` | `fix/encoding-error-windows` |
| Documentation | `docs/short-description` | `docs/update-install-guide` |
| Refactor | `refactor/short-description` | `refactor/config-loader` |

Always branch from `main`. Keep branches focused on a single concern -- avoid mixing features and bug fixes in the same branch.

---

## Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Examples:

```
feat(output): add JSON export format
fix(parser): handle empty input files gracefully
docs(readme): update installation instructions
```

- Use the imperative mood in the summary ("add", not "added" or "adds")
- Keep the summary line under 72 characters
- Reference issue numbers in the footer: `Closes #42`

---

## Pull requests

- Open a pull request against `main`
- Fill in the pull request template in full
- Link any related issues
- Ensure all checks pass before requesting review
- Keep PRs small and focused -- large PRs take longer to review and are more likely to introduce conflicts
- Be responsive to review comments; PRs inactive for 30 days may be closed

---

## Coding standards

**Python**

- Style: [PEP 8](https://peps.python.org/pep-0008/), enforced via `ruff`
- Type hints required on all public functions
- Docstrings on all public functions and classes (Google style)
- Tests required for all new functionality; aim to keep coverage above 80%

**PowerShell**

- Follow the [PowerShell Practice and Style Guide](https://poshcode.gitbook.io/powershell-practice-and-style/)
- Use approved verbs (`Get-Verb` for the full list)
- Comment-based help required on all functions
- Use `[CmdletBinding()]` on all advanced functions

**General**

- No secrets, credentials, or personally identifiable information in commits
- Update `CHANGELOG.md` under `[Unreleased]` for any user-facing change
- Update documentation if behaviour changes
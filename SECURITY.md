# Security Policy

## Supported Versions

The `main` branch is the supported development line.

## Reporting a Vulnerability

Please do not open a public issue for security reports.

Email the maintainer or use GitHub's private vulnerability reporting if it is enabled for this repository. Include:

- A clear description of the issue
- Steps to reproduce it
- The affected browser or environment
- Any suggested fix, if known

## Security Goals

Gomoku Mini is currently a static browser game with no backend and no production dependencies. The project still treats security as part of normal maintenance:

- Avoid unsafe DOM insertion patterns
- Keep the dependency-free architecture unless a dependency has a clear reason
- Review future dependencies for supply-chain risk
- Keep GitHub Actions minimal and permission-scoped
- Encourage beginner-friendly but careful pull request review

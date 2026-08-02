# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, **do not open a public GitHub issue.**

1. Email your findings privately to the project maintainers.
2. Include detailed steps to reproduce, code snippets, or configurations showing the vulnerability.
3. Maintainers will acknowledge receipt within 48 hours and work with you to patch and disclose the issue responsibly.

## Security Measures

This project implements the following security measures:

### API Security
- All API routes enforce rate limiting (20 requests per minute per IP).
- Input validation with strict size limits on all user-submitted content.
- Error responses are sanitized — internal error details are never exposed to clients.
- API keys are loaded from environment variables, never hardcoded.

### HTTP Security Headers
- `X-Content-Type-Options: nosniff` — prevents MIME type sniffing.
- `X-Frame-Options: DENY` — prevents clickjacking via iframes.
- `X-XSS-Protection: 1; mode=block` — enables browser XSS filters.
- `Strict-Transport-Security` — enforces HTTPS with HSTS preload.
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer data leakage.
- `Permissions-Policy` — disables camera, microphone, and geolocation APIs.
- `X-Powered-By` header is removed.

### AI Security
- System prompts are server-side only and not exposed to clients.
- AI responses rendered via `react-markdown` (no raw HTML injection).
- No `dangerouslySetInnerHTML`, `innerHTML`, or `eval()` usage in the codebase.
- All links open with `rel="noopener noreferrer"`.

### Repository Security
- `.env` files are gitignored and never committed.
- Security-sensitive file extensions (`.key`, `.cert`, `.pem`, SSH keys) are gitignored.
- Dependabot is configured for automated dependency updates.
- CI pipeline includes security audit step.

# Security Policy

## Project Status

ZakatBridge is a static prototype. It does **not** process payments, store personal data, use cookies, or communicate with any server. Even so, we take security seriously — especially because a future version may handle sensitive information.

## Supported Versions

Only the latest version on the `main` branch is supported.

## Reporting a Vulnerability

**Please do not open a public issue for security problems.**

1. Use GitHub's **private vulnerability reporting** ("Security" tab → "Report a vulnerability") on the repository, or contact the maintainers privately.
2. Include a description, steps to reproduce, and the potential impact.
3. You should receive an acknowledgement within 7 days.
4. Please allow reasonable time for a fix before public disclosure.

## Current Security Measures

- **Content Security Policy** restricting scripts and styles to the same origin, blocking network requests (`connect-src 'none'`) and form submissions (`form-action 'none'`).
- **No `innerHTML` with dynamic data** — DOM content is built using `textContent` to prevent cross-site scripting (XSS).
- **Input validation and whitelisting** for all form values.
- **No third-party scripts, fonts, analytics, or trackers.**
- **No personal or payment data requested.** The only value stored locally is the language preference.
- `referrer` policy set to `no-referrer`.

## Guidance for Contributors

- Never commit secrets, API keys, or credentials.
- Do not add external scripts or CDNs without discussion.
- Do not add any form field that requests payment details, government IDs, or other sensitive information.
- Any future backend or payment integration must undergo a dedicated security and privacy review, and should rely on established, licensed payment providers rather than handling card data directly.

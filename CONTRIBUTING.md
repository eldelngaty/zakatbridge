# Contributing to ZakatBridge

Thank you for wanting to help! ZakatBridge is a small, beginner-friendly project. You do not need to be an expert — questions, typo fixes, and translation improvements are all valuable.

## Ground Rules

1. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
2. **Protect dignity and privacy.** Never add real names, photos, addresses, phone numbers, or stories of real beneficiaries.
3. **Be honest.** Do not add fabricated statistics, partnerships, testimonials, or contributor counts. All demo data must be clearly labelled as fictional.
4. **Keep it simple.** Plain HTML, CSS, and vanilla JavaScript. No frameworks, build tools, paid APIs, or external CDNs without prior discussion in an issue.
5. **Never collect real money or sensitive data** in this prototype.

## Ways to Contribute

- 🐛 Report bugs or accessibility problems
- 🌍 Improve Arabic or English translations
- 🎨 Improve design and mobile layout
- ♿ Test with screen readers and keyboard-only navigation
- 📖 Improve documentation
- 🕌 Review Zakat explanations and calculator logic (scholars and knowledgeable community members)
- ⚖️ Advise on nonprofit, legal, and compliance questions

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/YOUR-USERNAME/zakatbridge.git
   ```

3. **Create a branch:**

   ```bash
   git checkout -b fix/short-description
   ```

4. Open `index.html` in your browser (or run `python3 -m http.server 8000`) and make your changes.
5. **Test** in both English and Arabic, on a narrow (mobile) and a wide screen.
6. **Commit** with a clear message and **push** your branch.
7. Open a **pull request** describing what you changed and why.

## Code Style

- **HTML:** semantic elements, every input has a `<label>`, translatable text has a `data-i18n` key.
- **CSS:** use the variables in `:root`; prefer logical properties (`margin-inline-start`) so RTL works automatically.
- **JavaScript:** `"use strict"`, `const`/`let`, small documented functions. **Never** use `innerHTML` with dynamic content — use `textContent` / `createElement`.
- Keep indentation at 2 spaces.

## Adding or Editing Translations

1. Add a `data-i18n="section.key"` attribute to the element in `index.html` (keep the English text inside as a fallback).
2. Add the same key to **both** `I18N.en` and `I18N.ar` in `script.js`.
3. Check the Arabic layout in RTL mode.

## Adding a Demo Case

Add an object to `DEMO_CASES` in `script.js`. Use an ID like `DEMO-007`, provide `en` and `ar` text, and make it obviously fictional (e.g. "Example region: …").

## Pull Request Checklist

- [ ] Works in English and Arabic (RTL)
- [ ] Works on mobile and desktop
- [ ] Keyboard accessible, with visible focus
- [ ] No real personal data, no fabricated claims
- [ ] No new external dependencies
- [ ] No console errors

## Questions?

Open an issue with the `question` label. Thank you for helping build something meaningful. 💚

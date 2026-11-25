# ZakatBridge — Open Source Humanitarian Platform

> ⚠️ **Prototype notice:** ZakatBridge is an early-stage, open-source **prototype**. It is **not** an operating or registered charity, it does **not** collect money, and it has **no** partner organizations at this time. Every case and number shown in the app is **fictional demonstration data**.

## 🌉 The Humanitarian Mission

Many Egyptians living in **Canada** and the **United States** want to support underprivileged families back home in **Egypt** through **Zakat** (obligatory annual charity) and **Sadaqah** (voluntary charity). Finding channels that are trustworthy, transparent, and respectful of the people receiving help is hard.

ZakatBridge explores what such a channel could look like, guided by four values:

| Value | What it means here |
|---|---|
| **Transparency** | Open source code, clear processes, and public reporting. |
| **Accountability** | Every contribution traceable from giver to recipient. |
| **Accessibility** | Arabic and English, RTL support, mobile-first, keyboard and screen-reader friendly. |
| **Dignity** | Beneficiaries identified only by anonymous codes — never exposed, shamed, or exploited. |

## ✨ Features (current MVP)

1. Responsive, professional homepage (green, white, and gold palette)
2. Arabic / English switch with full right-to-left (RTL) layout
3. Separate **Zakat** and **Sadaqah** categories
4. Directory of **fictional** example cases with category filters
5. **Simulated** donation form — no payment or personal data requested
6. Transparency dashboard computed from demo data only
7. Simple Zakat calculator (gold or silver nisab, user-entered metal price)
8. About Us & Mission section
9. Invitation for volunteers and open-source contributors

## 🏗️ Technical Architecture

ZakatBridge is a **static website** — no server, no database, no build step, no dependencies.

```
zakatbridge/
├── index.html          # Page structure & content (English text is the default)
├── style.css           # All styles: design tokens, layout, RTL, responsive rules
├── script.js           # All behaviour: i18n, cases, donation sim, dashboard, calculator
├── README.md           # This file
├── LICENSE             # MIT License
├── CONTRIBUTING.md     # How to contribute
├── CODE_OF_CONDUCT.md  # Community standards
├── SECURITY.md         # Security policy & reporting
├── ROADMAP.md          # Planned features
└── .gitignore
```

**How it works**

- **Translations:** every translatable element in `index.html` has a `data-i18n="key"` attribute. `script.js` holds an `I18N` dictionary (`en` and `ar`) and swaps text when the language changes. It also sets `<html lang>` and `<html dir="rtl|ltr">`.
- **RTL:** `style.css` uses CSS *logical properties* (`margin-inline-start`, `inset-inline-start`, …) so the layout mirrors automatically in Arabic.
- **Demo data:** the fictional cases live in the `DEMO_CASES` array at the top of `script.js`.
- **State:** simulated donations only change numbers in memory for the current browser tab. The only thing saved is your language choice (in `localStorage`).
- **Zakat calculation:** `net = assets − debts`; if `net ≥ nisab` (85 g gold or 595 g silver × price per gram), Zakat = `net × 2.5%`.

**Security & privacy considerations**

- Strict **Content Security Policy** (`<meta http-equiv="Content-Security-Policy">`): only same-origin scripts and styles; no network requests; forms can't submit anywhere.
- No `innerHTML` with dynamic data — all content is built with `textContent` to prevent XSS.
- No personal, financial, or payment information is requested or stored.
- No cookies, analytics, trackers, or third-party resources.

**Accessibility considerations**

- Semantic HTML landmarks, a "skip to content" link, and visible focus outlines
- Labelled form fields with inline error messages (`role="alert"`, `aria-invalid`)
- ARIA progress bars, `aria-live` result regions, and `aria-pressed` filter buttons
- Respects `prefers-reduced-motion`; good colour contrast; works at 320 px wide

## 🚀 Installation / Running Locally

No tools are required.

1. Download or clone this repository.
2. Open `index.html` in any modern browser (double-click it).

Optionally, run a tiny local server (useful for testing exactly like GitHub Pages):

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. Add `?lang=ar` to the URL to open directly in Arabic.

## 📤 Publishing on GitHub Pages (beginner guide)

**Option A — using the GitHub website only (no command line)**

1. Create a free account at [github.com](https://github.com) and sign in.
2. Click the **+** icon (top right) → **New repository**.
3. Name it `zakatbridge`, choose **Public**, leave "Add a README" **unchecked**, and click **Create repository**.
4. Unzip `zakatbridge.zip` on your computer.
5. On the new repository page, click **uploading an existing file**.
6. Open the unzipped folder, select **all files inside it** (including `.gitignore` — on macOS press `Cmd+Shift+.` to show hidden files; on Windows enable *View → Hidden items*), and drag them into the browser window.
7. Write a message like `Initial commit` and click **Commit changes**.
8. Go to **Settings** → **Pages** (left sidebar).
9. Under **Build and deployment → Source**, choose **Deploy from a branch**. Set **Branch** to `main` and folder to `/ (root)`, then click **Save**.
10. Wait 1–2 minutes and refresh. Your site will be live at
    `https://YOUR-USERNAME.github.io/zakatbridge/`

**Option B — using Git on the command line**

```bash
cd zakatbridge
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/YOUR-USERNAME/zakatbridge.git
```

```bash
git push -u origin main
```

Then follow steps 8–10 above to enable GitHub Pages.

## ⚠️ Current Limitations

- **Not operational:** no real donations, payment processing, or fund distribution.
- **Fictional data only:** cases, amounts, and dashboard figures are illustrative.
- **No verification workflow:** there are no field partners, auditors, or verified beneficiaries.
- **No accounts or backend:** nothing persists beyond the current browser tab (except language preference).
- **Simplified calculator:** does not cover every type of wealth or every school of thought; metal prices must be entered manually; the CAD/USD rate in the dashboard is fixed and illustrative.
- **No legal/regulatory review:** operating a real cross-border charity requires registered nonprofits, legal counsel, and compliance with Canadian, US, and Egyptian laws.
- **Translations:** Arabic text needs review by native speakers and scholars.

## 🗺️ Planned Features

See [ROADMAP.md](ROADMAP.md). Highlights:

- Expanded calculator (more asset types, lunar-year reminders)
- Improved Arabic content reviewed by native speakers and scholars
- Automated accessibility and unit tests
- Case data moved to a JSON file to make contributions easier
- Research into partnering with registered nonprofits and licensed payment processors
- A verification and reporting model designed together with community advisors

## 🤝 Contributing

Contributions of all kinds are welcome — code, design, translation, documentation, accessibility testing, and advice from Islamic finance, nonprofit, and legal experts.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).
2. Open an issue to discuss your idea or pick an existing one.
3. Fork the repository, create a branch, make your change, and open a pull request.

Please **never** add real beneficiary information, real photos of people in need, or unverifiable statistics.

## 🔐 Security

Please see [SECURITY.md](SECURITY.md) for how to report vulnerabilities privately.

## 📄 License

Released under the [MIT License](LICENSE).

``# Scalable E2E Web Automation Framework

A production-style end-to-end test automation framework built with **Playwright**, **JavaScript**, and **Node.js**, wired into a **GitHub Actions** CI/CD pipeline. Tests run against [SauceDemo](https://www.saucedemo.com), a stable public demo app, so the suite runs out of the box — swap `BASE_URL` to point at your own app.

## Tech Stack
- **Playwright** — cross-browser automation (Chromium, Firefox, WebKit)
- **JavaScript / Node.js**
- **Page Object Model (POM)** design pattern
- **GitHub Actions** — CI/CD with matrix builds, HTML reports, and trace artifacts

## Project Structure
```
playwright-e2e-framework/
├── .github/workflows/
│   └── playwright.yml        # CI pipeline: matrix run across 3 browsers + artifact upload
├── pages/                    # Page Object Model
│   ├── BasePage.js           # Shared actions/waits used by every page object
│   ├── LoginPage.js          # Authentication workflow
│   ├── InventoryPage.js      # Dynamic UI: sorting, cart badge, add/remove
│   ├── CartPage.js           # Cart review
│   └── CheckoutPage.js       # Data input form + order summary
├── tests/                    # Test specs, grouped by workflow
│   ├── auth.spec.js          # Login: positive + edge cases
│   ├── inventory.spec.js     # Dynamic UI interactions
│   └── checkout.spec.js      # Data input forms: positive + validation/edge cases
├── utils/
│   └── test-data.js          # Centralized fixtures (users, products, form data)
├── playwright.config.js      # Cross-browser projects, reporters, tracing
├── package.json
└── .env.example
```

## Why this structure
- **POM** keeps selectors and page logic in one place per screen, so a UI change means editing one file, not every test.
- **BasePage** removes repeated waiting/clicking/filling boilerplate across page objects.
- **Centralized test data** (`utils/test-data.js`) avoids hardcoded strings scattered across specs and makes it trivial to add new user/product fixtures.
- **Tagged tests** (`@smoke`, `@edge`) let you run a fast subset in CI (e.g. `--grep @smoke`) without touching the full regression suite.

## Getting Started

### 1. Install dependencies
```bash
npm install
npx playwright install --with-deps
```

### 2. Run the suite
```bash
npm test                    # all browsers, all tests
npm run test:chromium       # single browser
npm run test:auth           # single spec file
npx playwright test --grep @smoke   # tagged subset
```

### 3. Debug
```bash
npm run test:headed   # watch the browser
npm run test:debug    # Playwright Inspector, step through
npm run test:ui       # interactive UI mode
npm run codegen       # record new tests by clicking through the app
```

### 4. View results
```bash
npm run report   # opens the last HTML report
```
On failure, Playwright also captures a **trace**, a **screenshot**, and a **video**. Open a trace with:
```bash
npx playwright show-trace test-results/<failing-test-folder>/trace.zip
```

## Test Coverage

| Spec | Covers |
|---|---|
| `auth.spec.js` | Valid login, logout, locked-out user, invalid credentials, empty-field validation, error dismissal, case-sensitivity edge case |
| `inventory.spec.js` | 4-way sorting (name/price asc/desc), dynamic cart badge updates on add/remove, empty-cart state, cart persistence across pages |
| `checkout.spec.js` | End-to-end checkout, subtotal/tax/total calculation, missing-field validation for each required input, cancel-and-return flow |

**69 tests total** across the three browser projects (23 unique tests × 3 browsers).

## CI/CD Pipeline (`.github/workflows/playwright.yml`)
- Triggers on push/PR to `main`, manual dispatch, and a nightly cron
- Runs a **matrix job** — Chromium, Firefox, and WebKit in parallel, each in its own runner
- `fail-fast: false` so one browser's failure doesn't cancel the others
- Uploads the **HTML report**, **JUnit XML**, and **traces/videos/screenshots** as build artifacts (kept 14 days) — download them from the Actions run summary to debug failures without re-running locally
- A summary job aggregates artifact locations after the matrix completes

## Configuration
Copy `.env.example` to `.env` and adjust as needed:
```
BASE_URL=https://www.saucedemo.com
```
`playwright.config.js` reads `BASE_URL` so the same suite can target staging, QA, or production by changing one variable — no code edits required.

## Extending the Framework
- **New page/flow**: add a page object under `pages/` extending `BasePage`, add fixtures to `utils/test-data.js`, add a spec under `tests/`.
- **New browser/device**: add an entry to the `projects` array in `playwright.config.js` (mobile viewports are already stubbed in behind the `@mobile` tag).
- **Parallel scaling**: `fullyParallel: true` is already set; increase CI `workers` as your suite grows and runner capacity allows.

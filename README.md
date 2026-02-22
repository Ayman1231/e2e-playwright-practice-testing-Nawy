# Playwright E2E Automation

E2E tests for [Practice Software Testing](https://practicesoftwaretesting.com), combining API and UI flows (user registration, login, cart, checkout, invoice) using Playwright and TypeScript.

---

## Project structure

```
Playwright/
├── playwright.config.ts    # Playwright config (browsers, baseURL, report, screenshot on failure)
├── package.json             # Scripts and dependencies
├── README.md                # This file
├── PLAYWRIGHT-SETUP.md      # Optional: install browsers once so they persist (e.g. in Cursor)
├── tests/
│   └── e2e-ui-api.spec.ts  # E2E test: API (register, cart, invoice) + UI (login, checkout)
├── src/
│   ├── api/
│   │   └── apiClient.ts    # API helpers (register, login, products, cart, invoice)
│   └── pages/
│       ├── LoginPage.ts    # Page object for login
│       └── CheckoutPage.ts # Page object for checkout
├── playwright-report/       # HTML report (generated after each run)
└── test-results/            # Screenshots, videos, traces (on failure)
```

---

## How to install dependencies

1. **Node.js**  
   Ensure Node.js (e.g. v18+) is installed.

2. **Install npm packages**  
   From the project root:

   ```bash
   npm install
   ```

3. **Install browsers (first time)**  
   Install Chromium and Firefox so Playwright can run tests:

   ```bash
   npm run install:browsers
   ```

   If you use Cursor and want browsers to persist across restarts, see **PLAYWRIGHT-SETUP.md** (set `PLAYWRIGHT_BROWSERS_PATH` then run the command above once).

---

## How to run tests locally

- **All tests (headless, default):**
  ```bash
  npm test
  ```
  or only the E2E spec:
  ```bash
  npm run test:e2e
  ```

- **With browser window visible (Chromium):**
  ```bash
  npm run test:e2e:headed
  ```

- **Interactive UI mode:**
  ```bash
  npm run test:ui
  ```

After a run, the **HTML report** opens in the browser automatically (see `playwright.config.ts`). You can also open the last report with:

```bash
npx playwright show-report
```

---

## How to run tests in different browsers

The project is set up with two browser **projects**: Chromium and Firefox.

- **Run on all configured browsers (Chromium + Firefox) in parallel:**
  ```bash
  npx playwright test
  ```
  or for the E2E spec only:
  ```bash
  npx playwright test tests/e2e-ui-api.spec.ts
  ```

- **Run only on Chromium:**
  ```bash
  npx playwright test --project=chromium
  ```

- **Run only on Firefox:**
  ```bash
  npx playwright test --project=firefox
  ```

- **Run on a specific browser with the window visible:**
  ```bash
  npx playwright test tests/e2e-ui-api.spec.ts --project=chromium --headed
  npx playwright test tests/e2e-ui-api.spec.ts --project=firefox --headed
  ```

To add or change browsers, edit the `projects` array in **playwright.config.ts**.

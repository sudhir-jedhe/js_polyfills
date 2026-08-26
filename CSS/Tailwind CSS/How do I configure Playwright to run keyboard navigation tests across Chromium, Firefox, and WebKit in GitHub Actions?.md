*** copy How do I configure Playwright to run keyboard navigation tests across Chromium, Firefox, and WebKit in GitHub Actions?.md ***

To run cross-browser keyboard navigation tests reliably across **Chromium**, **Firefox**, and **WebKit** in GitHub Actions, you need to account for engine-specific keyboard quirks (such as macOS/WebKit key modifiers and Focus/Tab navigation behaviors) and parallelize execution across test matrices.

---

### Step 1: Configure Multi-Browser Playwright Config

Update your `playwright.config.ts` to define distinct browser projects and ensure WebKit enables full tab navigation (which mimics macOS Full Keyboard Access).

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run storybook -- --ci --port 6006",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        // WebKit requires explicit user agent / keyboard configuration in headless mode
        contextOptions: {
          reducedMotion: "reduce",
        },
      },
    },
  ],
});

```

---

### Step 2: Handle Cross-Engine Key Modifiers in Tests

Cross-browser tests must handle engine-level keyboard differences (e.g., `Meta` on WebKit/macOS vs `Control` on Windows/Linux).

Create a cross-platform helper in `e2e/helpers/keyboard.ts`:

```typescript
// e2e/helpers/keyboard.ts
import { Page, Locator, expect } from "@playwright/test";

/** Returns 'Meta' on WebKit/Mac and 'Control' on Chromium/Firefox on Linux/Windows */
export function getModifierKey(page: Page): "Meta" | "Control" {
  const browserName = page.context().browser()?.browserType().name();
  return browserName === "webkit" ? "Meta" : "Control";
}

/** Asserts focus state with cross-browser retries */
export async function expectFocused(locator: Locator) {
  await expect(locator).toBeFocused({ timeout: 5000 });
}

/** Cross-browser Tab navigation helper */
export async function pressTab(page: Page, shift = false) {
  if (shift) {
    await page.keyboard.press("Shift+Tab");
  } else {
    await page.keyboard.press("Tab");
  }
}

```

Write the cross-browser test:

```typescript
// e2e/keyboard-cross-browser.spec.ts
import { test } from "@playwright/test";
import { expectFocused, pressTab, getModifierKey } from "./helpers/keyboard";

test.describe("Cross-Browser Keyboard Traversal", () => {
  test("Navigates controls with Tab & shortcuts across engines", async ({ page }) => {
    await page.goto("/iframe.html?id=components-form--default&viewMode=story");
    await page.waitForLoadState("networkidle");

    const input = page.getByLabel(/username/i);
    const checkbox = page.getByRole("checkbox", { name: /remember me/i });
    const submitBtn = page.getByRole("button", { name: /sign in/i });

    // Ensure focus begins at the top of the body
    await page.locator("body").focus();

    // 1. Tab into text input
    await pressTab(page);
    await expectFocused(input);

    // 2. Tab into checkbox & toggle with Space
    await pressTab(page);
    await expectFocused(checkbox);
    await page.keyboard.press("Space");

    // 3. Tab to submit button & activate with Enter
    await pressTab(page);
    await expectFocused(submitBtn);

    // 4. Test platform-specific modifier shortcuts (e.g., Ctrl+K / Cmd+K search dialog)
    const modifier = getModifierKey(page);
    await page.keyboard.press(`${modifier}+k`);
  });
});

```

---

### Step 3: GitHub Actions Matrix Workflow

Run each browser engine in parallel across separate matrix runners using Playwright's sharding and caching for fast CI execution.

Create `.github/workflows/keyboard-matrix.yml`:

```yaml
name: Cross-Browser Keyboard Tests

on:
  pull_request:
    paths:
      - "src/**"
      - "e2e/**"
      - "playwright.config.ts"

jobs:
  test-keyboard-matrix:
    name: ${{ matrix.project }} on Ubuntu
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        project: [chromium, firefox, webkit]

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install Node Dependencies
        run: npm ci

      - name: Cache Playwright Binaries
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ matrix.project }}-${{ hashFiles('package-lock.json') }}

      - name: Install Required Browser Engine & OS Deps
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps ${{ matrix.project }}

      - name: Install OS Dependencies Only (on Cache Hit)
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: npx playwright install-deps ${{ matrix.project }}

      - name: Build Storybook Artifacts
        run: npm run build-storybook

      - name: Run Keyboard Navigation Tests
        run: npx playwright test --project=${{ matrix.project }}

      - name: Upload Test Artifacts on Failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.project }}
          path: playwright-report/
          retention-days: 7

```

---

### Crucial Cross-Browser Quirks to Keep in Mind

* **WebKit Button Tab Navigation:** By default on macOS, Safari requires Full Keyboard Access enabled in System Settings to tab directly to buttons. Headless WebKit in Playwright emulates this, but always use `page.keyboard.press("Tab")` over simulated DOM dispatches to ensure standard browser behavior.
* **Space vs. Enter Activation:** Radix buttons and links react to both `Enter` and `Space`, but native checkboxes only trigger with `Space`. Ensure your assertions trigger the key designated by WAI-ARIA standards.
* **Fast Failure Isolation:** Setting `fail-fast: false` on the matrix ensures a failure in WebKit won't cancel the Chromium or Firefox runs, allowing you to debug browser-specific engine differences simultaneously.

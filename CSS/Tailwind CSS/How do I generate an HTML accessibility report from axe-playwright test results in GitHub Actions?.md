*** copy How do I generate an HTML accessibility report from axe-playwright test results in GitHub Actions?.md ***

To generate a standalone, visual HTML accessibility report from `@axe-core/playwright` audits in CI, use the **`axe-html-reporter`** package. It compiles axe violation nodes, screenshots, and WCAG tags into a browsable report artifact.

---

### Step 1: Install Dependencies

```bash
npm install -D @axe-core/playwright axe-html-reporter

```

---

### Step 2: Configure the Report Generator Helper

Create `e2e/helpers/a11y-reporter.ts` to execute axe scans and output an HTML report:

```typescript
// e2e/helpers/a11y-reporter.ts
import { Page, TestInfo, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";
import * as path from "node:path";
import * as fs from "node:fs";

export interface A11yReportOptions {
  includeSelector?: string;
  reportName?: string;
  strictAAA?: boolean;
}

export async function runAndReportA11y(
  page: Page,
  testInfo: TestInfo,
  options: A11yReportOptions = {}
) {
  const {
    includeSelector = "#storybook-root",
    reportName = testInfo.title.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
    strictAAA = false,
  } = options;

  const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "cat.color"];
  if (strictAAA) {
    tags.push("wcag2aaa", "wcag21aaa");
  }

  // 1. Run Axe Analysis
  const results = await new AxeBuilder({ page })
    .include(includeSelector)
    .withTags(tags)
    .analyze();

  // 2. Output HTML report directory
  const reportDir = path.resolve(process.cwd(), "playwright-report/a11y");
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportHTML = createHtmlReport({
    results,
    options: {
      projectKey: "Design System Accessibility",
      customSummary: `Tested Story: ${testInfo.title}`,
      outputDir: reportDir,
      reportFileName: `${reportName}.html`,
    },
  });

  // 3. Attach report to Playwright's native test artifact viewer
  await testInfo.attach(`${reportName}-a11y-report`, {
    body: reportHTML,
    contentType: "text/html",
  });

  // 4. Assert zero violations
  expect(results.violations).toEqual([]);
}

```

---

### Step 3: Use the Helper in Playwright Specs

Pass the `testInfo` fixture from Playwright so test titles automatically generate unique report files:

```typescript
// e2e/a11y.spec.ts
import { test } from "@playwright/test";
import { runAndReportA11y } from "./helpers/a11y-reporter";

const STORIES = [
  { id: "components-button--all-variants", name: "Button Variants" },
  { id: "components-card--themed", name: "Themed Card" },
  { id: "components-dropdown--open", name: "Dropdown Menu" },
];

test.describe("Accessibility Audits", () => {
  for (const story of STORIES) {
    test(`A11y: ${story.name}`, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      // Runs scan, saves HTML report, and asserts 0 violations
      await runAndReportA11y(page, testInfo, {
        includeSelector: "#storybook-root",
      });
    });
  }
});

```

---

### Step 4: Configure GitHub Actions Workflow

Set up `.github/workflows/a11y-report.yml` to run the suite, upload the HTML reports as workflow artifacts, and optionally publish the summary to the Pull Request:

```yaml
name: Accessibility Audit & HTML Report

on:
  pull_request:
    paths:
      - "tokens/**"
      - "src/**"

jobs:
  a11y-test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.45.0-jammy

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Run Axe Audits & Generate HTML Reports
        run: npx playwright test e2e/a11y.spec.ts
        continue-on-error: true # Allows report upload step even when violations fail the build

      - name: Upload HTML Accessibility Reports
        uses: actions/upload-artifact@v4
        with:
          name: a11y-html-reports
          path: playwright-report/a11y/
          retention-days: 14

      - name: Upload Combined Playwright Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-full-report
          path: playwright-report/
          retention-days: 14

```

---

### Step 5: (Optional) Deploy HTML Reports to GitHub Pages for Live Viewing

Instead of downloading ZIP artifacts from GitHub Actions, deploy the generated `playwright-report/a11y/` directory to GitHub Pages to provide instant, shareable links in PR comments:

```yaml
      - name: Deploy Reports to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./playwright-report/a11y
          destination_dir: a11y-reports

```

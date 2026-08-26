*** copy How do I set up Playwright test sharding to run tests across 4 parallel GitHub Actions jobs?.md ***

Playwright has native support for **test sharding** via the `--shard=x/y` CLI argument.

To execute tests across 4 parallel jobs and combine the results into a single unified HTML report, use a GitHub Actions **matrix strategy** for the test workers followed by a **merge-reports** job.

---

### Step 1: Configure Playwright for Blob Reporting in CI

When sharding across multiple machines, each runner outputs a partial test log called a **blob report**. These are merged at the end.

Update `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Use 'blob' in CI for sharding; use 'html' locally
  reporter: process.env.CI
    ? [["blob", { outputDir: "blob-report" }], ["list"]]
    : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run storybook -- --ci --port 6006",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});

```

---

### Step 2: GitHub Actions Workflow with 4-Way Sharding

Create `.github/workflows/playwright-sharded.yml`:

```yaml
name: Playwright Tests (Sharded)

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # -------------------------------------------------------------
  # 1. RUN TESTS IN PARALLEL (4 SHARDS)
  # -------------------------------------------------------------
  test:
    name: Shard ${{ matrix.shardIndex }} of ${{ matrix.shardTotal }}
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.45.0-jammy
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

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

      - name: Build Storybook / Web Server
        run: npm run build-storybook

      - name: Run Playwright Tests (Shard ${{ matrix.shardIndex }}/${{ matrix.shardTotal }})
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload Shard Blob Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: blob-reports-shard-${{ matrix.shardIndex }}
          path: blob-report/
          retention-days: 1

  # -------------------------------------------------------------
  # 2. MERGE BLOB REPORTS INTO UNIFIED HTML REPORT
  # -------------------------------------------------------------
  merge-reports:
    name: Merge Test Reports
    needs: [test]
    if: always()
    runs-on: ubuntu-latest

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

      - name: Download All Blob Report Artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-reports-shard-*
          merge-multiple: true

      - name: Merge Reports into Final HTML Report
        run: npx playwright merge-reports --reporter=html all-blob-reports

      - name: Upload Final HTML Report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-final-html-report
          path: playwright-report/
          retention-days: 14

```

---

### How It Works Under the Hood

1. **Deterministic Distribution:** Playwright inspects your entire test directory and divides the test files evenly across the 4 runners based on the `--shard=1/4`, `--shard=2/4`, etc. flags.
2. **`blob-report` Files:** Each runner outputs its results as binary files (`.zip` containing test traces, timings, steps, and screenshots).
3. **`merge-multiple: true`:** Downloads all separate shard artifacts into a single folder (`all-blob-reports/`).
4. **`npx playwright merge-reports`:** Reconstructs the full test run into a single unified HTML dashboard, complete with traces and video recordings across all browsers and shards.

---

### Increasing or Decreasing Worker Count

To scale beyond 4 jobs, update the array in the workflow matrix:

```yaml
matrix:
  shardIndex: [1, 2, 3, 4, 5, 6, 7, 8]
  shardTotal: [8]

```

No changes to the test codebase or `playwright.config.ts` are required.

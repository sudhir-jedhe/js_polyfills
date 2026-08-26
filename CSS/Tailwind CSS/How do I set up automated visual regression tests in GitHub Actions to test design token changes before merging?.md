*** copy How do I set up automated visual regression tests in GitHub Actions to test design token changes before merging?.md ***

Automated visual regression testing ensures that updating design tokens (colors, spacing, typography, radii) doesn't introduce unintended layout shifts, broken contrast, or misaligned components.

The industry standard approach combines **Storybook + Playwright Test Runner** (or Chromatic) running inside **GitHub Actions** against your component library.

---

### Step 1: Install Playwright & Test Runner

```bash
npm install -D @playwright/test @storybook/test-runner concurrently wait-on
npx playwright install --with-deps chromium

```

---

### Step 2: Configure Visual Snapshot Test Suite

Create a visual regression test using Playwright that visits your Storybook components and captures pixel-perfect snapshots.

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // 1% tolerance for antialiasing
      animations: "disabled",  // Disable CSS animations for deterministic tests
    },
  },
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
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Dark Mode Chrome",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
      },
    },
  ],
});

```

---

### Step 3: Write Component Visual Tests

Create `e2e/visual-regression.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

const STORIES_TO_TEST = [
  { id: "components-button--all-variants", name: "Button Variants" },
  { id: "components-card--themed", name: "Themed Cards" },
  { id: "components-badge--all-intents", name: "Badges" },
  { id: "components-input--states", name: "Input States" },
];

test.describe("Visual Regression: Design Tokens", () => {
  for (const story of STORIES_TO_TEST) {
    test(`Snapshot: ${story.name}`, async ({ page }) => {
      // Navigate to isolated Storybook iframe canvas
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      
      // Wait for fonts and network idle
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      // Compare visual snapshot against baseline
      await expect(page.locator("#storybook-root")).toHaveScreenshot(
        `${story.id}.png`,
        { threshold: 0.2 }
      );
    });
  }
});

```

---

### Step 4: Configure GitHub Actions Workflow

Create `.github/workflows/visual-regression.yml`. This workflow runs on PRs modifying design tokens (`tokens/**` or `src/styles/**`), boots the app, executes the snapshot comparisons, and uploads diff artifacts if tests fail.

```yaml
name: Visual Regression Tests

on:
  pull_request:
    paths:
      - "tokens/**"
      - "src/styles/**"
      - "src/components/**"

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  visual-test:
    runs-on: ubuntu-latest
    container:
      # Use official Playwright container to avoid OS-level font rendering differences
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

      - name: Build Design Tokens
        run: npm run build:tokens

      - name: Build Storybook
        run: npm run build-storybook

      - name: Run Visual Regression Tests
        run: npx playwright test

      - name: Upload Test Results & Diffs on Failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-visual-diffs
          path: |
            test-results/
            e2e/__snapshots__/
          retention-days: 14

      - name: Post Visual Failure Summary
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ **Visual Regression Detected!**\n\nDesign token updates caused visual differences that exceed the threshold. Download the `playwright-visual-diffs` artifact from this workflow run to inspect side-by-side pixel diffs.'
            })

```

---

### Step 5: Handling Baseline Snapshots & Intentional Updates

When designers deliberately update token values (e.g., brand color shift from indigo to violet), baseline snapshots will naturally fail in CI.

Add an update workflow or run the update command locally inside Docker:

```json
// package.json
{
  "scripts": {
    "test:visual": "playwright test",
    "test:visual:update": "playwright test --update-snapshots"
  }
}

```

To regenerate snapshots matching Linux CI rendering:

```bash
docker run --rm -v $(pwd):/work/ -w /work/ mcr.microsoft.com/playwright:v1.45.0-jammy npm run test:visual:update

```

---

### Visual Diff Artifact Output Example

When a token introduces breaking changes, Playwright generates a 3-up image in `test-results/`:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Expected     │  │     Actual      │  │      Diff       │
│  (Baseline PR)  │  │  (New Tokens)   │  │ (Red Highlights)│
└─────────────────┘  └─────────────────┘  └─────────────────┘

```

---

### Key Best Practices

* **Containerized Execution:** Always run Playwright tests inside the official `[mcr.microsoft.com/playwright](https://mcr.microsoft.com/playwright)` Docker container in CI and when updating snapshots locally. Linux and macOS render fonts with subtle antialiasing variations that cause false positives.
* **Disable Transitions & Animations:** Ensure `--animate-*` and `transition-all` properties are disabled during snapshot capture using `page.evaluate(() => document.documentElement.classList.add('no-animations'))` or Playwright's `animations: "disabled"`.
* **Wait on Web Fonts:** Always execute `await page.evaluate(() => document.fonts.ready)` before capturing screenshot frames to prevent missing font flashes.

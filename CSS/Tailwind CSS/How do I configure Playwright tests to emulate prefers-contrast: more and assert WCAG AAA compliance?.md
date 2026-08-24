To emulate `prefers-contrast: more` and assert strict **WCAG AAA** compliance ($\ge 7:1$ for normal text, $\ge 4.5:1$ for large text/UI components) in Playwright, configure `page.emulateMedia({ contrast: 'more' })` and run `@axe-core/playwright` scoped specifically to the `wcag2aaa` and `wcag21aaa` rulesets.

---

### Step 1: Install Dependencies

```bash
npm install -D @playwright/test @axe-core/playwright

```

---

### Step 2: Configure Dedicated High-Contrast Projects in Playwright

In `playwright.config.ts`, add test projects that automatically emulate high-contrast media features for both Light and Dark themes:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "on-first-retry",
  },
  projects: [
    /* 1. Standard Light Mode */
    {
      name: "light-mode",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
      },
    },

    /* 2. High-Contrast Light Mode (Emulates prefers-contrast: more) */
    {
      name: "high-contrast-light",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
        contextOptions: {
          forcedColors: "none",
          reducedMotion: "reduce",
        },
      },
    },

    /* 3. High-Contrast Dark Mode */
    {
      name: "high-contrast-dark",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
      },
    },
  ],
});

```

---

### Step 3: Create the WCAG AAA Assertion Helper

Create `e2e/helpers/a11y-aaa.ts` to enforce the strict `wcag2aaa`, `wcag21aaa`, and `cat.color` axe tags:

```typescript
// e2e/helpers/a11y-aaa.ts
import { Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export interface A11yAaaOptions {
  includeSelector?: string;
  excludeSelector?: string;
}

export async function assertWcagAaa(
  page: Page,
  options: A11yAaaOptions = {}
) {
  const { includeSelector = "#storybook-root", excludeSelector } = options;

  let builder = new AxeBuilder({ page })
    .include(includeSelector)
    // Run core WCAG A/AA along with strict AAA and color/contrast rules
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag2aaa",
      "wcag21a",
      "wcag21aa",
      "wcag21aaa",
      "cat.color",
    ])
    // Ensure strict AAA enhanced contrast rule (7:1) is explicitly activated
    .withRules(["color-contrast-enhanced"]);

  if (excludeSelector) {
    builder = builder.exclude(excludeSelector);
  }

  const results = await builder.analyze();

  // Print helpful node targets in CI if violations occur
  if (results.violations.length > 0) {
    const errorDetails = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    }));

    console.error(
      `🚨 [WCAG AAA Violation] Found ${results.violations.length} issue(s):\n`,
      JSON.stringify(errorDetails, null, 2)
    );
  }

  expect(results.violations).toEqual([]);
}

```

---

### Step 4: Write High-Contrast & AAA Test Specs

Use `page.emulateMedia({ contrast: 'more' })` to trigger CSS media queries (`@media (prefers-contrast: more)`), then run AAA assertions and pixel snapshot tests:

```typescript
// e2e/high-contrast-aaa.spec.ts
import { test, expect } from "@playwright/test";
import { assertWcagAaa } from "./helpers/a11y-aaa";

const STORIES_TO_TEST = [
  { id: "components-button--all-variants", name: "Buttons" },
  { id: "components-card--themed", name: "Themed Cards" },
  { id: "components-input--states", name: "Form Inputs" },
  { id: "components-alert--all-statuses", name: "Alert Banners" },
];

test.describe("WCAG AAA High-Contrast Compliance", () => {
  for (const story of STORIES_TO_TEST) {
    test(`Audits & Snapshots (Light AAA): ${story.name}`, async ({ page }) => {
      // 1. Navigate to Storybook canvas
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      // 2. Emulate high-contrast media feature
      await page.emulateMedia({
        contrast: "more",
        colorScheme: "light",
      });

      // 3. Assert zero WCAG AAA contrast violations (>= 7:1)
      await assertWcagAaa(page, { includeSelector: "#storybook-root" });

      // 4. Pixel-diff snapshot for high-contrast light mode
      await expect(page.locator("#storybook-root")).toHaveScreenshot(
        `${story.id}-high-contrast-light.png`,
        { threshold: 0.2 }
      );
    });

    test(`Audits & Snapshots (Dark AAA): ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      // 1. Emulate high-contrast dark mode
      await page.emulateMedia({
        contrast: "more",
        colorScheme: "dark",
      });

      // Force .dark class if your theme switcher relies on class strategy
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });

      // 2. Run AAA audit under dark mode
      await assertWcagAaa(page, { includeSelector: "#storybook-root" });

      // 3. Pixel-diff snapshot for high-contrast dark mode
      await expect(page.locator("#storybook-root")).toHaveScreenshot(
        `${story.id}-high-contrast-dark.png`,
        { threshold: 0.2 }
      );
    });
  }
});

```

---

### Step 5: Test Windows High Contrast Mode (`forced-colors: active`)

To test how your components adapt under native Windows High Contrast mode (where the OS overrides colors with system keywords like `ButtonText`, `Highlight`, `CanvasText`), emulate `forcedColors: 'active'`:

```typescript
// e2e/forced-colors.spec.ts
import { test, expect } from "@playwright/test";
import { assertWcagAaa } from "./helpers/a11y-aaa";

test("Windows Forced Colors (High Contrast) Rendering", async ({ page }) => {
  await page.goto("/iframe.html?id=components-button--all-variants&viewMode=story");
  await page.waitForLoadState("networkidle");

  // Emulate Windows High Contrast Mode
  await page.emulateMedia({
    forcedColors: "active",
    colorScheme: "dark",
  });

  // Verify elements render required focus indicators and borders
  const primaryButton = page.getByRole("button", { name: /submit/i }).first();
  await primaryButton.focus();

  // Assert focused button receives active outline
  const outlineWidth = await primaryButton.evaluate(
    (el) => window.getComputedStyle(el).outlineWidth
  );
  expect(parseInt(outlineWidth, 10)).toBeGreaterThanOrEqual(2);

  await assertWcagAaa(page);
});

```

---

### Key Contrast Thresholds Checked by `color-contrast-enhanced`

| Element Type                                                 | WCAG AA Requirement | WCAG AAA Requirement (`color-contrast-enhanced`) |
| ------------------------------------------------------------ | ------------------- | ------------------------------------------------ |
| **Normal Body Text** ($< 18\text{pt}$ / $< 24\text{px}$)     | $\ge 4.5:1$         | **$\ge 7.0:1$**                                  |
| **Large Text** ($\ge 18\text{pt}$ or $\ge 14\text{pt}$ bold) | $\ge 3.0:1$         | **$\ge 4.5:1$**                                  |
| **UI Components & Borders**                                  | $\ge 3.0:1$         | **$\ge 4.5:1$**                                  |
| **Incidental / Disabled Elements**                           | No requirement      | No requirement                                   |
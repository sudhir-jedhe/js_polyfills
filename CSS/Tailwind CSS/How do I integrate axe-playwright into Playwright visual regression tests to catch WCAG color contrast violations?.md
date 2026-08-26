*** copy How do I integrate axe-playwright into Playwright visual regression tests to catch WCAG color contrast violations?.md ***

Integrating `@axe-core/playwright` into your existing visual regression test suite allows you to capture pixel-diff snapshots while simultaneously running rule-based accessibility audits—such as **WCAG 2.1 AA/AAA color contrast violations** (`color-contrast` and `color-contrast-enhanced`)—in a single test run.

---

### Step 1: Install Dependencies

```bash
npm install -D @axe-core/playwright

```

---

### Step 2: Create an Accessibility Audit Helper

Create a shared helper (`e2e/helpers/a11y.ts`) configured with specific WCAG rules and custom reporters:

```typescript
// e2e/helpers/a11y.ts
import { Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export interface A11yAuditOptions {
  /** Scope the scan to a specific CSS selector (e.g. '#storybook-root') */
  includeSelector?: string;
  /** Exclude specific unstable or dynamic elements */
  excludeSelector?: string;
  /** Test against WCAG AAA contrast standard (7:1) instead of AA (4.5:1) */
  strictAAA?: boolean;
}

export async function checkA11y(page: Page, options: A11yAuditOptions = {}) {
  const {
    includeSelector = "#storybook-root",
    excludeSelector,
    strictAAA = false,
  } = options;

  let builder = new AxeBuilder({ page })
    .include(includeSelector)
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "cat.color", // Specifically target color and contrast rules
    ]);

  if (strictAAA) {
    builder = builder.withTags(["wcag2aaa", "wcag21aaa"]);
  }

  if (excludeSelector) {
    builder = builder.exclude(excludeSelector);
  }

  const results = await builder.analyze();

  // Format error output for CI logs if violations exist
  if (results.violations.length > 0) {
    const violationSummary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    }));

    console.error(
      `🚨 [A11y Violation] Found ${results.violations.length} accessibility issue(s):\n`,
      JSON.stringify(violationSummary, null, 2)
    );
  }

  expect(results.violations).toEqual([]);
}

```

---

### Step 3: Combine Snapshot Tests with Contrast Audits

Update your Storybook test runner spec (`e2e/visual-regression.spec.ts`) to execute visual snapshot assertions and axe-core contrast checks together:

```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from "@playwright/test";
import { checkA11y } from "./helpers/a11y";

const STORIES_TO_TEST = [
  { id: "components-button--all-variants", name: "Button Variants" },
  { id: "components-card--themed", name: "Themed Cards" },
  { id: "components-badge--all-intents", name: "Badges" },
  { id: "components-input--states", name: "Input States" },
];

test.describe("Visual Regression & A11y Contract", () => {
  for (const story of STORIES_TO_TEST) {
    test(`Visual & A11y Audit: ${story.name}`, async ({ page }) => {
      // 1. Navigate to isolated Storybook canvas
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

      // 2. Wait for fonts and network idle before testing
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      // 3. Automated A11y & Contrast Scan (Fails on WCAG AA contrast violations)
      await checkA11y(page, { includeSelector: "#storybook-root" });

      // 4. Pixel-Diff Visual Snapshot Test
      await expect(page.locator("#storybook-root")).toHaveScreenshot(
        `${story.id}.png`,
        { threshold: 0.2 }
      );
    });
  }
});

```

---

### Step 4: Targeting Specific Theme Modes (Light vs Dark)

Because contrast ratios often break in dark mode when surface tokens invert, ensure your Playwright project matrix passes theme attributes before running `checkA11y`:

```typescript
// e2e/dark-mode.spec.ts
import { test, expect } from "@playwright/test";
import { checkA11y } from "./helpers/a11y";

test("Dark Mode Token Contrast Validation", async ({ page }) => {
  await page.goto("/iframe.html?id=components-card--themed&viewMode=story");

  // Force dark mode class on root
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });

  await page.waitForTimeout(100); // Allow styles to settle

  // Runs axe-core against dark mode color variables
  await checkA11y(page);

  // Snapshot under dark mode
  await expect(page.locator("#storybook-root")).toHaveScreenshot(
    "card-dark-mode.png"
  );
});

```

---

### Violation Output in CI

When a design token change fails contrast requirements (e.g., using `--color-primary: #818cf8` on a white background), `axe-playwright` outputs structured terminal logs pointing directly to the offending DOM node:

```text
🚨 [A11y Violation] Found 1 accessibility issue(s):
[
  {
    "id": "color-contrast",
    "impact": "serious",
    "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    "helpUrl": "https://dequeuniversity.com/rules/axe/4.9/color-contrast",
    "nodes": [
      {
        "target": ["button.bg-primary"],
        "html": "<button class=\"bg-primary text-primary-foreground\">Save Changes</button>",
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 3.12 (foreground color: #ffffff, background color: #818cf8, font size: 10.5pt (14px), font weight: 500). Expected contrast ratio of 4.5:1"
      }
    ]
  }
]

```

---

### Key Advantages

* **Dual Validation:** Catches subtle alpha-transparency issues and invalid color tokens programmatically before a human needs to inspect pixel diffs.
* **Zero Extra Test Runs:** Runs alongside existing visual regression tests within the same Playwright execution loop.
* **Deterministic CI Pipeline:** Prevents contrast regressions from entering `main` during design token synchronization.

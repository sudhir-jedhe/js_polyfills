***  How do I write Playwright automated tests to resize container elements and test container query breakpoint changes?.md ***

Because container queries respond to the inline size of their parent element rather than the browser window, testing them requires resizing the **container element itself** (or its parent wrapper) and verifying the computed styles or DOM changes.

---

### Step 1: Create Container Resizing Test Helpers

Create `e2e/helpers/container-queries.ts` with helper functions to resize containers programmatically via inline styles or class manipulation:

```typescript
// e2e/helpers/container-queries.ts
import { Locator, Page, expect } from "@playwright/test";

/**
 * Resizes a container element by applying inline width and awaiting layout stabilization
 */
export async function setContainerWidth(container: Locator, widthPx: number) {
  await container.evaluate((el: HTMLElement, width: number) => {
    el.style.width = `${width}px`;
    el.style.maxWidth = "none";
    el.style.minWidth = "none";
  }, widthPx);

  // Assert bounding box has resolved to the requested width
  await expect(async () => {
    const box = await container.boundingBox();
    expect(box?.width).toBeCloseTo(widthPx, 1);
  }).toPass({ timeout: 2000 });
}

/**
 * Asserts the computed CSS display/flex-direction or style on a child element
 */
export async function expectComputedStyle(
  element: Locator,
  property: keyof CSSStyleDeclaration,
  expectedValue: string
) {
  await expect.poll(async () => {
    return element.evaluate((el, prop) => {
      const styles = window.getComputedStyle(el);
      return styles[prop as any];
    }, property);
  }, {
    message: `Expected ${String(property)} to be "${expectedValue}"`,
    timeout: 3000,
  }).toBe(expectedValue);
}

```

---

### Step 2: Write Tests for Container Query Breakpoints

Given a card that transitions from a vertical stack (`flex-col`) to a horizontal layout (`@sm:flex-row` at $384\text{px}$) and reveals an extended description at `@lg` ($512\text{px}$):

```typescript
// e2e/container-card.spec.ts
import { test, expect } from "@playwright/test";
import { setContainerWidth, expectComputedStyle } from "./helpers/container-queries";

test.describe("Container Query Responsive States", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-responsiveproductcard--default&viewMode=story");
    await page.waitForLoadState("networkidle");
  });

  test("renders stacked layout below @sm threshold (<384px)", async ({ page }) => {
    const container = page.locator(".@container").first();
    const card = container.getByRole("article");
    const ratingBadge = card.getByText(/★ 4.9/i);
    const description = card.getByText(/engineered with high-fidelity/i);

    // 1. Set container below the @2xs (256px) breakpoint
    await setContainerWidth(container, 240);

    // Assert flex-direction is column
    await expectComputedStyle(card, "flexDirection", "column");

    // Rating badge (@2xs:inline-flex) should be hidden
    await expect(ratingBadge).toBeHidden();

    // Extended description (@lg:block) should be hidden
    await expect(description).toBeHidden();
  });

  test("reveals rating badge when container crosses @2xs (>=256px)", async ({ page }) => {
    const container = page.locator(".@container").first();
    const card = container.getByRole("article");
    const ratingBadge = card.getByText(/★ 4.9/i);

    // 2. Expand container to 300px (crosses @2xs: 256px, below @sm: 384px)
    await setContainerWidth(container, 300);

    // Rating badge should now be visible
    await expect(ratingBadge).toBeVisible();

    // Card should still be vertically stacked
    await expectComputedStyle(card, "flexDirection", "column");
  });

  test("switches to horizontal layout when container crosses @sm (>=384px)", async ({ page }) => {
    const container = page.locator(".@container").first();
    const card = container.getByRole("article");

    // 3. Expand container to 400px (crosses @sm: 384px)
    await setContainerWidth(container, 400);

    // Layout should flip from flex-col to flex-row
    await expectComputedStyle(card, "flexDirection", "row");
  });

  test("reveals full description when container crosses @lg (>=512px)", async ({ page }) => {
    const container = page.locator(".@container").first();
    const description = container.getByText(/engineered with high-fidelity/i);

    // 4. Expand container to 600px (crosses @lg: 512px)
    await setContainerWidth(container, 600);

    // Description (@lg:block) is now displayed
    await expect(description).toBeVisible();
  });
});

```

---

### Step 3: Test Resizable Split Panes (Interactive Dragging)

When testing named containers inside resizable split panels or drawer sidebars:

```typescript
// e2e/split-panel-container.spec.ts
import { test, expect } from "@playwright/test";

test("adapts sidebar sub-components as split panel handle is dragged", async ({ page }) => {
  await page.goto("/dashboard");

  const sidebar = page.locator(".@container\\/sidebar");
  const dragHandle = page.getByRole("separator", { name: /resize sidebar/i });
  const quickActionBtn = sidebar.getByRole("button", { name: /quick action/i });

  // 1. Initial narrow sidebar (e.g. 280px) -> button is full-width
  await expect(quickActionBtn).toBeVisible();

  // 2. Drag separator rightwards to expand sidebar width past 400px
  const handleBox = await dragHandle.boundingBox();
  if (handleBox) {
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + 200, handleBox.y, { steps: 10 });
    await page.mouse.up();
  }

  // 3. Verify that named container query (@sm/sidebar:flex-row) triggered
  const actionContainer = quickActionBtn.locator("..");
  const flexDirection = await actionContainer.evaluate((el) => window.getComputedStyle(el).flexDirection);
  expect(flexDirection).toBe("row");
});

```

---

### Verification Summary

* **Do not use `page.setViewportSize()` for container tests:** Modifying the browser viewport tests media queries (`@media`), not container queries (`@container`).
* **Wait for Style Recalculation:** Use `expect.poll()` or `toPass()` when evaluating computed styles right after modifying dimensions to allow the browser's layout engine to settle.
* **Escape Special Characters in Locators:** Container class names contain special characters (`@` and `/`). In CSS selectors, escape them using `\\@` and `\\/` (e.g., `.@container\\/sidebar`).

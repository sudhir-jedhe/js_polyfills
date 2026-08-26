*** copy How do I write automated Playwright tests to verify keyboard tab order and focus-visible rings across Radix components?.md ***

Testing keyboard navigation and focus rings across Radix UI primitives requires verifying two distinct behaviors:

1. **DOM Focus Flow & Trapping:** Ensuring `Tab`, `Shift+Tab`, `ArrowDown`/`ArrowUp`, and `Escape` follow WAI-ARIA roving tabindex and focus management patterns.
2. **Focus-Visible Ring Rendering:** Asserting that computed styles (like `box-shadow` or `outline` applied by Tailwind's `focus-visible:ring-*`) activate on keyboard interaction but remain suppressed on mouse clicks.

---

### Step 1: Create Focus & Ring Assertion Helpers

Create `e2e/helpers/keyboard.ts` to inspect the currently active DOM node and evaluate computed focus rings:

```typescript
// e2e/helpers/keyboard.ts
import { Page, Locator, expect } from "@playwright/test";

/** Asserts that a specific element currently holds DOM focus */
export async function expectFocused(locator: Locator) {
  await expect(locator).toBeFocused();
}

/** Evaluates whether an element is rendering an active focus ring */
export async function expectFocusRing(locator: Locator) {
  const hasRing = await locator.evaluate((el) => {
    const style = window.getComputedStyle(el);
    // Tailwind focus rings use box-shadow with custom CSS variables
    const boxShadow = style.boxShadow;
    const outline = style.outlineStyle;
    
    const hasVisibleBoxShadow = boxShadow !== "none" && boxShadow.length > 0;
    const hasVisibleOutline = outline !== "none" && style.outlineWidth !== "0px";
    
    return hasVisibleBoxShadow || hasVisibleOutline;
  });

  expect(hasRing).toBe(true);
}

```

---

### Step 2: Test 1 — Sequential Tab Navigation & Focus Ring

Verify that standard form controls receive focus in the correct order via the `Tab` key and render focus rings without ring bleeding:

```typescript
// e2e/keyboard-tab-order.spec.ts
import { test, expect } from "@playwright/test";
import { expectFocused, expectFocusRing } from "./helpers/keyboard";

test.describe("Keyboard Navigation & Focus Rings", () => {
  test("Sequential tab order across input and buttons", async ({ page }) => {
    await page.goto("/iframe.html?id=components-form--default&viewMode=story");
    await page.waitForLoadState("networkidle");

    const emailInput = page.getByLabel(/email/i);
    const submitBtn = page.getByRole("button", { name: /submit/i });
    const cancelBtn = page.getByRole("button", { name: /cancel/i });

    // 1. Initial click outside to clear state
    await page.locator("body").click();

    // 2. Tab to first input
    await page.keyboard.press("Tab");
    await expectFocused(emailInput);
    await expectFocusRing(emailInput);

    // 3. Tab to submit button
    await page.keyboard.press("Tab");
    await expectFocused(submitBtn);
    await expectFocusRing(submitBtn);

    // 4. Tab to cancel button
    await page.keyboard.press("Tab");
    await expectFocused(cancelBtn);
    await expectFocusRing(cancelBtn);

    // 5. Shift+Tab backward navigation
    await page.keyboard.press("Shift+Tab");
    await expectFocused(submitBtn);
  });
});

```

---

### Step 3: Test 2 — Radix Dialog Focus Trap & Escape Dismissal

Radix Dialog components must trap focus inside the modal boundary and restore focus to the trigger upon pressing `Escape`:

```typescript
// e2e/radix-dialog-keyboard.spec.ts
import { test, expect } from "@playwright/test";
import { expectFocused, expectFocusRing } from "./helpers/keyboard";

test("Radix Dialog: Focus trap and Escape restoration", async ({ page }) => {
  await page.goto("/iframe.html?id=components-dialog--modal&viewMode=story");

  const openTrigger = page.getByRole("button", { name: /open modal/i });

  // 1. Navigate to trigger with keyboard and open dialog
  await page.keyboard.press("Tab");
  await expectFocused(openTrigger);
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const firstInput = dialog.getByLabel(/first name/i);
  const saveBtn = dialog.getByRole("button", { name: /save changes/i });
  const closeBtn = dialog.getByRole("button", { name: /close/i });

  // 2. Verify initial focus shifts into the dialog
  await expectFocused(firstInput);

  // 3. Tab through trapped elements
  await page.keyboard.press("Tab");
  await expectFocused(saveBtn);
  await expectFocusRing(saveBtn);

  await page.keyboard.press("Tab");
  await expectFocused(closeBtn);

  // 4. Verify focus loops back to the first element (trap check)
  await page.keyboard.press("Tab");
  await expectFocused(firstInput);

  // 5. Press Escape to close and verify focus returns to trigger
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expectFocused(openTrigger);
});

```

---

### Step 4: Test 3 — Radix Dropdown Roving Focus (Arrow Keys)

Radix Dropdown Menus use arrow keys (`ArrowDown`, `ArrowUp`, `Home`, `End`) to navigate items rather than `Tab`:

```typescript
// e2e/radix-dropdown-keyboard.spec.ts
import { test, expect } from "@playwright/test";
import { expectFocused } from "./helpers/keyboard";

test("Radix Dropdown: Arrow key navigation and selection", async ({ page }) => {
  await page.goto("/iframe.html?id=components-dropdown--default&viewMode=story");

  const menuTrigger = page.getByRole("button", { name: /options/i });

  // 1. Focus trigger and open menu via Space
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();

  const profileItem = page.getByRole("menuitem", { name: /profile/i });
  const billingItem = page.getByRole("menuitem", { name: /billing/i });
  const settingsItem = page.getByRole("menuitem", { name: /settings/i });

  // 2. Radix focuses the first active item automatically
  await expectFocused(profileItem);

  // 3. Navigate down via ArrowDown
  await page.keyboard.press("ArrowDown");
  await expectFocused(billingItem);

  await page.keyboard.press("ArrowDown");
  await expectFocused(settingsItem);

  // 4. Wrap around navigation (if loop is enabled)
  await page.keyboard.press("ArrowDown");
  await expectFocused(profileItem);

  // 5. Select item with Enter
  await page.keyboard.press("Enter");
  await expect(menu).not.toBeVisible();
  await expectFocused(menuTrigger);
});

```

---

### Key Testing Guardrails

* **Avoid Mouse Interactions During Tests:** Avoid using `.click()` when validating keyboard flows; use `page.keyboard.press("Tab")` and `page.keyboard.press("Space")`/`Enter` to prevent mouse events from resetting `:focus-visible` states.
* **Inspect `document.activeElement` for Shadow DOM:** If wrapping custom web components, retrieve active elements using:

```typescript
await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));

```

* **Verify Disabled States:** Ensure disabled elements are skipped during `Tab` traversals by asserting they never receive focus.

*** copy Set up automated keyboard navigation tests in Playwright.md ***

Automating keyboard navigation tests in Playwright involves validating three core requirements:

1. **Focus Sequence (Tab / Shift+Tab)** follows natural visual and DOM order without trapping focus unexpectedly.
2. **Component Interactions (WAI-ARIA patterns)** respond correctly to `Enter`, `Space`, `Arrow` keys, and `Escape`.
3. **Focus States (`:focus-visible`)** are active when navigating via keyboard.

---

### Step 1: Create Shared Keyboard Navigation Helpers

Create `e2e/helpers/a11y-keyboard.ts` with custom assertions for active focus tracking, sequential element traversals, and focus ring evaluation:

```typescript
// e2e/helpers/a11y-keyboard.ts
import { Page, Locator, expect } from "@playwright/test";

/** Assert that a locator is the active focused DOM node */
export async function expectFocused(locator: Locator) {
  await expect(locator).toBeFocused({ timeout: 5000 });
}

/** Assert that an element is rendering an outline or box-shadow focus ring */
export async function expectVisibleFocusRing(locator: Locator) {
  const hasRing = await locator.evaluate((el) => {
    const style = window.getComputedStyle(el);
    const hasOutline = style.outlineStyle !== "none" && style.outlineWidth !== "0px";
    const hasBoxShadow = style.boxShadow !== "none" && style.boxShadow.length > 0;
    return hasOutline || hasBoxShadow;
  });
  expect(hasRing).toBe(true);
}

/**
 * Asserts sequential tab traversal across an ordered array of locators
 */
export async function assertTabSequence(page: Page, locators: Locator[]) {
  // Clear any existing focus by focusing document body
  await page.locator("body").focus();

  for (const target of locators) {
    await page.keyboard.press("Tab");
    await expectFocused(target);
    await expectVisibleFocusRing(target);
  }
}

/**
 * Asserts reverse tab traversal (Shift + Tab) across an ordered array of locators in reverse
 */
export async function assertReverseTabSequence(page: Page, locators: Locator[]) {
  const reversed = [...locators].reverse().slice(1); // skip the last one where we start

  for (const target of reversed) {
    await page.keyboard.press("Shift+Tab");
    await expectFocused(target);
  }
}

```

---

### Step 2: Form & Sequential Flow Test

Validate that form inputs, checkboxes, and buttons are traversed in correct logical order:

```typescript
// e2e/keyboard-form.spec.ts
import { test, expect } from "@playwright/test";
import {
  expectFocused,
  assertTabSequence,
  assertReverseTabSequence,
} from "./helpers/a11y-keyboard";

test.describe("Keyboard Navigation: Form Controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-form--default&viewMode=story");
    await page.waitForLoadState("networkidle");
  });

  test("traverses fields and submits cleanly with keyboard", async ({ page }) => {
    const nameInput = page.getByLabel(/full name/i);
    const emailInput = page.getByLabel(/email address/i);
    const termsCheckbox = page.getByRole("checkbox", { name: /accept terms/i });
    const cancelBtn = page.getByRole("button", { name: /cancel/i });
    const submitBtn = page.getByRole("button", { name: /submit/i });

    const flow = [nameInput, emailInput, termsCheckbox, cancelBtn, submitBtn];

    // 1. Validate forward tab sequence + visible focus rings
    await assertTabSequence(page, flow);

    // 2. Validate backwards traversal
    await assertReverseTabSequence(page, flow);

    // 3. Re-enter form and interact purely using keys
    await nameInput.fill("Jane Doe");
    await page.keyboard.press("Tab");
    await emailInput.fill("jane@example.com");

    // Toggle checkbox with Space
    await page.keyboard.press("Tab");
    await expect(termsCheckbox).not.toBeChecked();
    await page.keyboard.press("Space");
    await expect(termsCheckbox).toBeChecked();

    // Advance to submit and activate with Enter
    await page.keyboard.press("Tab"); // cancel
    await page.keyboard.press("Tab"); // submit
    await page.keyboard.press("Enter");

    // Verify submission feedback
    await expect(page.getByText(/form submitted successfully/i)).toBeVisible();
  });
});

```

---

### Step 3: Modal Dialog Focus Trap & Escape Dismissal

Modals must trap `Tab` cycles within their container boundaries and restore focus to the opening trigger upon pressing `Escape`:

```typescript
// e2e/keyboard-dialog.spec.ts
import { test, expect } from "@playwright/test";
import { expectFocused, expectVisibleFocusRing } from "./helpers/a11y-keyboard";

test.describe("Keyboard Navigation: Modal Dialog", () => {
  test("traps tab focus and returns focus on Escape", async ({ page }) => {
    await page.goto("/iframe.html?id=components-dialog--default&viewMode=story");
    await page.waitForLoadState("networkidle");

    const triggerBtn = page.getByRole("button", { name: /open dialog/i });

    // 1. Focus trigger and activate via Enter
    await triggerBtn.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const firstField = dialog.getByLabel(/project title/i);
    const confirmBtn = dialog.getByRole("button", { name: /confirm/i });
    const closeBtn = dialog.getByRole("button", { name: /close/i });

    // 2. Verify initial auto-focus lands inside dialog
    await expectFocused(firstField);

    // 3. Tab through trapped controls
    await page.keyboard.press("Tab");
    await expectFocused(confirmBtn);
    await expectVisibleFocusRing(confirmBtn);

    await page.keyboard.press("Tab");
    await expectFocused(closeBtn);

    // 4. Trap check: Next Tab must loop back to first field, NOT to underlying page
    await page.keyboard.press("Tab");
    await expectFocused(firstField);

    // 5. Shift+Tab loops back to the end (close button)
    await page.keyboard.press("Shift+Tab");
    await expectFocused(closeBtn);

    // 6. Escape dismisses dialog and restores focus to original trigger
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expectFocused(triggerBtn);
  });
});

```

---

### Step 4: Roving Tabindex & Arrow Key Navigation (Dropdowns / Menus)

Components using the composite widget pattern (e.g. Radix Menus, Tabs, Radio Groups) use arrow keys rather than `Tab`:

```typescript
// e2e/keyboard-menu.spec.ts
import { test, expect } from "@playwright/test";
import { expectFocused } from "./helpers/a11y-keyboard";

test.describe("Keyboard Navigation: Roving Focus Menu", () => {
  test("navigates menu items with ArrowDown/ArrowUp, Home, End, and loops", async ({ page }) => {
    await page.goto("/iframe.html?id=components-dropdown--default&viewMode=story");
    await page.waitForLoadState("networkidle");

    const menuTrigger = page.getByRole("button", { name: /user menu/i });

    // Open menu using Space or Down Arrow
    await menuTrigger.focus();
    await page.keyboard.press("ArrowDown");

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    const itemProfile = page.getByRole("menuitem", { name: /profile/i });
    const itemSettings = page.getByRole("menuitem", { name: /settings/i });
    const itemBilling = page.getByRole("menuitem", { name: /billing/i });
    const itemLogout = page.getByRole("menuitem", { name: /log out/i });

    // Radix auto-focuses first item
    await expectFocused(itemProfile);

    // Arrow down traversal
    await page.keyboard.press("ArrowDown");
    await expectFocused(itemSettings);

    await page.keyboard.press("ArrowDown");
    await expectFocused(itemBilling);

    // Jump to last item with 'End' key
    await page.keyboard.press("End");
    await expectFocused(itemLogout);

    // Wrap around to top with another ArrowDown
    await page.keyboard.press("ArrowDown");
    await expectFocused(itemProfile);

    // Jump to first item with 'Home' key
    await page.keyboard.press("Home");
    await expectFocused(itemProfile);

    // Select with Enter and ensure menu closes
    await page.keyboard.press("Enter");
    await expect(menu).not.toBeVisible();
    await expectFocused(menuTrigger);
  });
});

```

---

### Step 5: Key Navigation Assertions Checklist

| Key Combination         | Expected Behavior                                           | Tested Assertion                                                  |
| ----------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `Tab` / `Shift+Tab`     | Advances / regresses focus sequentially                     | `expectFocused(target)` & `expectVisibleFocusRing(target)`        |
| `Space`                 | Toggles checkboxes, expands accordions, opens menus         | `expect(checkbox).toBeChecked()`                                  |
| `Enter`                 | Submits forms, executes primary button actions              | State change / modal opens                                        |
| `ArrowUp` / `ArrowDown` | Roving focus across menu items, radio options, or listboxes | Focus shifts without changing browser scroll position             |
| `Escape`                | Dismisses popovers, tooltips, dialogs, drawers              | `expect(container).not.toBeVisible()` & focus restores to trigger |
| `Home` / `End`          | Jumps focus to first / last item in roving widgets          | Focus lands on boundary items                                     |

To test light/dark theme switching and ensure semantic color tokens resolve accurately without visual regressions, automated Playwright tests must verify:

1. **DOM Class & Attribute Mutations:** Checking that the `.dark` class (or `data-theme="dark"`) applies to `<html>`.
2. **Computed Style & Token Value Assertions:** Reading computed CSS variables (`var(--bg)`, `var(--surface)`) or evaluated RGB/OKLCH color values.
3. **Local Storage Persistence:** Confirming the user's explicit theme preference persists across page reloads.
4. **OS `colorScheme` Emulation:** Testing automatic switching under `prefers-color-scheme: dark` vs `light`.

---

### Step 1: Create Theme Testing Helpers

Create `e2e/helpers/theme.ts` with reusable assertions for computed styles and theme states:

```typescript
// e2e/helpers/theme.ts
import { Page, Locator, expect } from "@playwright/test";

/**
 * Asserts whether the root <html> element possesses the 'dark' class
 */
export async function expectThemeClass(page: Page, expected: "dark" | "light") {
  const html = page.locator("html");
  if (expected === "dark") {
    await expect(html).toHaveClass(/\bdark\b/);
  } else {
    await expect(html).not.toHaveClass(/\bdark\b/);
  }
}

/**
 * Asserts the computed color/background value of an element or CSS custom property
 */
export async function expectComputedColor(
  element: Locator,
  property: "backgroundColor" | "color" | "borderColor",
  expectedRgbPattern: RegExp | string
) {
  await expect.poll(async () => {
    return element.evaluate((el, prop) => {
      return window.getComputedStyle(el)[prop as any];
    }, property);
  }, {
    message: `Expected ${property} to match ${expectedRgbPattern}`,
    timeout: 3000,
  }).toMatch(expectedRgbPattern);
}

/**
 * Retrieves the resolved value of a CSS custom property on :root or an element
 */
export async function getCssVariable(
  page: Page,
  variableName: string,
  selector = ":root"
): Promise<string> {
  return page.evaluate(
    ({ varName, sel }) => {
      const el = document.querySelector(sel) || document.documentElement;
      return window.getComputedStyle(el).getPropertyValue(varName).trim();
    },
    { varName: variableName, sel: selector }
  );
}

```

---

### Step 2: Write Theme Toggle & Token Verification Tests

Create `e2e/dark-mode.spec.ts` to test manual toggle switching, token shifts, and storage persistence:

```typescript
// e2e/dark-mode.spec.ts
import { test, expect } from "@playwright/test";
import { expectThemeClass, expectComputedColor } from "./helpers/theme";

test.describe("Dark Mode & Color Token Verification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("toggles between Light and Dark mode using accessible radio buttons", async ({ page }) => {
    const lightRadio = page.getByRole("radio", { name: /light/i });
    const darkRadio = page.getByRole("radio", { name: /dark/i });
    const surfaceCard = page.locator("section").first();

    // 1. Switch to Light Mode
    await lightRadio.click();
    await expectThemeClass(page, "light");
    await expect(lightRadio).toHaveAttribute("aria-checked", "true");
    await expect(darkRadio).toHaveAttribute("aria-checked", "false");

    // 2. Switch to Dark Mode
    await darkRadio.click();
    await expectThemeClass(page, "dark");
    await expect(darkRadio).toHaveAttribute("aria-checked", "true");
    await expect(lightRadio).toHaveAttribute("aria-checked", "false");

    // 3. Verify that the surface card's background changed to a dark surface tone
    // (In browsers, OKLCH tokens resolve to rgb/rgba in getComputedStyle)
    const darkBgColor = await surfaceCard.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(darkBgColor).not.toBe("rgb(255, 255, 255)");
  });

  test("persists theme preference in localStorage across page reloads", async ({ page }) => {
    const darkRadio = page.getByRole("radio", { name: /dark/i });

    // Activate dark theme
    await darkRadio.click();
    await expectThemeClass(page, "dark");

    // Verify localStorage key written by next-themes
    const storedTheme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(storedTheme).toBe("dark");

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Root should retain .dark without flash of light theme
    await expectThemeClass(page, "dark");
    await expect(page.getByRole("radio", { name: /dark/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  test("supports keyboard navigation across theme radio items", async ({ page }) => {
    const lightRadio = page.getByRole("radio", { name: /light/i });
    const darkRadio = page.getByRole("radio", { name: /dark/i });

    // Focus light radio
    await lightRadio.focus();
    await expect(lightRadio).toBeFocused();

    // Tab to Dark radio and select with Enter / Space
    await page.keyboard.press("Tab");
    await expect(darkRadio).toBeFocused();
    await page.keyboard.press("Space");

    await expectThemeClass(page, "dark");
  });
});

```

---

### Step 3: Test OS System Preference Emulation (`prefers-color-scheme`)

Test that the `System` mode correctly follows the operating system setting via `page.emulateMedia()`:

```typescript
// e2e/system-theme.spec.ts
import { test, expect } from "@playwright/test";
import { expectThemeClass } from "./helpers/theme";

test.describe("System Color Scheme Emulation", () => {
  test("adapts automatically when OS colorScheme switches to dark", async ({ page }) => {
    // 1. Emulate OS Dark Mode
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const systemRadio = page.getByRole("radio", { name: /system/i });
    await systemRadio.click();

    // System mode with dark OS preference applies .dark
    await expectThemeClass(page, "dark");

    // 2. Emulate OS Light Mode switch at runtime
    await page.emulateMedia({ colorScheme: "light" });

    // Should automatically remove .dark class
    await expectThemeClass(page, "light");
  });
});

```

---

### Step 4: Token Visual Regression Snapshots (Optional)

Capture deterministic visual snapshots of key components in both themes:

```typescript
// e2e/theme-visual-regression.spec.ts
import { test, expect } from "@playwright/test";

test("matches visual snapshots in both light and dark themes", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("section").first();

  // Light Snapshot
  await page.getByRole("radio", { name: /light/i }).click();
  await expect(card).toHaveScreenshot("surface-card-light.png");

  // Dark Snapshot
  await page.getByRole("radio", { name: /dark/i }).click();
  await expect(card).toHaveScreenshot("surface-card-dark.png");
});

```

---

### Summary Checklist

* **Assert on `html` class:** `expect(page.locator('html')).toHaveClass(/\bdark\b/)` avoids race conditions caused by animations.
* **Test Flash of Unstyled Content (FOUC):** Reload tests ensure `next-themes` applies `.dark` before first render.
* **Isolate Emulation:** Use `page.emulateMedia({ colorScheme: 'dark' })` specifically for testing the `system` option.

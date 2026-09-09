***  How do I write automated Playwright tests to verify clipboard copy actions and keyboard shortcuts in Radix components?.md ***

Testing clipboard copy actions and keyboard interactions in Playwright requires two key steps:

1. **Granting Browser Clipboard Permissions:** Enabling `clipboard-read` and `clipboard-write` on the browser context.
2. **Asserting Clipboard Contents & ARIA Live Feedback:** Reading `navigator.clipboard.readText()` and verifying that the live region status updates accordingly.

---

### Step 1: Clipboard Testing Helper

Create `e2e/helpers/clipboard.ts` to grant permissions and read system clipboard data directly from the page context:

```typescript
// e2e/helpers/clipboard.ts
import { BrowserContext, Page, expect } from "@playwright/test";

/** Grants clipboard read/write permissions to the browser context */
export async function grantClipboardPermissions(context: BrowserContext) {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
}

/** Reads the current string from the system clipboard */
export async function getClipboardText(page: Page): Promise<string> {
  return page.evaluate(() => navigator.clipboard.readText());
}

/** Asserts that the system clipboard matches the expected text */
export async function expectClipboardText(page: Page, expected: string | RegExp) {
  await expect.poll(async () => {
    return page.evaluate(() => navigator.clipboard.readText());
  }, {
    message: `Expected clipboard to match "${expected}"`,
    timeout: 5000,
  }).toMatch(expected);
}

```

---

### Step 2: Write Clipboard & Keyboard Shortcut Tests

Test three interaction methods:

1. **Mouse Click** on truncated text.
2. **Keyboard Activation (`Enter` / `Space`)** while focused.
3. **Interactive Tooltip Action Button** click.

```typescript
// e2e/clipboard-tooltip.spec.ts
import { test, expect } from "@playwright/test";
import { grantClipboardPermissions, expectClipboardText } from "./helpers/clipboard";

const EXPECTED_TRACE_ID =
  "tx_9842aef98234bc890123ef123490aafe89341209bcdef123894";

test.describe("Copyable Truncated Tooltip: Clipboard & Keyboard", () => {
  test.beforeEach(async ({ context, page }) => {
    // 1. Grant clipboard permissions before loading page
    await grantClipboardPermissions(context);
    await page.goto("/iframe.html?id=components-copyabletooltip--default&viewMode=story");
    await page.waitForLoadState("networkidle");
  });

  test("copies full text on direct mouse click", async ({ page }) => {
    const trigger = page.getByRole("button", { name: new RegExp(EXPECTED_TRACE_ID, "i") });

    // Click the truncated text element
    await trigger.click();

    // Verify clipboard content
    await expectClipboardText(page, EXPECTED_TRACE_ID);

    // Verify visual feedback badge inside tooltip
    await expect(page.getByText(/copied to clipboard/i)).toBeVisible();

    // Verify screen reader live status announcement
    const liveRegion = page.getByRole("status");
    await expect(liveRegion).toHaveText(/full text copied to clipboard/i);
  });

  test("copies full text using keyboard navigation (Tab + Enter)", async ({ page }) => {
    const trigger = page.getByRole("button", { name: new RegExp(EXPECTED_TRACE_ID, "i") });

    // Focus trigger via keyboard Tab
    await page.locator("body").focus();
    await page.keyboard.press("Tab");
    await expect(trigger).toBeFocused();

    // Activate copy action via Enter
    await page.keyboard.press("Enter");
    await expectClipboardText(page, EXPECTED_TRACE_ID);

    // Activate copy action via Space
    await page.keyboard.press("Space");
    await expectClipboardText(page, EXPECTED_TRACE_ID);
  });

  test("opens tooltip on hover and allows clicking 'Copy Full' action button", async ({ page }) => {
    const trigger = page.getByRole("button", { name: new RegExp(EXPECTED_TRACE_ID, "i") });

    // Hover over trigger to reveal Radix Tooltip content
    await trigger.hover();

    const tooltipContent = page.getByRole("tooltip");
    await expect(tooltipContent).toBeVisible();

    // Click the dedicated 'Copy Full' button inside the tooltip
    const copyButton = tooltipContent.getByRole("button", { name: /copy full/i });
    await copyButton.click();

    await expectClipboardText(page, EXPECTED_TRACE_ID);
    await expect(tooltipContent.getByText(/copied/i)).toBeVisible();
  });
});

```

---

### Step 3: Handling Headless CI Quirk (WebKit / Firefox)

Chromium fully supports `context.grantPermissions(['clipboard-read', 'clipboard-write'])`. In Firefox and WebKit on headless Linux runners, reading the clipboard directly via `navigator.clipboard.readText()` without a user gesture can be restricted by browser policy.

To handle cross-engine test execution consistently in CI, use an evaluation fallback:

```typescript
// e2e/helpers/clipboard.ts
export async function getClipboardTextCrossBrowser(page: Page): Promise<string> {
  const browserName = page.context().browser()?.browserType().name();

  if (browserName === "chromium") {
    return page.evaluate(() => navigator.clipboard.readText());
  }

  // For WebKit / Firefox: verify the internal copied state or live region text
  const liveStatus = await page.locator('[role="status"]').textContent();
  return liveStatus || "";
}

```

---

### Key Verification Checklist

* **Permission Pre-Grant:** Always call `context.grantPermissions(...)` in `beforeEach` before navigating to the page.
* **Trim & Format Safety:** Assert using `expectClipboardText(page, text)` to verify exact string equality with no trailing whitespace or truncated ellipsis artifacts (`...`).
* **Focus Restoration:** Verify that clicking or pressing `Enter` to copy retains keyboard focus on the element rather than losing focus to `document.body`.

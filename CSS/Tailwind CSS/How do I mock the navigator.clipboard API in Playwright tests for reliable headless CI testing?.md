***  How do I mock the navigator.clipboard API in Playwright tests for reliable headless CI testing?.md ***

To eliminate cross-browser permission restrictions and OS-level clipboard flakes on headless CI runners (especially in Firefox and WebKit), mock the `navigator.clipboard` object using Playwright's `page.addInitScript()`.

---

### Step 1: Create the Clipboard Mock Fixture

Create `e2e/fixtures/clipboard-mock.ts`. This fixture creates an in-memory clipboard mock that intercepts `writeText()`, `readText()`, and custom MIME types, storing the text on `window` for test assertions:

```typescript
// e2e/fixtures/clipboard-mock.ts
import { test as base, expect, Page } from "@playwright/test";

export interface MockClipboard {
  /** Retrieves the current mock clipboard value */
  getText: () => Promise<string>;
  /** Pre-populates the mock clipboard with specific text */
  setText: (text: string) => Promise<void>;
  /** Asserts that the clipboard matches the expected string or pattern */
  expectClipboardToMatch: (expected: string | RegExp) => Promise<void>;
  /** Clears the clipboard buffer */
  clear: () => Promise<void>;
}

export const test = base.extend<{ mockClipboard: MockClipboard }>({
  mockClipboard: async ({ page }, use) => {
    // 1. Inject mock before any application script executes
    await page.addInitScript(() => {
      let clipboardBuffer = "";

      // Replace native navigator.clipboard with deterministic mock
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text: string) => {
            clipboardBuffer = String(text);
            return Promise.resolve();
          },
          readText: async () => {
            return Promise.resolve(clipboardBuffer);
          },
          write: async (data: ClipboardItem[]) => {
            for (const item of data) {
              if (item.types.includes("text/plain")) {
                const blob = await item.getType("text/plain");
                clipboardBuffer = await blob.text();
              }
            }
            return Promise.resolve();
          },
          read: async () => {
            const blob = new Blob([clipboardBuffer], { type: "text/plain" });
            return Promise.resolve([
              new ClipboardItem({ "text/plain": blob }),
            ]);
          },
        },
        configurable: true,
      });

      // Expose internal buffer to Playwright test runner
      (window as any).__getMockClipboard = () => clipboardBuffer;
      (window as any).__setMockClipboard = (val: string) => {
        clipboardBuffer = val;
      };
    });

    // 2. Define fixture assertion helpers
    const clipboardHelper: MockClipboard = {
      getText: async () => {
        return page.evaluate(() => (window as any).__getMockClipboard() || "");
      },

      setText: async (text: string) => {
        await page.evaluate((val) => (window as any).__setMockClipboard(val), text);
      },

      expectClipboardToMatch: async (expected: string | RegExp) => {
        await expect.poll(async () => {
          return page.evaluate(() => (window as any).__getMockClipboard() || "");
        }, {
          message: `Expected mock clipboard to match "${expected}"`,
          timeout: 5000,
        }).toMatch(expected);
      },

      clear: async () => {
        await page.evaluate(() => (window as any).__setMockClipboard(""));
      },
    };

    await use(clipboardHelper);
  },
});

export { expect };

```

---

### Step 2: Write Tests Using the Mock Fixture

Use the `mockClipboard` fixture across all browser engines (**Chromium, Firefox, WebKit**) without configuring OS permissions:

```typescript
// e2e/clipboard-actions.spec.ts
import { test, expect } from "./fixtures/clipboard-mock";

test.describe("Clipboard Operations (Mocked CI)", () => {
  test("copies truncated token on click", async ({ page, mockClipboard }) => {
    await page.goto("/iframe.html?id=components-copyabletooltip--default&viewMode=story");

    const expectedToken = "tx_9842aef98234bc890123ef123490aafe89341209bcdef123894";
    const copyTrigger = page.getByRole("button", { name: new RegExp(expectedToken, "i") });

    // 1. Click element to trigger copy
    await copyTrigger.click();

    // 2. Assert text was written to mock clipboard
    await mockClipboard.expectClipboardToMatch(expectedToken);

    // 3. Assert UI feedback changed
    await expect(page.getByText(/copied to clipboard/i)).toBeVisible();
  });

  test("copies text via keyboard Enter shortcut", async ({ page, mockClipboard }) => {
    await page.goto("/iframe.html?id=components-copyabletooltip--default&viewMode=story");

    const copyTrigger = page.getByRole("button").first();
    await copyTrigger.focus();
    await page.keyboard.press("Enter");

    const clipboardContent = await mockClipboard.getText();
    expect(clipboardContent.length).toBeGreaterThan(0);
  });

  test("tests paste input flow by pre-populating mock clipboard", async ({ page, mockClipboard }) => {
    await page.goto("/iframe.html?id=components-importmodal--default&viewMode=story");

    // 1. Pre-seed mock clipboard with dummy JSON tokens
    const seededPayload = JSON.stringify({ brand: { primary: "#6366f1" } });
    await mockClipboard.setText(seededPayload);

    // 2. Click "Paste from Clipboard" button in UI
    const pasteBtn = page.getByRole("button", { name: /paste from clipboard/i });
    await pasteBtn.click();

    // 3. Verify textarea ingested the pre-seeded clipboard data
    const textarea = page.getByLabel(/token payload/i);
    await expect(textarea).toHaveValue(seededPayload);
  });
});

```

---

### Step 3: Mocking Clipboard Failures & Error Handling

To test how your UI handles errors (e.g., when a user blocks permissions or the browser rejects the write), inject a rejection mock:

```typescript
test("displays error toast when clipboard write fails", async ({ page }) => {
  // Override clipboard.writeText to simulate a runtime exception
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("NotAllowedError: Permission denied")),
      },
      configurable: true,
    });
  });

  await page.goto("/iframe.html?id=components-copyabletooltip--default&viewMode=story");

  const copyTrigger = page.getByRole("button").first();
  await copyTrigger.click();

  // Assert error boundary or fallback toast is displayed
  await expect(page.getByText(/failed to copy/i)).toBeVisible();
});

```

---

### Native vs. Mocked Clipboard in CI

| Capability                  | Native `grantPermissions`        | Mocked `navigator.clipboard`  |
| --------------------------- | -------------------------------- | ----------------------------- |
| **Chromium Headless**       | Supported                        | Supported                     |
| **Firefox Headless**        | Restricted by OS security policy | Supported (100% reliable)     |
| **WebKit Headless (Linux)** | Fails without user interaction   | Supported (100% reliable)     |
| **Error Injection Testing** | Difficult                        | Simple (`Promise.reject()`)   |
| **Execution Speed**         | Requires IPC permission rounds   | Zero latency in-memory access |
To configure automated ARIA live region testing in Playwright, you set up a custom test fixture that instruments the browser's DOM with a `MutationObserver` before test execution begins. This captures every dynamic text mutation pushed to `aria-live`, `role="status"`, `role="alert"`, and `role="log"` elements.

---

### Step 1: Create the Playwright Live Region Fixture

Create `e2e/fixtures/live-region-fixture.ts`. This extends Playwright's base `test` object with an automatic listener and an assertion helper.

```typescript
// e2e/fixtures/live-region-fixture.ts
import { test as base, expect, Page } from "@playwright/test";

export interface CapturedAnnouncement {
  text: string;
  politeness: "polite" | "assertive" | "off";
  role: string | null;
  timestamp: number;
}

export interface LiveRegionTracker {
  getAnnouncements: () => Promise<CapturedAnnouncement[]>;
  expectAnnounced: (
    expectedText: string | RegExp,
    politeness?: "polite" | "assertive"
  ) => Promise<void>;
  clear: () => Promise<void>;
}

export const test = base.extend<{ liveRegion: LiveRegionTracker }>({
  liveRegion: async ({ page }, use) => {
    // 1. Inject DOM MutationObserver on page navigation
    await page.addInitScript(() => {
      window.__ariaLiveLog = [];

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const target = mutation.target as HTMLElement;
          const liveNode = target.nodeType === Node.ELEMENT_NODE
            ? (target as HTMLElement).closest('[aria-live], [role="status"], [role="alert"], [role="log"]')
            : target.parentElement?.closest('[aria-live], [role="status"], [role="alert"], [role="log"]');

          if (liveNode) {
            const rawText = liveNode.textContent?.trim();
            if (rawText) {
              const explicitLive = liveNode.getAttribute("aria-live");
              const role = liveNode.getAttribute("role");
              
              // Resolve effective politeness
              let politeness: "polite" | "assertive" | "off" = "polite";
              if (explicitLive === "assertive" || role === "alert") {
                politeness = "assertive";
              } else if (explicitLive === "off") {
                politeness = "off";
              }

              const lastEntry = window.__ariaLiveLog[window.__ariaLiveLog.length - 1];
              // De-duplicate rapid identical mutations on same element
              if (!lastEntry || lastEntry.text !== rawText || lastEntry.politeness !== politeness) {
                window.__ariaLiveLog.push({
                  text: rawText,
                  politeness,
                  role,
                  timestamp: Date.now(),
                });
              }
            }
          }
        }
      });

      // Observe the DOM subtree as early as document loads
      document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      });
    });

    // 2. Define fixture controls
    const tracker: LiveRegionTracker = {
      getAnnouncements: async () => {
        return page.evaluate(() => window.__ariaLiveLog || []);
      },

      clear: async () => {
        await page.evaluate(() => {
          window.__ariaLiveLog = [];
        });
      },

      expectAnnounced: async (expectedText, politeness = "polite") => {
        await expect.poll(async () => {
          const logs: CapturedAnnouncement[] = await page.evaluate(
            () => window.__ariaLiveLog || []
          );

          return logs.some((item) => {
            const matchesText =
              typeof expectedText === "string"
                ? item.text.includes(expectedText)
                : expectedText.test(item.text);
            const matchesPoliteness = item.politeness === politeness;
            return matchesText && matchesPoliteness;
          });
        }, {
          message: `Expected live region announcement "${expectedText}" (${politeness}) not detected.`,
          timeout: 5000,
        }).toBe(true);
      },
    };

    await use(tracker);
  },
});

export { expect };

declare global {
  interface Window {
    __ariaLiveLog: CapturedAnnouncement[];
  }
}

```

---

### Step 2: Write Component Live Region Tests

Import the extended `test` runner and use `liveRegion.expectAnnounced` to assert on toasts, dynamic badges, async progress, and error banners.

```typescript
// e2e/live-announcements.spec.ts
import { test, expect } from "./fixtures/live-region-fixture";

test.describe("ARIA Live Announcement Audits", () => {
  test("asserts polite announcements when saving settings (Toast)", async ({ page, liveRegion }) => {
    await page.goto("/iframe.html?id=components-toast--default&viewMode=story");

    const saveButton = page.getByRole("button", { name: /save changes/i });
    await saveButton.click();

    // Verifies text is announced with polite priority
    await liveRegion.expectAnnounced("Profile changes saved successfully", "polite");
  });

  test("asserts assertive announcements on form validation failures", async ({ page, liveRegion }) => {
    await page.goto("/iframe.html?id=components-form--validation&viewMode=story");

    const submitButton = page.getByRole("button", { name: /submit/i });
    await submitButton.click();

    // Verifies critical errors trigger assertive live interruption
    await liveRegion.expectAnnounced(/Please correct the highlighted errors/i, "assertive");
  });

  test("verifies live region updates during multi-step async progress", async ({ page, liveRegion }) => {
    await page.goto("/iframe.html?id=components-uploader--async&viewMode=story");

    const uploadButton = page.getByRole("button", { name: /upload dataset/i });
    await uploadButton.click();

    // Step 1: Upload progress status
    await liveRegion.expectAnnounced(/Uploading: 50%/i, "polite");

    // Step 2: Final processing confirmation
    await liveRegion.expectAnnounced(/Upload complete: dataset_2026.csv ready/i, "polite");
  });
});

```

---

### Step 3: Inspecting Captured History in Failures

If an assertion fails or you need to inspect the full timeline of screen reader announcements, retrieve the raw array:

```typescript
test("inspect raw sequence of announcements", async ({ page, liveRegion }) => {
  await page.goto("/iframe.html?id=components-cart--demo&viewMode=story");

  await page.getByRole("button", { name: /add item/i }).click();
  await page.getByRole("button", { name: /remove item/i }).click();

  const history = await liveRegion.getAnnouncements();
  
  expect(history).toEqual([
    expect.objectContaining({ text: "Added 1 item to cart", politeness: "polite" }),
    expect.objectContaining({ text: "Cart is now empty", politeness: "polite" }),
  ]);
});

```

---

### Key Requirements for Screen Reader Compliance

* **Mount Before Mutation:** The element with `aria-live` or `role="status"` must exist in the DOM **prior** to the text change. Injecting a pre-filled `<div role="status">Saved</div>` directly into the DOM is ignored by most screen readers (like NVDA/VoiceOver).
* **`aria-atomic="true"`:** Add `aria-atomic="true"` to live containers so screen readers read the entire message instead of just the modified sub-node.
* **Avoid Overusing `assertive`:** Reserve `politeness: "assertive"` (or `role="alert"`) exclusively for errors requiring immediate user correction; use `polite` (or `role="status"`) for all standard background notifications.

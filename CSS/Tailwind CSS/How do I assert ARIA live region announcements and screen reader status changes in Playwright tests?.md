To test screen reader announcements in Playwright, you cannot directly capture audio output, but you can assert on the two underlying mechanisms screen readers rely on:

1. **ARIA Live Region Text Ingestion:** Verifying that elements configured with `aria-live="polite"` / `aria-live="assertive"` or standard landmark roles (`role="status"`, `role="alert"`) receive text updates dynamically.
2. **DOM Mutation Observers:** Intercepting live announcements as they happen to ensure text is injected into an *already mounted* live region (a strict screen reader requirement).

---

### Step 1: Create an ARIA Live Region Interceptor Helper

Screen readers (NVDA, JAWS, VoiceOver) only announce updates if the `aria-live` container is **already present in the DOM** before its text content changes. Injecting a brand new `<div aria-live="polite">Message</div>` node is often ignored.

Create `e2e/helpers/live-announcements.ts` to track live region mutations:

```typescript
// e2e/helpers/live-announcements.ts
import { Page, expect } from "@playwright/test";

/**
 * Attaches a MutationObserver inside the browser page to monitor all
 * text additions to elements marked with aria-live or role="status" / role="alert".
 */
export async function trackLiveAnnouncements(page: Page) {
  await page.evaluate(() => {
    (window as any).__ariaAnnouncements = [];

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target as HTMLElement;
        const liveRegion = target.closest(
          '[aria-live], [role="status"], [role="alert"], [role="log"]'
        );

        if (liveRegion) {
          const text = liveRegion.textContent?.trim();
          if (text && !(window as any).__ariaAnnouncements.includes(text)) {
            (window as any).__ariaAnnouncements.push({
              text,
              politeness:
                liveRegion.getAttribute("aria-live") ||
                (liveRegion.getAttribute("role") === "alert" ? "assertive" : "polite"),
              role: liveRegion.getAttribute("role"),
              timestamp: Date.now(),
            });
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
}

/**
 * Asserts that a specific message was announced via an ARIA live region.
 */
export async function expectAnnounced(
  page: Page,
  expectedText: string | RegExp,
  expectedPoliteness: "polite" | "assertive" = "polite"
) {
  await expect.poll(async () => {
    const announcements = await page.evaluate(
      () => (window as any).__ariaAnnouncements || []
    );

    return announcements.some((a: any) => {
      const textMatches =
        typeof expectedText === "string"
          ? a.text.includes(expectedText)
          : expectedText.test(a.text);
      const politenessMatches = a.politeness === expectedPoliteness;
      return textMatches && politenessMatches;
    });
  }, {
    message: `Expected ARIA live announcement "${expectedText}" (${expectedPoliteness}) was not detected.`,
    timeout: 5000,
  }).toBe(true);
}

```

---

### Step 2: Test Live Region Updates (Toast Notifications / Async Feedback)

Here is how to test dynamic toast messages and form status changes:

```typescript
// e2e/aria-live.spec.ts
import { test, expect } from "@playwright/test";
import { trackLiveAnnouncements, expectAnnounced } from "./helpers/live-announcements";

test.describe("ARIA Live Regions & Status Announcements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-toast--default&viewMode=story");
    await page.waitForLoadState("networkidle");

    // Initialize the tracker before triggering any interactions
    await trackLiveAnnouncements(page);
  });

  test("announces toast notification updates politely", async ({ page }) => {
    const triggerBtn = page.getByRole("button", { name: /save changes/i });

    // 1. Trigger the async action
    await triggerBtn.click();

    // 2. Assert screen reader live region announcement
    await expectAnnounced(page, "Settings saved successfully", "polite");

    // 3. Optional: Validate explicit ARIA role mapping directly on DOM
    const statusRegion = page.getByRole("status");
    await expect(statusRegion).toHaveText(/settings saved successfully/i);
  });

  test("announces urgent form errors assertively via role='alert'", async ({ page }) => {
    await page.goto("/iframe.html?id=components-form--validation&viewMode=story");
    await trackLiveAnnouncements(page);

    const submitBtn = page.getByRole("button", { name: /submit/i });

    // Submit invalid form
    await submitBtn.click();

    // Assert alert role & assertive announcement
    await expectAnnounced(page, "Please fill in all required fields", "assertive");

    const alertRegion = page.getByRole("alert");
    await expect(alertRegion).toBeVisible();
  });
});

```

---

### Step 3: Testing Native Radix Primitives (`aria-live`)

Radix UI components (such as Radix Toast, Progress, and Slider) output live region markup by default:

```typescript
// e2e/radix-primitives-a11y.spec.ts
import { test, expect } from "@playwright/test";

test("Radix Slider updates aria-valuenow on keyboard arrow adjustment", async ({ page }) => {
  await page.goto("/iframe.html?id=components-slider--default&viewMode=story");

  const sliderThumb = page.getByRole("slider", { name: /volume/i });

  // 1. Focus slider thumb
  await sliderThumb.focus();
  await expect(sliderThumb).toHaveAttribute("aria-valuenow", "50");

  // 2. Adjust slider value with ArrowUp (+1 step)
  await page.keyboard.press("ArrowUp");
  await expect(sliderThumb).toHaveAttribute("aria-valuenow", "51");
  await expect(sliderThumb).toHaveAttribute("aria-valuetext", "51 percent");
});

```

---

### Summary of Live Region Testing Rules

* **`role="status"`:** Implicitly behaves as `aria-live="polite"` and `aria-atomic="true"`. Use for non-urgent feedback (e.g., saving data, item added to cart).
* **`role="alert"`:** Implicitly behaves as `aria-live="assertive"` and `aria-atomic="true"`. Use for immediate interrupts (e.g., session timeouts, form validation errors).
* **Container Pre-mounting:** Live containers must be present in the DOM *before* text is injected. Testing via the `trackLiveAnnouncements` helper ensures the update happens dynamically inside an active container rather than rendering a fresh DOM tree.

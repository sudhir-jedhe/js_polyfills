*** copy How do I build an accessible theme selector menu (Light, Dark, System) using Radix Dropdown and next-themes?.md ***

An accessible theme selector using **Radix UI (`@radix-ui/react-dropdown-menu`)** and **`next-themes`** manages WAI-ARIA radio group semantics (`role="menuitemradio"`), handles keyboard navigation (roving tabindex, arrow navigation, escape dismissal), and prevents SSR hydration layout shifts.

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-dropdown-menu next-themes lucide-react

```

---

### Step 2: Build the Accessible Theme Selector Component

```tsx
// components/ThemeSelector.tsx
"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch between server HTML and client theme state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder matching trigger geometry to prevent layout shift
    return (
      <div 
        className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 animate-pulse" 
        aria-hidden="true" 
      />
    );
  }

  // Determine active icon on trigger based on resolved theme
  const CurrentIcon =
    theme === "system"
      ? Laptop
      : resolvedTheme === "dark"
      ? Moon
      : Sun;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Select display theme. Current theme is ${theme}`}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <CurrentIcon className="h-4 w-4 transition-transform active:scale-90" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[160px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenu.Label className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Appearance
          </DropdownMenu.Label>

          {/* Radio Group guarantees single-select semantics */}
          <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenu.RadioItem
              value="light"
              className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-700 outline-none transition-colors data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 dark:text-slate-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-white"
            >
              <Sun className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span className="flex-1">Light</span>
              <DropdownMenu.ItemIndicator>
                <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem
              value="dark"
              className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-700 outline-none transition-colors data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 dark:text-slate-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-white"
            >
              <Moon className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span className="flex-1">Dark</span>
              <DropdownMenu.ItemIndicator>
                <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem
              value="system"
              className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-700 outline-none transition-colors data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 dark:text-slate-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-white"
            >
              <Laptop className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span className="flex-1">System</span>
              <DropdownMenu.ItemIndicator>
                <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

```

---

### Step 3: Verify Automated Keyboard & ARIA Specifications

| Feature                   | Implementation Detail                                     | Accessible Behavior                                                                                           |
| ------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **ARIA Roles**            | `DropdownMenu.RadioGroup` & `RadioItem`                   | Renders `role="radiogroup"` with child `role="menuitemradio"` and `aria-checked="true/false"`.                |
| **Trigger Announcements** | `aria-label="Select display theme. Current theme is ..."` | Screen readers announce the exact purpose and current state before opening.                                   |
| **Keyboard Traversal**    | `ArrowUp` / `ArrowDown` & `Enter` / `Space`               | Moves roving focus sequentially and toggles options without page scroll.                                      |
| **Focus Restoration**     | Native Radix FocusScope                                   | Dismissing with `Escape` or making a selection automatically restores DOM focus to the trigger button.        |
| **Layout Shift / FOUC**   | `mounted` guard + skeleton loader                         | Avoids hydration mismatch warning and stops visual layout jumps before client-side theme hydration completes. |

---

### Step 4: Add Automated Playwright Test

Ensure the menu adheres to keyboard accessibility and screen reader expectations:

```typescript
// e2e/theme-selector.spec.ts
import { test, expect } from "@playwright/test";

test("ThemeSelector keyboard navigation and state selection", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const trigger = page.getByRole("button", { name: /select display theme/i });
  await trigger.focus();

  // Open dropdown with keyboard
  await page.keyboard.press("ArrowDown");

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();

  // Navigate to Dark option and select
  const darkOption = page.getByRole("menuitemradio", { name: /dark/i });
  await page.keyboard.press("ArrowDown");
  await expect(darkOption).toBeFocused();
  await page.keyboard.press("Enter");

  // Menu closes and theme updates
  await expect(menu).not.toBeVisible();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(trigger).toBeFocused();
});

```

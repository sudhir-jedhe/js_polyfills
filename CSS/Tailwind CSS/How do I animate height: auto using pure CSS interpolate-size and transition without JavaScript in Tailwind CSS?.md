The modern CSS property **`interpolate-size: allow-keywords`** allows browsers to smoothly animate intrinsic sizing keywords (like `height: auto`, `min-content`, and `max-content`) using standard CSS transitions without JavaScript calculations.

---

### Step 1: Enable `interpolate-size` in Tailwind v4

In your main CSS file (`globals.css` / `index.css`), apply `interpolate-size: allow-keywords` to the `:root` so every element in your application gains the ability to interpolate keywords:

```css
@import "tailwindcss";

:root {
  interpolate-size: allow-keywords;
}

```

*(Optional)* If you only want it on specific elements, register a utility:

```css
@utility interpolate-keywords {
  interpolate-size: allow-keywords;
}

```

---

### Step 2: Animating Collapsible Sections with Tailwind

Because `interpolate-size: allow-keywords` is active, toggling between `h-0` (or `max-h-0`) and `h-auto` (or `max-h-none`) with standard `transition-[height]` or `transition-all` animates smoothly.

#### Example: Pure CSS `<details>` Accordion

The native `<details>` element can animate its height between closed and open states:

```html
<div class="max-w-md mx-auto p-6 space-y-4">
  <details class="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-hidden transition-[height] duration-300 ease-out h-14 open:h-auto">
    <summary class="flex items-center justify-between cursor-pointer font-semibold text-slate-900 dark:text-white list-none select-none">
      <span>How does interpolate-size work?</span>
      <span class="transition-transform duration-300 group-open:rotate-180 text-slate-400">
        ↓
      </span>
    </summary>

    <p class="pt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      By setting <code>interpolate-size: allow-keywords</code> on the root, the browser calculates the layout size of <code>auto</code> and smoothly transitions the height directly on the CSS rendering pipeline.
    </p>
  </details>
</div>

```

---

### Step 3: React Dynamic Collapsible Component

In React, toggle between `h-0` and `h-auto` without any `ref`, `ResizeObserver`, or third-party animation library:

```tsx
import * as React from "react";

export function CollapsibleCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span>{title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Direct height transition from 0 to auto */}
      <div
        className={`overflow-hidden transition-[height,opacity] duration-300 ease-in-out ${
          isOpen ? "h-auto opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}

```

---

### Alternative: CSS `calc-size()`

You can also use the CSS function `calc-size()` directly via Tailwind arbitrary properties for targeted elements:

```html
<!-- Transitions height from 0px to calc-size(auto, size) -->
<div class="overflow-hidden transition-[height] duration-300 h-0 data-[open=true]:h-[calc-size(auto,size)]">
  Dynamic content here...
</div>

```

---

### Key Requirements & Gotchas

* **`overflow-hidden` is mandatory:** When the element is transitioning to or from `h-0`, inner text and borders will visually bleed out unless `overflow: hidden` is applied to the collapsing container.
* **Child Padding Placement:** Place vertical padding inside an inner wrapper div (as shown in Step 3), or ensure padding also transitions to `0` when closed (`p-0` to `p-4`), so the collapsed container has a true height of `0px`.

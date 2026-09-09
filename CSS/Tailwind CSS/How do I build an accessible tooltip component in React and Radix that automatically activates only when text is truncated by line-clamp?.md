***  How do I build an accessible tooltip component in React and Radix that automatically activates only when text is truncated by line-clamp?.md ***

To build a conditional tooltip that only activates when text is truncated by `line-clamp` (or `truncate`), compare the element's actual layout bounds (`clientWidth`, `clientHeight`) against its scrollable content dimensions (`scrollWidth`, `scrollHeight`) using a `ResizeObserver`.

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-tooltip

```

---

### Step 2: Build the `useIsTruncated` Hook

Create `hooks/useIsTruncated.ts` to detect both single-line overflow and multi-line `line-clamp` overflow dynamically across resizes:

```typescript
// hooks/useIsTruncated.ts
import * as React from "react";

export function useIsTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  const checkTruncation = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Detects horizontal overflow (single-line truncate)
    const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;

    // Detects vertical overflow (multi-line line-clamp)
    const hasVerticalOverflow = el.scrollHeight > el.clientHeight;

    setIsTruncated(hasHorizontalOverflow || hasVerticalOverflow);
  }, []);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial measurement
    checkTruncation();

    // Re-check whenever container or window dimensions change
    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(el);

    if (el.parentElement) {
      resizeObserver.observe(el.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkTruncation]);

  return { ref, isTruncated, checkTruncation };
}

```

---

### Step 3: Build the `TruncatedTooltip` Component

Wrap Radix's `Tooltip` primitive. When `isTruncated` is `false`, the component sets `open={false}` to disable tooltip triggers, hover cards, and screen reader announcements for text that is already fully visible.

```tsx
// components/TruncatedTooltip.tsx
"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useIsTruncated } from "@/hooks/useIsTruncated";
import { cn } from "@/lib/utils";

interface TruncatedTooltipProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** The full text content to display and measure */
  content: string;
  /** Number of lines before truncation (1 = single line truncate, >1 = line-clamp) */
  lines?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Optional custom tooltip side */
  side?: "top" | "right" | "bottom" | "left";
}

const LINE_CLAMP_CLASSES: Record<number, string> = {
  1: "truncate",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export function TruncatedTooltip({
  content,
  lines = 1,
  side = "top",
  className,
  ...props
}: TruncatedTooltipProps) {
  const { ref, isTruncated } = useIsTruncated<HTMLParagraphElement>();

  // If text is not truncated, render raw text without Tooltip overhead
  if (!isTruncated) {
    return (
      <p
        ref={ref}
        className={cn("min-w-0 break-words", LINE_CLAMP_CLASSES[lines], className)}
        {...props}
      >
        {content}
      </p>
    );
  }

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <p
            ref={ref}
            tabIndex={0}
            aria-label={content}
            className={cn(
              "min-w-0 cursor-help break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm",
              LINE_CLAMP_CLASSES[lines],
              className
            )}
            {...props}
          >
            {content}
          </p>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            sideOffset={6}
            className="z-50 max-w-sm rounded-xl border border-slate-200 bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xl animate-in fade-in-0 zoom-in-95 dark:border-slate-800 dark:bg-slate-950"
          >
            {content}
            <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

```

---

### Step 4: Practical Usage in Responsive Cards

```tsx
// components/ArticleCard.tsx
import { TruncatedTooltip } from "@/components/TruncatedTooltip";

export function ArticleCard() {
  return (
    <article className="w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-3 min-w-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        Design Tokens
      </span>

      {/* Single-line header: Tooltip triggers only if title overflows the 320px card */}
      <TruncatedTooltip
        lines={1}
        content="Automating OKLCH Color Transformations in Design Systems"
        className="text-base font-bold text-slate-900 dark:text-white"
      />

      {/* Multi-line body: Tooltip triggers only if text exceeds 2 lines */}
      <TruncatedTooltip
        lines={2}
        content="OKLCH provides perceptually uniform color interpolation across gamut boundaries. When building token translation layers between Figma and Tailwind v4, clamp scales preserve accessibility contracts without hand-tuned hex mappings."
        className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
      />
    </article>
  );
}

```

---

### Accessibility & Performance Highlights

* **Keyboard Accessible Focus (`tabIndex={0}`):** Truncated paragraphs receive keyboard focus and display focus rings so non-mouse users can access the full content via keyboard navigation.
* **No Redundant Screen Reader Clutter:** When text fits comfortably on screen, standard `<p>` tags render without adding extraneous tooltip nodes to the accessibility tree.
* **`ResizeObserver` Accuracy:** Recalculates dynamically when container cards resize via CSS Grid or viewport shifts without needing window `scroll` or `resize` polling.

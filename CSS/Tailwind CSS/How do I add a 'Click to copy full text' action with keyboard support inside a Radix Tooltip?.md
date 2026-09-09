***  How do I add a 'Click to copy full text' action with keyboard support inside a Radix Tooltip?.md ***

To allow users to click or press a keyboard shortcut to copy full truncated text from inside a Radix Tooltip, the standard `Tooltip` (which closes when hover/focus moves away) must be configured to support **interactive content** (`interactive={true}` behavior via Radix `Tooltip.Content` or focusable child triggers).

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-tooltip lucide-react

```

---

### Step 2: Build the `useIsTruncated` Hook

Create `hooks/useIsTruncated.ts` to detect both single-line (`truncate`) and multi-line (`line-clamp`) text truncation:

```typescript
// hooks/useIsTruncated.ts
import * as React from "react";

export function useIsTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  const checkTruncation = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;
    const hasVerticalOverflow = el.scrollHeight > el.clientHeight;

    setIsTruncated(hasHorizontalOverflow || hasVerticalOverflow);
  }, []);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(el);

    if (el.parentElement) {
      resizeObserver.observe(el.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, [checkTruncation]);

  return { ref, isTruncated, checkTruncation };
}

```

---

### Step 3: Build the Accessible `CopyableTruncatedTooltip` Component

This component:

1. Truncates text on screen with responsive line-clamps.
2. Only renders the interactive tooltip if the text is overflowing.
3. Allows users to click the text, press **`Enter`** / **`Space`** while focused, or click the tooltip button to copy the entire string.
4. Announces the copy status politely via a live region (`role="status"`).

```tsx
// components/CopyableTruncatedTooltip.tsx
"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Copy, Check } from "lucide-react";
import { useIsTruncated } from "@/hooks/useIsTruncated";
import { cn } from "@/lib/utils";

interface CopyableTruncatedTooltipProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /** The full string content */
  content: string;
  /** Number of visible clamped lines (1 = single line) */
  lines?: 1 | 2 | 3 | 4 | 5;
  side?: "top" | "right" | "bottom" | "left";
}

const LINE_CLAMP_CLASSES: Record<number, string> = {
  1: "truncate",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

export function CopyableTruncatedTooltip({
  content,
  lines = 1,
  side = "top",
  className,
  ...props
}: CopyableTruncatedTooltipProps) {
  const { ref, isTruncated } = useIsTruncated<HTMLParagraphElement>();
  const [copied, setCopied] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCopy = React.useCallback(
    async (e?: React.SyntheticEvent) => {
      if (e) e.stopPropagation();

      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    },
    [content]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enable Enter or Space to trigger copy when focused
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCopy(e);
    }
  };

  // If text is not truncated, render standard paragraph without overhead
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
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip.Trigger asChild>
          <p
            ref={ref}
            tabIndex={0}
            role="button"
            aria-label={`${content}. Press Enter to copy full text.`}
            onClick={handleCopy}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-w-0 cursor-pointer break-words rounded-sm select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
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
            sideOffset={8}
            className="z-50 max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 shadow-2xl animate-in fade-in-0 zoom-in-95 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex flex-col gap-2.5">
              {/* Full Text Display */}
              <p className="leading-relaxed text-slate-200 break-words select-text">
                {content}
              </p>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-2">
                <span className="text-[11px] text-slate-400">
                  {copied ? "Copied to clipboard!" : "Click text or button to copy"}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" aria-hidden="true" />
                      <span>Copy Full</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Polite screen reader live region announcement */}
            <div className="sr-only" role="status" aria-live="polite">
              {copied ? "Full text copied to clipboard" : ""}
            </div>

            <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

```

---

### Step 4: Practical Usage in a Card Feed

```tsx
// components/LogViewerCard.tsx
import { CopyableTruncatedTooltip } from "./CopyableTruncatedTooltip";

export function LogViewerCard() {
  return (
    <div className="w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>ERROR_TRACE_ID</span>
        <span className="font-bold text-red-500">500 Internal</span>
      </div>

      {/* Single-line trace token: Truncates and copies on click/Enter */}
      <CopyableTruncatedTooltip
        lines={1}
        content="tx_9842aef98234bc890123ef123490aafe89341209bcdef123894"
        className="font-mono text-xs text-slate-800 dark:text-slate-200"
      />

      {/* Multi-line stack trace */}
      <CopyableTruncatedTooltip
        lines={2}
        content="UnhandledPromiseRejection: Database connection timed out after 30000ms at PostgreSQLPool.connect (/var/task/node_modules/pg-pool/index.js:45:11)"
        className="text-xs text-slate-500 dark:text-slate-400"
      />
    </div>
  );
}

```

---

### Accessibility & Interaction Highlights

* **WAI-ARIA Action Semantics:** Setting `role="button"` and `tabIndex={0}` on the clamped text allows keyboard users to tab directly to the element and activate copy via `Enter` or `Space`.
* **Dynamic Live Region Feedback:** The inline `<div role="status" aria-live="polite">` informs screen readers when content is successfully copied without disrupting screen reader position.
* **Smart Event Propagation:** Copy button clicks call `e.stopPropagation()` so the tooltip content remains stable while copying.

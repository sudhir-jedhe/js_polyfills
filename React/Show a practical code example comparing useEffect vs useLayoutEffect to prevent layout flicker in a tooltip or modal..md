***  Show a practical code example comparing useEffect vs useLayoutEffect to prevent layout flicker in a tooltip or modal..md ***

Here is a practical example of a dynamic **Tooltip** component positioned above a target button.

Because the exact height of the tooltip depends on dynamic text length, we must render it into the DOM, measure its rendered height (`getBoundingClientRect`), and calculate the correct `top` position.

---

### The Problem with `useEffect` (Causes Visual Flicker)

```tsx
import React, { useState, useRef, useEffect } from 'react';

function BrokenTooltip({ targetRect, text }: { targetRect: DOMRect; text: string }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (tooltipRef.current) {
      const { height } = tooltipRef.current.getBoundingClientRect();
      // ⚠️ React updates state AFTER the browser already painted top=0
      setTop(targetRect.top - height - 8);
    }
  }, [targetRect]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: targetRect.left,
        top: `${top}px`, // 1. Paints at top: 0px first, then flashes to targetRect.top - height - 8px
      }}
    >
      {text}
    </div>
  );
}

```

**What happens on screen:**

1. **Render 1:** DOM node is placed at `top: 0px`.
2. **Browser Paint:** The browser paints the tooltip at the top-left of the screen (`top: 0px`).
3. **`useEffect` executes:** Reads `height`, calls `setTop(-calculatedHeight)`.
4. **Render 2:** DOM node updates to the correct offset.
5. **Browser Paint 2:** Tooltip snaps into place.
*Result:* The user sees a split-second **flash/flicker** as the element jumps across the screen.

---

### The Fix with `useLayoutEffect` (Zero Flicker)

```tsx
import React, { useState, useRef, useLayoutEffect } from 'react';

function SmoothTooltip({ targetRect, text }: { targetRect: DOMRect; text: string }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { height } = tooltipRef.current.getBoundingClientRect();
      // ✅ Runs synchronously BEFORE the browser calculates layout/paint
      setTop(targetRect.top - height - 8);
    }
  }, [targetRect]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: targetRect.left,
        top: `${top}px`, // Evaluated & recalculated before the single frame paint
      }}
    >
      {text}
    </div>
  );
}

```

**What happens on screen:**

1. **Mutation Phase:** React creates and attaches the `<div>` to the DOM in memory.
2. **Layout Phase (`useLayoutEffect`):** React runs the layout effect immediately, measures `height`, and triggers `setTop()`.
3. **Synchronous Re-render:** React immediately executes the re-render pass synchronously before yielding the thread.
4. **Browser Paint:** The browser renders the frame once with the tooltip already in its exact target position.
*Result:* **Zero flicker**, the element appears directly above the button on frame 1.

---

### When to Choose Which

* Use **`useLayoutEffect`** exclusively for DOM measurements and layout-dependent state adjustments (tooltips, popovers, custom dropdown positioning, canvas resizing, measuring element scroll positions).
* Use **`useEffect`** for all standard side effects (data fetching, subscriptions, setting document titles, analytic trackers) so you don't unnecessarily block browser painting.

*** copy When is useLayoutEffect strictly required in React versus useEffect, and what are the performance trade-offs?.md ***

**`useLayoutEffect`** and **`useEffect`** have identical signatures, but they execute at completely different stages of the browser's rendering lifecycle.

* **`useLayoutEffect`** fires **synchronously** immediately after React mutates the DOM, **before the browser paints** the screen.
* **`useEffect`** fires **asynchronously** **after the browser has painted** the screen.

---

### The Execution Timeline

```
[React Render Phase] (Computes Virtual DOM)
        │
        ▼
[React Commit Phase] (Mutates Real DOM)
        │
        ▼
[useLayoutEffect]    ◀── Synchronous execution (Main thread blocked, screen NOT painted yet)
        │
        ▼
[Browser Paint]      ◀── Pixels rendered on screen for the user
        │
        ▼
[useEffect]          ◀── Asynchronous execution (Runs without delaying visual feedback)

```

---

### When `useLayoutEffect` is Strictly Required

You should only use `useLayoutEffect` when a state update or DOM mutation must occur **before the user sees the frame**, specifically to eliminate visual flicker.

**1. Measuring DOM Elements to Position Tooltips, Popovers, or Modals**
If you need to measure an element’s rendered size (`getBoundingClientRect()`) to calculate where to place a tooltip or dropdown:

* With `useEffect`: The tooltip renders in a default/wrong spot $\to$ browser paints $\to$ effect measures $\to$ tooltip jumps to the correct position (**visible flicker**).
* With `useLayoutEffect`: React creates the node $\to$ `useLayoutEffect` measures and calculates positioning $\to$ React updates DOM $\to$ browser paints once in the final position (**zero flicker**).

```tsx
function Tooltip({ targetRect, children }: { targetRect: DOMRect; children: React.ReactNode }) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    const { height, width } = tooltipRef.current.getBoundingClientRect();
    // Position above target; calculation finishes before paint
    setCoords({
      top: targetRect.top - height - 8,
      left: targetRect.left + (targetRect.width - width) / 2,
    });
  }, [targetRect]);

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'fixed', top: `${coords.top}px`, left: `${coords.left}px` }}
    >
      {children}
    </div>
  );
}

```

**2. Synchronous Scroll Position Restoration**
When restoring scroll position on route transitions or chat lists (e.g., sticking to the bottom of a message stream):

* `useEffect` will show the default top position for 1 frame before jumping to the bottom.
* `useLayoutEffect` ensures the scroll offset is adjusted before the screen updates.

**3. Direct DOM Manipulation / Canvas Setup**
When integrating with imperative animation engines (like GSAP or canvas contexts) where starting values must be applied immediately to prevent the un-styled initial state from flashing.

---

### Performance Trade-Offs

| Metric / Dimension                  | `useEffect`                                                    | `useLayoutEffect`                                                                      |
| ----------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Execution Timing**                | Asynchronous (Post-paint).                                     | **Synchronous** (Pre-paint).                                                           |
| **Main Thread Impact**              | **Non-blocking**. Does not delay browser frame rate or paints. | **Blocks browser paint**. Long operations delay the frame, dropping FPS.               |
| **INP (Interaction to Next Paint)** | Favorable. Browser renders user feedback immediately.          | Dangerous. Heavy logic directly increases **Presentation Delay** and inflates INP.     |
| **SSR Compatibility**               | Fully compatible. Ignored on the server without warnings.      | Throws SSR warnings on Next.js/Node because DOM measurements cannot run on the server. |

---

### Strict Decision Matrix

```
Do you need to read the DOM (getBoundingClientRect, offsetHeight, scrollTop) 
AND immediately update the DOM/state based on that measurement?
   │
   ├── YES ──▶ Will the user see a visual flash/flicker if delayed by 1 frame?
   │              ├── YES ──▶ Use `useLayoutEffect`
   │              └── NO  ──▶ Use `useEffect` or `ResizeObserver`
   │
   └── NO  ──▶ (Data fetching, timers, logging, subscriptions) ──▶ ALWAYS use `useEffect`

```

---

### Recommended Best Practice: Default to `useEffect`

1. Always write `useEffect` first.
2. Only convert to `useLayoutEffect` if you observe a distinct visual flicker or layout jump when the component mounts or updates.
3. If supporting Server-Side Rendering (SSR) without hydration warnings, use an isomorphic fallback hook:

```typescript
import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

```

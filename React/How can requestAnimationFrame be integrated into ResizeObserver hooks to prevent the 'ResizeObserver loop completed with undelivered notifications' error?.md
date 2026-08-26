*** copy How can requestAnimationFrame be integrated into ResizeObserver hooks to prevent the 'ResizeObserver loop completed with undelivered notifications' error?.md ***

The error **`ResizeObserver loop completed with undelivered notifications`** (or `ResizeObserver loop limit exceeded`) occurs when a `ResizeObserver` callback triggers a layout mutation (like updating React state that changes DOM dimensions) within the **same animation frame/layout pass**.

The browser notices that the element's size changed again while it was trying to deliver the notification, detects a potential infinite layout loop, and terminates the cycle with an error.

Wrapping the observer callback inside **`requestAnimationFrame` (rAF)** defers the state update to the start of the **next paint cycle**, breaking the synchronous feedback loop.

---

**Step-by-Step Implementation with `requestAnimationFrame**`

To implement this correctly:

1. Capture the latest observer entries.
2. Cancel any pending animation frame to prevent queuing stale renders.
3. Schedule the measurement update for the next frame via `requestAnimationFrame`.
4. Clean up both the observer and any pending `rAF` ID on unmount.

```typescript
// useMeasureWithRAF.ts
import { useState, useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface Dimensions {
  width: number;
  height: number;
  top: number;
  left: number;
}

export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [rect, setRect] = useState<Dimensions>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const observerRef = useRef<ResizeObserver | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!element) return;

    // 1. Synchronous initial measurement before paint (zero flicker)
    const initialRect = element.getBoundingClientRect();
    setRect({
      width: initialRect.width,
      height: initialRect.height,
      top: initialRect.top,
      left: initialRect.left,
    });

    // 2. Set up ResizeObserver with rAF throttling
    observerRef.current = new ResizeObserver((entries) => {
      if (!entries.length) return;

      // Cancel any previously queued frame that hasn't fired yet
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Defer state mutation to the next animation frame
      rafIdRef.current = requestAnimationFrame(() => {
        const nextRect = element.getBoundingClientRect();

        setRect((prev) => {
          // Guard: Avoid triggering a re-render if dimensions are unchanged
          if (
            prev.width === nextRect.width &&
            prev.height === nextRect.height &&
            prev.top === nextRect.top &&
            prev.left === nextRect.left
          ) {
            return prev;
          }

          return {
            width: nextRect.width,
            height: nextRect.height,
            top: nextRect.top,
            left: nextRect.left,
          };
        });
      });
    });

    observerRef.current.observe(element);

    // 3. Complete cleanup
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [element]);

  return [ref, rect] as const;
}

```

---

**Why This Pattern Prevents the Error**

* **Separation of Measurement and Mutation:**
The browser delivers the `ResizeObserver` event during the current frame layout phase. Instead of calling React's `setState` immediately (which would synchronously alter the DOM and trigger another layout pass), `requestAnimationFrame` moves the update to the next frame pipeline.
* **Automatic Throttling:**
Calling `cancelAnimationFrame(rafIdRef.current)` before queuing a new frame ensures that if a user rapidly resizes the browser (firing 10+ resize events in under 16ms), React renders only the latest size snapshot once per refresh rate ($60\text{Hz}$ / $120\text{Hz}$).
* **Memory & Event Safety:**
Clearing `rafIdRef.current` inside the unmount cleanup guarantees that state updates won't be called on unmounted components if the element is removed mid-frame.

*** copy Show how to create a custom useMeasure hook using useLayoutEffect and ResizeObserver for accurate, flicker-free layout tracking..md ***

A robust measurement hook requires handling three core constraints:

1. **Callback Ref over `useRef`:** A standard `useRef` doesn't notify when a DOM node attaches or detaches (e.g., inside conditional renders). A callback ref ensures the observer binds immediately upon node attachment.
2. **`useLayoutEffect` (or isomorphic fallback):** Takes the initial synchronous measurement before the browser paints to eliminate visual jumps.
3. **`ResizeObserver`:** Continuously tracks layout, border-box, or window resizing.

---

**Step 1: Create an Isomorphic Layout Effect Helper**

`useLayoutEffect` emits console warnings in Server-Side Rendering (SSR) environments like Next.js because DOM layouts do not exist on the server.

```typescript
// useIsomorphicLayoutEffect.ts
import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

```

---

**Step 2: Build the `useMeasure` Hook**

```typescript
// useMeasure.ts
import { useState, useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface Dimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

const defaultDimensions: Dimensions = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
};

export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [rect, setRect] = useState<Dimensions>(defaultDimensions);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Callback ref ensures we capture element mounting/unmounting reliably
  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!element) return;

    // 1. Measure synchronously on mount BEFORE the browser paints
    const initialRect = element.getBoundingClientRect();
    setRect({
      width: initialRect.width,
      height: initialRect.height,
      top: initialRect.top,
      left: initialRect.left,
      bottom: initialRect.bottom,
      right: initialRect.right,
      x: initialRect.x,
      y: initialRect.y,
    });

    // 2. Set up ResizeObserver to track continuous size changes
    observerRef.current = new ResizeObserver((entries) => {
      if (!entries.length) return;

      const entry = entries[0];
      const nextRect = element.getBoundingClientRect();

      setRect((prev) => {
        // Prevent redundant re-renders if dimensions haven't changed
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
          bottom: nextRect.bottom,
          right: nextRect.right,
          x: nextRect.x,
          y: nextRect.y,
        };
      });
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [element]);

  return [ref, rect] as const;
}

```

---

**Step 3: Example Usage (Flicker-Free Tooltip / Box Tracker)**

```tsx
import React from 'react';
import { useMeasure } from './useMeasure';

export function ResponsiveCard() {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '500px',
        resize: 'both',
        overflow: 'auto',
        border: '1px solid #ccc',
        padding: '16px',
      }}
    >
      <h3>Resizable Card</h3>
      <p>Width: {Math.round(width)}px</p>
      <p>Height: {Math.round(height)}px</p>
    </div>
  );
}

```

---

**Key Technical Details**

* **Synchronous First Measurement:** Reading `element.getBoundingClientRect()` inside `useIsomorphicLayoutEffect` ensures that any secondary state update finishes in the exact same frame before pixels are painted to the screen.
* **Equality Guards:** `setRect((prev) => ...)` compares measurements prior to state updates to avoid infinite loops and unnecessary render cycles during micro-resizes.
* **Cleanup Safety:** Disconnecting `ResizeObserver` in the effect cleanup prevents memory leaks when components unmount or elements detach.

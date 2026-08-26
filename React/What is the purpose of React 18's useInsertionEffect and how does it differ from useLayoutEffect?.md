*** copy What is the purpose of React 18's useInsertionEffect and how does it differ from useLayoutEffect?.md ***

**`useInsertionEffect`** is a specialized hook introduced in React 18 specifically designed for **runtime CSS-in-JS library authors** (such as Styled-Components or Emotion). Its sole purpose is to inject `<style>` tags or CSS rules into the DOM **before** React reads layout or the browser calculates layout and paints.

Application developers rarely write `useInsertionEffect` directly—it is an infrastructure hook for styling libraries.

---

### The Complete React 18 Effect Timeline

`useInsertionEffect` slots in *before* `useLayoutEffect`:

```
[1. Render Phase]          ──▶ React calls components & builds Virtual DOM
                                      │
[2. useInsertionEffect]    ──▶ Synchronous: Inject <style> rules into <head> (DOM not fully mutated yet)
                                      │
[3. Real DOM Mutation]     ──▶ React updates real DOM nodes (elements, attributes)
                                      │
[4. useLayoutEffect]       ──▶ Synchronous: Read layout (getBoundingClientRect) / direct DOM mutations
                                      │
[5. Browser Layout & Paint]──▶ Browser computes layout geometry and draws pixels on screen
                                      │
[6. useEffect]             ──▶ Asynchronous: API calls, event listeners, timers (post-paint)

```

---

### The Problem `useInsertionEffect` Solves

In runtime CSS-in-JS libraries, dynamic styles are generated and injected at runtime.

If a CSS-in-JS library injects `<style>` tags during `useLayoutEffect` or `useEffect`:

1. The component renders.
2. `useLayoutEffect` runs in a child component and calls `element.getBoundingClientRect()` or `offsetWidth`.
3. The CSS-in-JS library then injects `<style>` into the DOM.
4. Injecting new styles into the DOM forces the browser engine to **recalculate styles and reflow layout across the entire page (Forced Synchronous Reflow)**.
5. If another layout effect reads dimensions, layout runs again—causing catastrophic **layout thrashing** during every render pass.

By running **`useInsertionEffect` before any layout effects and DOM mutations occur**, styles are guaranteed to be inserted and available *before* any layout reads happen.

---

### Key Differences: `useInsertionEffect` vs. `useLayoutEffect`

| Feature                   | `useInsertionEffect`                                                        | `useLayoutEffect`                                                                                    |
| ------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Execution Timing**      | Runs **before** React mutates the DOM tree and before layout measurements.  | Runs **after** React mutates the DOM tree, but **before** browser paint.                             |
| **Primary Use Case**      | Injecting dynamic CSS `<style>` elements into the document.                 | Measuring DOM layout (`getBoundingClientRect`) and mutating DOM nodes synchronously without flicker. |
| **Ref Access (`useRef`)** | **Refs are NOT attached yet** (accessing `ref.current` is unreliable/null). | **Refs are fully populated** with real DOM elements.                                                 |
| **State Updates**         | Cannot/should not update state (`setState` is discouraged/unsupported).     | Can update state (e.g., setting coordinates based on measured dimensions).                           |
| **Target Audience**       | CSS-in-JS library maintainers.                                              | Application developers building complex UI (tooltips, animations, scroll restoration).               |

---

### How CSS-in-JS Libraries Use It

```typescript
// Simplified illustration of dynamic style injection
import { useInsertionEffect } from 'react';

function useDynamicStyles(cssRule: string) {
  useInsertionEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = cssRule;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [cssRule]);
}

// Consuming component
export function Button({ variant }: { variant: string }) {
  // Styles are injected into <head> before any DOM measurements run
  useDynamicStyles(`.btn-${variant} { background: ${variant === 'primary' ? 'blue' : 'gray'}; }`);

  return <button className={`btn-${variant}`}>Click Me</button>;
}

```

---

### Summary Rule

* **`useInsertionEffect`:** Use **only** when authoring a CSS-in-JS library to inject `<style>` tags before layout.
* **`useLayoutEffect`:** Use when you need to read real DOM dimensions and update positions/state before the user sees a paint flicker.
* **`useEffect`:** Use for everything else (fetching data, timers, event listeners, non-layout DOM logic).

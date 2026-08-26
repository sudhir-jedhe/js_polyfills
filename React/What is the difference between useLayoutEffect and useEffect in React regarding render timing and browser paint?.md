*** copy What is the difference between useLayoutEffect and useEffect in React regarding render timing and browser paint?.md ***

The core difference between `useEffect` and `useLayoutEffect` comes down to **when they execute relative to the browser's paint cycle**:

```
[Render Phase] ──▶ React calculates DOM mutations (Virtual DOM)
                          │
[Commit Phase] ──▶ React updates the real DOM tree
                          │
                   ┌───────────────────────────────────────────────┐
                   │  1. useLayoutEffect fires SYNCHRONOUSLY       │
                   │     • Real DOM is updated in memory           │
                   │     • Blocks browser painting                 │
                   │     • Reads layout (e.g. getBoundingClientRect)│
                   │     • Synchronous setState here re-renders    │
                   │       BEFORE the user sees anything           │
                   └───────────────────────┬───────────────────────┘
                                           │
[Browser Paint] ──▶ Browser calculates layout & paints pixels to screen
                          │
                   ┌───────────────────────────────────────────────┐
                   │  2. useEffect fires ASYNCHRONOUSLY            │
                   │     • Screen is already visible to user       │
                   │     • Does NOT block browser paint/UI         │
                   └───────────────────────────────────────────────┘

```

---

**1. Execution Timing & Thread Blocking**

* **`useLayoutEffect` (Synchronous / Blocking):**
* Fires immediately after React applies mutations to the host DOM, but **before the browser recalculates layout and paints pixels to the screen**.
* It runs synchronously on the main JavaScript thread. Because it blocks the browser from painting until it finishes, any DOM measurements or secondary state updates triggered inside it happen before the screen updates.

* **`useEffect` (Asynchronous / Non-blocking):**
* Fires **after the browser has completely painted** the updated DOM onto the screen.
* React defers its execution using a browser task/microtask so that it does not block the user interface or cause frame drops.

---

**2. The "Layout Flicker" Scenario**

The timing difference becomes critical when you need to read a DOM measurement and immediately adjust styles or position based on that measurement (e.g., tooltips, popovers, dropdown positioning).

**With `useEffect` (Causes Visual Flicker):**

1. React mounts a tooltip at `top: 0, left: 0`.
2. The browser paints the tooltip at $(0, 0)$ (the user sees it for a split second).
3. `useEffect` fires, measures the trigger button, and calls `setPosition({ top: 120, left: 45 })`.
4. React re-renders and the browser paints again at the correct location.
5. **Result:** A visible layout jump/flicker.

**With `useLayoutEffect` (Zero Flicker):**

1. React mounts a tooltip at `top: 0, left: 0` in the real DOM tree.
2. `useLayoutEffect` immediately fires, reads the trigger button's coordinates via `element.getBoundingClientRect()`, and calls `setPosition(...)`.
3. React synchronously re-renders the component with the new position **before yielding to the browser**.
4. The browser paints the screen only once, displaying the tooltip directly at $(120, 45)$.
5. **Result:** Seamless, flicker-free rendering.

---

**Summary Comparison Matrix**

| Feature                | `useEffect`                                    | `useLayoutEffect`                                                     |
| ---------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| **Execution Timing**   | **After** browser paints pixels to screen.     | **Before** browser paints pixels to screen (after DOM mutation).      |
| **Execution Mode**     | Asynchronous / Non-blocking.                   | Synchronous / Blocks browser paint.                                   |
| **Performance Impact** | Minimal (keeps UI responsive).                 | High if long-running (can cause UI jank/freezing).                    |
| **DOM Measurement**    | Prone to visual flickering if updating state.  | Safe for measurements and synchronous repositioning.                  |
| **SSR Behavior**       | Safely ignored on the server.                  | Emits a warning on the server because no DOM layout exists.           |
| **Primary Use Cases**  | Data fetching, subscriptions, timers, logging. | Tooltips/popovers positioning, measuring DOM elements, canvas setups. |

> **Rule of Thumb:** Default to **`useEffect`** 99% of the time. Only switch to **`useLayoutEffect`** when reading layout properties (like `getBoundingClientRect()`, `scrollWidth`, `offsetHeight`) or when state updates cause an observable visual flicker.

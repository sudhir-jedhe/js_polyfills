# Interview Q&A: useRef Core Mechanics

**Q: What does `useRef` return, and how is it different from `useState`?**

`useRef(initialValue)` returns a plain mutable object `{ current: initialValue }` whose reference stays the same for the entire lifetime of the component. Mutating `.current` does not trigger a re-render, whereas calling a `useState` setter always schedules one (assuming the value actually changed). Use `useState` for anything that should show up in the rendered UI; use `useRef` for values the component needs to remember without that change itself causing a re-render.

**Q: Why doesn't updating a ref cause the component to re-render?**

Because refs are explicitly designed as an escape hatch outside React's rendering model — mutating `.current` is a plain JavaScript object mutation that React's scheduler has no visibility into. `useState`/`useReducer` are the only APIs that tell React "something changed, please re-render"; `useRef` intentionally doesn't participate in that mechanism, which is exactly what makes it suitable for values you don't want to cause re-renders.

## Comparison table: useRef vs useState

| Aspect | `useRef` | `useState` |
|---|---|---|
| Triggers re-render on change | No | Yes |
| Value available immediately after mutation | Yes (synchronous) | No — reflects the update only after next render |
| Best for | DOM node handles, mutable bookkeeping not shown in UI | Any value that should drive what's rendered |

## Comparison table: useRef vs a plain variable

| Aspect | `useRef` | Plain variable in component body |
|---|---|---|
| Persists across renders | Yes — same object reference for the instance's lifetime | No — reinitialized every render |
| Shared across instances | No — each instance gets its own ref | N/A |

The most common mistake is trying to track "did I already fetch this" with a plain `let`/`const` inside the function body, which resets every render and never actually prevents anything — `useRef` is the mechanism React provides specifically to persist a mutable value across renders for one component instance.

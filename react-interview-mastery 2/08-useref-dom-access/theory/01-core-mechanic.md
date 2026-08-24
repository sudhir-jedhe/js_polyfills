# The core mechanic

`useRef(initialValue)` returns a plain object shaped `{ current: initialValue }` that is stable across the component's entire lifetime — the same object reference every render. You can read and write `.current` freely, and doing so does **not** trigger a re-render, unlike `useState`.

```jsx
function Counter() {
  const renderCount = useRef(0);
  renderCount.current += 1; // mutating during render — fine for this specific purpose
  return <p>Rendered {renderCount.current} times</p>;
}
```

This is the key mental model difference from `useState`: `useState` changes are meant to drive what's on screen (they schedule a re-render); `useRef` changes are for bookkeeping that the component needs to remember but that shouldn't, by itself, cause the UI to update.

## Why ref mutations don't update the UI

Because React's render cycle is driven by state changes (via `useState`/`useReducer`) and prop changes from a parent re-rendering — `.current` mutations are invisible to React's scheduler entirely. If you mutate a ref and expect the screen to reflect it immediately, it won't, until *something else* (a state update) causes a re-render, at which point the ref's current value will be read fresh. This is a frequent source of confusion: "I set `ref.current = true` but the UI didn't update" — because nothing told React to re-render.

## useRef vs useState

| Aspect | `useRef` | `useState` |
|---|---|---|
| Triggers re-render on change | No | Yes |
| Value available immediately after mutation | Yes (synchronous) | No — reflects the update only after next render (with the well-known caveats around batching) |
| Best for | DOM node handles, mutable bookkeeping not shown in UI (timers, previous values, instance flags) | Any value that should drive what's rendered |

## useRef vs a plain variable in the component body

| Aspect | `useRef` | Plain variable declared in component body |
|---|---|---|
| Persists across renders | Yes — same object reference for the component instance's lifetime | No — reinitialized to its initial value on every render |
| Shared across multiple instances of the component | No — each component instance gets its own ref | N/A (module-level variables would be shared and are almost never what you want) |

A `let` or `const` declared inside the function body is recreated fresh every render — it cannot hold onto a value between renders. `useRef` is the mechanism React provides specifically to persist a mutable value across renders for one component instance.

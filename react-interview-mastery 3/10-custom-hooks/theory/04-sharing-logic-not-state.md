# Sharing Logic, Not State

This trips people up constantly: calling the same custom hook from two different components (or twice in the same component) gives each call site its **own, independent state instance**. Nothing is shared between them unless the hook itself reaches into something external and shared (like `localStorage`, a module-level variable, or Context).

```jsx
function ComponentA() {
  const [isOpen, toggle] = useToggle(); // its own isOpen, starts false
}
function ComponentB() {
  const [isOpen, toggle] = useToggle(); // a completely separate isOpen, also starts false
}
// toggling A's isOpen has zero effect on B's isOpen — they don't know about each other
```

If you actually need shared state across components (not just shared logic), a custom hook alone won't do it — you need Context, a module-level store, or an external state library. `useLocalStorage` is a partial exception: because `localStorage` itself is a shared, external resource, two components using `useLocalStorage('theme', 'light')` will both read the same persisted value on mount, but their in-memory `useState` copies still won't automatically stay in sync with each other without extra work (e.g., listening to the `storage` event).

## Sharing logic (custom hook) vs sharing state (Context / external store)

| Aspect | Custom hook (e.g. `useToggle`) | Context or external store |
|---|---|---|
| What's shared between call sites | Only the logic/implementation — each call gets independent state | The actual state value itself, synchronized across all consumers |
| Use when | Multiple components need the same *kind* of behavior, each with its own instance | Multiple components need to read/write the exact same shared value |

Use a custom hook when each component should have its own independent copy of some stateful behavior (e.g., every accordion panel manages its own open/closed state via `useToggle`). Use Context or an external store when components need to observe and mutate one shared piece of state (e.g., the currently logged-in user). The most common mistake is expecting two calls to the same custom hook to be "linked" and being surprised when updating one doesn't affect the other.

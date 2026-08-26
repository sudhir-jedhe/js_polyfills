# What Breaks If useSyncExternalStore's Snapshot Function Returns a New Object Every Call?

```jsx
function useStore() {
  return useSyncExternalStore(
    subscribe,
    () => ({ value: store.getValue() }) // new object every call
  );
}
```

**Answer:** The component re-renders in an infinite loop (or React logs a warning about `getSnapshot` returning a different value on every call and the render becomes unstable).

**Why:** `useSyncExternalStore` compares the snapshot from `getSnapshot` across calls (typically via `Object.is`) to decide whether a re-render is needed; returning a brand-new object literal every call always compares as different, so React thinks the store changed every single time it checks, causing continuous re-renders. The snapshot function must return a stable reference when the underlying value hasn't changed (e.g., return `store.getValue()` directly if it's a primitive, or memoize the object).

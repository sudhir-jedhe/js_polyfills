*** copy 02-conditional-hook-call-crashes.md ***

# Output-Based: Conditional Hook Call Crashes

```jsx
function useFeatureFlag(name, enabled) {
  if (enabled) {
    const [isOn] = useState(true);
    return isOn;
  }
  return false;
}

function Feature({ enabled }) {
  const isOn = useFeatureFlag('newUI', enabled);
  return <p>{isOn ? 'on' : 'off'}</p>;
}
```

`Feature` first renders with `enabled={true}`, then re-renders with `enabled={false}`. What happens?

**Answer:** React throws an error like "Rendered fewer hooks than expected" (or logs a warning about hooks order changing), and the app likely crashes or falls into an inconsistent state for this component.

**Why:** The `useState` call inside `useFeatureFlag` is conditional on `enabled`. On the first render, `useState` is called (1 hook slot used); on the second render, `enabled` is `false`, so the `if` block is skipped and `useState` is never called (0 hook slots used). React expects the exact same number and order of hook calls between renders for a given component instance — violating that corrupts its internal bookkeeping and throws.

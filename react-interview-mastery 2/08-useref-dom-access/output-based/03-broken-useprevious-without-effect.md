# Output-Based: What breaks when `usePrevious` updates the ref during render instead of in an effect?

```jsx
function usePrevious(value) {
  const ref = useRef();
  ref.current = value; // set directly during render, no useEffect
  return ref.current;
}

function Display({ value }) {
  const previous = usePrevious(value);
  return <p>current: {value}, previous: {previous}</p>;
}
```

`Display` is rendered with `value=1`, then re-rendered with `value=2`. What does "previous:" show on the second render?

**Answer:** `2`, not `1` — the bug is that `previous` always equals `current`.

**Why:** Setting `ref.current = value` directly in the render body updates it *before* the return statement reads `ref.current`, so you're immediately overwriting the old value with the new one in the same render pass. The correct `usePrevious` pattern updates the ref inside a `useEffect` (which runs *after* render/commit), so during the current render, `ref.current` still holds the value from the previous render — only after that render commits does the effect update it for next time.

# Output-Based: Is `ref.current` the DOM node or `null` during the very first render?

```jsx
function Input() {
  const ref = useRef(null);
  console.log('render, ref.current =', ref.current);
  return <input ref={ref} />;
}
```

What does the console log on the very first render — is `ref.current` the `<input>` DOM node or `null`?

**Answer:** `null`.

**Why:** During the render phase, React hasn't committed the JSX to the actual DOM yet, so refs to DOM elements haven't been attached. React sets `ref.current` to the real node only after the commit phase, right before effects run. If you `console.log` at the top of the function body (during render), you'll always see the ref's value from *before* this render's DOM was attached — `null` on the first render.

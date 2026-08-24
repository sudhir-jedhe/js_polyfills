# Does the Input Lag While Typing?

```jsx
function Search({ list }) {
  const [text, setText] = useState("");

  function handleChange(e) {
    setText(e.target.value);
    // expensiveFilter is a synchronous, heavy computation over 50k items
    setResults(expensiveFilter(list, e.target.value));
  }
  // ...
}
```

**Answer:** Yes, the input visibly lags on every keystroke.

**Why:** Neither `setText` nor `setResults` is marked non-urgent — both run in the same synchronous update, so React must finish rendering the expensive filtered list before the input's new value is painted. Wrapping the `setResults` call in `startTransition` (or deriving `results` via `useDeferredValue(text)`) would let React prioritize repainting the input immediately.

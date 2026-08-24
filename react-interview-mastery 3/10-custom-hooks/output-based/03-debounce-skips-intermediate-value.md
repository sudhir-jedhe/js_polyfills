# Output-Based: Debounce Skips the Intermediate Value

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 500);
  console.log('render, debouncedText =', debouncedText);
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}
```

The user types "hi" quickly (two keystrokes within 500ms of each other). How many times does "render" log with a *changed* `debouncedText` value (ignoring the initial render)?

**Answer:** Once — not twice. The intermediate value `"h"` is skipped; only the final `"hi"` eventually shows up as `debouncedText`.

**Why:** Each keystroke updates `text`, which re-runs the effect (since `value`/`text` changed), which clears the *previous* pending `setTimeout` (via the cleanup function) and schedules a new one. Since the second keystroke arrives before the first 500ms timer fires, the first timer is cancelled before ever calling `setDebounced("h")`. Only the timer scheduled after the last keystroke ("hi") survives long enough to fire, setting `debouncedText` to `"hi"` directly — the intermediate state is never rendered.

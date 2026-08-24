# Output-Based: Does a conditionally rendered `Timer` resume from where it left off?

```jsx
function Toggle() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>Toggle</button>
      {show ? <Timer /> : null}
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{seconds}</p>;
}
```

The user toggles off then back on. Does the timer resume from where it left off?

**Answer:** No — it resets to `0`.

**Why:** When `show` becomes `false`, `<Timer />` is removed from the tree, which unmounts it and discards its state entirely (the interval is cleared by the cleanup function too). When `show` becomes `true` again, it's a brand-new mount with fresh `useState(0)`. Conditional rendering with `? :` or `&&` fully unmounts components, unlike CSS-based hiding (`display: none`), which would preserve state.

***  06-usestate-argument-ignored-after-mount.md ***

# Does Clicking "Reset" Actually Reset `count` Visually? What's the Surprise?

```jsx
function Timer({ initialCount }) {
  const [count, setCount] = React.useState(initialCount);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(initialCount)}>Reset</button>
    </div>
  );
}

// Rendered as: <Timer initialCount={0} />, never re-rendered with a new initialCount prop
```

**Answer:** "Reset" works fine here (sets `count` back to `0`), but this is a bit of a trap question — many people expect `useState(initialCount)` to re-sync `count` whenever `initialCount` prop changes on a re-render. It does not.

**Why:** `useState`'s argument is only used to seed state on the component's very first mount. If the parent later re-renders `<Timer initialCount={5} />` with a new prop value, `count` will NOT automatically update to `5` — it stays whatever it was, because `useState` ignores its argument after mount. Re-syncing to prop changes requires either a `key` change (to remount) or a manual effect/derived-state pattern.

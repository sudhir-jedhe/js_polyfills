*** copy 01-three-direct-updates-only-increment-once.md ***

# What Does the Button Show After One Click?

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** After one click, the button shows `1`, not `3`.

**Why:** All three `setCount(count + 1)` calls read the same `count` value (0) captured in this render's closure, so each one schedules "set state to 1." React only applies the last-scheduled value for a given batch when using the non-functional form repeatedly like this — the net effect is a single increment, not three.

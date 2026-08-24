# What Logs When the Button Is Clicked?

```jsx
function Example() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(count + 1);
    console.log('count is', count);
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** `count is 0` on the first click (and `count is 1` on the second click, etc.) — always the *pre-update* value.

**Why:** `setCount` schedules a re-render; it doesn't mutate the `count` variable in the current closure synchronously. The `console.log` right after still reads the same `count` that existed when this render's `handleClick` was created, which is the old value.

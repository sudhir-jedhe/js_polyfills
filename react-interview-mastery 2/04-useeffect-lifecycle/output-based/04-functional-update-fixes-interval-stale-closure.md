# How Is This Different From Question 3, and What Does It Log?

```jsx
function Clock() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}
```

**Answer:** The displayed count correctly increments every second: 1, 2, 3, 4...

**Why:** The functional updater form `c => c + 1` doesn't rely on any value captured by the effect's closure — React calls it with the actual latest state value at the time the interval fires, regardless of what `count` was when the effect was created. This sidesteps the stale-closure problem entirely without needing `count` in the dependency array.

*** copy 05-avoiding-stale-closure-with-functional-update.md ***

# Avoiding a Stale Closure With the Functional Update Form Inside `setInterval`

```jsx
function Ticker() {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []); // no stale-closure bug because setSeconds uses the updater form
  return <p>{seconds}s elapsed</p>;
}
```

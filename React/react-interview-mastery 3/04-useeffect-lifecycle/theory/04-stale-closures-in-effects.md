*** copy 04-stale-closures-in-effects.md ***

# Stale Closures Inside Effects

An effect closes over the props/state values from the render in which it was created. If the dependency array doesn't include something the effect uses, the effect keeps referencing the *old* value indefinitely — even after that value has changed in later renders — because React doesn't re-run the effect to "refresh" the closure.

```jsx
// Bug: interval always logs the count from the FIRST render (0), forever
function BuggyCounter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // stale closure — always 0
    }, 1000);
    return () => clearInterval(id);
  }, []); // missing `count` dependency
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Fixed: use functional update so the interval doesn't need `count` as a dependency
function FixedCounter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // reads latest state via the updater, no stale value needed
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{count}</div>;
}
```

## Two general fixes for a stale-closure bug

Given a stale-closure bug where a callback (interval, timeout, event listener) logs or uses an outdated value, there are two general fixes: add the missing value to the dependency array (so the effect — and whatever it creates, like the interval — is recreated with a fresh closure whenever that value changes), or, more idiomatically for accumulator-style updates, avoid needing the value in the closure at all by using the functional updater form (`setCount(c => c + 1)`), which always operates on the true latest state regardless of what the closure captured. A ref-based fix (storing the latest value in a `ref` that the effect reads without listing as a dependency) is another common pattern — see `../problems/03-stale-closure-bug-fix-in-useeffect.md` for a worked example of both approaches side by side.

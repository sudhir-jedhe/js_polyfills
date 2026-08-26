*** copy 03-functional-updates.md ***

# Functional Updates Solve the "Multiple Updates, Same Tick" Problem

Calling `setCount(count + 1)` twice in the same handler only increments once, because both calls read the same stale `count` from the closure:

```jsx
function Bad() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(count + 1); // count is 0 -> schedules "set to 1"
    setCount(count + 1); // count is STILL 0 in this closure -> schedules "set to 1" again
  }
  return <button onClick={handleClick}>{count}</button>; // only +1, not +2
}
```

Pass a function to the setter instead — React guarantees it's called with the latest pending state, letting updates chain correctly:

```jsx
function Good() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // correctly sees the result of the previous update
  }
  return <button onClick={handleClick}>{count}</button>; // +2
}
```

Use functional updates whenever the new state depends on the previous state — it's a safe default, not just a bug fix for edge cases.

## Direct value update vs. functional update

| Aspect | `setCount(count + 1)` | `setCount(prev => prev + 1)` |
|---|---|---|
| Reads from | The value captured in the current render's closure | The latest pending state, guaranteed up to date |
| Safe for multiple calls in one handler | No — repeated calls all use the same stale value | Yes — each call correctly builds on the last |
| Safe inside `setTimeout`/async callbacks | No — closure value can be very stale by the time it runs | Yes — always operates on current state at update time |

Default to the functional form whenever the new state depends on the previous state; use the direct form only when the new value is fully independent of prior state (e.g. `setStatus('submitted')`). The common mistake is calling the setter multiple times per handler using the direct form and expecting each call to "stack."

# What Does the Button Show After One Click, and Why Is It Different From Question 1?

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** After one click, the button shows `3`.

**Why:** The functional updater form receives the *latest pending* state as its argument, not the value captured in the closure. React queues these updater functions and applies them in sequence, so each one correctly builds on the previous one's result within the same batch.

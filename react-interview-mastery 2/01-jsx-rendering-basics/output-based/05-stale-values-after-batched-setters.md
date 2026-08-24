# What Logs, and How Many Times?

```jsx
function App() {
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(0);

  function handleClick() {
    setA(1);
    setB(2);
    console.log('after setters', a, b);
  }

  return <button onClick={handleClick}>{a}-{b}</button>;
}
```

**Answer:** `after setters 0 0` — the old values, not `1 2`. The component then re-renders once, showing `1-2`.

**Why:** `useState` setters don't mutate state synchronously; they schedule an update. Inside the same event handler, `a` and `b` are still the values captured by that render's closure. React batches both `setA` and `setB` into a single re-render that happens after the handler finishes, so reading `a`/`b` right after calling the setters gives stale values.

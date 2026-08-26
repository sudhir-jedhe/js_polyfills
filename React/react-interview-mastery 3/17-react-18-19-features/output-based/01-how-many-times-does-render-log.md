# How Many Times Does This Log "render"?

```jsx
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  console.log("render");

  function handleClick() {
    setTimeout(() => {
      setA(1);
      setB(1);
    }, 0);
  }

  return <button onClick={handleClick}>{a}-{b}</button>;
}
// React 18, createRoot. Click once.
```

**Answer:** `"render"` logs twice total: once for the initial mount, and once more after both `setA` and `setB` are applied together.

**Why:** React 18's automatic batching applies inside `setTimeout` callbacks, not just event handlers, so the two state updates are batched into a single re-render instead of two. This is a direct behavior change from React 17, where the same code would have caused two separate re-renders (three "render" logs total: mount + 2 updates).

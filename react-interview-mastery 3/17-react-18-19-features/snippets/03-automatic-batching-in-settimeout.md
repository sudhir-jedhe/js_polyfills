# Automatic Batching Inside a setTimeout (React 18+)

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState(0);

  function handleClick() {
    setTimeout(() => {
      setCount((c) => c + 1);
      setClicks((c) => c + 1);
      // Both updates batched into a single re-render in React 18+
    }, 0);
  }

  return <button onClick={handleClick}>{count} / {clicks}</button>;
}
```

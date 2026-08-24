# Automatic Batching in React 18 — One Re-render, Not Two, Even in a `setTimeout`

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  const [clicks, setClicks] = React.useState(0);

  function handleClick() {
    setTimeout(() => {
      setCount(c => c + 1);
      setClicks(c => c + 1); // batched with the update above in React 18+
    }, 0);
  }

  return <button onClick={handleClick}>{count} / {clicks}</button>;
}
```

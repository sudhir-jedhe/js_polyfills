***  01-basic-counter-functional-update.md ***

# Basic Counter Using Functional Update

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Count: {count}
    </button>
  );
}
```

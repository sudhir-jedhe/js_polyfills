*** copy 02-two-updates-functional-form.md ***

# Two Rapid Updates in One Handler — Functional Form Applies Both Correctly

```jsx
function DoubleIncrement() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }
  return <button onClick={handleClick}>{count}</button>; // jumps by 2 each click
}
```

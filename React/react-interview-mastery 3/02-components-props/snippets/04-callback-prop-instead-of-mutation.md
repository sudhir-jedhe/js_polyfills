***  04-callback-prop-instead-of-mutation.md ***

# Passing a Callback Prop Instead of Mutating Props Directly

```jsx
function Counter({ count, onIncrement }) {
  return <button onClick={onIncrement}>Count: {count}</button>;
}
function App() {
  const [count, setCount] = React.useState(0);
  return <Counter count={count} onIncrement={() => setCount(c => c + 1)} />;
}
```

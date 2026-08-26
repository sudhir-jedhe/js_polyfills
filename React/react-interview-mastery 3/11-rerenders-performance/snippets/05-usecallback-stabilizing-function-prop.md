# Snippet: useCallback Stabilizing a Function Prop for a Memoized Child

```jsx
const Button = React.memo(function Button({ onClick, children }) {
  console.log('Button rendered');
  return <button onClick={onClick}>{children}</button>;
});
function Parent() {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(c => c + 1), []); // stable identity
  return <Button onClick={increment}>Count: {count}</Button>;
}
```

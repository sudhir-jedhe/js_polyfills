# Output-Based: What Happens When `App` Re-Renders?

```jsx
function withLoading(Wrapped) {
  return function WithLoading(props) {
    console.log('WithLoading render');
    return props.isLoading ? <p>Loading</p> : <Wrapped {...props} />;
  };
}
const Inner = (props) => {
  console.log('Inner render');
  return <p>data</p>;
};
const Enhanced = withLoading(Inner);
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Enhanced isLoading={false} />
    </>
  );
}
```
**Answer:** Both `"WithLoading render"` and `"Inner render"` log on every click.

**Why:** `Enhanced` (the `WithLoading` wrapper) is not memoized, so it re-renders whenever `App` re-renders, and since `isLoading` is `false`, it renders `Inner`, which also re-renders. This illustrates that a HOC adds an extra component in the re-render chain — no different from any other component tree in terms of re-render triggers.

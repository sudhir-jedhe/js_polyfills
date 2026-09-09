***  01-inline-handler-defeats-memo.md ***

# Output-Based: Inline Handler Defeats React.memo

```jsx
const Child = React.memo(function Child({ onClick }) {
  console.log('Child render');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = () => console.log('clicked');

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <Child onClick={handleClick} />
    </>
  );
}
```

Clicking "Increment" 3 times — how many times does "Child render" log?

**Answer:** 4 times total (once on initial mount, then once per increment click).

**Why:** `handleClick` is declared as a plain arrow function inside `Parent`'s body, so it's a brand-new function reference on every render of `Parent`. `React.memo`'s shallow prop comparison sees a "different" `onClick` every time, so it never bails out — `Child` re-renders on every `Parent` render despite being wrapped in `React.memo`. Wrapping `handleClick` in `useCallback(() => console.log('clicked'), [])` would fix this.

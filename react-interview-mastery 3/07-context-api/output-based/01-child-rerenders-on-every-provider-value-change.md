# Output-Based: Does `Child` re-render on every `count` increment, even though it only reads `count`?

```jsx
const CountContext = createContext();

function App() {
  const [count, setCount] = useState(0);
  console.log('App render');
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <Child />
    </CountContext.Provider>
  );
}

function Child() {
  console.log('Child render');
  const { count } = useContext(CountContext);
  return <p>{count}</p>;
}
```

Clicking a button elsewhere calls `setCount(c => c + 1)` once. What logs?

**Answer:** `App render` then `Child render` — every time, on every increment.

**Why:** `setCount` triggers `App` to re-render, which creates a brand-new `{ count, setCount }` object literal for `value`. Even though `Child` only reads `count`, React re-renders every consumer of a context whenever the `value` reference changes (checked via `Object.is`), regardless of which fields the consumer actually uses.

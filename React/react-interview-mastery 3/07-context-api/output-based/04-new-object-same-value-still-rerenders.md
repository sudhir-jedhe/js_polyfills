*** copy 04-new-object-same-value-still-rerenders.md ***

# Output-Based: Does setting state with an equivalent-but-new object re-render an unrelated sibling?

```jsx
function Provider({ children }) {
  const [state, setState] = useState({ count: 0 });
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

function A() {
  const { state } = useContext(MyContext);
  console.log('A', state.count);
  return null;
}

function B() {
  console.log('B');
  return null;
}

function Root() {
  return (
    <Provider>
      <A />
      <B />
    </Provider>
  );
}
```

`A` calls `setState({ count: 0 })` (same value, new object) inside a click handler. Does `B` re-render? Does `A`?

**Answer:** Both `A` and `B` re-render (assuming neither is wrapped in `React.memo`).

**Why:** `setState` was called with a new object reference, so React treats it as a state change and re-renders `Provider`, which creates a new context `value`, which re-renders every consumer (`A`). `B` re-renders too — not because of context, but simply because it's a child of `Provider`, and by default all children of a re-rendered component re-render regardless of context or props, unless wrapped in `React.memo`.

***  06-unchanged-reference-skips-rerender.md ***

# Output-Based: Does a consumer re-render when the context value reference is unchanged?

```jsx
const ListContext = createContext([]);

function List() {
  const items = useContext(ListContext);
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function App() {
  const [items] = useState(['a', 'b']);
  return (
    <ListContext.Provider value={items}>
      <List />
    </ListContext.Provider>
  );
}

// App re-renders for an unrelated reason (e.g. parent state change), items array reference unchanged
```

Does `List` re-render when `App` re-renders but `items` (the array reference) hasn't changed?

**Answer:** No, `List` does not re-render.

**Why:** React's context propagation checks `Object.is(newValue, oldValue)` on the `value` prop passed to the Provider. Since `items` comes from `useState` and wasn't reassigned, it's the same array reference across `App` re-renders, so `value` is unchanged and consumers bail out of re-rendering due to context (though they could still re-render for unrelated reasons like their own state or a non-memoized parent re-render cascading through props — not applicable here since `List` takes no props).

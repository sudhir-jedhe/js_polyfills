# Output-Based: `useContext` with no Provider above

```jsx
const DataContext = createContext(null);

function Consumer() {
  const data = useContext(DataContext);
  return <p>{data ?? 'no provider'}</p>;
}

function App() {
  return <Consumer />; // rendered with no wrapping Provider
}
```

What renders?

**Answer:** `no provider`.

**Why:** With no `DataContext.Provider` above `Consumer` in the tree, `useContext` returns the default value passed to `createContext`, which is `null` here. `null ?? 'no provider'` evaluates to `'no provider'`.

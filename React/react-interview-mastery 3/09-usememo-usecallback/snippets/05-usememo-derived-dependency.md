*** copy 05-usememo-derived-dependency.md ***

# Snippet: useMemo for a Derived Value Used in a Dependency Array Elsewhere

```jsx
function Report({ rows }) {
  const total = useMemo(() => rows.reduce((sum, r) => sum + r.amount, 0), [rows]);

  useEffect(() => {
    document.title = `Total: ${total}`;
  }, [total]); // stable unless rows actually change
  return <p>{total}</p>;
}
```

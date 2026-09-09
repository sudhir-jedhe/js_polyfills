***  06-debounced-search.md ***

# Snippet: Debouncing an input handler via useEffect cleanup

```jsx
function DebouncedSearch({ onSearch }) {
  const [query, setQuery] = React.useState('');
  React.useEffect(() => {
    const id = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(id);
  }, [query, onSearch]);
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

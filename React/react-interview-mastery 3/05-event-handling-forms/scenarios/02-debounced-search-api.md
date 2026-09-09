***  02-debounced-search-api.md ***

# Scenario: Search-as-you-type feature is hammering the backend with a request per keystroke

You're building a product search box that calls a search API on every keystroke, and the backend team reports request volume spiking heavily, with most requests being immediately superseded by the next one before their response even matters.

**Approach:** Debounce the search trigger so the API call only fires after the user pauses typing, using a `useEffect` whose cleanup cancels the pending timeout on every keystroke:

```jsx
function ProductSearch() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      const data = await searchProducts(query);
      setResults(data);
    }, 300);
    return () => clearTimeout(timeoutId); // cancels the pending call on the next keystroke
  }, [query]);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}
```

Each keystroke schedules a new 300ms timeout and cancels the previous one via cleanup, so only a pause in typing actually triggers a network call — cutting request volume dramatically without adding an external debounce library.

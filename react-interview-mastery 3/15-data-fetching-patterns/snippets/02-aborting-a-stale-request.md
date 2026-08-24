# Aborting a Stale Request With AbortController

```jsx
function Search({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setResults)
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      });
    return () => controller.abort();
  }, [query]);

  return <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>;
}
```

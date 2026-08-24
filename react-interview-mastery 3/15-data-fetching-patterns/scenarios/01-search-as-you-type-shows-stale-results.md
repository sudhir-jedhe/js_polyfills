# Search-as-You-Type Shows Stale Results

You're building an autocomplete search box. Users report that when they type quickly, the results sometimes flash to match an earlier, shorter query before settling — e.g., typing "react" briefly shows results for "rea" after showing results for "react".

**Approach:** This is the classic out-of-order response race condition — a longer query happened to resolve before a shorter one. Fix with `AbortController`: abort the previous request whenever a new keystroke fires a new one, so only the latest request's response can ever be applied.

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then(setResults)
        .catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
    }, 250); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r) => <li key={r.id}>{r.label}</li>)}</ul>
    </div>
  );
}
```

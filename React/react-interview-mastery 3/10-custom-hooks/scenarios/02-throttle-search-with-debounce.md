*** copy 02-throttle-search-with-debounce.md ***

# Scenario: A Search Input Fires a Request on Every Keystroke, Overwhelming the Backend

You're building a live search feature. Currently, every keystroke in the search box immediately fires a request via `useFetch(`/api/search?q=${query}`)`, and the backend team is asking you to throttle it — support says search feels "laggy" under load, and the API bill has spiked.

**Approach:** Introduce a `useDebounce` hook between the raw input state and the value that actually drives the fetch, so requests only fire after the user pauses typing:

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, loading } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <Spinner />}
      <ResultsList results={results ?? []} />
    </div>
  );
}
```

The input itself (`query`) stays instantly responsive to typing since it's a separate, undebounced state; only the value driving the network request is delayed. This composes two independently-testable hooks (`useDebounce`, `useFetch`) rather than baking debounce logic directly into the fetch hook, keeping each one focused and reusable elsewhere.

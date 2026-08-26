*** copy 03-real-custom-hook-implementations.md ***

# Real Custom Hook Implementations

**useToggle** — boolean state with a toggle function:

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}
```

**useDebounce** — delays updating a value until it's stopped changing for a given delay:

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancel the pending update if value changes again first
  }, [value, delay]);
  return debounced;
}

// usage: only fires a search request 300ms after the user stops typing
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**useLocalStorage** — state that's synced to `localStorage`, surviving page reloads:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

**useFetch** — a minimal data-fetching hook with loading/error state and request cancellation:

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });

    return () => controller.abort(); // cancel if url changes or component unmounts mid-flight
  }, [url]);

  return state;
}
```

## Composing custom hooks

Custom hooks can call other custom hooks — this is a normal and encouraged pattern for building complex reusable logic from simpler pieces, as long as every hook involved still follows the Rules of Hooks:

```jsx
function useDebouncedFetch(url, delay = 300) {
  const debouncedUrl = useDebounce(url, delay);
  return useFetch(debouncedUrl);
}
```

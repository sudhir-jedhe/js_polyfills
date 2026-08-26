*** copy 01-consolidate-duplicated-fetch-logic.md ***

# Scenario: Five Components Each Reimplement Ad-Hoc Fetch Logic, Inconsistently

You're doing a code review and find five components each with their own copy-pasted `useState` + `useEffect` fetch logic — some missing cleanup on unmount, some missing error handling, one with a race condition when the URL prop changes quickly.

**Approach:** Extract a single `useFetch` custom hook that centralizes the correct, once-vetted logic (loading/error/data state, cancellation on unmount or URL change), and have every component delegate to it instead of reimplementing:

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <p>{user.name}</p>;
}
```

Now a bug fix (e.g., handling non-2xx responses) is made once, in one place, and every consumer benefits automatically — this is the core value proposition of extracting custom hooks: correctness and consistency, not just line-count reduction.

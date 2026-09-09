***  02-implement-usefetch-with-abort-on-unmount.md ***

# Problem 2: Implement `useFetch(url)` With Loading/Error/Data State and Abort-on-Unmount

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        // AbortError fires when we cancel on purpose (unmount or url change) —
        // it's not a real failure, so don't surface it as one.
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });

    // Runs on unmount, AND before the effect reruns for a new url — either
    // way, the in-flight request for the previous url gets cancelled.
    return () => controller.abort();
  }, [url]);

  return state;
}

// usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Failed to load user: {error.message}</p>;
  return <h1>{user.name}</h1>;
}
```

## Why abort-on-unmount matters here

Two scenarios this protects against:

1. **Component unmounts while the request is in flight** (e.g., the user navigates away). Without `controller.abort()` in the cleanup, the fetch would still resolve later and call `setState` on an unmounted component — wasted work, and in React versions/setups that warn about it, a console warning about updating state on an unmounted component.
2. **`url` changes before the previous request resolves** (e.g., `userId` prop changes quickly). The cleanup fires for the *previous* effect before the new one runs, aborting the stale request. Combined with the `AbortError` check in `.catch`, this guarantees a slower, earlier response can never overwrite a faster, later one — a classic fetch race condition.

## Composing with `useDebounce`

`useFetch` composes cleanly with `useDebounce` (see `theory/03-real-custom-hook-implementations.md` and `snippets/05-composing-usedebouncedfetch.md`) to build a debounced search-as-you-type experience without duplicating any fetch logic:

```jsx
function useDebouncedFetch(url, delay = 300) {
  const debouncedUrl = useDebounce(url, delay);
  return useFetch(debouncedUrl);
}
```

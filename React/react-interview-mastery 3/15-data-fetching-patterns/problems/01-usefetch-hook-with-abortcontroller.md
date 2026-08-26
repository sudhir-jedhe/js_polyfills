# Problem: `useFetch(url)` Hook With AbortController Cleanup

**Requirements:**
- Fetch `url` and expose `{ data, loading, error }`.
- Fix the classic race-condition bug: if `url` changes before a slow first request resolves, the slow response must never overwrite the fast second response's result.
- Abort the in-flight request both on unmount and whenever `url` changes.
- Don't treat an intentional abort as an error state.

## The bug being fixed

```jsx
// BROKEN: no cancellation — a slow response for the old url can
// overwrite a fast response for the new url.
function useFetchBroken(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then((r) => r.json()).then(setData);
  }, [url]);
  return data;
}
```

If `url` changes from `/api/users/1` (slow, 500ms) to `/api/users/2` (fast, 50ms), the effect re-runs and fires a second request — but there's nothing stopping the first (now-stale) request's `.then` from calling `setData` after the second one already has, silently showing user 1's data while `url` points at user 2.

## Solution

```jsx
import { useEffect, useState } from 'react';

function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState({ data: null, loading: true, error: null });
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setState({ data, loading: false, error: null });
      } catch (err) {
        // an aborted request is not a real error — it means a newer
        // request superseded this one (url changed) or we unmounted
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err });
        }
      }
    }

    load();

    // runs before the effect re-fires (url changed) AND on unmount —
    // both cases must cancel the in-flight request
    return () => controller.abort();
  }, [url]);

  return state;
}

export default useFetch;
```

## Usage

```jsx
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <Profile user={user} />;
}
```

**Notes:**
- The same `controller` created inside the effect is used for both the fetch call and the cleanup function — this is what ties "this specific request" to "this specific effect run."
- Because the cleanup runs synchronously before the *next* effect run, there is never a moment where two requests for two different `url`s are both un-aborted — only the latest one survives.
- `err.name !== 'AbortError'` is the key line that prevents a cancellation from being displayed as a failure.

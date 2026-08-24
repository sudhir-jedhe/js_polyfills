# Output-Based: A `cancelled` Flag Prevents a Stale-Response Race Condition

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url).then((r) => r.json()).then((json) => {
      if (!cancelled) setData(json);
    });
    return () => { cancelled = true; };
  }, [url]);
  return data;
}

function Profile({ userId }) {
  const data = useFetch(`/api/users/${userId}`);
  return <p>{data ? data.name : 'Loading...'}</p>;
}
```

`Profile` is rendered with `userId={1}`, then quickly re-rendered with `userId={2}` before the first fetch resolves. Does the component ever briefly display user 1's name before showing user 2's?

**Answer:** No — it goes straight from "Loading..." to user 2's name, never flashing user 1's data.

**Why:** Changing `url` (via `userId`) reruns the effect, and before the new fetch starts, React calls the previous effect's cleanup, setting that closure's `cancelled` to `true`. When the first fetch's `.then` eventually resolves, its `if (!cancelled)` check is `true` (cancelled), so `setData` is skipped for the stale request. Only the second effect's fetch (for `userId=2`) is allowed to call `setData`, preventing a stale-response race condition — this is the manual equivalent of what `AbortController` gives you more directly.

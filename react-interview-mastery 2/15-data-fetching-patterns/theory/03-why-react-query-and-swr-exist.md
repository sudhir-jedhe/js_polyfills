# Why React Query / SWR Exist

Hand-rolled fetching re-solves the same problems in every component: caching (don't refetch data you already have), deduplication (two components requesting the same resource in the same render shouldn't fire two network calls), background refetching, and cache invalidation. These libraries implement **stale-while-revalidate**: show cached data immediately, then silently refetch in the background and update the UI if the server disagrees. They also refetch automatically on window focus or network reconnect, which hand-rolled `useEffect` fetching never does unless you build it yourself. You don't need to memorize their APIs for an interview — you need to be able to say *why* they exist: they turn fetching from an imperative, per-component concern into a declarative cache keyed by query params.

## What is stale-while-revalidate?

It's a caching strategy where the UI immediately renders the last known (possibly stale) data from cache while a background request checks for fresher data; if the fresh data differs, the UI updates. This avoids the loading-spinner flash on every navigation back to previously-seen data, trading strict correctness for perceived speed.

## Manual `useEffect` fetching vs React Query/SWR

| Aspect | Manual `useEffect` fetching | React Query / SWR |
|---|---|---|
| Caching | None by default — every mount refetches | Built-in cache keyed by query key/URL |
| Deduplication | Duplicate requests across components | Automatic dedup of identical in-flight requests |
| Refetch triggers | Only what you code (param change) | Window focus, reconnect, interval, manual invalidation |
| Boilerplate | Loading/error/data state written per component | Handled by the hook (`isLoading`, `isError`, `data`) |
| Common mistake | Re-implementing caching badly (e.g., a module-level object) instead of just adopting a library | Reaching for a library before understanding what problem it solves, making debugging cache issues harder |

Use manual fetching for a one-off request with no sharing/reuse needs; reach for React Query/SWR once you have more than a couple of components fetching overlapping data or need background refresh behavior.

## The duplicate-request problem in practice

```jsx
function App() {
  return (
    <>
      <UserCard id={1} />
      <UserCard id={1} />
    </>
  );
}

function UserCard({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${id}`).then((r) => r.json()).then(setUser);
  }, [id]);
  return <p>{user?.name}</p>;
}
```

Each `UserCard` instance has its own effect and no shared cache, so plain `useEffect` fetching duplicates identical requests across sibling components — two separate requests fire for the same `/api/users/1`. This duplication is exactly what request deduplication in libraries like React Query solves; a hand-rolled fetch has no concept of "someone already asked for this."

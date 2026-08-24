# The Classic `useEffect` + `fetch` Pattern

Fetching in a function component almost always starts as `useEffect` that fires a request and stores the result in state:

```jsx
function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <Profile user={data} />;
}
```

This works, but it has two well-known bugs, covered in depth in the next theory file:

1. **Race conditions** — responses can resolve out of order when a dependency (like `userId`) changes quickly.
2. **Missing cleanup** — setting state after the component has unmounted (or after the effect has re-run for a new value) is wasted work and can mask stale-closure bugs.

## Why fetching belongs in `useEffect`, not the render body

Fetching during render runs on every render, including re-renders caused by unrelated state changes, and can trigger infinite loops if the fetch eventually causes a state update, which triggers another render, which fetches again. `useEffect` scopes the fetch to specific dependency changes (mount, or when specified values change), giving you control over when it actually fires. Data fetching is a side effect, and side effects belong in `useEffect` (or an event handler for user-triggered actions), not in the render function, which should stay pure.

## A subtle dependency-array trap

```jsx
function Orders({ userId }) {
  const options = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetch(`/api/orders?user=${userId}`, options).then((r) => r.json()).then(setOrders);
  }, [userId, options]);
  // ...
}
```

`options` is a new object literal created on every render, so it's referentially different each time even if its contents are identical, making `[userId, options]` effectively change every render and defeating the dependency array's purpose — the effect refetches on every render, not just when `userId` changes. Fix by moving `options` inside the effect or memoizing it with `useMemo`.

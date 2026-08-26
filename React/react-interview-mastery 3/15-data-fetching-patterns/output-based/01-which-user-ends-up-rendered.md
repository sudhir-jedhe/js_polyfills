# Which User Ends Up Rendered?

```jsx
function Profile({ id }) {
  const [name, setName] = useState("");

  useEffect(() => {
    fetchUser(id).then((u) => setName(u.name));
  }, [id]);

  return <p>{name}</p>;
}

// Simulated network: user 1 takes 500ms, user 2 takes 50ms.
// Parent rapidly changes id from 1 -> 2 within 10ms.
```

**Answer:** The name for user 1 is rendered, even though `id` is now 2.

**Why:** Both requests fire (effect reruns on each `id` change), but user 2's request resolves first (50ms) and sets state, then user 1's request resolves later (500ms) and overwrites it. Without a cancellation/ignore mechanism, the last *response to arrive* wins, not the last *request sent*.

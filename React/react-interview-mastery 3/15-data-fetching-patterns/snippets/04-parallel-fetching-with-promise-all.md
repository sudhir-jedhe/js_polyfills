# Parallel Fetching With Promise.all

```jsx
function Dashboard({ userId }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch(`/api/users/${userId}/stats`).then((r) => r.json()),
    ]).then(([user, stats]) => setState({ user, stats }));
  }, [userId]);

  if (!state) return <p>Loading...</p>;
  return <p>{state.user.name}: {state.stats.total} posts</p>;
}
```

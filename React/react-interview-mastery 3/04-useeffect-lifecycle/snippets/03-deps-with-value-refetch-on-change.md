***  03-deps-with-value-refetch-on-change.md ***

# Dependency Array With a Value — Re-Runs Only When That Value Changes

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data);
    });
    return () => { cancelled = true; }; // avoid setting state after unmount/stale request
  }, [userId]);
  return <div>{user?.name ?? 'Loading...'}</div>;
}
```

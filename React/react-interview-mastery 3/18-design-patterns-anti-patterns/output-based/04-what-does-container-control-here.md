# What Does the "Container" Component Actually Control Here, and Is It Necessary?

```jsx
function UserListContainer() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  return <UserListView users={users} />;
}

function UserListView({ users }) {
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Answer:** It renders the same UI as if the fetching logic were just inlined into a single component using a custom hook — nothing about this specific split changes behavior or output.

**Why:** This is a valid container/presentational split, but with hooks available, the same separation of concerns is usually achieved with `const users = useUsers()` inside one component, without a forced two-component hierarchy. It's not wrong, just no longer the default idiom — worth recognizing as "correct but dated" rather than broken.

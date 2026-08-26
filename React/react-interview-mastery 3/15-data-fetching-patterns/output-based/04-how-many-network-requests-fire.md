# How Many Network Requests Fire?

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

**Answer:** 2 separate requests for the same `/api/users/1`.

**Why:** Each `UserCard` instance has its own effect and no shared cache, so plain `useEffect` fetching duplicates identical requests across sibling components. This duplication is exactly what request deduplication in libraries like React Query solves — a hand-rolled fetch has no concept of "someone already asked for this."

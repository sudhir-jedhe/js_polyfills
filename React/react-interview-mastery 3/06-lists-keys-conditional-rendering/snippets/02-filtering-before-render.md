***  02-filtering-before-render.md ***

# Snippet: Filtering a list before rendering

```jsx
// Keys stay attached to the right items after filtering
function ActiveUsers({ users }) {
  return (
    <ul>
      {users
        .filter((u) => u.isActive)
        .map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
    </ul>
  );
}
```

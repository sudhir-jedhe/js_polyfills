*** copy 06-early-return-for-empty-state.md ***

# Early Return Keeps the Main Render Path Flat and Readable

```jsx
function Profile({ user }) {
  if (!user) return <p>No user loaded.</p>;
  return <h2>{user.name}</h2>;
}
```

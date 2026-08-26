*** copy 07-conditional-consumption-not-recreation.md ***

# Snippet: Consuming context conditionally based on a prop, not re-creating the context itself

```jsx
function Avatar({ useCurrentUser }) {
  const { user } = useAuth();
  const displayUser = useCurrentUser ? user : null;
  return <img src={displayUser?.avatarUrl ?? '/default-avatar.png'} alt="avatar" />;
}
```

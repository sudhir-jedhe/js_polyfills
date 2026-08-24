# Optimistic Updates

Instead of waiting for the server to confirm a mutation, update local state immediately as if it succeeded, then roll back if the request fails. This makes UIs feel instant for actions like liking a post or checking off a todo. The tradeoff is complexity: you need a rollback path, and you must reconcile with the eventual server response.

```jsx
function LikeButton({ postId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);

  async function toggleLike() {
    const previous = liked;
    setLiked(!liked); // optimistic
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch {
      setLiked(previous); // rollback
    }
  }

  return <button onClick={toggleLike}>{liked ? "Liked" : "Like"}</button>;
}
```

## Pessimistic vs optimistic updates

| Aspect | Pessimistic (wait for server) | Optimistic (update UI immediately) |
|---|---|---|
| Perceived speed | Slower, UI waits for round trip | Instant |
| Complexity | Simple: render server response | Needs rollback logic and reconciliation |
| Risk | UI is always consistent with server | UI can briefly show a state the server rejects |
| Common mistake | Making every interaction feel laggy for low-risk actions (likes, toggles) | Applying it to high-stakes mutations (payments) where a silent rollback is confusing to the user |

Use optimistic updates for low-risk, easily-reversible actions; keep pessimistic updates for anything where a rollback would be jarring or costly.

## What can go wrong without a snapshot

The risk of an optimistic update is that the mutation can fail, requiring a rollback to the previous state (and ideally a user-visible indication that it failed) — so you need to keep a snapshot of the prior state and handle the error path deliberately, not just assume success. Always capture `previous` (or an equivalent snapshot) *before* applying the optimistic change, so the rollback path has something exact to restore.

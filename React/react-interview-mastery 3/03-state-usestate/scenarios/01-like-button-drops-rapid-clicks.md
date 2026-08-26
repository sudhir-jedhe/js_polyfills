*** copy 01-like-button-drops-rapid-clicks.md ***

# "Like" Button Sometimes Only Registers One Click Out of Several Rapid Clicks

**Scenario:** You're building a "like" button that increments a counter, and users on slower devices report that rapidly double/triple-tapping sometimes only adds 1 instead of 2 or 3 to the count.

**Approach:** This is almost certainly the stale-closure batching issue — the handler likely uses `setLikes(likes + 1)`, and if multiple clicks get batched together (or if the handler is somehow called multiple times referencing the same render's `likes`), each call schedules the same "set to old+1" update. Switch to the functional updater form so each increment is guaranteed to build on the true latest value:

```jsx
function LikeButton() {
  const [likes, setLikes] = React.useState(0);
  function handleLike() {
    setLikes(prev => prev + 1); // always correct regardless of batching/timing
  }
  return <button onClick={handleLike}>❤️ {likes}</button>;
}
```

This is also the safer default any time an increment/toggle could conceivably fire more than once before a re-render completes (double-click, key repeat, async handlers).

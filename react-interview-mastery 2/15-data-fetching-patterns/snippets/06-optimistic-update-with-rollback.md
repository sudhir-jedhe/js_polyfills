# Optimistic Update With Rollback on Failure

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

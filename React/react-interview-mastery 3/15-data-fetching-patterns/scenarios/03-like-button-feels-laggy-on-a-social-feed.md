# "Like" Button Feels Laggy on a Social Feed

Product wants likes to feel instant when tapped, even on a slow connection, but also wants to gracefully handle the rare case where the like fails server-side (e.g., the post was deleted).

**Approach:** Use an optimistic update: flip the UI state immediately, fire the mutation in the background, and roll back with a toast if it fails. Keep a snapshot of prior state so rollback is exact.

```jsx
function LikeButton({ post }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [count, setCount] = useState(post.likeCount);

  async function handleClick() {
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(count + (liked ? -1 : 1));

    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: liked ? "DELETE" : "POST",
      });
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
      showToast("Couldn't update like, please try again.");
    }
  }

  return (
    <button onClick={handleClick}>
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}
```

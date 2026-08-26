# Problem: Optimistic UI Update for a "Like" Button

**Requirements:**
- Clicking "like" updates the UI (icon + count) immediately, without waiting for the server.
- If the server request fails, roll back to the exact prior state and surface the failure to the user.
- Prevent double-submission while a request for the same toggle is already in flight.

## Solution

```jsx
import { useState } from 'react';

function LikeButton({ post }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [count, setCount] = useState(post.likeCount);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleClick() {
    if (pending) return; // avoid double-submitting mid-flight

    // snapshot BEFORE mutating, so rollback is exact
    const prevLiked = liked;
    const prevCount = count;
    const nextLiked = !liked;

    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    setErrorMessage(null);
    setPending(true);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: nextLiked ? 'POST' : 'DELETE',
      });
      if (!res.ok) throw new Error('Server rejected the like');
    } catch (err) {
      // roll back to the exact snapshot, not just "toggle again" —
      // toggling again could compound with a concurrent state change
      setLiked(prevLiked);
      setCount(prevCount);
      setErrorMessage("Couldn't update like. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={pending} aria-pressed={liked}>
        {liked ? '♥' : '♡'} {count}
      </button>
      {errorMessage && <p role="alert" className="error-text">{errorMessage}</p>}
    </div>
  );
}

export default LikeButton;
```

**Notes:**
- The snapshot (`prevLiked`, `prevCount`) is captured *before* the optimistic mutation, so rollback restores the exact pre-click values rather than re-deriving them (which could be wrong if other state changed in between).
- `pending` guards against a user rapid-clicking the button before the first request resolves, which would otherwise double-toggle both the UI and the server-side state.
- This pattern suits low-risk, easily-reversible actions like likes; for high-stakes mutations (e.g., payments) prefer a pessimistic (wait-for-server) approach where a silent rollback would be more confusing than a brief wait.

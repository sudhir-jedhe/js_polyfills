*** copy How do you handle chained actions (like deleting or liking) on an optimistic item that hasn't finished saving yet in React 19?.md ***

Handling chained actions (such as liking, updating, or deleting an item that is still in flight) requires coordinating client-generated IDs with asynchronous action queues.

Because the temporary item has no database ID yet, you cannot send a traditional `DELETE /api/items/123`. Instead, you use a **Client UUID as the Canonical Key** combined with an **Action Pipeline / Correlation ID** pattern.

---

### The 3 Core Architectural Approaches

```
Scenario A: Pure Client Cancellation (Fastest for Deletes)
[ Create Item (temp-1) in flight ] ──► User Clicks Delete ──► Cancel create request via AbortController ──► Remove from UI

Scenario B: Client-Side UUID as Database Primary Key (Cleanest Full-Stack)
[ Client Generates UUID (e.g. 550e8400...) ] ──► Backend uses client UUID as the true DB `id` ──► Delete/Like sends the exact same UUID

Scenario C: Pending Promise / Temporary ID Correlation
[ Create Item (temp-1) ] ──► User clicks Like ──► Like Action sends `parentTempId: "temp-1"` ──► Backend / Queue links them

```

---

### Implementation Pattern: Client-Generated Canonical IDs

The most resilient pattern in modern full-stack architectures is generating a `UUID v4` on the client. The client uses this UUID immediately for all chained actions, and the backend accepts it as the record's primary identifier.

#### 1. Multi-Action Reducer for `useOptimistic`

Use a discriminated union of action types inside `useOptimistic` so a single list handles creates, likes, and deletes concurrently:

```jsx
import { useActionState, useOptimistic, startTransition } from 'react';

// Combined optimistic reducer handling chained mutations
function postsReducer(currentPosts, action) {
  switch (action.type) {
    case 'CREATE':
      return [...currentPosts, { ...action.payload, isPending: true }];

    case 'TOGGLE_LIKE':
      return currentPosts.map((post) => {
        if (post.id === action.id) {
          return {
            ...post,
            liked: !post.liked,
            likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
          };
        }
        return post;
      });

    case 'DELETE':
      return currentPosts.filter((post) => post.id !== action.id);

    default:
      return currentPosts;
  }
}

```

---

#### 2. Component Handling Chained Mutations

```jsx
// Base Server Action
async function mutatePostsAction(prevPosts, actionPayload) {
  const { type, id, data } = actionPayload;

  if (type === 'CREATE') {
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ id, ...data }), // Send client UUID to server
      headers: { 'Content-Type': 'application/json' },
    });
    const saved = await res.json();
    return [...prevPosts, saved];
  }

  if (type === 'TOGGLE_LIKE') {
    await fetch(`/api/posts/${id}/like`, { method: 'POST' });
    return prevPosts.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 } : p
    );
  }

  if (type === 'DELETE') {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    return prevPosts.filter((p) => p.id !== id);
  }

  return prevPosts;
}

export function PostFeed({ initialPosts = [] }) {
  // 1. Base state
  const [posts, formAction] = useActionState(mutatePostsAction, initialPosts);

  // 2. Optimistic state powered by reducer
  const [optimisticPosts, setOptimistic] = useOptimistic(posts, postsReducer);

  // A. Create Post (Generates permanent UUID immediately)
  const handleCreatePost = (text) => {
    const newId = crypto.randomUUID(); // Canonical identifier across all chained ops

    const newPost = { id: newId, text, likesCount: 0, liked: false };

    startTransition(async () => {
      setOptimistic({ type: 'CREATE', payload: newPost });
      await formAction({ type: 'CREATE', id: newId, data: { text } });
    });
  };

  // B. Chained Like (Can be clicked instantly, even while creation is in-flight)
  const handleLike = (id) => {
    startTransition(async () => {
      setOptimistic({ type: 'TOGGLE_LIKE', id });
      await formAction({ type: 'TOGGLE_LIKE', id });
    });
  };

  // C. Chained Delete (Can delete immediately while creation is in-flight)
  const handleDelete = (id) => {
    startTransition(async () => {
      setOptimistic({ type: 'DELETE', id });
      await formAction({ type: 'DELETE', id });
    });
  };

  return (
    <div>
      <button onClick={() => handleCreatePost('My rapid post!')}>Post</button>

      <ul>
        {optimisticPosts.map((post) => (
          <li key={post.id} style={{ opacity: post.isPending ? 0.6 : 1 }}>
            <span>{post.text}</span>
            <button onClick={() => handleLike(post.id)}>
              {post.liked ? '❤️' : '🤍'} ({post.likesCount})
            </button>
            <button onClick={() => handleDelete(post.id)}>🗑️ Delete</button>
            {post.isPending && <small> (Publishing...)</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Handling Race Conditions on the Server

When chained actions are triggered rapidly:

1. **Delete Before Create Lands:** If the `DELETE` request arrives at the server before the initial `POST` request finishes writing to the DB:

* **Solution (Upsert / Soft Cancel):** The backend treats `DELETE /api/posts/:id` for an unknown UUID as an idempotent `200 OK` or marks the record as `is_deleted = true` in an idempotency cache. When the delayed `POST` finally arrives, the server checks the tombstone record and drops the write.

1. **Like Before Create Finishes:** If a `LIKE` request arrives before `CREATE`:

* The client UUID ensures both operations target the exact same primary key in the database without needing foreign key translation.

---

### Summary Checklist

| Problem                            | Solution                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| **Unknown Database ID**            | Generate a `crypto.randomUUID()` on the client and send it as the primary key.             |
| **Multiple Mutation Types**        | Pass an Action Reducer (`switch (action.type)`) as the second argument to `useOptimistic`. |
| **Instant Delete while In-Flight** | Optimistically remove from list immediately; backend handles idempotent removal.           |
| **Out-of-Order Requests**          | Use idempotent server endpoints keyed by the client's UUID.                                |

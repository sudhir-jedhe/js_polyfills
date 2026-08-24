When a user triggers multiple rapid submissions in a row (e.g., rapidly sending several chat messages or toggling multiple todo items), React 19 handles `useOptimistic` updates by maintaining an internal **queue of pending optimistic actions** applied sequentially on top of the latest confirmed **base state**.

---

### The Underlying Mechanism: The Optimistic Queue

Instead of treating each optimistic update in isolation, React acts as a reducer accumulator across all currently in-flight Transitions/Actions:

$$\text{Rendered Optimistic State} = \text{Base State} + \sum (\text{Active Pending Optimistic Updates})$$

```
[ Base State: Messages [1] ]
       │
       ├─► User submits "Hi" ──► Queue: [+"Hi"] ────────────► Renders: [1, "Hi"]
       │
       ├─► User submits "How are you?" ──► Queue: [+"Hi", +"How are you?"] ──► Renders: [1, "Hi", "How are you?"]
       │
       ├─► Server confirms "Hi" (ID: 2)
       │         │
       │         └─► Base State updates: [1, 2]
       │             Queue drops "Hi", keeps [+"How are you?"]
       │             Renders: [1, 2, "How are you?"]  <── Instant seamless re-render!
       │
       └─► Server confirms "How are you?" (ID: 3)
                 │
                 └─► Base State updates: [1, 2, 3]
                     Queue is now empty []
                     Renders: [1, 2, 3]

```

---

### Step-by-Step Concurrent Resolution

#### 1. In-Flight Stacking (FIFO Execution)

Every time `setOptimistic(payload)` is invoked inside an active Action/Transition, React appends that payload to its internal queue of active optimistic layers. React then replays the `updateFn` across each item in the queue against the current `baseState`.

#### 2. Out-of-Order Network Resolution

If action #1 takes 2000 ms to respond, but action #2 responds in 300 ms:

* When action #2 resolves, the base state updates to include item #2.
* React immediately re-computes the optimistic view: `Base State (with item #2) + Pending Queue (still containing item #1)`.
* The UI stays consistent without duplicate items or visual glitches, regardless of which network request finishes first.

#### 3. Partial Failure & Rollback

If action #1 fails and rejects, but action #2 succeeds:

* Action #1's optimistic payload is evicted from the active queue.
* Action #2's confirmed data is merged into the base state.
* The UI automatically drops item #1 on the next frame while preserving item #2.

---

### Complete Pattern for Rapid Submissions

To ensure rapid concurrent submissions work smoothly without race conditions, use an ID generator (like `crypto.randomUUID()`) to key temporary items and merge updates immutably:

```jsx
import { useActionState, useOptimistic, useRef } from 'react';

async function sendCommentAction(previousComments, formData) {
  const text = formData.get('comment');
  const tempId = formData.get('tempId');

  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tempId }),
  });

  if (!res.ok) throw new Error('Comment failed');

  const serverComment = await res.json();
  // Base state appends confirmed server object
  return [...previousComments, serverComment];
}

export function CommentThread({ initialComments = [] }) {
  const formRef = useRef(null);

  // 1. Base state
  const [comments, formAction] = useActionState(sendCommentAction, initialComments);

  // 2. Optimistic state with pure accumulator function
  const [optimisticComments, setOptimisticComment] = useOptimistic(
    comments,
    (currentList, newOptimisticItem) => [...currentList, newOptimisticItem]
  );

  const handleSubmit = async (formData) => {
    const text = formData.get('comment');
    if (!text || !text.trim()) return;

    // Generate unique temp ID for this specific in-flight item
    const tempId = crypto.randomUUID();
    formData.append('tempId', tempId);

    // Reset input immediately so user can type the NEXT message right away
    formRef.current?.reset();

    // Enqueue optimistic item
    setOptimisticComment({
      id: tempId,
      text,
      pending: true,
    });

    // Run action (multiple can run concurrently)
    await formAction(formData);
  };

  return (
    <div className="comment-feed">
      <ul className="comment-list">
        {optimisticComments.map((comment) => (
          <li
            key={comment.id}
            style={{ opacity: comment.pending ? 0.6 : 1 }}
          >
            {comment.text}
            {comment.pending && <small> (Sending...)</small>}
          </li>
        ))}
      </ul>

      <form ref={formRef} action={handleSubmit} className="input-bar">
        <input name="comment" placeholder="Write a comment..." required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

```

---

### Crucial Rules for Concurrent Optimistic Updates

* **Stable Unique Keys:** Never use array indices (`index`) as keys for optimistic lists. Use temporary client IDs (`crypto.randomUUID()` or timestamp prefixes) so React can track which specific items are transitioning.
* **Keep `updateFn` Pure:** The reducer function passed to `useOptimistic` is executed multiple times per frame whenever any in-flight action resolves or rejects. It must never perform side effects or mutate the incoming array directly.
* **Input Reset Timing:** Always call `formRef.current.reset()` **before** awaiting `formAction(formData)`. This frees the input field instantly for the next submission rather than locking it during the network round-trip.

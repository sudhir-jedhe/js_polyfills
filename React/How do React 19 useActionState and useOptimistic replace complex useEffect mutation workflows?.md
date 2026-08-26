In traditional React, handling async mutations (like form submissions, liking a post, or updating records) often devolved into a tangle of `useState`, `useEffect`, manual loading flags, and error state tracking.

React 19 replaces this with **Actions**, centered around two hooks:

* **`useActionState`**: Manages the lifecycle of an async mutation (pending state, returned state/data, error handling, and progressive enhancement).
* **`useOptimistic`**: Displays speculative UI updates instantly while the async Action is in flight, automatically rolling back if the action fails.

---

### The Problem: Legacy `useEffect` + State Mutation Workflow

A classic mutation with optimistic UI and error rollbacks previously required extensive manual plumbing:

```tsx
// ❌ Legacy Pattern: 5+ state variables, useEffect synchronizers, manual rollback
function LikeButtonLegacy({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [previousLikes, setPreviousLikes] = useState(initialLikes);

  // Sync state if initial prop changes
  useEffect(() => {
    setLikes(initialLikes);
    setPreviousLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    setIsPending(true);
    setError(null);
    setPreviousLikes(likes);
    setLikes((prev) => prev + 1); // 1. Manual optimistic update

    try {
      await api.likePost(postId); // 2. Async API mutation
    } catch (err) {
      setLikes(previousLikes);    // 3. Manual rollback on error
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <button onClick={handleLike} disabled={isPending}>
        Likes: {likes}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

```

---

### The React 19 Solution: `useActionState` + `useOptimistic`

With React 19, mutations are written as async Actions. React automatically manages pending transitions, optimistic branches, and rollbacks.

```tsx
'use client';

import { useActionState, useOptimistic } from 'react';
import { updateTitleAction } from './actions';

interface State {
  title: string;
  error?: string | null;
}

export function TitleEditor({ initialTitle }: { initialTitle: string }) {
  // 1. Manage server mutation state with useActionState
  const [state, formAction, isPending] = useActionState(
    async (prevState: State, formData: FormData): Promise<State> => {
      const newTitle = formData.get('title') as string;

      // Trigger optimistic preview immediately
      setOptimisticTitle(newTitle);

      try {
        const savedTitle = await updateTitleAction(newTitle);
        return { title: savedTitle, error: null };
      } catch (err: any) {
        // If it throws or fails, returning or throwing automatically
        // reverts useOptimistic back to `state.title`
        return { title: prevState.title, error: err.message };
      }
    },
    { title: initialTitle, error: null }
  );

  // 2. Derive instantaneous optimistic state
  const [optimisticTitle, setOptimisticTitle] = useOptimistic(
    state.title,
    (_current, update: string) => update
  );

  return (
    <div className="space-y-3">
      <h2>
        Current: {optimisticTitle}{' '}
        {isPending && <span className="text-xs text-gray-400">(Saving...)</span>}
      </h2>

      {/* HTML Forms natively bind to the Action */}
      <form action={formAction} className="flex gap-2">
        <input
          name="title"
          defaultValue={optimisticTitle}
          placeholder="New title..."
          disabled={isPending}
          className="border p-1 rounded"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {isPending ? 'Updating...' : 'Save'}
        </button>
      </form>

      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </div>
  );
}

```

---

### How the Hooks Work Internally

#### 1. `useActionState`

* **Signature:** `const [state, formAction, isPending] = useActionState(actionFn, initialState, permalink?)`
* **Automatic Transition Wrapping:** When `formAction` runs, React wraps the execution in a concurrent transition (`startTransition`).
* **Built-in Pending State:** `isPending` is a true boolean reflecting whether the async action is currently resolving.
* **Form & Non-Form Invocation:** Can be passed directly to `<form action={formAction}>` (with progressive enhancement support) or called imperatively (`formAction(payload)`).

#### 2. `useOptimistic`

* **Signature:** `const [optimisticState, setOptimisticState] = useOptimistic(passthroughState, updateFn)`
* **In-Flight Branching:** When `setOptimisticState` is called within a transition, React renders the temporary optimistic UI immediately.
* **Automatic Rollback on Rejection:** As soon as the Action finishes (whether it returns new state or throws an error), React drops the temporary branch and re-renders using the real committed state from `useActionState`. No manual cleanup or `previousState` ref bookkeeping is required.

---

### Comparison: Legacy Mutation vs. React 19 Actions

| Workflow Aspect            | Legacy `useEffect` / `useState`                  | React 19 `useActionState` + `useOptimistic`       |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| **Loading Indicator**      | Manual `setIsLoading(true / false)`              | **Automatic `isPending` flag**                    |
| **Optimistic Preview**     | Manual state updates + `previousState` refs      | **`useOptimistic` handles branching & rollback**  |
| **Error Recovery**         | Manual `catch` blocks resetting state values     | **Automatic rollback** to last committed state    |
| **Concurrent Integration** | Uncoordinated; blocks UI or causes layout shifts | **Integrated into React concurrent transitions**  |
| **Form Handling**          | `onSubmit={e => { e.preventDefault(); ... }}`    | **Native `<form action={...}>` support**          |
| **Prop Synchronization**   | Requires sync `useEffect` or key resets          | **State automatically syncs from Action results** |

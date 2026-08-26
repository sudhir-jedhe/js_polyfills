Combining **`useActionState`** (for authoritative server validation, error states, and DB mutations) with **`useOptimistic`** (for immediate user feedback) requires a clean separation between **optimistic transient state** and **committed server state**.

When an error occurs on the server, React automatically rolls back `useOptimistic` to the last committed state, allowing `useActionState` to cleanly render validation messages without leaving orphaned optimistic items in your UI.

---

### Step-by-Step Implementation: Live Comment Feed with Validation

#### 1. Define Server Types and the Server Action

Validate incoming `FormData` using a schema parser (like Zod). Return structured error objects for validation failures:

```typescript
// app/actions/comments.ts
'use server';

import { z } from 'zod';

export interface Comment {
  id: string;
  text: string;
  sending?: boolean; // Tag for optimistic rendering
}

export interface CommentActionState {
  comments: Comment[];
  error?: string | null;
  fieldErrors?: { text?: string[] };
}

const CommentSchema = z.object({
  text: z.string().trim().min(3, 'Comment must be at least 3 characters long'),
});

export async function addCommentAction(
  prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const text = formData.get('comment') as string;

  // 1. Server validation
  const validation = CommentSchema.safeParse({ text });
  if (!validation.success) {
    return {
      comments: prevState.comments, // Preserve existing list
      error: 'Please fix the errors below.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 2. Perform DB mutation (simulate potential failure or delay)
  try {
    const saved = await db.comment.create({ data: { text: validation.data.text } });

    return {
      comments: [...prevState.comments, saved],
      error: null,
      fieldErrors: undefined,
    };
  } catch (err: any) {
    return {
      comments: prevState.comments,
      error: err.message || 'Failed to save comment.',
    };
  }
}

```

---

#### 2. The Client Component (`useActionState` + `useOptimistic`)

```tsx
// app/components/CommentSection.tsx
'use client';

import { useActionState, useOptimistic, useRef } from 'react';
import { addCommentAction, type Comment, type CommentActionState } from '@/app/actions/comments';

export function CommentSection({ initialComments }: { initialComments: Comment[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  // 1. Server state and validation manager
  const [state, formAction, isPending] = useActionState(
    async (prevState: CommentActionState, formData: FormData): Promise<CommentActionState> => {
      const text = formData.get('comment') as string;

      // A. Trigger optimistic preview immediately
      setOptimisticComments({
        id: `temp-${Date.now()}`,
        text,
        sending: true,
      });

      // B. Run Server Action
      const result = await addCommentAction(prevState, formData);

      // C. Reset form input only on successful submission
      if (!result.error && !result.fieldErrors) {
        formRef.current?.reset();
      }

      return result;
    },
    { comments: initialComments, error: null }
  );

  // 2. Optimistic state derived from the committed state (state.comments)
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    state.comments,
    (currentList: Comment[], newComment: Comment) => [...currentList, newComment]
  );

  return (
    <div className="space-y-6 max-w-lg">
      {/* 3. Render Optimistic List */}
      <ul className="space-y-2">
        {optimisticComments.map((comment) => (
          <li
            key={comment.id}
            className={`p-3 rounded border ${
              comment.sending
                ? 'opacity-60 bg-gray-50 border-dashed border-gray-300'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <p className="text-gray-900">{comment.text}</p>
            {comment.sending && (
              <span className="text-xs text-blue-500 font-medium">Posting...</span>
            )}
          </li>
        ))}
      </ul>

      {/* 4. Form with Server Validation Errors */}
      <form ref={formRef} action={formAction} className="space-y-3">
        {state.error && (
          <div className="p-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded">
            {state.error}
          </div>
        )}

        <div>
          <textarea
            name="comment"
            placeholder="Write a comment..."
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!state.fieldErrors?.text}
            aria-describedby="comment-error"
          />
          {state.fieldErrors?.text && (
            <p id="comment-error" className="text-xs text-red-500 mt-1">
              {state.fieldErrors.text[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}

```

---

### How the Rollback Lifecycle Works

```
[1. User Clicks Submit]
       │
       ├── `setOptimisticComments()` appends temporary item (`sending: true`)
       │     └── UI renders new item instantly (0ms)
       │
       ▼
[2. Server Action Runs Validation/DB]
       │
       ├── CASE A: SUCCESS
       │     ├── Action returns `{ comments: [...items, realItem], error: null }`
       │     ├── `useOptimistic` automatically syncs with new `state.comments`
       │     └── Form resets; temporary item is cleanly replaced by real item
       │
       └── CASE B: VALIDATION / SERVER ERROR
             ├── Action returns `{ comments: prevComments, fieldErrors: { text: [...] } }`
             ├── React drops the optimistic branch and reverts to `state.comments`
             ├── Temporary comment vanishes from UI
             └── `state.fieldErrors` renders the inline validation message

```

---

### Key Best Practices

* **Always Derive `useOptimistic` from `state.data`:** Pass `state.comments` as the base argument to `useOptimistic(...)`. This guarantees that when `useActionState` finishes, the optimistic layer syncs with the latest authoritative state.
* **Tag Optimistic Entries with Metadata:** Add flags like `sending: true` to optimistic items to dim their opacity, disable delete/edit actions on them, or show inline spinners.
* **Conditional Form Resetting:** Only call `formRef.current?.reset()` if the action returned without errors. If validation fails, preserving the input text lets the user fix their typo without retyping the whole message.

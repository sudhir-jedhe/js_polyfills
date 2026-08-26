When an optimistic update fails and rolls back, clearing the inputs prematurely (`form.reset()`) creates a frustrating user experience: the temporary UI item disappears, the error banner appears, and the user's typed text is lost.

To restore failed values cleanly:

1. **Preserve Submitted Values in State:** Return the uncommitted `submittedValues` from the Server Action when an error occurs.
2. **Controlled State / `key` Reset Pattern:** Bind input values or `defaultValue`s to the persisted `submittedValues` on rollback, while resetting the input only on explicit success.

---

### Step 1: Server Action Returning Submitted Payload on Error

The Server Action must return the attempted input values along with the error so the client knows what needs restoration:

```typescript
// app/actions/comments.ts
'use server';

import { z } from 'zod';

const CommentSchema = z.object({
  author: z.string().min(2, 'Name is required'),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
});

export type CommentItem = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type CommentActionState = {
  status: 'idle' | 'success' | 'error';
  comments: CommentItem[];
  submittedValues?: { author: string; content: string };
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
};

export async function addCommentAction(
  prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const rawValues = {
    author: (formData.get('author') as string) || '',
    content: (formData.get('content') as string) || '',
  };

  const parsed = CommentSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      ...prevState,
      status: 'error',
      error: 'Please fix validation errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      submittedValues: rawValues, // Retain what user typed
    };
  }

  // Simulate network/server failure trigger
  if (rawValues.content.toLowerCase().includes('fail')) {
    return {
      ...prevState,
      status: 'error',
      error: 'Network timeout: Failed to save comment to database.',
      submittedValues: rawValues, // Retain what user typed
    };
  }

  // Simulated DB latency
  await new Promise((res) => setTimeout(res, 600));

  const newComment: CommentItem = {
    id: crypto.randomUUID(),
    author: parsed.data.author,
    content: parsed.data.content,
    createdAt: new Date().toLocaleTimeString(),
  };

  return {
    status: 'success',
    comments: [newComment, ...prevState.comments],
    submittedValues: undefined, // Clear out on success
    error: null,
    fieldErrors: undefined,
  };
}

```

---

### Step 2: Client Component with Auto-Restoration

Instead of immediately clearing the form with `form.reset()`, maintain local input draft state. If the Server Action fails, synchronize the input fields back to `state.submittedValues` via an effect, while allowing `useOptimistic` to discard the failed list item automatically.

```tsx
// app/components/OptimisticCommentFeed.tsx
'use client';

import { useActionState, useOptimistic, startTransition, useState, useEffect } from 'react';
import { addCommentAction, type CommentItem, type CommentActionState } from '@/app/actions/comments';

interface Props {
  initialComments: CommentItem[];
}

export function OptimisticCommentFeed({ initialComments }: Props) {
  // 1. Base Action State
  const [state, formAction, isPending] = useActionState(addCommentAction, {
    status: 'idle',
    comments: initialComments,
    error: null,
  });

  // 2. Local Form Inputs State
  const [inputs, setInputs] = useState({ author: '', content: '' });

  // 3. Optimistic List Management
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    state.comments,
    (current: CommentItem[], newComment: CommentItem) => [newComment, ...current]
  );

  // 4. Restore inputs if Server Action returns an error
  useEffect(() => {
    if (state.status === 'error' && state.submittedValues) {
      setInputs(state.submittedValues);
    } else if (state.status === 'success') {
      setInputs({ author: '', content: '' });
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const tempAuthor = inputs.author.trim();
    const tempContent = inputs.content.trim();

    if (!tempAuthor || !tempContent) return;

    // Clear client fields optimistically to feel snappy
    setInputs({ author: '', content: '' });

    startTransition(async () => {
      // Paint optimistic item into list
      setOptimisticComments({
        id: `temp-${crypto.randomUUID()}`,
        author: tempAuthor,
        content: tempContent,
        createdAt: 'Just now',
      });

      // Submit Server Action
      await formAction(formData);
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-base font-bold text-gray-900">Discussion</h2>
        {isPending && (
          <span className="text-xs text-amber-600 font-medium animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Posting...
          </span>
        )}
      </div>

      {/* Rollback Error Banner with Action Message */}
      {state.status === 'error' && state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
          <p className="font-semibold">⚠️ Submission Failed (Rolled Back)</p>
          <p>{state.error}</p>
          <p className="text-[11px] text-red-500 italic">
            Your draft has been restored into the fields below so you can retry.
          </p>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded-lg border">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Name
          </label>
          <input
            name="author"
            value={inputs.author}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {state.fieldErrors?.author && (
            <p className="text-xs text-red-500 mt-1">{state.fieldErrors.author[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Comment (type "fail" to test rollback restoration)
          </label>
          <textarea
            name="content"
            value={inputs.content}
            onChange={handleChange}
            rows={3}
            placeholder="Write your thoughts..."
            className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {state.fieldErrors?.content && (
            <p className="text-xs text-red-500 mt-1">{state.fieldErrors.content[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Post Comment
        </button>
      </form>

      {/* Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Comments ({optimisticComments.length})
        </h3>

        <ul className="divide-y border rounded-lg overflow-hidden">
          {optimisticComments.map((comment) => {
            const isOptimistic = comment.id.startsWith('temp-');

            return (
              <li
                key={comment.id}
                className={`p-3 text-sm space-y-1 transition-opacity ${
                  isOptimistic ? 'opacity-50 bg-amber-50/40' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-semibold text-gray-800">{comment.author}</span>
                  <span>{comment.createdAt}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
                {isOptimistic && (
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                    Sending...
                  </span>
                )}
              </li>
            );
          })}

          {optimisticComments.length === 0 && (
            <li className="p-4 text-center text-xs text-gray-400">No comments yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

```

---

### Alternative: Uncontrolled Form with `key` Reset Trigger

If you prefer native uncontrolled inputs (`defaultValue`), use an incrementing `formKey` that only increments on **successful** submissions. On failure, the inputs naturally preserve what the user typed without needing state re-binding:

```tsx
export function UncontrolledOptimisticForm() {
  const [formKey, setFormKey] = useState(0);

  const [state, formAction] = useActionState(async (prev, formData) => {
    const res = await addCommentAction(prev, formData);
    if (res.status === 'success') {
      // Only increment key on success to clear native input fields
      setFormKey((k) => k + 1);
    }
    return res;
  }, initialState);

  return (
    // Re-mounts and clears inputs ONLY when formKey increments on success
    <form key={formKey} action={formAction}>
      <input name="author" defaultValue={state.submittedValues?.author || ''} />
      <textarea name="content" defaultValue={state.submittedValues?.content || ''} />
      <button type="submit">Submit</button>
    </form>
  );
}

```

---

### Summary Checklist

* **Always return `submittedValues` on error:** Even if Zod parsing fails, package the unparsed raw strings in the failure return state.
* **Controlled vs. Uncontrolled Strategy:**
* For **controlled inputs**, re-inject `state.submittedValues` via an effect on failure.
* For **uncontrolled inputs**, increment a `key={successCount}` on the `<form>` only when the server returns a successful status.


* **Seamless Rollback:** `useOptimistic` automatically removes the pending optimistic card as soon as the transition settles, while the form inputs preserve the exact text for user review and re-submission.
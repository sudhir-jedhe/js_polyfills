Combining **`useActionState`** (for managing server state, validation errors, and submission status) with **`useOptimistic`** (for instantaneous client-side UI rendering) requires structuring your form around a unified action flow.

The key challenge is handling **error rollbacks**: when a Server Action fails or returns validation errors, `useOptimistic` automatically discards temporary updates once the transition completes, while `useActionState` preserves the error messages and previous valid state so the user can fix the input.

---

### Step 1: Define Schemas & Server Action

The Server Action validates data, introduces potential errors, and returns a structured response contract (`status`, `data`, `error`, `fieldErrors`):

```typescript
// app/actions/todos.ts
'use server';

import { z } from 'zod';

const TodoSchema = z.object({
  id: z.string(),
  text: z.string().min(3, 'Todo must be at least 3 characters long'),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema>;

export type TodoActionState = {
  status: 'idle' | 'success' | 'error';
  todos: Todo[];
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
};

export async function createTodoAction(
  prevState: TodoActionState,
  formData: FormData
): Promise<TodoActionState> {
  const text = formData.get('text') as string;

  // 1. Zod Validation
  const parsed = TodoSchema.safeParse({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  if (!parsed.success) {
    return {
      ...prevState,
      status: 'error',
      error: 'Please fix validation errors.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 2. Simulate potential server/network failure
  if (parsed.data.text.toLowerCase().includes('fail')) {
    return {
      ...prevState,
      status: 'error',
      error: 'Server error: Simulated network failure on write.',
    };
  }

  // Artificial latency
  await new Promise((res) => setTimeout(res, 800));

  // 3. Successful database insertion
  const newTodo = parsed.data;
  return {
    status: 'success',
    todos: [...prevState.todos, newTodo],
    error: null,
    fieldErrors: undefined,
  };
}

```

---

### Step 2: Client Component Wiring

To trigger both `useOptimistic` and `useActionState` within a single transition:

1. `useActionState` exposes the base `state` and the bound `formAction`.
2. Wrap `formAction` in a custom `formSubmitHandler` using `startTransition`.
3. Call `setOptimisticTodos` immediately inside the transition before invoking `formAction(formData)`.

```tsx
// app/components/OptimisticTodoManager.tsx
'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { createTodoAction, type Todo, type TodoActionState } from '@/app/actions/todos';

interface Props {
  initialTodos: Todo[];
}

export function OptimisticTodoManager({ initialTodos }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  // 1. Base Server State via useActionState
  const [state, formAction, isPending] = useActionState(createTodoAction, {
    status: 'idle',
    todos: initialTodos,
    error: null,
  });

  // 2. Instant Visual Layer via useOptimistic
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    state.todos,
    (currentTodos: Todo[], newOptimisticTodo: Todo) => [
      ...currentTodos,
      newOptimisticTodo,
    ]
  );

  // 3. Combined submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = (formData.get('text') as string)?.trim();

    if (!text) return;

    // Reset input field on the DOM immediately
    formRef.current?.reset();

    // Run optimistic paint + server action in a single concurrent transition
    startTransition(async () => {
      // (a) Optimistic paint (marked with isOptimistic flag or temp ID)
      setOptimisticTodos({
        id: `temp-${crypto.randomUUID()}`,
        text,
        completed: false,
      });

      // (b) Trigger Server Action
      await formAction(formData);
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-base font-bold text-gray-900">Task List</h2>
        {isPending && (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Syncing with server...
          </span>
        )}
      </div>

      {/* Server-Side Error Banner */}
      {state.status === 'error' && state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
          <p className="font-semibold">⚠️ Action Failed</p>
          <p>{state.error}</p>
        </div>
      )}

      {/* Todo List */}
      <ul className="divide-y border rounded-lg overflow-hidden min-h-[120px]">
        {optimisticTodos.map((todo) => {
          const isOptimistic = todo.id.startsWith('temp-');

          return (
            <li
              key={todo.id}
              className={`p-3 text-sm flex items-center justify-between transition-opacity ${
                isOptimistic ? 'opacity-50 bg-amber-50/40' : 'bg-white'
              }`}
            >
              <span className="text-gray-800 font-medium">{todo.text}</span>
              {isOptimistic && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600">
                  Saving...
                </span>
              )}
            </li>
          );
        })}

        {optimisticTodos.length === 0 && (
          <li className="p-6 text-center text-xs text-gray-400">No items available.</li>
        )}
      </ul>

      {/* Form Submission */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-2 pt-2">
        <div className="flex gap-2">
          <input
            name="text"
            placeholder="Type task name (type 'fail' to test rollback)..."
            className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {state.fieldErrors?.text && (
          <p className="text-xs text-red-500">{state.fieldErrors.text[0]}</p>
        )}
      </form>
    </div>
  );
}

```

---

### Step 3: Server Component Page Setup

```tsx
// app/todos/page.tsx (Server Component)
import { OptimisticTodoManager } from '@/app/components/OptimisticTodoManager';
import type { Todo } from '@/app/actions/todos';

export default async function TodosPage() {
  const initialTodos: Todo[] = [
    { id: '1', text: 'Configure optimistic updates', completed: true },
    { id: '2', text: 'Set up Server Actions error boundaries', completed: false },
  ];

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <OptimisticTodoManager initialTodos={initialTodos} />
    </main>
  );
}

```

---

### How Error Rollback & State Synchronization Work

1. **Keystroke / Submit:** When the user clicks *Add*, `setOptimisticTodos` immediately pushes the new item to `optimisticTodos`. The item paints on screen with 50% opacity and a `"Saving..."` badge.
2. **Success Flow:** If the Server Action succeeds, `useActionState` receives the new server-confirmed state `{ todos: [...prev, newTodo] }`. When the transition ends, `useOptimistic` reconciles against the newly updated base state, replacing the temporary ID (`temp-uuid`) with the real database ID without layout shifts.
3. **Failure / Rollback Flow:** If the Server Action throws or returns `{ status: 'error' }`, `state.todos` does not include the new item. When the transition concludes, `useOptimistic` automatically drops the temporary item and snaps back to the original `state.todos`, while `state.error` is populated to render the error banner.

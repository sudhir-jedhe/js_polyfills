Combining **streamed promises via `use()**` with **`useOptimistic`** allows you to render server-streamed data progressively while simultaneously providing zero-latency optimistic updates when the user triggers mutations.

The key architecture pattern is establishing a **two-layer state pipeline**:

1. **Authoritative Stream Layer:** A server-streamed Promise unwrapped with `use()` inside `<Suspense>`.
2. **Optimistic Mutation Layer:** An in-flight speculative state branch managed by `useOptimistic` + `startTransition` (or `useActionState`).

---

### The Architecture & Data Flow

```
[1. Initial Page Load / Navigation]
     ├── Server Component streams `todosPromise` (non-blocking)
     │      │
     │      ▼ (Flight HTTP Stream)
     └── Client Component:
            ├── `<Suspense fallback={<Skeleton />}>`
            └── `use(todosPromise)` unwraps resolved items: `[{ id: 1, text: "Buy milk" }]`
                   │
                   ▼
[2. User Adds Item: "Walk dog"]
     ├── `startTransition` / Form Action fires
     ├── `setOptimisticTodos` instantly appends `{ id: "temp", text: "Walk dog", sending: true }`
     │      └── UI paints immediately (0ms latency)
     │
     └── Server Action executes mutation in background
            │
            ├── SUCCESS: Server revalidates/updates ──▶ Optimistic state replaced by real committed item
            └── FAILURE: Server action throws ──────▶ Optimistic branch automatically rolls back

```

---

### Step 1: Server Component (Streams Initial Promise)

The Server Component kicks off the data fetch without awaiting it and passes the raw Promise down:

```tsx
// app/todos/page.tsx (Server Component)
import { Suspense } from 'react';
import { TodoListClient } from './TodoListClient';
import { fetchTodos } from '@/lib/api';

export default function TodosPage() {
  // Fire the promise on the server (do NOT await)
  const todosPromise = fetchTodos();

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Live Task Stream</h1>

      <Suspense fallback={<TodoSkeleton />}>
        <TodoListClient todosPromise={todosPromise} />
      </Suspense>
    </main>
  );
}

function TodoSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-10 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded" />
    </div>
  );
}

```

---

### Step 2: Client Component (`use` + `useOptimistic` + Server Action)

Unwrap the streamed Promise with `use()`, pass the unwrapped items as the base to `useOptimistic`, and dispatch mutations via an Action:

```tsx
// app/todos/TodoListClient.tsx
'use client';

import { use, useOptimistic, useRef, useTransition } from 'react';
import { addTodoAction } from '@/app/actions/todos';

export interface Todo {
  id: string;
  text: string;
  sending?: boolean; // Tag for optimistic styling
}

export function TodoListClient({
  todosPromise,
}: {
  todosPromise: Promise<Todo[]>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  // 1. Unwrap the server-streamed Promise (suspends if pending)
  const serverTodos = use(todosPromise);

  // 2. Base useOptimistic on the stream-resolved server data
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    serverTodos,
    (currentTodos: Todo[], newTodoText: string): Todo[] => [
      ...currentTodos,
      {
        id: `temp-${Date.now()}`,
        text: newTodoText,
        sending: true,
      },
    ]
  );

  // 3. Form Action handler triggering optimistic state + server mutation
  const handleAddTodo = async (formData: FormData) => {
    const text = formData.get('todo') as string;
    if (!text?.trim()) return;

    formRef.current?.reset();

    // Optimistic updates must be wrapped inside a Transition
    startTransition(async () => {
      setOptimisticTodos(text); // Paints new item instantly (0ms)
      await addTodoAction(text); // Performs Server Action & revalidation
    });
  };

  return (
    <div className="space-y-4">
      {/* Optimistic List Rendering */}
      <ul className="divide-y border rounded-lg overflow-hidden bg-white shadow-sm">
        {optimisticTodos.map((todo) => (
          <li
            key={todo.id}
            className={`p-3 flex justify-between items-center text-sm ${
              todo.sending ? 'bg-gray-50 text-gray-400 italic' : 'text-gray-900'
            }`}
          >
            <span>{todo.text}</span>
            {todo.sending && (
              <span className="text-xs text-blue-500 font-medium animate-pulse">
                Saving...
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Mutation Form */}
      <form ref={formRef} action={handleAddTodo} className="flex gap-2">
        <input
          name="todo"
          placeholder="New task..."
          required
          className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
}

```

---

### Step 3: Server Action with Path Revalidation

The Server Action persists the record and triggers cache revalidation:

```typescript
// app/actions/todos.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function addTodoAction(text: string) {
  // Simulate network latency / DB write
  await db.todo.create({
    data: {
      text,
      createdAt: new Date(),
    },
  });

  // Revalidate the route so subsequent renders get fresh server data
  revalidatePath('/todos');
}

```

---

### Why This Combination Works Seamlessly

* **No Premature Mounts:** `use(todosPromise)` guarantees that `useOptimistic` is initialized with the true server data **before** the client view becomes interactive.
* **Automatic Rollback:** If `addTodoAction` throws a server exception or validation fails, React drops the transition and rolls `optimisticTodos` back to the actual `serverTodos` array automatically.
* **Zero Prop Drilling / Redux Overhead:** You eliminate custom client stores, `useEffect` synchronization chains, and manual `previousState` rollback tracking.

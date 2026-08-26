To handle multiple mutation types (create, update, delete) on stream-resolved data, structure the `useOptimistic` reducer around an **action-based pattern** (similar to a standard Redux/`useReducer` dispatcher).

This allows a single optimistic state pipeline to resolve items from `use(promise)` while handling in-place edits, soft deletions, and instant status updates.

---

### 1. The Optimistic Action Types and Reducer

Define discriminated action types for updating and removing items:

```typescript
// types/tasks.ts
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pending?: boolean; // Marker for in-flight mutations
}

export type OptimisticTaskAction =
  | { type: 'delete'; id: string }
  | { type: 'toggle'; id: string }
  | { type: 'edit'; id: string; newTitle: string };

```

---

### 2. Client Component Implementation

Unwrap the streamed promise with `use()`, connect it to `useOptimistic`, and dispatch actions inside `startTransition`:

```tsx
// app/tasks/TaskListClient.tsx
'use client';

import { use, useOptimistic, useTransition } from 'react';
import { deleteTaskAction, toggleTaskAction, updateTaskTitleAction } from '@/app/actions/tasks';
import type { Task, OptimisticTaskAction } from '@/types/tasks';

export function TaskListClient({
  tasksPromise,
}: {
  tasksPromise: Promise<Task[]>;
}) {
  const [isPending, startTransition] = useTransition();

  // 1. Unwrap the server-streamed Promise
  const serverTasks = use(tasksPromise);

  // 2. Action-based optimistic reducer
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    serverTasks,
    (currentTasks: Task[], action: OptimisticTaskAction): Task[] => {
      switch (action.type) {
        case 'delete':
          // Instantly remove item from optimistic list
          return currentTasks.filter((task) => task.id !== action.id);

        case 'toggle':
          // Invert completed flag and mark pending
          return currentTasks.map((task) =>
            task.id === action.id
              ? { ...task, completed: !task.completed, pending: true }
              : task
          );

        case 'edit':
          // Update title in-place
          return currentTasks.map((task) =>
            task.id === action.id
              ? { ...task, title: action.newTitle, pending: true }
              : task
          );

        default:
          return currentTasks;
      }
    }
  );

  // --- Handlers wrapped in Transitions ---

  const handleToggle = (id: string) => {
    startTransition(async () => {
      setOptimisticTasks({ type: 'toggle', id });
      await toggleTaskAction(id);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      setOptimisticTasks({ type: 'delete', id });
      await deleteTaskAction(id);
    });
  };

  const handleEdit = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    startTransition(async () => {
      setOptimisticTasks({ type: 'edit', id, newTitle });
      await updateTaskTitleAction(id, newTitle);
    });
  };

  return (
    <ul className="divide-y border rounded-lg bg-white shadow-sm overflow-hidden">
      {optimisticTasks.map((task) => (
        <li
          key={task.id}
          className={`p-3 flex items-center justify-between gap-3 text-sm transition ${
            task.pending ? 'opacity-60 bg-gray-50' : 'opacity-100'
          }`}
        >
          {/* Checkbox Toggle */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle(task.id)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
          />

          {/* Editable Title Input */}
          <input
            defaultValue={task.title}
            onBlur={(e) => {
              if (e.target.value !== task.title) {
                handleEdit(task.id, e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className={`flex-1 bg-transparent px-2 py-1 rounded hover:bg-gray-100 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          />

          {/* Delete Action Button */}
          <button
            onClick={() => handleDelete(task.id)}
            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </li>
      ))}
      {optimisticTasks.length === 0 && (
        <li className="p-4 text-center text-gray-400 text-sm">No tasks found.</li>
      )}
    </ul>
  );
}

```

---

### 3. Corresponding Server Actions with Cache Revalidation

Each action handles database updates and revalidates the route so the next server pass delivers the true updated state:

```typescript
// app/actions/tasks.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function toggleTaskAction(id: string) {
  const task = await db.task.findUnique({ where: { id } });
  if (!task) throw new Error('Task not found');

  await db.task.update({
    where: { id },
    data: { completed: !task.completed },
  });

  revalidatePath('/tasks');
}

export async function deleteTaskAction(id: string) {
  await db.task.delete({ where: { id } });
  revalidatePath('/tasks');
}

export async function updateTaskTitleAction(id: string, newTitle: string) {
  await db.task.update({
    where: { id },
    data: { title: newTitle },
  });

  revalidatePath('/tasks');
}

```

---

### How Optimistic Edits and Deletes Behave on Error

| Mutation Event      | User Experience (0ms)                                        | If Server Action Rejects / Network Fails           |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| **Delete**          | Item instantly vanishes from DOM.                            | Item snaps back into the list automatically.       |
| **Toggle Checkbox** | Checkbox flips status instantly; row dims (`pending: true`). | Checkbox flips back to previous state; row undims. |
| **Title Edit**      | Text displays edited string immediately.                     | Text rolls back to original persisted title.       |

---

### Key Takeaways for Multi-Mutation Optimistic UIs

* **Centralize with Discriminated Unions:** Using `{ type: 'delete' | 'toggle' | 'edit' }` makes scaling complex entity updates straightforward without declaring separate `useOptimistic` hooks for every mutation.
* **Keep Keys Stable:** When updating an existing item in the array, preserve its true `task.id` rather than generating temporary IDs.
* **Combine with Uncontrolled Inputs for Edits:** Using `defaultValue={task.title}` alongside `onBlur` allows standard typing performance while dispatching the optimistic transition only when the user commits the change.

Implementing optimistic drag-and-drop reordering with React 19 combines `@hello-pangea/dnd` (or HTML5 Drag and Drop / `@dnd-kit`), **`useOptimistic`**, and **`startTransition`**.

When a user drops an item, the client calculates the new array order locally, paints it instantly via `useOptimistic`, and triggers a Server Action in the background to persist the new sort orders in the database. If the server mutation fails, React automatically rolls back the list to its previous state.

---

### Step 1: Types & Server Action

The Server Action receives the reordered array with new index rankings, updates the database in a transaction, and returns the confirmed list:

```typescript
// app/actions/reorder.ts
'use server';

import { z } from 'zod';

export const TaskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number().int().nonnegative(),
});

export type TaskItem = z.infer<typeof TaskItemSchema>;

export async function reorderTasksAction(
  reorderedTasks: TaskItem[]
): Promise<{ success: boolean; data: TaskItem[]; error?: string }> {
  try {
    // 1. Assign sequential order indexes (0, 1, 2, ...)
    const rankedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    // 2. Persist order in DB via transaction (e.g., Prisma / Drizzle)
    // await db.$transaction(
    //   rankedTasks.map((t) => db.task.update({ where: { id: t.id }, data: { order: t.order } }))
    // );

    // Artificial delay to simulate network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      data: rankedTasks,
    };
  } catch (err: any) {
    return {
      success: false,
      data: reorderedTasks,
      error: err.message || 'Failed to persist task order',
    };
  }
}

```

---

### Step 2: Array Reorder Helper

```typescript
// lib/array-utils.ts
export function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

```

---

### Step 3: Optimistic Drag-and-Drop Container

Using `@hello-pangea/dnd` (the actively maintained fork of `react-beautiful-dnd` with full React 18/19 support):

```tsx
// app/components/OptimisticKanbanList.tsx
'use client';

import { useState, useOptimistic, useTransition } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { reorderTasksAction, type TaskItem } from '@/app/actions/reorder';
import { reorderArray } from '@/lib/array-utils';

interface Props {
  initialTasks: TaskItem[];
}

export function OptimisticKanbanList({ initialTasks }: Props) {
  const [serverTasks, setServerTasks] = useState<TaskItem[]>(initialTasks);
  const [isPending, startTransition] = useTransition();

  // 1. React 19 Optimistic Reducer
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    serverTasks,
    (_current: TaskItem[], newOrder: TaskItem[]) => newOrder
  );

  // 2. Handle Drag End
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    // Calculate new order client-side immediately
    const reordered = reorderArray(optimisticTasks, sourceIndex, destIndex);

    // 3. Trigger immediate optimistic paint & server persistence
    startTransition(async () => {
      // Paints instantly on screen
      setOptimisticTasks(reordered);

      // Runs background server update
      const response = await reorderTasksAction(reordered);

      if (response.success) {
        setServerTasks(response.data);
      } else {
        // Automatically rolls back to `serverTasks` when transition settles
        alert(`Failed to save order: ${response.error}`);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-base font-bold text-gray-900">Task Priorities</h2>
        {isPending && (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Saving order...
          </span>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks-list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2.5 min-h-[150px]"
            >
              {optimisticTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 rounded-lg border text-sm flex items-center justify-between transition-shadow select-none ${
                        snapshot.isDragging
                          ? 'bg-blue-50 border-blue-400 shadow-lg ring-2 ring-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 cursor-grab active:cursor-grabbing">
                          ⋮⋮
                        </span>
                        <span className="font-medium text-gray-800">{task.title}</span>
                      </div>

                      <span className="text-xs font-mono text-gray-400 bg-white px-2 py-0.5 rounded border">
                        #{index + 1}
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

```

---

### Step 4: Server Component Integration

Render the client component on the server, passing initial ordered rows from your database:

```tsx
// app/tasks/page.tsx (Server Component)
import { OptimisticKanbanList } from '@/app/components/OptimisticKanbanList';
import type { TaskItem } from '@/app/actions/reorder';

export default async function TasksPage() {
  // Fetch initial tasks ordered by rank/index
  const initialTasks: TaskItem[] = [
    { id: 't1', title: 'Prepare Q3 roadmap slides', order: 0 },
    { id: 't2', title: 'Review Server Action security RFC', order: 1 },
    { id: 't3', title: 'Set up S3 multipart upload pipeline', order: 2 },
    { id: 't4', title: 'Implement ClamAV virus scanner', order: 3 },
  ];

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <OptimisticKanbanList initialTasks={initialTasks} />
    </main>
  );
}

```

---

### Core Resilience Checklist

* **Zero Drag-Flicker:** Passing `optimisticTasks` to the list rendering loop guarantees that once the drop event fires, items don't snap back to their old index while awaiting the HTTP response.
* **Automatic Error Rollback:** If the Server Action returns `{ success: false }` or throws an unhandled rejection, `serverTasks` remains unchanged. Once `startTransition` completes, `useOptimistic` discards the temporary state and snaps the list back to its original database order.
* **Fractional Indexing Optimization (Alternative for High-Frequency Reordering):** For large lists ($>1{,}000$ items), instead of updating every item's integer order ($0, 1, 2, 3\dots$), assign fractional LexoRank / floating-point ranks (e.g., placing an item between rank $1.0$ and $2.0$ assigns $1.5$) so only a single database row is mutated per drop.

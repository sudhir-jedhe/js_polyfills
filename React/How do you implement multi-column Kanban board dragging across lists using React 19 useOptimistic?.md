Implementing a multi-column Kanban board with cross-list drag-and-drop requires managing two dimensions of movement:

1. **Intra-column reordering:** Changing the vertical rank/order within the same status column.
2. **Inter-column transfer:** Moving an item from Column A to Column B while simultaneously updating its `status` and `order`.

Using **`useOptimistic`** with an action reducer allows the entire multi-column state to repaint instantly when a card is dropped across columns, while a Server Action persists the database transaction in the background.

---

### Step 1: Types & Multi-Column Reorder Action

The Server Action persists both the status change and new order indexes across affected columns:

```typescript
// app/actions/kanban.ts
'use server';

import { z } from 'zod';

export type ColumnStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export const KanbanCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  order: z.number().int().nonnegative(),
});

export type KanbanCard = z.infer<typeof KanbanCardSchema>;
export type KanbanBoardState = Record<ColumnStatus, KanbanCard[]>;

export interface MoveCardPayload {
  cardId: string;
  sourceColumn: ColumnStatus;
  destinationColumn: ColumnStatus;
  sourceIndex: number;
  destinationIndex: number;
}

export async function moveKanbanCardAction(
  payload: MoveCardPayload,
  nextBoardState: KanbanBoardState
): Promise<{ success: boolean; data: KanbanBoardState; error?: string }> {
  try {
    // 1. In production: run atomic DB updates (e.g. Prisma / Drizzle transaction)
    // - Update moved card's status and order
    // - Re-index remaining cards in source & destination columns

    // Simulate network roundtrip latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      data: nextBoardState,
    };
  } catch (err: any) {
    return {
      success: false,
      data: nextBoardState,
      error: err.message || 'Failed to move card across columns',
    };
  }
}

```

---

### Step 2: Pure Immutable Cross-Column Matrix Helper

```typescript
// lib/kanban-utils.ts
import type { ColumnStatus, KanbanBoardState } from '@/app/actions/kanban';

export function moveCardBetweenColumns(
  board: KanbanBoardState,
  sourceCol: ColumnStatus,
  destCol: ColumnStatus,
  sourceIndex: number,
  destIndex: number
): KanbanBoardState {
  const sourceList = Array.from(board[sourceCol]);
  const destList = sourceCol === destCol ? sourceList : Array.from(board[destCol]);

  // 1. Remove card from source column
  const [movedCard] = sourceList.splice(sourceIndex, 1);
  if (!movedCard) return board;

  // 2. Update card status and insert into destination column
  const updatedCard = { ...movedCard, status: destCol };
  destList.splice(destIndex, 0, updatedCard);

  // 3. Re-rank order indexes for both affected columns
  const rankedSource = sourceList.map((card, idx) => ({ ...card, order: idx }));
  const rankedDest = destList.map((card, idx) => ({ ...card, order: idx }));

  return {
    ...board,
    [sourceCol]: rankedSource,
    [destCol]: rankedDest,
  };
}

```

---

### Step 3: Optimistic Multi-Column Kanban Component

Using `@hello-pangea/dnd` to coordinate multi-droppable column targets:

```tsx
// app/components/OptimisticKanbanBoard.tsx
'use client';

import { useState, useOptimistic, useTransition } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  moveKanbanCardAction,
  type KanbanBoardState,
  type ColumnStatus,
  type MoveCardPayload,
} from '@/app/actions/kanban';
import { moveCardBetweenColumns } from '@/lib/kanban-utils';

const COLUMNS: Array<{ id: ColumnStatus; label: string; accent: string }> = [
  { id: 'TODO', label: 'To Do', accent: 'border-t-blue-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', accent: 'border-t-amber-500' },
  { id: 'DONE', label: 'Done', accent: 'border-t-emerald-500' },
];

interface Props {
  initialBoard: KanbanBoardState;
}

export function OptimisticKanbanBoard({ initialBoard }: Props) {
  const [serverBoard, setServerBoard] = useState<KanbanBoardState>(initialBoard);
  const [isPending, startTransition] = useTransition();

  // 1. React 19 Optimistic Reducer for Full Board State
  const [optimisticBoard, setOptimisticBoard] = useOptimistic(
    serverBoard,
    (_current: KanbanBoardState, nextState: KanbanBoardState) => nextState
  );

  // 2. Cross-Column Drop Handler
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceCol = source.droppableId as ColumnStatus;
    const destCol = destination.droppableId as ColumnStatus;
    const sourceIndex = source.index;
    const destIndex = destination.index;

    // No-op if dropped in original position
    if (sourceCol === destCol && sourceIndex === destIndex) return;

    // Compute updated board matrix instantly
    const nextBoardState = moveCardBetweenColumns(
      optimisticBoard,
      sourceCol,
      destCol,
      sourceIndex,
      destIndex
    );

    const payload: MoveCardPayload = {
      cardId: draggableId,
      sourceColumn: sourceCol,
      destinationColumn: destCol,
      sourceIndex,
      destinationIndex: destIndex,
    };

    // 3. Paint optimistic state and sync in background
    startTransition(async () => {
      // Paint immediately on client
      setOptimisticBoard(nextBoardState);

      // Execute Server Action
      const response = await moveKanbanCardAction(payload, nextBoardState);

      if (response.success) {
        setServerBoard(response.data);
      } else {
        // Automatically rolls back to serverBoard if failed
        alert(`Failed to move card: ${response.error}`);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sprint Board</h1>
          <p className="text-xs text-gray-500">Drag items between columns to reassign status</p>
        </div>

        {isPending && (
          <div className="text-xs text-amber-600 font-medium flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Persisting board changes...
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {COLUMNS.map((column) => {
            const cards = optimisticBoard[column.id] || [];

            return (
              <div
                key={column.id}
                className={`bg-gray-100/70 border border-gray-200 rounded-xl p-3.5 border-t-4 ${column.accent} shadow-sm flex flex-col min-h-[450px]`}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    {column.label}
                  </span>
                  <span className="text-xs font-mono font-semibold bg-gray-200/80 text-gray-600 px-2 py-0.5 rounded-full">
                    {cards.length}
                  </span>
                </div>

                {/* Droppable Card Column */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2.5 rounded-lg p-1 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-white rounded-lg border text-sm select-none transition-shadow ${
                                snapshot.isDragging
                                  ? 'border-blue-400 shadow-xl ring-2 ring-blue-300 rotate-1'
                                  : 'border-gray-200 hover:border-gray-300 shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-medium text-gray-800 leading-snug">
                                  {card.title}
                                </span>
                                <span className="text-gray-300 cursor-grab active:cursor-grabbing text-xs">
                                  ⋮⋮
                                </span>
                              </div>

                              <div className="flex justify-between items-center mt-2.5 pt-2 border-t text-[11px] text-gray-400 font-mono">
                                <span>#{card.id.slice(0, 6)}</span>
                                <span>Pos: {index + 1}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

```

---

### Step 4: Server Component Orchestration

Fetch grouped columns directly from your database and feed them into the client board:

```tsx
// app/board/page.tsx (Server Component)
import { OptimisticKanbanBoard } from '@/app/components/OptimisticKanbanBoard';
import type { KanbanBoardState } from '@/app/actions/kanban';

export default async function KanbanPage() {
  // Query cards grouped by status and ordered by index
  const initialBoard: KanbanBoardState = {
    TODO: [
      { id: 'card-1', title: 'Write RFC for multi-tenant auth', status: 'TODO', order: 0 },
      { id: 'card-2', title: 'Audit S3 bucket CORS policies', status: 'TODO', order: 1 },
    ],
    IN_PROGRESS: [
      { id: 'card-3', title: 'Stream virus scanner integration', status: 'IN_PROGRESS', order: 0 },
    ],
    DONE: [
      { id: 'card-4', title: 'Setup Zod cross-field validation', status: 'DONE', order: 0 },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <OptimisticKanbanBoard initialBoard={initialBoard} />
    </main>
  );
}

```

---

### Key Production Considerations

* **Atomic Column State Swapping:** Managing board state as a hashmap (`Record<ColumnStatus, KanbanCard[]>`) allows `useOptimistic` to atomically swap items between keys in $O(N)$ time without triggering nested component re-mounts.
* **Instant Placeholder Alignment:** Passing `optimisticBoard` into both `<Droppable>` containers prevents cross-column flickering or layout collapse when moving cards across long lists.
* **Zero-Lag Rollbacks:** If the Server Action throws a network timeout or authorization failure, `serverBoard` remains untouched, causing React to immediately restore the cards to their pre-drag columns when the transition concludes.

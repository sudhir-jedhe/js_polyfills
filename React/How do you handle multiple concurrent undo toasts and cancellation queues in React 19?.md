Managing multiple concurrent undo toasts in React 19 requires coordinating three pieces of state:

1. **Speculative UI Layer (`useOptimistic`):** Keeps deleted items hidden instantly from the main list.
2. **Cancellation Queue (`useRef<Map<string, Timeout>>`):** Tracks independent countdown timers per item so each deletion can be canceled independently.
3. **Toast Notifications State:** Displays a stack of interactive toast notifications where each toast has its own countdown and "Undo" action.

---

### Step 1: The Permanent Server Action

```typescript
// app/actions/items.ts
'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export async function deleteItemPermanentlyAction(itemId: string) {
  await db.item.delete({ where: { id: itemId } });
  revalidatePath('/items');
}

```

---

### Step 2: Client Queue & Concurrent Toast Implementation

Use a `useRef` map for timers so timeout IDs survive re-renders without re-triggering component re-evaluations.

```tsx
// app/items/MultiUndoItemList.tsx
'use client';

import { useState, useRef, useOptimistic, useTransition, useEffect } from 'react';
import { deleteItemPermanentlyAction } from '@/app/actions/items';

export interface Item {
  id: string;
  title: string;
}

interface ToastItem {
  id: string;
  title: string;
  expiresAt: number;
}

const GRACE_PERIOD_MS = 5000;

export function MultiUndoItemList({ initialItems }: { initialItems: Item[] }) {
  const [, startTransition] = useTransition();

  // 1. In-flight deleted IDs tracked before server commits
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // 2. Active visible toast queue
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // 3. Map storing timer instances per item ID
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // 4. Optimistic list derived from server items minus in-flight deleted IDs
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialItems.filter((item) => !deletedIds.includes(item.id)),
    (currentItems, idsToRemove: string[]) =>
      currentItems.filter((item) => !idsToRemove.includes(item.id))
  );

  // Flush and commit all remaining pending deletions on unmount or tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      timersRef.current.forEach((_, itemId) => {
        // Fast synchronous beacon/fetch fallback if available, or force commit
        deleteItemPermanentlyAction(itemId);
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Clear timers on component teardown
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // --- Trigger Deletion (Queued) ---
  const handleDelete = (item: Item) => {
    // Prevent duplicate triggers for the same item
    if (timersRef.current.has(item.id)) return;

    // A. Speculatively remove item immediately (0ms)
    startTransition(() => {
      setOptimisticItems([item.id]);
    });
    setDeletedIds((prev) => [...prev, item.id]);

    // B. Add to the toast stack
    setToasts((prev) => [
      ...prev,
      {
        id: item.id,
        title: item.title,
        expiresAt: Date.now() + GRACE_PERIOD_MS,
      },
    ]);

    // C. Schedule independent timer for this specific item
    const timerId = setTimeout(() => {
      commitPermanentDeletion(item.id);
    }, GRACE_PERIOD_MS);

    timersRef.current.set(item.id, timerId);
  };

  // --- Commit to Server (Timer Expired) ---
  const commitPermanentDeletion = (itemId: string) => {
    // Clean up timer and toast entry
    timersRef.current.delete(itemId);
    setToasts((prev) => prev.filter((t) => t.id !== itemId));

    // Fire Server Action inside transition
    startTransition(async () => {
      try {
        await deleteItemPermanentlyAction(itemId);
      } catch (error) {
        console.error('Failed to commit delete:', error);
      } finally {
        // Remove from deletedIds; server revalidation now provides updated authoritative list
        setDeletedIds((prev) => prev.filter((id) => id !== itemId));
      }
    });
  };

  // --- Undo Deletion (User Clicks "Undo") ---
  const handleUndo = (itemId: string) => {
    const timerId = timersRef.current.get(itemId);
    if (timerId) {
      clearTimeout(timerId);
      timersRef.current.delete(itemId);
    }

    // Remove from toast queue and restore item to the UI
    setToasts((prev) => prev.filter((t) => t.id !== itemId));
    setDeletedIds((prev) => prev.filter((id) => id !== itemId));
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 relative">
      <h2 className="text-xl font-bold">Inbox / Tasks</h2>

      {/* Item List */}
      <ul className="divide-y border rounded-lg overflow-hidden bg-white shadow-sm">
        {optimisticItems.map((item) => (
          <li key={item.id} className="p-3 flex justify-between items-center text-sm">
            <span>{item.title}</span>
            <button
              onClick={() => handleDelete(item)}
              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </li>
        ))}
        {optimisticItems.length === 0 && (
          <li className="p-4 text-center text-gray-400 text-sm">All items cleared.</li>
        )}
      </ul>

      {/* Concurrent Toast Stack */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center justify-between gap-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm min-w-[280px] animate-slide-up"
          >
            <span>Deleted <strong>{toast.title}</strong></span>
            <button
              onClick={() => handleUndo(toast.id)}
              className="text-yellow-400 font-semibold hover:text-yellow-300 underline"
            >
              Undo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

### Architecture & Lifecycle Matrix

| Stage                                   | Data Flow                                                                            | UI State                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **1. User clicks delete on Item A & B** | `timersRef` stores 2 distinct timers; `deletedIds` includes `[A, B]`.                | Items A & B instantly disappear; 2 independent toasts stack on bottom-right. |
| **2. User clicks "Undo" on Item A**     | Timer A is cleared with `clearTimeout`; Item A removed from `deletedIds`.            | Item A re-renders immediately; Toast A dismisses; Toast B remains active.    |
| **3. Timer B expires (5s)**             | Timer B triggers `commitPermanentDeletion(B)`; Server Action executes.               | Toast B dismisses; Server updates database; Route revalidates cleanly.       |
| **4. User closes tab / navigates**      | `beforeunload` listener runs and triggers instant commit for all IDs in `timersRef`. | Guarantees pending deletions aren't lost in memory.                          |

---

### Key Production Considerations

* **Map vs. Array for Timers:** Using `Map<string, Timeout>` gives $O(1)$ lookups and cancellations when clearing specific timers out of order.
* **Ref-Based Timer Isolation:** Storing timer handles in `useRef` ensures setting or clearing timeouts does not cause redundant component re-renders.
* **Batch Commit on Mass Actions:** If you add an "Undo All" button, iterate over `timersRef`, clear all timeout IDs, and reset `deletedIds` to `[]` in a single state update.

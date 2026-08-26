An optimistic undo pattern lets users delete or archive items instantly from the UI while giving them a short grace period (e.g., 5 seconds) to cancel the action before the permanent Server Action commits to the database.

To implement this cleanly in React 19, you coordinate **`useOptimistic`** for immediate removal with a **client-side countdown timer** that defers the Server Action execution.

---

### Architecture & Lifecycle Flow

```
[1. User clicks "Delete"]
       │
       ├── Optimistic list updates immediately (item hidden from UI)
       ├── Toast appears with "Undo" button & 5-second countdown
       └── A `setTimeout` is scheduled to fire the Server Action
              │
              ├── CASE A: User clicks "Undo" before timer ends
              │     ├── `clearTimeout()` cancels the network request
              │     ├── Toast dismisses
              │     └── Item instantly reappears in the list
              │
              └── CASE B: Timer expires (5 seconds elapsed)
                    ├── Toast dismisses
                    └── Server Action fires ──▶ DB deletes record ──▶ `revalidatePath()`

```

---

### Step 1: The Permanent Server Action

The Server Action performs the actual database deletion and invalidates the route:

```typescript
// app/actions/items.ts
'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export async function deleteItemPermanentlyAction(itemId: string) {
  try {
    await db.item.delete({ where: { id: itemId } });
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to delete item:', error);
    throw new Error('Database deletion failed');
  }
}

```

---

### Step 2: Client Component with Deferred Action & Undo Toast

Use a combination of `useOptimistic` for instantaneous UI removal, a local `pendingDeletions` queue to track in-flight items, and `setTimeout` refs to allow cancellation:

```tsx
// app/components/ItemListClient.tsx
'use client';

import { useState, useRef, useOptimistic, useTransition, useEffect } from 'react';
import { deleteItemPermanentlyAction } from '@/app/actions/items';

export interface Item {
  id: string;
  title: string;
}

interface ToastState {
  id: string;
  item: Item;
  timerId: NodeJS.Timeout;
}

export function ItemListClient({ initialItems }: { initialItems: Item[] }) {
  const [, startTransition] = useTransition();
  const [activeToast, setActiveToast] = useState<ToastState | null>(null);
  
  // Track IDs marked for deletion on the client before server commits
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // 1. Optimistic list filters out any pending deleted IDs
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialItems.filter((item) => !deletedIds.includes(item.id)),
    (currentItems, idToRemove: string) =>
      currentItems.filter((item) => item.id !== idToRemove)
  );

  // Clean up any lingering timers if the component unmounts
  useEffect(() => {
    return () => {
      if (activeToast) clearTimeout(activeToast.timerId);
    };
  }, [activeToast]);

  // 2. Trigger Optimistic Delete with Delay
  const handleDeleteClick = (item: Item) => {
    // If another toast was already active, commit it immediately
    if (activeToast) {
      clearTimeout(activeToast.timerId);
      commitDeletion(activeToast.item.id);
    }

    // A. Speculatively remove from UI instantly
    startTransition(() => {
      setOptimisticItems(item.id);
    });
    setDeletedIds((prev) => [...prev, item.id]);

    // B. Schedule Server Action to execute after 5 seconds
    const timerId = setTimeout(() => {
      commitDeletion(item.id);
      setActiveToast(null);
    }, 5000);

    // C. Display the Undo Toast
    setActiveToast({ id: item.id, item, timerId });
  };

  // 3. Commit Deletion to Server
  const commitDeletion = (itemId: string) => {
    startTransition(async () => {
      try {
        await deleteItemPermanentlyAction(itemId);
        // Remove from client deleted queue once server revalidation takes over
        setDeletedIds((prev) => prev.filter((id) => id !== itemId));
      } catch (err) {
        // Rollback on server error
        setDeletedIds((prev) => prev.filter((id) => id !== itemId));
      }
    });
  };

  // 4. Undo Handler (User clicks "Undo")
  const handleUndo = () => {
    if (!activeToast) return;

    // Cancel the pending server call
    clearTimeout(activeToast.timerId);

    // Restore item by removing from deletedIds list
    setDeletedIds((prev) => prev.filter((id) => id !== activeToast.item.id));
    setActiveToast(null);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 relative">
      <h2 className="text-xl font-bold">My Items</h2>

      {/* Items List */}
      <ul className="divide-y border rounded-lg overflow-hidden bg-white shadow-sm">
        {optimisticItems.map((item) => (
          <li key={item.id} className="p-3 flex justify-between items-center text-sm">
            <span>{item.title}</span>
            <button
              onClick={() => handleDeleteClick(item)}
              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </li>
        ))}
        {optimisticItems.length === 0 && (
          <li className="p-4 text-center text-gray-400 text-sm">No items remaining.</li>
        )}
      </ul>

      {/* Floating Undo Toast */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm animate-slide-up z-50">
          <span>Deleted <strong>{activeToast.item.title}</strong></span>
          <button
            onClick={handleUndo}
            className="text-yellow-400 font-semibold hover:text-yellow-300 underline ml-2"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

```

---

### Edge Cases and Best Practices

* **Flush Pending Deletes on Navigation / Window Close:**
If a user navigates away or closes the tab while an undo timer is running, use the `beforeunload` or `navigator.sendBeacon` lifecycle to commit the final delete immediately so the mutation isn't silently lost.
* **Queueing Multiple Deletes:**
If the user deletes multiple items in rapid succession, maintain a Map of active timers (`useRef<Map<string, NodeJS.Timeout>>(new Map())`) so each item tracks its own independent 5-second countdown.
* **Network Failures on Delayed Commit:**
If the network fails when the timer eventually fires, catching the rejection and filtering the ID out of `deletedIds` restores the item to the screen while showing an error alert.

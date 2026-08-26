Combining **React 19’s `useOptimistic**` with**React Hook Form’s `useFieldArray**` allows dynamic array modifications (adding, deleting, or updating line items) to render instantly on screen while a Server Action persists the changes asynchronously.

Because `useFieldArray` maintains internal form state (for uncontrolled inputs and validation) and `useOptimistic` manages visual presentation during pending transitions, the optimal architecture uses:

1. **Server Action** that mutates the array and returns the confirmed server state.
2. **`useOptimistic`** to compute instant additions/removals with a temporary `pending: true` flag.
3. **`useFieldArray` sync** to align RHF’s internal state once the server transition resolves.

---

### Step 1: Types & Server Action

The Server Action persists the updated array to the database and returns the finalized list:

```typescript
// app/actions/line-items.ts
'use server';

import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  isOptimistic: z.boolean().optional(),
});

export type LineItem = z.infer<typeof ItemSchema>;

export async function saveLineItemsAction(
  items: LineItem[]
): Promise<{ success: boolean; data: LineItem[]; error?: string }> {
  try {
    // Simulate server latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Strip temporary optimistic flags before DB save
    const sanitizedItems = items.map(({ isOptimistic, ...rest }) => ({
      ...rest,
      id: rest.id.startsWith('temp-') ? crypto.randomUUID() : rest.id,
    }));

    // Example DB persist: await db.invoiceItems.set(sanitizedItems);

    return {
      success: true,
      data: sanitizedItems,
    };
  } catch (err: any) {
    return {
      success: false,
      data: items,
      error: err.message || 'Failed to save items',
    };
  }
}

```

---

### Step 2: Component with `useOptimistic` & `useFieldArray`

Manage the instant visual feedback with `useOptimistic` and wire row modifications through `startTransition`:

```tsx
// app/components/OptimisticItemManager.tsx
'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { saveLineItemsAction, type LineItem } from '@/app/actions/line-items';

type OptimisticAction =
  | { type: 'ADD'; item: LineItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE'; item: LineItem };

interface Props {
  initialItems: LineItem[];
}

export function OptimisticItemManager({ initialItems }: Props) {
  const [serverItems, setServerItems] = useState<LineItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  // 1. React Hook Form setup
  const { register, control, reset } = useForm<{ items: LineItem[] }>({
    defaultValues: { items: initialItems },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'items',
    keyName: '_rhfId',
  });

  // 2. React 19 useOptimistic Reducer
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    serverItems,
    (current: LineItem[], action: OptimisticAction): LineItem[] => {
      switch (action.type) {
        case 'ADD':
          return [...current, { ...action.item, isOptimistic: true }];
        case 'REMOVE':
          return current.filter((item) => item.id !== action.id);
        case 'UPDATE':
          return current.map((item) =>
            item.id === action.item.id ? { ...action.item, isOptimistic: true } : item
          );
        default:
          return current;
      }
    }
  );

  // 3. Optimistic Add Handler
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const amount = Number(formData.get('amount'));

    if (!name || isNaN(amount)) return;

    const newItem: LineItem = {
      id: `temp-${crypto.randomUUID()}`,
      name,
      amount,
    };

    e.currentTarget.reset();

    // Trigger instant optimistic update & background server action
    startTransition(async () => {
      setOptimisticItems({ type: 'ADD', item: newItem });

      const updatedPayload = [...serverItems, newItem];
      const res = await saveLineItemsAction(updatedPayload);

      if (res.success) {
        setServerItems(res.data);
        reset({ items: res.data });
      }
    });
  };

  // 4. Optimistic Remove Handler
  const handleRemoveItem = (id: string, index: number) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'REMOVE', id });

      const updatedPayload = serverItems.filter((item) => item.id !== id);
      const res = await saveLineItemsAction(updatedPayload);

      if (res.success) {
        setServerItems(res.data);
        reset({ items: res.data });
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-bold text-gray-900">Line Items</h2>
        {isPending && (
          <span className="text-xs text-amber-600 animate-pulse font-medium">
            Syncing changes with server...
          </span>
        )}
      </div>

      {/* Item List with Optimistic Feedback */}
      <ul className="divide-y border rounded-lg overflow-hidden">
        {optimisticItems.map((item, index) => (
          <li
            key={item.id}
            className={`p-3.5 flex justify-between items-center text-sm transition-opacity ${
              item.isOptimistic ? 'opacity-50 bg-amber-50/50' : 'bg-white'
            }`}
          >
            <div>
              <span className="font-medium text-gray-800">{item.name}</span>
              {item.isOptimistic && (
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                  (Saving...)
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-gray-700">${item.amount.toFixed(2)}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id, index)}
                disabled={isPending}
                className="text-xs text-gray-400 hover:text-red-600 disabled:opacity-30"
              >
                Delete
              </button>
            </div>
          </li>
        ))}

        {optimisticItems.length === 0 && (
          <li className="p-4 text-center text-xs text-gray-400">No items added yet.</li>
        )}
      </ul>

      {/* Quick Add Form */}
      <form onSubmit={handleAddItem} className="flex gap-2 items-end pt-2">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Item Name
          </label>
          <input
            name="name"
            placeholder="e.g. Design Consulting"
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="w-28">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
}

```

---

### Core Integration Principles

* **Dual-State Separation:** Render the UI from `optimisticItems` to reflect immediate user interactions, while keeping `serverItems` as the source of truth that only updates when the Server Action succeeds.
* **Synchronize RHF with `reset()`:** When the Server Action returns the confirmed list from the database, call `reset({ items: res.data })` to re-align React Hook Form's internal registration records without causing field desync.
* **Temporary Identifier Handling:** Use temporary IDs (`temp-${uuid}`) during optimistic addition. Strip or replace them with genuine database UUIDs on the server before completing the transaction.
* **Automatic Rollback:** If the Server Action throws an error or fails, `startTransition` finishes and `useOptimistic` automatically rolls back the UI to match `serverItems` without manual rollback logic.

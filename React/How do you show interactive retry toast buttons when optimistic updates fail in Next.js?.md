When an optimistic update fails in Next.js, the UI automatically rolls back via `useOptimistic`. Showing an interactive **Retry Toast** allows the user to re-trigger the failed mutation without re-typing their inputs or losing context.

The standard pattern pairs **`useOptimistic`**, a lightweight toast library (like `sonner`), and a **reusable action dispatcher** that encapsulates the payload for re-execution.

---

### Step 1: Define Schemas & Server Action

The Server Action performs the mutation, validates with Zod, and returns a structured status response:

```typescript
// app/actions/bookmarks.ts
'use server';

import { z } from 'zod';

const BookmarkSchema = z.object({
  id: z.string(),
  url: z.string().url('Please provide a valid URL'),
  title: z.string().min(2, 'Title is required'),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;

export type BookmarkActionResponse =
  | { success: true; data: Bookmark }
  | { success: false; error: string; payload: Bookmark };

export async function addBookmarkAction(
  bookmark: Bookmark
): Promise<BookmarkActionResponse> {
  const parsed = BookmarkSchema.safeParse(bookmark);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid bookmark',
      payload: bookmark,
    };
  }

  // Simulate network/server failure when URL contains 'fail'
  if (parsed.data.url.includes('fail')) {
    return {
      success: false,
      error: 'Network timeout: Failed to reach remote database.',
      payload: bookmark,
    };
  }

  // Artificial latency
  await new Promise((res) => setTimeout(res, 500));

  // Persist to DB: await db.bookmark.create({ data: parsed.data });
  return {
    success: true,
    data: parsed.data,
  };
}

```

---

### Step 2: Component with `useOptimistic` and Interactive Toast (`Sonner`)

Use `sonner` to display the error toast with an interactive `action` button that re-invokes the submission pipeline with the exact failed payload:

```tsx
// app/components/OptimisticBookmarkManager.tsx
'use client';

import { useState, useOptimistic, useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { addBookmarkAction, type Bookmark } from '@/app/actions/bookmarks';

interface Props {
  initialBookmarks: Bookmark[];
}

export function OptimisticBookmarkManager({ initialBookmarks }: Props) {
  const [serverBookmarks, setServerBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // 1. Optimistic Layer
  const [optimisticBookmarks, setOptimisticBookmarks] = useOptimistic(
    serverBookmarks,
    (current: Bookmark[], newBookmark: Bookmark) => [newBookmark, ...current]
  );

  // 2. Centralized Mutation & Retry Dispatcher
  const executeAddBookmark = (item: Bookmark) => {
    // Generate/preserve temporary ID
    const optimisticItem = {
      ...item,
      id: item.id.startsWith('temp-') ? item.id : `temp-${crypto.randomUUID()}`,
    };

    startTransition(async () => {
      // (a) Paint optimistic update immediately
      setOptimisticBookmarks(optimisticItem);

      // (b) Trigger Server Action
      const result = await addBookmarkAction(optimisticItem);

      if (result.success) {
        // Update server baseline on success
        setServerBookmarks((prev) => [result.data, ...prev]);
        toast.success(`Saved "${result.data.title}"`, { id: optimisticItem.id });
      } else {
        // (c) Rollback happens automatically. Display actionable Retry Toast:
        toast.error(`Failed to save: ${result.error}`, {
          id: optimisticItem.id, // Replace previous toast if retrying
          duration: 8000,
          action: {
            label: 'Retry',
            onClick: () => {
              // Re-dispatch with the exact same failed payload
              executeAddBookmark(result.payload);
            },
          },
        });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string)?.trim();
    const url = (formData.get('url') as string)?.trim();

    if (!title || !url) return;

    formRef.current?.reset();

    executeAddBookmark({
      id: `temp-${crypto.randomUUID()}`,
      title,
      url,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-base font-bold text-gray-900">Bookmarks</h2>
        {isPending && (
          <span className="text-xs text-amber-600 font-medium animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Saving...
          </span>
        )}
      </div>

      {/* Input Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded-lg border">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Site Title
          </label>
          <input
            name="title"
            placeholder="e.g. Next.js Documentation"
            className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            URL (include "fail" in URL to test error retry toast)
          </label>
          <input
            name="url"
            type="url"
            placeholder="https://example.com"
            className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Add Bookmark
        </button>
      </form>

      {/* Bookmark Feed */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Saved Links ({optimisticBookmarks.length})
        </h3>

        <ul className="divide-y border rounded-lg overflow-hidden">
          {optimisticBookmarks.map((b) => {
            const isOptimistic = b.id.startsWith('temp-');

            return (
              <li
                key={b.id}
                className={`p-3 text-sm flex justify-between items-center transition-opacity ${
                  isOptimistic ? 'opacity-50 bg-amber-50/40' : 'bg-white'
                }`}
              >
                <div className="truncate max-w-[260px]">
                  <p className="font-semibold text-gray-800 truncate">{b.title}</p>
                  <p className="text-xs text-blue-600 truncate">{b.url}</p>
                </div>

                {isOptimistic && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                    Saving...
                  </span>
                )}
              </li>
            );
          })}

          {optimisticBookmarks.length === 0 && (
            <li className="p-6 text-center text-xs text-gray-400">No bookmarks saved yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

```

---

### Step 3: Add the Global Toaster in Root Layout

Mount the `Toaster` from `sonner` in your root layout:

```tsx
// app/layout.tsx
import { Toaster } from 'sonner';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

```

---

### Architectural Highlights

* **Decoupled Execution Function:** Creating a dedicated `executeAddBookmark(item)` handler allows both the primary `<form>` submission and the toast's `action.onClick` retry callback to invoke the exact same execution flow.
* **Preserving Failed Payloads:** Returning `payload: bookmark` in the failure object ensures that retries run with the original parameters even after the form DOM input has been cleared.
* **Persistent Toast IDs (`id: optimisticItem.id`):** Using the optimistic item's temporary ID as the toast ID replaces existing toasts for that item rather than stacking duplicate error banners on successive retries.

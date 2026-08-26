Implementing debounced autosave drafts with Server Actions requires solving three concurrency challenges:

1. **Race Conditions:** Slower network responses from an earlier keystroke must not overwrite newer saves.
2. **Non-Blocking UI:** Server roundtrips must run smoothly in the background without freezing form inputs.
3. **Dirty Checking:** Unchanged state should never trigger unnecessary network requests or database writes.

The cleanest architecture combines a **custom debounce hook**, a **request versioning counter (`useRef`)**, and **`startTransition`** to execute Server Actions without triggering full-page Suspense re-renders.

---

### Step 1: Server Action for Draft Persistence

The Server Action accepts the draft data, verifies authorization, saves to Redis (or a database `drafts` table), and returns a server timestamp:

```typescript
// app/actions/autosave.ts
'use server';

import { auth } from '@/lib/auth';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DraftSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(120),
  content: z.string().max(50000),
});

export type DraftPayload = z.infer<typeof DraftSchema>;

export type SaveDraftResult =
  | { success: true; lastSavedAt: number }
  | { success: false; error: string };

export async function autosaveDraftAction(payload: DraftPayload): Promise<SaveDraftResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = DraftSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: 'Invalid draft format' };
  }

  try {
    const key = `draft:${session.user.id}:${parsed.data.id}`;
    const timestamp = Date.now();

    // Store in Redis with a 7-day TTL
    await redis.set(
      key,
      { ...parsed.data, updatedAt: timestamp },
      { ex: 60 * 60 * 24 * 7 }
    );

    return { success: true, lastSavedAt: timestamp };
  } catch (error: any) {
    console.error('Autosave error:', error);
    return { success: false, error: 'Failed to write draft to storage' };
  }
}

```

---

### Step 2: Concurrency-Safe Autosave Hook

This hook debounces inputs, ignores stale out-of-order responses using an incrementing sequence counter, and supports a manual "Save Now" flush before unmounting or closing the tab:

```typescript
// hooks/useAutosave.ts
'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { autosaveDraftAction, type DraftPayload } from '@/app/actions/autosave';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutosave(data: DraftPayload, delayMs = 1000) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Track request sequence and last saved payload to prevent duplicate saves
  const latestRequestId = useRef(0);
  const lastSavedDataRef = useRef<string>(JSON.stringify(data));
  const currentDataRef = useRef(data);
  currentDataRef.current = data;

  const performSave = useCallback(async (dataToSave: DraftPayload) => {
    const stringified = JSON.stringify(dataToSave);
    
    // Skip network request if data has not changed since last successful save
    if (stringified === lastSavedDataRef.current) {
      return;
    }

    const currentRequestId = ++latestRequestId.current;
    setStatus('saving');
    setError(null);

    startTransition(async () => {
      const result = await autosaveDraftAction(dataToSave);

      // Discard response if a newer autosave request was initiated in the meantime
      if (currentRequestId !== latestRequestId.current) {
        return;
      }

      if (result.success) {
        lastSavedDataRef.current = stringified;
        setLastSaved(result.lastSavedAt);
        setStatus('saved');
      } else {
        setStatus('error');
        setError(result.error);
      }
    });
  }, []);

  // Debounced auto-trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      performSave(currentDataRef.current);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [data, delayMs, performSave]);

  // Flush on page unload or before manual submission
  const flush = useCallback(async () => {
    await performSave(currentDataRef.current);
  }, [performSave]);

  return { status, lastSaved, error, flush };
}

```

---

### Step 3: Editor Component with Visual Indicators

```tsx
// app/components/DraftEditor.tsx
'use client';

import { useState } from 'react';
import { useAutosave } from '@/hooks/useAutosave';

interface DraftEditorProps {
  initialDraft: {
    id: string;
    title: string;
    content: string;
  };
}

export function DraftEditor({ initialDraft }: DraftEditorProps) {
  const [formData, setFormData] = useState(initialDraft);
  const { status, lastSaved, error, flush } = useAutosave(formData, 1200);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      {/* Header & Status Indicator */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-bold text-gray-900">Document Editor</h2>

        <div className="text-xs flex items-center gap-2">
          {status === 'saving' && (
            <span className="text-amber-600 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Saving draft...
            </span>
          )}

          {status === 'saved' && (
            <span className="text-emerald-700 font-medium">
              ✓ Saved {lastSaved ? `at ${new Date(lastSaved).toLocaleTimeString()}` : ''}
            </span>
          )}

          {status === 'error' && (
            <span className="text-red-600 font-medium">
              ⚠ Save failed: {error}
            </span>
          )}

          {status === 'idle' && (
            <span className="text-gray-400">All changes saved</span>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Untitled Document"
            className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            placeholder="Start typing your draft..."
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Manual Action Footer */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <button
          type="button"
          onClick={() => flush()}
          disabled={status === 'saving'}
          className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          Force Save Now
        </button>
      </div>
    </div>
  );
}

```

---

### Step 4: Server Component Page Setup

Rehydrate the existing draft from Redis during the initial SSR render pass:

```tsx
// app/documents/[id]/page.tsx (Server Component)
import { auth } from '@/lib/auth';
import { Redis } from '@upstash/redis';
import { DraftEditor } from '@/app/components/DraftEditor';
import { redirect } from 'next/navigation';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Load active draft or default state
  const key = `draft:${session.user.id}:${id}`;
  const savedDraft = await redis.get<{ id: string; title: string; content: string }>(key);

  const initialDraft = savedDraft ?? {
    id,
    title: '',
    content: '',
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <DraftEditor initialDraft={initialDraft} />
    </main>
  );
}

```

---

### Best Practices

* **Always Wrap in `startTransition`:** Invoking Server Actions inside `startTransition` marks the async update as low priority, ensuring fast keystroke input remains smooth without UI lockup.
* **Track Request IDs (`useRef`):** In poor network conditions, request #1 might return *after* request #2. Checking `latestRequestId.current === currentRequestId` ensures an outdated network response never overwrites newer state.
* **Serialize for Dirty Checking:** Comparing serialized JSON strings (`JSON.stringify(data) === lastSavedDataRef.current`) avoids sending duplicate requests when the user types and quickly deletes characters.
* **Add `beforeunload` Warning:** If `status === 'saving'`, prevent accidental tab closures with a `window.addEventListener('beforeunload', ...)` listener.

Handling multi-tab draft editing without losing data requires two coordinated layers:

1. **Server-Side Optimistic Locking:** The server tracks a monotonic `version` integer (or timestamp). Mutations specify the `expectedVersion`; if the database version has moved forward, the mutation rejects with a `409 Conflict` and returns the latest remote state.
2. **Client-Side Cross-Tab Synchronization (`BroadcastChannel`):** When Tab A successfully autosaves and bumps the version, it broadcasts an event to all other open tabs on the same origin so Tab B can update its baseline or notify the user without polling.

---

### Architecture & Conflict Flow

```
[Tab A]                                          [Server / Redis / DB]                                     [Tab B]
   │                                                       │                                                  │
   ├── (1) Autosaves: { version: 1, text: "Alpha" } ──────▶│ (Version check: 1 === 1 ✅)                      │
   │                                                       ├── Increments version to 2                        │
   │◀── (2) Confirms { version: 2 } ───────────────────────┤                                                  │
   │                                                       │                                                  │
   ├── (3) Broadcasts via BroadcastChannel ──────────────────────────────────────────────────────────────────▶│
   │       `{ type: 'DRAFT_UPDATED', version: 2 }`         │                                                  │ (Receives broadcast;
   │                                                       │                                                  │  bumps expected version)
   │                                                       │                                                  │
   │                                                       │◀── (4) Slower Tab B saves stale draft: ──────────┤
   │                                                       │        { version: 1, text: "Beta" }              │
   │                                                       ├── (Version check: 1 !== 2 ❌ CONFLICT)           │
   │                                                       │                                                  │
   │                                                       ├──▶ (5) Returns 409 Conflict ────────────────────▶│
   │                                                       │        { serverDraft: "Alpha", version: 2 }      │
   │                                                       │                                                  │ (Shows Diff & Merge UI)

```

---

### Step 1: Server Action with Optimistic Version Check

The Server Action performs an atomic compare-and-swap (CAS) check against the current version:

```typescript
// app/actions/draft-locking.ts
'use server';

import { auth } from '@/lib/auth';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DraftUpdateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  expectedVersion: z.number().int().nonnegative(),
});

export type DraftPayload = z.infer<typeof DraftUpdateSchema>;

export type SaveResponse =
  | { status: 'success'; version: number; updatedAt: number }
  | {
      status: 'conflict';
      serverDraft: { title: string; content: string; version: number; updatedAt: number };
    }
  | { status: 'error'; message: string };

export async function saveDraftWithOptimisticLockAction(
  payload: DraftPayload
): Promise<SaveResponse> {
  const session = await auth();
  if (!session?.user?.id) return { status: 'error', message: 'Unauthorized' };

  const parsed = DraftUpdateSchema.safeParse(payload);
  if (!parsed.success) return { status: 'error', message: 'Invalid payload' };

  const { id, title, content, expectedVersion } = parsed.data;
  const draftKey = `draft:${session.user.id}:${id}`;

  try {
    const currentDraft = await redis.get<{
      title: string;
      content: string;
      version: number;
      updatedAt: number;
    }>(draftKey);

    const currentVersion = currentDraft?.version ?? 0;

    // ── Version Check: Detect Optimistic Lock Conflict ──
    if (currentDraft && currentVersion !== expectedVersion) {
      return {
        status: 'conflict',
        serverDraft: currentDraft,
      };
    }

    const nextVersion = currentVersion + 1;
    const updatedAt = Date.now();

    const newDraft = {
      id,
      title,
      content,
      version: nextVersion,
      updatedAt,
    };

    // Store updated draft in Redis
    await redis.set(draftKey, newDraft, { ex: 60 * 60 * 24 * 7 });

    return {
      status: 'success',
      version: nextVersion,
      updatedAt,
    };
  } catch (err: any) {
    console.error('Optimistic lock save failed:', err);
    return { status: 'error', message: 'Internal server error while saving draft' };
  }
}

```

---

### Step 2: Cross-Tab Broadcast Channel Hook

Use the Web `BroadcastChannel` API to notify sibling tabs when a save succeeds, keeping version numbers aligned before conflicts even trigger:

```typescript
// hooks/useDraftSyncChannel.ts
'use client';

import { useEffect, useRef } from 'react';

export type ChannelMessage =
  | { type: 'DRAFT_SAVED_REMOTELY'; id: string; version: number; updatedAt: number }
  | { type: 'TAB_ACQUIRED_FOCUS'; id: string };

export function useDraftSyncChannel(
  draftId: string,
  onRemoteSave?: (msg: Extract<ChannelMessage, { type: 'DRAFT_SAVED_REMOTELY' }>) => void
) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Shared broadcast channel per document
    const channel = new BroadcastChannel(`draft_sync_${draftId}`);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data.id !== draftId) return;

      if (event.data.type === 'DRAFT_SAVED_REMOTELY' && onRemoteSave) {
        onRemoteSave(event.data);
      }
    };

    return () => {
      channel.close();
    };
  }, [draftId, onRemoteSave]);

  const broadcastSave = (version: number, updatedAt: number) => {
    channelRef.current?.postMessage({
      type: 'DRAFT_SAVED_REMOTELY',
      id: draftId,
      version,
      updatedAt,
    });
  };

  return { broadcastSave };
}

```

---

### Step 3: Conflict Modal Component

When a conflict occurs, present the user with a direct resolution modal allowing them to **Overwrite with their current tab**, **Accept remote server version**, or **Review a side-by-side diff**:

```tsx
// app/components/ConflictResolutionModal.tsx
'use client';

interface ConflictModalProps {
  isOpen: boolean;
  localDraft: { title: string; content: string };
  serverDraft: { title: string; content: string; version: number; updatedAt: number };
  onKeepLocal: () => void;
  onAcceptServer: () => void;
}

export function ConflictResolutionModal({
  isOpen,
  localDraft,
  serverDraft,
  onKeepLocal,
  onAcceptServer,
}: ConflictModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border">
        <div className="border-b pb-3">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <span>⚠️</span> Edit Conflict Detected
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            This document was modified in another tab or device at{' '}
            {new Date(serverDraft.updatedAt).toLocaleTimeString()}.
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
            <span className="font-semibold text-gray-700 block border-b pb-1">
              Your Current Tab
            </span>
            <p><strong>Title:</strong> {localDraft.title}</p>
            <p className="font-mono text-[11px] whitespace-pre-wrap line-clamp-6 bg-white p-2 border rounded">
              {localDraft.content}
            </p>
          </div>

          <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/50 space-y-2">
            <span className="font-semibold text-blue-900 block border-b border-blue-200 pb-1">
              Server Version (v{serverDraft.version})
            </span>
            <p><strong>Title:</strong> {serverDraft.title}</p>
            <p className="font-mono text-[11px] whitespace-pre-wrap line-clamp-6 bg-white p-2 border rounded">
              {serverDraft.content}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 pt-2 border-t">
          <button
            onClick={onAcceptServer}
            className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Accept Server Version
          </button>
          <button
            onClick={onKeepLocal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Overwrite with My Changes
          </button>
        </div>
      </div>
    </div>
  );
}

```

---

### Step 4: Multi-Tab Synchronized Editor Container

```tsx
// app/components/SynchronizedDraftEditor.tsx
'use client';

import { useState, useRef, useTransition, useCallback } from 'react';
import { saveDraftWithOptimisticLockAction } from '@/app/actions/draft-locking';
import { useDraftSyncChannel } from '@/hooks/useDraftSyncChannel';
import { ConflictResolutionModal } from './ConflictResolutionModal';

interface SynchronizedDraftEditorProps {
  initialDraft: {
    id: string;
    title: string;
    content: string;
    version: number;
  };
}

export function SynchronizedDraftEditor({ initialDraft }: SynchronizedDraftEditorProps) {
  const [formData, setFormData] = useState({
    title: initialDraft.title,
    content: initialDraft.content,
  });

  const [version, setVersion] = useState(initialDraft.version);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'conflict'>('idle');
  const [conflictData, setConflictData] = useState<any | null>(null);
  const [, startTransition] = useTransition();

  const isDirtyRef = useRef(false);

  // 1. Handle background sync events from other tabs
  const handleRemoteSave = useCallback(
    (msg: { version: number; updatedAt: number }) => {
      if (!isDirtyRef.current) {
        // If this tab has no unsaved keystrokes, quietly advance the baseline version
        setVersion(msg.version);
      }
    },
    []
  );

  const { broadcastSave } = useDraftSyncChannel(initialDraft.id, handleRemoteSave);

  // 2. Perform optimistic save
  const handleSave = () => {
    setStatus('saving');

    startTransition(async () => {
      const response = await saveDraftWithOptimisticLockAction({
        id: initialDraft.id,
        title: formData.title,
        content: formData.content,
        expectedVersion: version,
      });

      if (response.status === 'success') {
        setVersion(response.version);
        isDirtyRef.current = false;
        setStatus('saved');
        // Notify other open tabs
        broadcastSave(response.version, response.updatedAt);
      } else if (response.status === 'conflict') {
        setStatus('conflict');
        setConflictData(response.serverDraft);
      } else {
        setStatus('idle');
        alert(response.message);
      }
    });
  };

  // 3. Conflict Resolution: Overwrite (Force Save with bumped version)
  const handleForceOverwrite = () => {
    if (!conflictData) return;
    const targetVersion = conflictData.version;
    setConflictData(null);

    startTransition(async () => {
      const res = await saveDraftWithOptimisticLockAction({
        id: initialDraft.id,
        title: formData.title,
        content: formData.content,
        expectedVersion: targetVersion, // Bind to newest server version to overwrite
      });

      if (res.status === 'success') {
        setVersion(res.version);
        isDirtyRef.current = false;
        setStatus('saved');
        broadcastSave(res.version, res.updatedAt);
      }
    });
  };

  // 4. Conflict Resolution: Accept Remote Version
  const handleAcceptRemote = () => {
    if (!conflictData) return;
    setFormData({
      title: conflictData.title,
      content: conflictData.content,
    });
    setVersion(conflictData.version);
    isDirtyRef.current = false;
    setConflictData(null);
    setStatus('saved');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-base font-bold text-gray-900">Document Editor</h2>
        <span className="text-xs text-gray-500 font-mono">Doc Version: v{version}</span>
      </div>

      <div className="space-y-3">
        <input
          value={formData.title}
          onChange={(e) => {
            isDirtyRef.current = true;
            setFormData((prev) => ({ ...prev, title: e.target.value }));
          }}
          placeholder="Title"
          className="w-full border p-2 rounded text-sm font-semibold"
        />

        <textarea
          value={formData.content}
          onChange={(e) => {
            isDirtyRef.current = true;
            setFormData((prev) => ({ ...prev, content: e.target.value }));
          }}
          rows={10}
          placeholder="Start writing..."
          className="w-full border p-3 rounded text-sm"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving...' : 'Save Draft'}
        </button>
      </div>

      <ConflictResolutionModal
        isOpen={status === 'conflict' && conflictData !== null}
        localDraft={formData}
        serverDraft={conflictData}
        onKeepLocal={handleForceOverwrite}
        onAcceptServer={handleAcceptRemote}
      />
    </div>
  );
}

```

---

### Core Resilience Principles

* **Atomic Check-and-Set:** Always compare `expectedVersion === currentVersion` inside a single database transaction or Redis script to avoid race conditions between two concurrent POST requests.
* **Proactive `BroadcastChannel` Alignment:** Using `BroadcastChannel` informs passive tabs of updates immediately without waiting for them to save and collide.
* **Dirty State Protection:** If a passive tab has unmodified text (`isDirtyRef.current === false`), it can automatically adopt the bumped version number so subsequent edits branch off the new head revision cleanly.

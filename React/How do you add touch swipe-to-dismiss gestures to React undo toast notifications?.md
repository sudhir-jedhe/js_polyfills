To add touch and mouse swipe-to-dismiss gestures to undo toast notifications, use standard **Pointer Events** (`onPointerDown`, `onPointerMove`, `onPointerUp`).

Using Pointer Events handles both touch screens and mouse drag interactions with a single API, while updating `transform: translateX` directly on the DOM ref ensures 60/120 FPS performance without React re-render lag.

---

### Step-by-Step Implementation

#### 1. The Swipeable Undo Toast Item Component

```tsx
// app/components/SwipeableUndoToast.tsx
'use client';

import React, { useRef, useState } from 'react';

interface SwipeableUndoToastProps {
  id: string;
  title: string;
  durationMs: number;
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void; // Immediately commits deletion
}

const DISMISS_THRESHOLD_PX = 100; // Drag distance required to dismiss

export function SwipeableUndoToast({
  id,
  title,
  durationMs,
  onUndo,
  onDismiss,
}: SwipeableUndoToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const currentDeltaXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // 1. Pointer Down (Touch / Click start)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks directly on the "Undo" button
    if ((e.target as HTMLElement).closest('button')) return;

    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    currentDeltaXRef.current = 0;

    // Capture pointer to track dragging outside toast boundaries
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (toastRef.current) {
      toastRef.current.style.transition = 'none'; // Instant tracking while dragging
    }
  };

  // 2. Pointer Move (Dragging)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || startXRef.current === null) return;

    const deltaX = e.clientX - startXRef.current;
    
    // Allow swiping only to the right (positive deltaX)
    if (deltaX > 0 && toastRef.current) {
      currentDeltaXRef.current = deltaX;
      // Opacity fades as user drags further
      const opacity = Math.max(0, 1 - deltaX / 250);
      toastRef.current.style.transform = `translateX(${deltaX}px)`;
      toastRef.current.style.opacity = `${opacity}`;
    }
  };

  // 3. Pointer Up / Cancel (Release)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (toastRef.current) {
      toastRef.current.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';

      // Check if threshold exceeded
      if (currentDeltaXRef.current >= DISMISS_THRESHOLD_PX) {
        setIsDismissing(true);
        toastRef.current.style.transform = 'translateX(120%)';
        toastRef.current.style.opacity = '0';

        // Wait for exit transition then trigger immediate commit
        setTimeout(() => {
          onDismiss(id);
        }, 200);
      } else {
        // Snap back to resting position
        toastRef.current.style.transform = 'translateX(0px)';
        toastRef.current.style.opacity = '1';
      }
    }

    startXRef.current = null;
    currentDeltaXRef.current = 0;
  };

  return (
    <div
      ref={toastRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative overflow-hidden flex items-center justify-between gap-4 bg-gray-950 text-white px-4 py-3 rounded-lg shadow-2xl text-sm min-w-[300px] border border-gray-800 touch-none select-none cursor-grab active:cursor-grabbing ${
        isDismissing ? 'pointer-events-none' : ''
      }`}
    >
      <div className="flex-1 truncate">
        <span>Deleted </span>
        <strong className="text-gray-200">{title}</strong>
      </div>

      <button
        type="button"
        onClick={() => onUndo(id)}
        className="text-amber-400 hover:text-amber-300 font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded hover:bg-white/10 transition z-10"
      >
        Undo
      </button>

      {/* Synchronized Animated Progress Bar */}
      <div
        className="toast-progress-bar absolute bottom-0 left-0 right-0 h-1 bg-amber-400"
        style={{
          animationDuration: `${durationMs}ms`,
        }}
      />
    </div>
  );
}

```

---

#### 2. CSS Keyframes for Progress Bar & Toast Entry

```css
/* Add to your global stylesheet */

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-progress-bar {
  transform-origin: left;
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in-right 0.25s ease-out forwards;
}

```

---

#### 3. Integrating with the Toast Container Stack

Pass `onDismiss` down so that swiping the toast instantly commits the deletion to the server without waiting for the remainder of the countdown timer:

```tsx
// app/components/ToastContainer.tsx
'use client';

import { SwipeableUndoToast } from './SwipeableUndoToast';

interface ToastData {
  id: string;
  title: string;
}

interface ToastContainerProps {
  toasts: ToastData[];
  durationMs: number;
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void; // Immediate commit
}

export function ToastContainer({
  toasts,
  durationMs,
  onUndo,
  onDismiss,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-2.5 z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="animate-slide-in">
          <SwipeableUndoToast
            id={toast.id}
            title={toast.title}
            durationMs={durationMs}
            onUndo={onUndo}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
}

```

---

### Core Performance & UX Principles

* **`touch-action: none` (or `touch-none` in Tailwind):** Prevents default browser scrolling/gestures from conflicting with the horizontal drag on mobile devices.
* **Direct DOM Manipulation via `ref`:** Updating `transform` directly inside `handlePointerMove` bypasses React's render loop entirely during the drag, avoiding dropped frames.
* **`setPointerCapture`:** Guarantees that dragging remains tracked even if the user's cursor or finger moves outside the bounds of the toast element before release.
* **Instant Immediate Commit on Dismiss:** When dismissed via swipe, call `clearTimeout` on the pending timer and invoke the Server Action immediately so the database mutation isn't delayed.

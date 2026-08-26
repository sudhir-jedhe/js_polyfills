To add a synchronized progress countdown bar to individual undo toasts without triggering continuous React re-renders, use **GPU-accelerated CSS keyframe animations** keyed to the exact timer duration.

By delegating the frame-by-frame animation to the browser's compositor thread, React only manages the initial mounting and unmounting of each toast.

---

### 1. Add the CSS Keyframe Animation

Define a keyframe rule that animates `transform: scaleX(...)` from `1` (100% width) to `0` (0% width). Using `transform` ensures smooth 60/120 FPS rendering without triggering DOM reflows or repaints.

```css
/* styles/toast.css or inside your Tailwind/global stylesheet */

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

```

---

### 2. The Isolated Toast Item Component

Extract the individual toast into its own component. Pass the duration directly via an inline CSS variable (`animationDuration`) so each toast runs independently.

```tsx
// app/components/UndoToastItem.tsx
'use client';

import React from 'react';

interface UndoToastItemProps {
  id: string;
  title: string;
  durationMs: number;
  onUndo: (id: string) => void;
}

export function UndoToastItem({
  id,
  title,
  durationMs,
  onUndo,
}: UndoToastItemProps) {
  return (
    <div className="relative overflow-hidden flex items-center justify-between gap-4 bg-gray-950 text-white px-4 py-3 rounded-lg shadow-2xl text-sm min-w-[300px] border border-gray-800">
      <div className="flex-1 truncate">
        <span>Deleted </span>
        <strong className="text-gray-200">{title}</strong>
      </div>

      <button
        onClick={() => onUndo(id)}
        className="text-amber-400 hover:text-amber-300 font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded hover:bg-white/10 transition z-10"
      >
        Undo
      </button>

      {/* Synchronized CSS Progress Bar */}
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

### 3. Integrate into the Toast Container Stack

Render the toast list, passing the exact matching duration constant (`GRACE_PERIOD_MS`) to both the JavaScript `setTimeout` and the CSS progress bar:

```tsx
// app/components/ToastStack.tsx
'use client';

import { UndoToastItem } from './UndoToastItem';

export interface ToastData {
  id: string;
  title: string;
}

interface ToastStackProps {
  toasts: ToastData[];
  durationMs: number;
  onUndo: (id: string) => void;
}

export function ToastStack({ toasts, durationMs, onUndo }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-2.5 z-50 pointer-events-auto">
      {toasts.map((toast) => (
        <UndoToastItem
          key={toast.id}
          id={toast.id}
          title={toast.title}
          durationMs={durationMs}
          onUndo={onUndo}
        />
      ))}
    </div>
  );
}

```

---

### 4. Optional: Pause on Hover via CSS

To let users pause the countdown by hovering over the toast, use `animation-play-state: paused` alongside pausing the JavaScript timer:

```css
/* Pause the progress bar when the user hovers over the toast container */
.group:hover .toast-progress-bar {
  animation-play-state: paused;
}

```

```tsx
// Pausing the JS timer logic in the parent component
const handleMouseEnter = (itemId: string) => {
  // Clear the existing timeout and calculate remaining time
  const timer = timersRef.current.get(itemId);
  if (timer) clearTimeout(timer);
};

const handleMouseLeave = (itemId: string, remainingTimeMs: number) => {
  // Resume the timer with the remaining duration
  const newTimer = setTimeout(() => commitPermanentDeletion(itemId), remainingTimeMs);
  timersRef.current.set(itemId, newTimer);
};

```

---

### Why CSS Animations Outperform `setInterval` State Ticks

| Metric                   | `setInterval` / `useState` (Tick every 16ms)      | CSS `transform: scaleX()`                    |
| ------------------------ | ------------------------------------------------- | -------------------------------------------- |
| **React Re-renders**     | 60+ re-renders per second per active toast        | **0 re-renders** during the entire countdown |
| **Thread Execution**     | Blocks and contends on the Main JS Thread         | **Compositor / GPU Thread**                  |
| **Animation Smoothness** | Stutters during CPU-heavy React state transitions | **Maintains 60/120 FPS smoothly**            |
| **Battery & CPU Usage**  | High CPU overhead                                 | **Negligible resource footprint**            |

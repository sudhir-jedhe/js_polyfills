Interactive notifications with action buttons (like an "Undo" toast) present a specific accessibility challenge: **`role="status"` or `aria-live="polite"` alone announces the message to screen readers, but it does NOT provide an easy keyboard navigation mechanism to focus the action button before it disappears.**

To make stacked undo toasts fully accessible under WCAG guidelines:

1. Use an **`aria-live="polite"`** container so updates do not aggressively cut off screen reader speech.
2. Provide a **global keyboard shortcut** (e.g., `Alt + T` or `Ctrl + Shift + U`) that jumps focus directly to the latest undo toast.
3. Manage **focus traps and keyboard navigation (`ArrowUp`, `ArrowDown`, `Escape`)** across the toast stack.
4. Auto-pause the countdown timer whenever a toast or any of its children receives keyboard focus.

---

### Accessible Architecture Breakdown

```
[ARIA Live Container] (aria-live="polite", aria-atomic="false")
    │
    └── [Toast Item 1] (role="status" or role="log")
    │       ├── Text: "Deleted Project Alpha" (read aloud)
    │       └── <button aria-label="Undo deletion of Project Alpha">
    │
    └── [Toast Item 2 (Active/Top)] ◀─── (User presses `Alt + T` / `Escape`)
            ├── Auto-timer pauses while focus is inside
            └── [ArrowDown / ArrowUp] navigates between stacked toasts

```

---

### Step-by-Step Implementation

#### 1. The Accessible Toast Item

Pause the timer on focus (`onFocus` / `onBlur`) and ensure descriptive `aria-label` tags on all interactive elements:

```tsx
// components/AccessibleUndoToastItem.tsx
'use client';

import React, { useRef, useEffect } from 'react';

interface ToastItemProps {
  id: string;
  title: string;
  durationMs: number;
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

export function AccessibleUndoToastItem({
  id,
  title,
  durationMs,
  onUndo,
  onDismiss,
  onPause,
  onResume,
}: ToastItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  // Handle individual keyboard actions within a toast
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onDismiss(id); // Dismisses toast on Escape
    }
  };

  return (
    <div
      ref={itemRef}
      role="status"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => onPause(id)}
      onBlur={() => onResume(id)}
      onMouseEnter={() => onPause(id)}
      onMouseLeave={() => onResume(id)}
      className="group relative overflow-hidden flex items-center justify-between gap-4 bg-gray-950 text-white px-4 py-3 rounded-lg shadow-2xl text-sm min-w-[320px] border border-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
      <div className="flex-1 truncate">
        <span>Deleted </span>
        <strong className="text-gray-100">{title}</strong>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUndo(id)}
          aria-label={`Undo deletion of ${title}`}
          className="text-amber-400 hover:text-amber-300 font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400"
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label={`Dismiss notification for ${title}`}
          className="text-gray-400 hover:text-gray-200 text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      {/* Progress Bar (Pauses when group is focused or hovered) */}
      <div
        className="toast-progress-bar absolute bottom-0 left-0 right-0 h-1 bg-amber-400 group-focus:paused group-hover:paused"
        style={{ animationDuration: `${durationMs}ms` }}
      />
    </div>
  );
}

```

---

#### 2. The Keyboard-Navigable Stack & Live Region

Provide keyboard shortcuts to jump to the toast container, and handle arrow key navigation through stacked notifications:

```tsx
// components/AccessibleToastContainer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { AccessibleUndoToastItem } from './AccessibleUndoToastItem';

export interface ToastData {
  id: string;
  title: string;
}

interface AccessibleToastContainerProps {
  toasts: ToastData[];
  durationMs: number;
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

export function AccessibleToastContainer({
  toasts,
  durationMs,
  onUndo,
  onDismiss,
  onPause,
  onResume,
}: AccessibleToastContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: Alt + T jumps focus directly into the newest toast
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        if (toasts.length > 0 && containerRef.current) {
          e.preventDefault();
          const firstInteractive = containerRef.current.querySelector<HTMLElement>(
            'button, [tabindex="0"]'
          );
          firstInteractive?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [toasts]);

  // Arrow Key Navigation between stacked toasts
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const focusableItems = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>('[role="status"]') || []
      );
      const currentIndex = focusableItems.indexOf(document.activeElement as HTMLElement);

      if (currentIndex === -1) return;

      if (e.key === 'ArrowDown') {
        const next = focusableItems[(currentIndex + 1) % focusableItems.length];
        next?.focus();
      } else {
        const prev = focusableItems[(currentIndex - 1 + focusableItems.length) % focusableItems.length];
        prev?.focus();
      }
    }
  };

  if (toasts.length === 0) return null;

  return (
    <section
      ref={containerRef}
      aria-label="Notifications (Press Alt + T to focus)"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      onKeyDown={handleContainerKeyDown}
      className="fixed bottom-6 right-6 flex flex-col-reverse gap-2.5 z-50 pointer-events-auto"
    >
      {toasts.map((toast) => (
        <AccessibleUndoToastItem
          key={toast.id}
          id={toast.id}
          title={toast.title}
          durationMs={durationMs}
          onUndo={onUndo}
          onDismiss={onDismiss}
          onPause={onPause}
          onResume={onResume}
        />
      ))}
    </section>
  );
}

```

---

### Essential ARIA & WCAG Rules for Toasts

* **`aria-live="polite"` over `"assertive"`:** `"assertive"` interrupts the screen reader mid-sentence. `"polite"` waits until the current speech queue finishes.
* **`aria-atomic="false"`:** Tells assistive technologies to announce only the new toast added to the stack, rather than re-reading the entire list of active toasts.
* **Pause on Focus / Hover (WCAG 2.2.1 Timing Adjustable):** If content has a time limit, users must be allowed to pause, extend, or adjust the duration. Tying `onFocus` to timer suspension satisfies this requirement.
* **Explicit `aria-label` on Action Buttons:** Never write just `"Undo"`. Use `"Undo deletion of Project Alpha"` so screen reader users in browse mode understand the exact context of the action.

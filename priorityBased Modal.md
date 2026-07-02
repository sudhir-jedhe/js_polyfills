**Priority-Based Modals** is a very common **Frontend System Design** question, especially for React Lead/Frontend Architect interviews.

## Problem

Multiple modals can be triggered simultaneously:

```text
1. Session Expired Modal       Priority = 100
2. Security Warning Modal      Priority = 90
3. App Update Modal            Priority = 50
4. Survey Modal                Priority = 20
```

If all arrive together:

```text
✅ Session Expired
✅ Security Warning
✅ App Update
✅ Survey
```

Only the highest-priority modal should be shown first.

***

# High-Level Design

```text
                    Modal Requests
                           |
                           ▼
                ┌─────────────────┐
                │ Modal Manager   │
                └─────────────────┘
                           |
                 Priority Queue
                           |
                           ▼
                  Current Modal
                           |
                           ▼
                     React Portal
```

***

# Modal Configuration

```ts
export interface ModalConfig {
  id: string;
  component: React.ReactNode;
  priority: number;
  dismissible?: boolean;
}
```

Example:

```ts
{
  id: "session-expired",
  priority: 100,
  component: <SessionExpiredModal />
}
```

***

# Modal Manager Context

```tsx
import {
  createContext,
  useContext,
  useState
} from "react";

interface ModalConfig {
  id: string;
  component: React.ReactNode;
  priority: number;
}

interface ModalContextType {
  showModal: (
    modal: ModalConfig
  ) => void;

  closeModal: () => void;
}

const ModalContext =
  createContext<ModalContextType>(
    {} as ModalContextType
  );

export const useModal = () =>
  useContext(ModalContext);
```

***

# Priority Queue Logic

```tsx
export function ModalProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] =
    useState<ModalConfig[]>([]);

  const [activeModal, setActiveModal] =
    useState<ModalConfig | null>(
      null
    );

  const showModal = (
    modal: ModalConfig
  ) => {
    setQueue(prev => {
      const updated = [
        ...prev,
        modal
      ];

      updated.sort(
        (a, b) =>
          b.priority - a.priority
      );

      return updated;
    });
  };

  const closeModal = () => {
    setQueue(prev => {
      const [
        current,
        ...remaining
      ] = prev;

      setActiveModal(
        remaining[0] || null
      );

      return remaining;
    });
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        closeModal
      }}
    >
      {children}

      {queue.length > 0 && (
        <div className="modal">
          {queue[0].component}
        </div>
      )}
    </ModalContext.Provider>
  );
}
```

***

# Usage

```tsx
const { showModal } = useModal();

showModal({
  id: "survey",
  priority: 10,
  component: <SurveyModal />
});

showModal({
  id: "security",
  priority: 90,
  component: (
    <SecurityAlertModal />
  )
});

showModal({
  id: "session",
  priority: 100,
  component: (
    <SessionExpiredModal />
  )
});
```

Display order:

```text
1. Session Expired
2. Security Alert
3. Survey
```

***

# Better Solution: Binary Heap

Sorting every insertion:

```ts
O(n log n)
```

Use a Max Heap:

```ts
Insert  -> O(log n)
Remove  -> O(log n)
Peek    -> O(1)
```

***

# Priority Queue Class

```ts
class PriorityQueue {
  private heap: ModalConfig[] = [];

  enqueue(item: ModalConfig) {
    this.heap.push(item);

    this.heap.sort(
      (a, b) =>
        b.priority - a.priority
    );
  }

  dequeue() {
    return this.heap.shift();
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
```

In production use a proper binary heap implementation.

***

# Prevent Duplicate Modals

```ts
showModal({
  id: "session-expired",
  ...
});
```

Before inserting:

```ts
if (
  queue.some(
    m => m.id === modal.id
  )
) {
  return;
}
```

***

# Modal Preemption

Critical modal arrives while another modal is open:

```text
User sees:

Survey Modal
```

Then:

```text
Session Expired
```

Priority:

```text
Survey = 10
Session Expired = 100
```

Replace immediately.

```ts
if (
  newModal.priority >
  currentModal.priority
) {
  pushCurrentToQueue();

  showNewModal();
}
```

***

# Modal Categories

```ts
enum ModalType {
  CRITICAL,
  WARNING,
  INFO
}
```

Priority mapping:

```ts
CRITICAL = 100
WARNING  = 50
INFO     = 10
```

Usage:

```ts
showModal({
  type: ModalType.CRITICAL
});
```

***

# React Portal Support

Always render modals through a portal.

```tsx
return createPortal(
  <Modal />,
  document.body
);
```

Benefits:

* Correct z-index layering
* Escapes parent overflow
* Better accessibility

***

# Accessibility

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

Support:

```text
✅ ESC close
✅ Focus trap
✅ Screen readers
✅ Keyboard navigation
```

***

# Production-Level Modal Manager API

```tsx
showModal({
  id: "security-alert",

  priority: 100,

  component:
    SecurityAlertModal,

  props: {},

  dismissible: false,

  persistent: true,

  onClose() {}
});
```

***

# Interview Discussion Points

### Naive Solution

```text
Array + sort
```

Complexity:

```text
Insert = O(n log n)
```

***

### Optimised Solution

```text
Priority Queue (Max Heap)
```

Complexity:

```text
Insert = O(log n)
Remove = O(log n)
Peek = O(1)
```

***

### Enterprise Considerations

* React Context for global modal state
* Priority Queue / Binary Heap
* Portal rendering
* Focus management
* Duplicate prevention
* Modal preemption
* Modal stacking
* Analytics tracking
* Lazy-loaded modal components

### Architecture

```text
Feature Modules
       │
       ▼
showModal()
       │
       ▼
Priority Modal Manager
       │
       ▼
Max Heap Queue
       │
       ▼
React Portal
       │
       ▼
Visible Modal
```

This is the **Senior Frontend Architect** approach typically expected in React system-design interviews at large-scale companies.

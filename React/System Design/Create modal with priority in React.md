# Modal with Priority in React

## Frontend System Design + Complete Interview-Ready Code

A **modal with priority** is a common **Senior React interview question**.

Used in:

```txt
Chat Notifications
Session Expiry
Payment Failure
System Alerts
Cookie Consents
Version Update Popups
Error Dialogs
Toast/Modal Queues
```

Interviewers ask this because it tests:

✅ State management

✅ Queueing logic

✅ Priority ordering

✅ Async event handling

✅ Reusable component design

✅ Accessibility

✅ Portal usage

✅ Global service (Modal Manager)

---

# 1. Requirements

## Functional

✅ Show one modal at a time

✅ Multiple modals may open simultaneously

✅ Handle **priority-based** ordering

✅ Close modal → next highest-priority modal opens

✅ Cancel modal

✅ Escape / Backdrop close

✅ Accessible (aria roles, focus trap)

✅ Reusable API

Priority Example:

```txt
Priority 5 → HIGH (error, session expired)
Priority 3 → MEDIUM (payment failed)
Priority 1 → LOW (cookie banner)
```

---

# 2. System Design

## Concept

Use a **Priority Queue** stored in a Modal Manager.

```txt
Component
   │
   ▼
Modal Service (Singleton)
   │
   ├── addModal({ priority, ... })
   ├── closeCurrent()
   ├── activeModal
   └── queue[]
   ▼
Modal Provider Renders Active Modal
```

---

## Data Flow

```txt
Component A opens Modal (P1)
         │
Component B opens Modal (P5)
         │
Component C opens Modal (P3)
         │
         ▼
     Queue
[ P5, P3, P1 ]
         │
         ▼
Show Modal P5
         │
Close P5 → Show P3
Close P3 → Show P1
```

---

# 3. Component Architecture

```txt
App
│
├── ModalProvider (Context + Service)
│
├── ModalManager
│    └── Renders Active Modal
│
├── useModal() hook
│
├── Modal Component
│     ├── Backdrop
│     ├── Content
│     └── Close Button
│
└── Any Component uses useModal()
```

---

# 4. Data Model

```js
{
  id: "modal-1",
  priority: 5,   // Higher = more important
  title: "Error",
  content: "Something failed"
}
```

---

# 5. Project Structure

```txt
src/
│
├── App.jsx
│
├── modal/
│   ├── ModalProvider.jsx
│   ├── Modal.jsx
│   ├── useModal.js
│   └── modalService.js
│
└── styles.css
```

---

# 6. Modal Service (Priority Queue)

```js
class ModalService {
  constructor() {
    this.queue = [];

    this.listeners = new Set();
  }

  open(modal) {
    const modalObj = {
      id: modal.id || Date.now().toString(),
      priority: modal.priority ?? 1,
      title: modal.title || "",
      content: modal.content || "",
    };

    // Add to queue
    this.queue.push(modalObj);

    // Sort by priority DESC
    this.queue.sort((a, b) => b.priority - a.priority);

    this.notify();

    return modalObj.id;
  }

  close(id) {
    if (id) {
      this.queue = this.queue.filter((m) => m.id !== id);
    } else {
      // Remove first (active)
      this.queue.shift();
    }

    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((cb) => cb(this.queue));
  }
}

export const modalService = new ModalService();
```

---

# 7. useModal Hook

```jsx
import { useEffect, useState } from "react";

import { modalService } from "./modalService";

export function useModal() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    return modalService.subscribe(setQueue);
  }, []);

  const activeModal = queue[0] || null;

  return {
    activeModal,

    openModal: modalService.open.bind(modalService),

    closeModal: modalService.close.bind(modalService),
  };
}
```

---

# 8. Modal Component

Uses **Portal** for rendering outside main DOM tree.

```jsx
import { createPortal } from "react-dom";

export default function Modal({ title, content, onClose }) {
  return createPortal(
    <div
      className="backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>

          <button onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">{content}</div>

        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

---

# 9. ModalProvider

Renders modals based on queue.

```jsx
import Modal from "./Modal";
import { useModal } from "./useModal";
import { useEffect } from "react";

export default function ModalProvider() {
  const { activeModal, closeModal } = useModal();

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && activeModal) {
        closeModal(activeModal.id);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeModal, closeModal]);

  if (!activeModal) return null;

  return (
    <Modal
      title={activeModal.title}
      content={activeModal.content}
      onClose={() => closeModal(activeModal.id)}
    />
  );
}
```

---

# 10. App.jsx

```jsx
import ModalProvider from "./modal/ModalProvider";
import Demo from "./Demo";
import "./styles.css";

export default function App() {
  return (
    <>
      <ModalProvider />

      <Demo />
    </>
  );
}
```

---

# 11. Demo Component

Show priority ordering.

```jsx
import { useModal } from "./modal/useModal";

export default function Demo() {
  const { openModal } = useModal();

  return (
    <div className="demo">
      <button
        onClick={() =>
          openModal({
            title: "Cookies Notice",
            content: "We use cookies to improve UX.",
            priority: 1,
          })
        }
      >
        Show Low Priority (P1)
      </button>

      <button
        onClick={() =>
          openModal({
            title: "Payment Failed",
            content: "Your payment could not be processed.",
            priority: 3,
          })
        }
      >
        Show Medium Priority (P3)
      </button>

      <button
        onClick={() =>
          openModal({
            title: "Session Expired",
            content: "Please login again.",
            priority: 5,
          })
        }
      >
        Show High Priority (P5)
      </button>
    </div>
  );
}
```

---

# 12. CSS

```css
body {
  font-family: Arial;
}

.demo {
  display: flex;
  gap: 8px;

  padding: 30px;
  flex-wrap: wrap;
}

.demo button {
  padding: 10px 16px;
  background: #2563eb;
  color: white;
  border: none;

  cursor: pointer;
  border-radius: 6px;
}

.backdrop {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
}

.modal {
  background: white;
  width: 400px;

  border-radius: 8px;
  padding: 16px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  animation: fadeIn 0.2s ease;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin: 12px 0;
}

@keyframes fadeIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

# 13. How It Works

```txt
User opens Modal A (P1)
User opens Modal B (P3)
User opens Modal C (P5)
      │
      ▼
Queue Sorted DESC
[ P5, P3, P1 ]
      │
      ▼
Show P5 first
      │
      ▼
Close P5 → Show P3
Close P3 → Show P1
```

---

# 14. Interview Follow-Up Questions

### Q1. Why use priority?

Some modals must take precedence:

```txt
Session Expired
Payment Failure
System Error
```

over less critical ones like:

```txt
Cookie Banner
Feedback Prompt
Upsell Offer
```

---

### Q2. Why Singleton Service?

Same service accessible from anywhere:

```txt
API interceptor
Global error handler
Auth service
Notification pipeline
```

Not tied to component tree.

---

### Q3. Why use Portal?

Escapes stacking context.

Renders modals outside layout tree.

Ensures overlays work correctly.

---

### Q4. What about multiple modals visible at once?

We can extend to allow **N modals visible** at once by sorting queue by priority and rendering top N.

---

# 15. Extensions (Senior Level)

✅ Focus trap using `focus-trap-react`

✅ Animation using `framer-motion`

✅ Accessibility (`role="dialog"`, `aria-modal`)

✅ Backdrop close toggle

✅ Preserve state per modal

✅ Modal queue persistence

✅ Undo action

✅ Timeout auto close

✅ Nested modals

---

# 16. Time Complexity

## Add Modal

```txt
Push + Sort → O(n log n)
```

Small queues are cheap.

## Close Modal

```txt
Filter → O(n)
```

For large queues, use heap:

```txt
Insert → O(log n)
Remove Top → O(log n)
```

Better for scale.

---

# 17. Senior React Interview Answer

> I would build a Modal with Priority using a singleton **Modal Service** that maintains a priority queue. Any component can open modals via `useModal().openModal({...})`, and the service ensures the highest-priority modal is displayed first. Modals are rendered through a `ModalProvider` using React Portals for proper stacking context and accessibility. State is synchronized across components via a subscription pattern. When one modal closes, the next highest priority modal opens automatically. For production, I extend this with focus traps, animations, priority persistence, keyboard shortcuts, backdrop control, and a heap-based data structure for scalable ordering — enabling behavior similar to enterprise notification systems used by Amazon, Google, and Microsoft dashboards.

# Modal – Advanced Features

### Focus Trap • Open/Close Animation • Backdrop Close

These are the **three most common Senior React interview follow-ups** after implementing a modal with priority queue.

They convert a basic modal into a **production-grade, accessible, and animated dialog** similar to Material UI, Chakra UI, Radix UI.

---

# 1. Focus Trap Inside Modal

## Why Focus Trap?

When a modal opens:

```txt
User presses Tab
       ↓
Focus should stay inside modal
```

Currently:

```txt
Tab escapes modal
Reaches background content
```

Bad for:

```txt
❌ Accessibility
❌ Keyboard users
❌ Screen readers
❌ WCAG compliance
```

---

## Approach

### Focus rules:

✅ First focus goes to modal

✅ Tab cycles inside modal

✅ Shift+Tab cycles backwards

✅ Escape closes modal

✅ On close, restore focus to previous element

---

## Store Previously Focused Element

```jsx
const previouslyFocused = useRef(null);
```

---

## Focus Modal When Opened

```jsx
useEffect(() => {
  previouslyFocused.current = document.activeElement;

  const focusables = modalRef.current.querySelectorAll(
    `
          a,
          button,
          input,
          textarea,
          select,
          not([tabindex="-1"])
        `,
  );

  focusables[0]?.focus();

  return () => {
    previouslyFocused.current?.focus();
  };
}, []);
```

---

## Trap Tab Key

```jsx
function handleKeyDown(event) {
  if (event.key !== "Tab") return;

  const focusables = modalRef.current.querySelectorAll(
    `
          a,
          button,
          input,
          textarea,
          select,
          not([tabindex="-1"])
        `,
  );

  if (focusables.length === 0) return;

  const first = focusables[0];

  const last = focusables[focusables.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
```

---

## Attach Handler

```jsx
<div
  ref={modalRef}
  onKeyDown={handleKeyDown}
>
```

---

## Result

```txt
Tab → cycles inside modal
Shift + Tab → reverses direction
Escape → closes modal
Focus → restored to trigger button
```

---

## Optional: Use Library

Production:

```bash
npm install focus-trap-react
```

Example:

```jsx
import FocusTrap from "focus-trap-react";

<FocusTrap>
  <div className="modal">...</div>
</FocusTrap>;
```

Handles everything automatically.

---

# 2. Animate Open & Close

Users expect smooth transitions:

```txt
Fade In
Slide Up
Scale
```

Matches:

```txt
Instagram
Notion
Slack
Material UI
```

---

## Option 1: Pure CSS Transitions

Add:

```css
.modal {
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal.open {
  opacity: 1;
  transform: scale(1);
}
```

---

Add `open` class dynamically:

```jsx
const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  setIsOpen(true);

  return () => {
    setIsOpen(false);
  };
}, []);
```

Then:

```jsx
<div className={`modal ${isOpen ? "open" : ""}`} />
```

---

## Add Backdrop Animation

```css
.backdrop {
  background: rgba(0, 0, 0, 0);

  transition: background 0.2s ease;
}

.backdrop.open {
  background: rgba(0, 0, 0, 0.6);
}
```

---

## Option 2: Use Framer Motion (Best)

Install:

```bash
npm install framer-motion
```

Example:

```jsx
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence>
  {isOpen && (
    <motion.div
      className="backdrop"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <motion.div
        className="modal"
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
      >
        Modal Content
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>;
```

---

### Framer Motion Benefits

✅ Automatic mount/unmount transitions

✅ Physics-based animations

✅ Better performance

✅ Sequenced animations

✅ Reduced motion accessibility

---

## Option 3: Motion Reduction Accessibility

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion) {
  .modal {
    transition: none;
  }
}
```

Very important for accessibility.

---

# 3. Backdrop Click to Close

Users expect this behaviour.

Examples:

```txt
Twitter
Facebook
Amazon
YouTube
```

---

## Basic Approach

Clicking backdrop closes modal.

Clicking modal content does NOT close.

---

## Implementation

Backdrop:

```jsx
<div
  className="backdrop"
  onClick={onClose}
>
```

Modal content:

```jsx
<div
  className="modal"
  onClick={(e) =>
    e.stopPropagation()
  }
>
```

---

## Behaviour

```txt
Click backdrop
        ↓
onClose runs
        ↓
Modal closes

Click modal content
        ↓
stopPropagation
        ↓
Modal remains open
```

---

## Optional: Prop to Enable/Disable Backdrop Close

```jsx
{
  closeOnBackdrop && <div onClick={onClose} />;
}
```

Some critical modals shouldn't close on backdrop click:

```txt
Payment
Session Timeout
Confirm Delete
```

Example usage:

```jsx
<Modal closeOnBackdrop={false} />
```

---

## Confirm Before Closing (Optional)

For unsaved changes:

```jsx
function handleBackdropClose() {
  if (isDirty) {
    const confirmed = window.confirm("Discard changes?");

    if (!confirmed) return;
  }

  onClose();
}
```

Used in:

```txt
Notion
Google Docs
Chat Composer
```

---

# Full Enhanced Modal Component

```jsx
import { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  title,
  content,
  onClose,
  closeOnBackdrop = true,
}) {
  const modalRef = useRef(null);

  const previouslyFocused = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);

    previouslyFocused.current = document.activeElement;

    setTimeout(() => {
      const focusables = modalRef.current?.querySelectorAll(
        "button,a,input,select,textarea",
      );

      focusables?.[0]?.focus();
    }, 50);

    return () => {
      previouslyFocused.current?.focus();
    };
  }, []);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = modalRef.current?.querySelectorAll(
      "button,a,input,select,textarea",
    );

    if (!focusables?.length) return;

    const first = focusables[0];

    const last = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleBackdropClick() {
    if (closeOnBackdrop) {
      onClose();
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="backdrop"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className="modal-header">
              <h3 id="modal-title">{title}</h3>

              <button onClick={onClose} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="modal-body">{content}</div>

            <div className="modal-footer">
              <button onClick={onClose}>Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,

    document.body,
  );
}
```

---

# Combined Behaviour

```txt
Modal opens
      ↓
Focus moves inside modal
      ↓
Tab cycles inside modal
      ↓
Escape closes modal
      ↓
Fade + Scale animation
      ↓
Backdrop closes if allowed
      ↓
Focus restored to trigger
```

---

# Senior React Interview Answer

> To make the modal production-grade, I add three critical features. First, a **focus trap** using refs and a Tab key handler ensures focus stays inside the modal and restores it to the previously focused element on close — essential for WCAG accessibility. Second, **open and close animations** are handled either using CSS transitions or `framer-motion`'s `AnimatePresence` for physics-based, exit-aware animations while respecting `prefers-reduced-motion`. Third, **backdrop click** closes the modal, but I stop event propagation from the modal content and provide a `closeOnBackdrop` prop for critical modals like payments, session expiry, or unsaved changes. Combined with priority queues, singleton services, and portals, this design produces a fully accessible, animated, enterprise-grade modal system similar to Material UI, Chakra UI, and Radix UI.

# Stacked Snack Bar in React

## System Design + Complete Interview-Ready Code

Snack bars (also called **Toasts**) are commonly used for:

✅ Success Notifications

✅ Error Messages

✅ Warnings

✅ Info Alerts

Examples:

```txt
Item added to cart
File uploaded
Payment failed
Session expired
```

Stacked Snack Bar means:

```txt
Multiple notifications
appear one below the other
```

Like:

- Gmail
- Slack
- LinkedIn
- Twitter
- YouTube

---

# Requirements

✅ Show snack bar dynamically

✅ Support multiple snack bars (stack)

✅ Auto-dismiss after timeout

✅ Manual close

✅ Different types (success, error, warning, info)

✅ Accessible

✅ Global usage using Context

✅ Reusable component

---

# System Design

```txt
Application
     │
     ▼
SnackBarProvider (Context)
     │
     ▼
SnackBarQueue (State)
     │
     ▼
SnackBarContainer
     │
     └── Individual SnackBar
          ├── Icon
          ├── Message
          └── Close Button
```

---

# Component Design

```txt
App
│
├── SnackBarProvider
│    │
│    ├── useSnackBar()
│    │
│    └── SnackBarContainer
│         ├── SnackBar 1
│         ├── SnackBar 2
│         └── SnackBar 3
│
└── Any Component
     └── Uses useSnackBar()
```

---

# Data Flow

```txt
Component
  ↓
useSnackBar().addSnackBar()
  ↓
Add To Queue
  ↓
Render Stacked SnackBars
  ↓
Auto Dismiss After Timeout
```

---

# Project Structure

```txt
src/
│
├── App.jsx
│
├── snackbar/
│   ├── SnackBarProvider.jsx
│   ├── SnackBarContainer.jsx
│   ├── SnackBar.jsx
│   └── useSnackBar.js
│
└── styles.css
```

---

# 1. SnackBarProvider.jsx

```jsx
import { createContext, useState, useCallback } from "react";

import SnackBarContainer from "./SnackBarContainer";

export const SnackBarContext = createContext();

let idCounter = 0;

export function SnackBarProvider({ children }) {
  const [snackBars, setSnackBars] = useState([]);

  const addSnackBar = useCallback((snack) => {
    const id = ++idCounter;

    const newSnack = {
      id,
      type: snack.type || "info",
      message: snack.message,
      duration: snack.duration || 3000,
    };

    setSnackBars((prev) => [...prev, newSnack]);

    setTimeout(() => {
      removeSnackBar(id);
    }, newSnack.duration);
  }, []);

  const removeSnackBar = useCallback((id) => {
    setSnackBars((prev) => prev.filter((snack) => snack.id !== id));
  }, []);

  return (
    <SnackBarContext.Provider
      value={{
        addSnackBar,
        removeSnackBar,
      }}
    >
      {children}

      <SnackBarContainer snackBars={snackBars} onClose={removeSnackBar} />
    </SnackBarContext.Provider>
  );
}
```

---

# 2. useSnackBar.js

```jsx
import { useContext } from "react";

import { SnackBarContext } from "./SnackBarProvider";

export function useSnackBar() {
  return useContext(SnackBarContext);
}
```

---

# 3. SnackBarContainer.jsx

```jsx
import SnackBar from "./SnackBar";

export default function SnackBarContainer({ snackBars, onClose }) {
  return (
    <div className="snackbar-container">
      {snackBars.map((snack) => (
        <SnackBar key={snack.id} snack={snack} onClose={onClose} />
      ))}
    </div>
  );
}
```

---

# 4. SnackBar.jsx

```jsx
export default function SnackBar({ snack, onClose }) {
  const typeClass = {
    success: "snackbar-success",
    error: "snackbar-error",
    warning: "snackbar-warning",
    info: "snackbar-info",
  };

  return (
    <div
      className={`snackbar ${typeClass[snack.type]}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{snack.message}</span>

      <button onClick={() => onClose(snack.id)}>✕</button>
    </div>
  );
}
```

---

# 5. App.jsx

```jsx
import { SnackBarProvider } from "./snackbar/SnackBarProvider";

import Demo from "./Demo";

import "./styles.css";

export default function App() {
  return (
    <SnackBarProvider>
      <Demo />
    </SnackBarProvider>
  );
}
```

---

# 6. Demo.jsx

```jsx
import { useSnackBar } from "./snackbar/useSnackBar";

export default function Demo() {
  const { addSnackBar } = useSnackBar();

  return (
    <div className="demo">
      <button
        onClick={() =>
          addSnackBar({
            type: "success",
            message: "Payment Successful",
          })
        }
      >
        Success
      </button>

      <button
        onClick={() =>
          addSnackBar({
            type: "error",
            message: "Something Went Wrong",
          })
        }
      >
        Error
      </button>

      <button
        onClick={() =>
          addSnackBar({
            type: "warning",
            message: "Low Balance",
          })
        }
      >
        Warning
      </button>

      <button
        onClick={() =>
          addSnackBar({
            type: "info",
            message: "New Update Available",
          })
        }
      >
        Info
      </button>
    </div>
  );
}
```

---

# 7. styles.css

```css
.snackbar-container {
  position: fixed;

  bottom: 20px;
  right: 20px;

  display: flex;
  flex-direction: column;

  gap: 10px;

  z-index: 9999;
}

.snackbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 20px;

  color: white;

  min-width: 250px;

  border-radius: 8px;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  animation: slideIn 300ms ease;
}

.snackbar button {
  background: transparent;

  border: none;

  color: white;

  font-size: 16px;

  cursor: pointer;
}

.snackbar-success {
  background: #16a34a;
}

.snackbar-error {
  background: #dc2626;
}

.snackbar-warning {
  background: #f97316;
}

.snackbar-info {
  background: #2563eb;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0%);
    opacity: 1;
  }
}
```

---

# How It Works

### Step 1

Component calls:

```js
addSnackBar({...})
```

### Step 2

Provider stores it:

```js
setSnackBars([...])
```

### Step 3

Container renders:

```txt
Snack1
Snack2
Snack3
```

Stacked.

### Step 4

After timeout:

```js
removeSnackBar(id);
```

Snack disappears.

---

# Data Flow Diagram

```txt
Component
   │
   ▼
addSnackBar()
   │
   ▼
Queue
   │
   ▼
Render Stack
   │
   ▼
Auto Dismiss
```

---

# Interview Optimizations

### 1. Global Access via Context

```jsx
useSnackBar();
```

Available everywhere.

---

### 2. Queue-Based Storage

```txt
[
  snack1,
  snack2,
  snack3
]
```

Stack UI works naturally.

---

### 3. Auto Dismiss

```js
setTimeout(() => remove(id), 3000);
```

---

### 4. Manual Close

```jsx
onClose = { onClose };
```

---

### 5. Types

```txt
success
error
warning
info
```

---

### 6. Accessibility

```jsx
role="alert"
aria-live="assertive"
```

Screen readers announce.

---

### 7. Animations

```css
slideIn
fadeOut
```

Optional: use `framer-motion`.

---

# Extensions

### Limit Snack Bar Count

```js
if (snackBars.length >= 3) {
  setSnackBars((prev) => prev.slice(-2));
}
```

---

### Pause On Hover

```js
onMouseEnter = pause();
onMouseLeave = resume();
```

---

### Position Options

```txt
top-left
top-right
bottom-left
bottom-right
center
```

---

# Senior React Interview Answer

> I would implement a stacked snack bar system using React Context to make it globally accessible across the app. Each snack bar is stored in a queue and rendered in a dedicated container using CSS Flexbox for stacking. Each snack has a unique ID, type, message, and duration. When added, the snack auto-dismisses using `setTimeout`, but users can also close it manually. To make it production-ready, I include accessibility roles (`aria-live="assertive"`, `role="alert"`), configurable position, hover-to-pause, animation, and stack size limits. This design ensures reusability, scalability, and easy integration into any React application.
> These are the **most common Senior React interview follow-ups** after implementing a stacked snack bar system.

---

# 1. Pause Snack Bar on Hover

## Why?

User needs time to read the message.

Currently:

```txt
Snack appears
       ↓
Auto disappears in 3 sec
```

User complaint:

```txt
Didn't get time to read!
```

Fix:

```txt
Hover
   ↓
Pause Timer

Mouse Leave
   ↓
Resume Timer
```

Example:

```txt
Payment Failed

Auto Dismiss = 3s
```

If user hovers at 1s:

```txt
Timer Paused
```

Leaves at 4s:

```txt
Timer Resumes
2 more seconds
```

Then dismisses.

---

## Timer Reference

We store timer using ref.

```js
const timerRef = useRef(null);

const remainingRef = useRef(snack.duration);

const startTimeRef = useRef(Date.now());
```

---

## Start Timer

```js
function startTimer() {
  startTimeRef.current = Date.now();

  timerRef.current = setTimeout(() => {
    onClose(snack.id);
  }, remainingRef.current);
}
```

---

## Pause Timer

```js
function pauseTimer() {
  clearTimeout(timerRef.current);

  const elapsed = Date.now() - startTimeRef.current;

  remainingRef.current -= elapsed;
}
```

---

## Resume Timer

```js
function handleMouseLeave() {
  startTimer();
}
```

---

## SnackBar Component

```jsx
import { useEffect, useRef } from "react";

export default function SnackBar({ snack, onClose }) {
  const timerRef = useRef(null);

  const remainingRef = useRef(snack.duration);

  const startTimeRef = useRef(Date.now());

  function startTimer() {
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      onClose(snack.id);
    }, remainingRef.current);
  }

  function pauseTimer() {
    clearTimeout(timerRef.current);

    const elapsed = Date.now() - startTimeRef.current;

    remainingRef.current -= elapsed;
  }

  useEffect(() => {
    startTimer();

    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className={`snackbar ${snack.type}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      {snack.message}
    </div>
  );
}
```

---

# Flow

```txt
Mount
   ↓
Start Timer

Hover
   ↓
Pause Timer

Leave
   ↓
Resume Timer

Time Out
   ↓
Dismiss
```

---

# 2. Limit Max Snack Bars in Stack

## Why?

If user triggers many snacks:

```txt
Payment Failed
Session Expired
Network Error
Auto Save Failed
Something Went Wrong
...
```

UI becomes cluttered.

Rule:

```txt
Max = 3 snacks
```

If new snack arrives:

```txt
Remove oldest
```

---

## Provider Update

```jsx
const MAX_SNACKS = 3;
```

---

## Add SnackBar

```jsx
const addSnackBar = (snack) => {
  const id = ++idCounter;

  const newSnack = {
    id,
    type: snack.type || "info",
    message: snack.message,
    duration: snack.duration || 3000,
  };

  setSnackBars((prev) => {
    const updated = [...prev, newSnack];

    if (updated.length > MAX_SNACKS) {
      return updated.slice(updated.length - MAX_SNACKS);
    }

    return updated;
  });
};
```

---

## Example

Existing snacks:

```txt
Snack 1
Snack 2
Snack 3
```

Add:

```txt
Snack 4
```

Result:

```txt
Snack 2
Snack 3
Snack 4
```

Oldest snack removed.

---

# Alternative: Queue Behavior

Some apps prefer:

```txt
Queue new snacks
until previous ones close
```

---

## Queue Version

```jsx
const queue = useRef([]);

if (snackBars.length >= MAX_SNACKS) {
  queue.current.push(newSnack);

  return;
}
```

Then when snack dismisses:

```jsx
function removeSnackBar(id) {
  setSnackBars((prev) => prev.filter((snack) => snack.id !== id));

  const next = queue.current.shift();

  if (next) {
    addSnackBar(next);
  }
}
```

---

# 3. Add Custom Icons

Modern snack bars use icons.

Examples:

```txt
✔️ Success
❌ Error
⚠️ Warning
ℹ️ Info
```

---

## Icon Config

```js
const ICONS = {
  success: "✔️",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};
```

---

## Icon Rendering

```jsx
<div className={`snackbar ${snack.type}`}>
  <span className="snackbar-icon">{ICONS[snack.type]}</span>

  <span>{snack.message}</span>

  <button onClick={() => onClose(snack.id)}>✕</button>
</div>
```

---

## Custom Icon Prop

For reusability:

```jsx
addSnackBar({
  type: "success",
  message: "Uploaded",
  icon: "☁️",
});
```

Then:

```jsx
<span>{snack.icon || ICONS[snack.type]}</span>
```

---

## SVG Icons

Better than emoji.

```jsx
<span>
  <svg width="18" height="18">
    ...
  </svg>
</span>
```

Use libraries:

```txt
Lucide
Feather
Material Icons
FontAwesome
```

Example:

```jsx
import { CheckCircle, XCircle } from "lucide-react";
```

---

## SnackBar With Icon

```jsx
export default function SnackBar({ snack, onClose }) {
  const Icon = snack.icon || ICONS[snack.type];

  return (
    <div className={`snackbar ${snack.type}`}>
      <div className="snack-content">
        <span>{Icon}</span>

        <span>{snack.message}</span>
      </div>

      <button onClick={() => onClose(snack.id)}>✕</button>
    </div>
  );
}
```

---

## CSS Update

```css
.snackbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.snackbar-icon {
  font-size: 20px;
}
```

Sample UI:

```txt
✔️  Payment Successful   ✕
❌  Network Failed        ✕
⚠️  Session Expiring     ✕
ℹ️  New Update Available  ✕
```

---

# Interview Answer

> To improve UX, I pause the snack bar timer when the user hovers using `onMouseEnter` and resume it on `onMouseLeave` by tracking elapsed time in refs. To prevent UI clutter, I enforce a maximum stack size (`MAX_SNACKS`) and remove the oldest snack when a new one arrives. Alternatively, snack bars can be queued if the stack is full. To improve visual clarity, I add default icons per type (success, error, warning, info) and allow consumers to pass a custom icon or SVG for full flexibility. This design produces a production-grade, accessible, and highly customizable notification system similar to those used by Slack, Gmail, LinkedIn, and Twitter.

`useEffectEvent` is a specialized React hook designed to solve one of the most frustrating problems in React: **having to include values in a `useEffect` dependency array that you need to read, but which shouldn't trigger the effect to re-run.**

It lets you extract **non-reactive logic** into a dedicated event function that always sees the latest props and state without being listed as a dependency.

---

### The Core Problem: Reactive vs. Non-Reactive Logic

In standard React:

* **Reactive values** (props, state, and variables derived from them) change over time and are part of the data flow.
* **Effects synchronize** with these reactive values. If you use a reactive value inside an effect, the linter forces you to declare it as a dependency, causing the effect to re-execute whenever that value changes.

However, sometimes an effect needs to run in response to **one specific trigger**, but needs to read **another changing value** solely as metadata (like analytics, notification preferences, or current themes).

---

### The Classic Dilemma: Chat Room & Theme Example

Consider a chat component that connects to a room and shows a notification using the user's current theme:

#### Without `useEffectEvent` (The Flawed Approaches)

```tsx
function ChatRoom({ roomId, theme }) {
  // ❌ Problem 1: `theme` in dependencies causes re-connection on every theme toggle!
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();

    return () => connection.disconnect();
  }, [roomId, theme]); // 👈 Changing theme drops & reconnects WebSocket!
}

```

If you omit `theme` to prevent reconnections, the linter warns you, and you risk a **stale closure** (reading an outdated `theme` value).

---

### The Solution: Using `useEffectEvent`

`useEffectEvent` separates the **reactive synchronization trigger** (`roomId`) from the **non-reactive side-effect logic** (`theme`).

```tsx
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  // 1. Extract non-reactive logic into an Effect Event
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme); // Always reads the latest `theme`
  });

  // 2. The Effect only synchronizes with `roomId`
  useEffect(() => {
    const connection = createConnection(roomId);

    connection.on('connected', () => {
      onConnected(); // Call the Effect Event here
    });

    connection.connect();

    return () => connection.disconnect();
  }, [roomId]); // 👈 Only re-runs when `roomId` changes, NOT when `theme` changes!
}

```

---

### How `useEffectEvent` Works Internally

```
[Component Renders] ──▶ theme = "dark"
       │
       ├── `useEffectEvent` wrapper is updated to point to latest render scope
       │
       └── `useEffect` runs ONLY when `roomId` changes:
             └── Calls `onConnected()` ──▶ Executes using latest `theme` ("dark")

```

1. **Always Fresh:** An Effect Event acts like a stable function reference that internally points to the latest version of the component's closure. It never suffers from stale closures.
2. **Omitted from Dependencies:** React guarantees that Effect Event functions are stable and **must not** be included in the `useEffect` dependency array. The React ESLint rules automatically exclude them.

---

### Rules of `useEffectEvent`

To maintain predictability and prevent race conditions, React enforces strict usage constraints:

* **Call only inside `useEffect`:** You cannot call an Effect Event during rendering, in event handlers (like `onClick`), or pass it to other components as a prop.
* **Do not pass around:** Treat Effect Events as private, internal helpers for the specific component's effects.

```tsx
function Form({ onSubmit }) {
  const onSave = useEffectEvent(() => {
    onSubmit();
  });

  // ❌ ILLEGAL: Cannot pass or call in event handlers directly
  // <button onClick={onSave}>Save</button>

  // ❌ ILLEGAL: Cannot call directly in render body
  // onSave();

  // ✅ LEGAL: Called strictly inside an effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
}

```

---

### Comparison: When to Use What

| Mechanism            | Purpose                                                            | In Dependency Array?         | Reads Latest State?     |
| -------------------- | ------------------------------------------------------------------ | ---------------------------- | ----------------------- |
| **`useEffect` Body** | Reactive synchronization logic.                                    | **Yes** (All used variables) | Yes                     |
| **`useEffectEvent`** | Non-reactive logic triggered by an effect (e.g., logging, toasts). | **No** (Strictly excluded)   | **Yes** (Always latest) |
| **`useCallback`**    | Memoizing functions passed as props to children.                   | **Yes** (Its own deps)       | Only if in deps         |
| **`useRef` Hack**    | Storing mutable values across renders.                             | **No**                       | Yes (Manual `.current`) |

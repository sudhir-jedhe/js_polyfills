Here are the primary ways to share data between sibling components in React, ranging from native primitives to specialized state managers.

---

### Comparison Matrix

| Approach                                    | Setup Complexity | Render Performance                     | Persistence          | Best Used For                                  |
| ------------------------------------------- | ---------------- | -------------------------------------- | -------------------- | ---------------------------------------------- |
| **Lifting State Up**                        | Lowest           | Moderate (re-renders parent)           | No                   | Simple sibling-to-sibling communication        |
| **Context API**                             | Low              | Low–Moderate (all consumers re-render) | No                   | Low-frequency data (themes, auth state)        |
| **Zustand / Redux**                         | Moderate         | High (atomic selector subscriptions)   | Optional via plugins | Complex client state, fine-grained renders     |
| **External Store (`useSyncExternalStore`)** | Moderate         | High (subscribes only to updates)      | Optional             | Vanilla JS singletons, event emitters          |
| **Custom Events (`EventTarget`)**           | Low              | Manual (requires local state hooks)    | No                   | Micro-frontends, non-React ↔ React bridges     |
| **`localStorage` + `storage` event**        | Low              | Manual / Async                         | Yes (cross-tab)      | Cross-tab synchronization, persistent settings |

---

### 1. Lifting State Up (Baseline)

The parent component holds state and passes data down via props, along with an update callback.

```jsx
function Parent() {
  const [text, setText] = useState('');
  return (
    <>
      <SiblingA text={text} onTextChange={setText} />
      <SiblingB text={text} />
    </>
  );
}

```

---

### 2. React Context API

Creates a scoped provider. Any child component can read or update the context without prop-drilling.

* **Caveat:** When the context value changes, **every** consuming component re-renders unless split into separate State and Dispatch contexts or memoized with selectors.

```jsx
const CounterContext = createContext(null);

export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

// Sibling A: Writer
function SiblingA() {
  const { setCount } = useContext(CounterContext);
  return <button onClick={() => setCount((c) => c + 1)}>Increment</button>;
}

// Sibling B: Reader
function SiblingB() {
  const { count } = useContext(CounterContext);
  return <p>Count: {count}</p>;
}

```

---

### 3. Zustand (Lightweight Global Store)

Uses a hook-based external store with selector-based subscriptions so components only re-render when their selected slice changes.

```javascript
// store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  message: 'Hello',
  setMessage: (msg) => set({ message: msg }),
}));

```

```jsx
// Sibling A
function SiblingA() {
  const setMessage = useStore((state) => state.setMessage);
  return <input onChange={(e) => setMessage(e.target.value)} />;
}

// Sibling B
function SiblingB() {
  const message = useStore((state) => state.message);
  return <div>{message}</div>;
}

```

---

### 4. External Store via `useSyncExternalStore`

React 18+'s native hook for subscribing to any arbitrary JavaScript store (e.g., an EventEmitter or plain object) safely with concurrent rendering.

```javascript
// store.js
let state = { user: 'Guest' };
const listeners = new Set();

export const externalStore = {
  getSnapshot: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setUser: (user) => {
    state = { ...state, user };
    listeners.forEach((l) => l());
  },
};

```

```jsx
import { useSyncExternalStore } from 'react';
import { externalStore } from './store';

function SiblingA() {
  return <button onClick={() => externalStore.setUser('Alex')}>Login</button>;
}

function SiblingB() {
  const state = useSyncExternalStore(
    externalStore.subscribe,
    externalStore.getSnapshot
  );
  return <p>Current user: {state.user}</p>;
}

```

---

### 5. `CustomEvent` / `EventTarget` (Pub/Sub)

Uses native browser event dispatching. Sibling A dispatches an event on `window`, and Sibling B listens for it.

* **Best for:** Decoupled widgets, micro-frontends, or coordinating non-React code with React components.

```jsx
// Sibling A: Dispatcher
function SiblingA() {
  const sendAlert = () => {
    window.dispatchEvent(
      new CustomEvent('app:notification', { detail: { text: 'New notification!' } })
    );
  };
  return <button onClick={sendAlert}>Notify Sibling</button>;
}

// Sibling B: Listener
function SiblingB() {
  const [alert, setAlert] = useState('');

  useEffect(() => {
    const handler = (e) => setAlert(e.detail.text);
    window.addEventListener('app:notification', handler);
    return () => window.removeEventListener('app:notification', handler);
  }, []);

  return <p>{alert}</p>;
}

```

---

### 6. `localStorage` with `storage` Event

Shares data across components and browser tabs while persisting across refreshes.

* **Note:** The native `window.addEventListener('storage', ...)` only fires in **other** open tabs by default. To sync within the same tab, dispatch a custom event alongside `localStorage.setItem`.

```jsx
// Sibling A: Write to Storage
function SiblingA() {
  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    // Dispatch custom event to sync within the active tab
    window.dispatchEvent(new Event('local-storage-sync'));
  };
  return <button onClick={() => setTheme('dark')}>Set Dark Mode</button>;
}

// Sibling B: Read and Subscribe
function SiblingB() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const syncTheme = () => setTheme(localStorage.getItem('theme') || 'light');
    window.addEventListener('storage', syncTheme); // Cross-tab sync
    window.addEventListener('local-storage-sync', syncTheme); // Same-tab sync

    return () => {
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener('local-storage-sync', syncTheme);
    };
  }, []);

  return <p>Theme: {theme}</p>;
}

```

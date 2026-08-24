This is a classic React 18 interview problem.

When we want to trigger a component re-render on changes to a plain JavaScript variable (or external store) without using `useState` or `useReducer`, **`useSyncExternalStore`** is the standard and official solution.

---

**Step 1: Create the external store and subscription logic**

To notify React when data changes, implement a **listener/subscriber pattern**:

```javascript
// store.js (or outside the component)
let score = 0;
const listeners = new Set();

export const scoreStore = {
  // 1. Read current value (Snapshot)
  getSnapshot() {
    return score;
  },

  // 2. Update value and notify subscribers
  updateScore(newScore) {
    score = newScore;
    // Notify all subscribed React components
    listeners.forEach((listener) => listener());
  },

  // 3. Subscription function for React
  subscribe(listener) {
    listeners.add(listener);
    // Return an unsubscribe cleanup function
    return () => listeners.delete(listener);
  },
};

```

---

**Step 2: Consume the store with `useSyncExternalStore**`

```jsx
import React, { useSyncExternalStore } from 'react';
import { scoreStore } from './store';

function ScoreBoard() {
  // useSyncExternalStore(subscribe, getSnapshot)
  const score = useSyncExternalStore(
    scoreStore.subscribe,
    scoreStore.getSnapshot
  );

  const handleIncrement = () => {
    scoreStore.updateScore(score + 1);
  };

  return (
    <div>
      <h2>Current Score: {score}</h2>
      <button onClick={handleIncrement}>Update Score</button>
    </div>
  );
}

export default ScoreBoard;

```

---

**How It Works**

1. **`subscribe` Function:** When the component mounts, React registers a callback with the store via `subscribe`.
2. **Notification Trigger:** Calling `updateScore` executes all registered callbacks in `listeners`.
3. **`getSnapshot` & Re-render:** React calls `getSnapshot()` to compare the previous and new values using `Object.is`. If the snapshot has changed, React schedules a re-render.

---

**Key Advantages of `useSyncExternalStore**`

* **Prevents Tearing:** Guarantees consistent state reads during Concurrent React rendering without UI mismatches.
* **Decoupled Architecture:** Keeps mutable state logic entirely outside React component lifecycles in plain JavaScript.

**1. Subscribing to Browser Online/Offline Status**

Instead of using `useEffect` with `useState` and manual event listener management, `useSyncExternalStore` provides a clean, declarative connection to browser APIs.

```tsx
import React, { useSyncExternalStore } from 'react';

// Subscribe to browser network events
function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

// Snapshot reader
function getSnapshot() {
  return navigator.onLine;
}

// Custom Hook
export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

// Usage in Component
export function NetworkIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      Status: {isOnline ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
  );
}

```

---

**2. Subscribing to Media Queries (`window.matchMedia`)**

Track screen size or theme changes without layout shifts or extra state hooks.

```tsx
import React, { useSyncExternalStore } from 'react';

function useMediaQuery(query: string) {
  const subscribe = (callback: () => void) => {
    const matchMedia = window.matchMedia(query);
    matchMedia.addEventListener('change', callback);

    return () => matchMedia.removeEventListener('change', callback);
  };

  const getSnapshot = () => window.matchMedia(query).matches;

  // Optional: third argument for SSR fallback value
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Usage in Component
export function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav>
      {isMobile ? <button>☰ Menu</button> : <div>Desktop Navigation Links</div>}
    </nav>
  );
}

```

---

**3. Reactive `localStorage` Store with Cross-Tab Sync**

Synchronize local storage changes across tabs and local updates within the same component tree.

```tsx
import React, { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

export const localStore = {
  getItem(key: string) {
    return localStorage.getItem(key);
  },

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
    // Notify local listeners
    listeners.forEach((listener) => listener());
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    // Cross-tab synchronization via storage event
    const handleStorage = (event: StorageEvent) => {
      listener();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', handleStorage);
    };
  },
};

// Component
export function ThemeSwitcher() {
  const theme = useSyncExternalStore(
    localStore.subscribe,
    () => localStore.getItem('app_theme') ?? 'light'
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    localStore.setItem('app_theme', nextTheme);
  };

  return (
    <div style={{ background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
      <p>Active Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

```

---

**Critical Rule: Stable `getSnapshot` References**

* **Primitives (Numbers, Booleans, Strings):** Can be returned directly.
* **Objects/Arrays:** `getSnapshot` must return the **same object reference** if the underlying data has not changed. Returning a new object reference (e.g., `() => ({ user: store.user })`) on every call triggers an infinite re-render loop.

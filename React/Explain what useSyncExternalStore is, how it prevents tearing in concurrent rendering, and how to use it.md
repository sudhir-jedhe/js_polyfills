*** copy Explain what useSyncExternalStore is, how it prevents tearing in concurrent rendering, and how to use it.md ***

`useSyncExternalStore` is a Hook introduced in React 18 designed specifically for **subscribing to external (non-React) data stores**—such as Redux, Zustand, browser APIs (`window.innerWidth`, `navigator.onLine`), or custom event emitters—while preventing **tearing** during concurrent rendering.

---

### What is "Tearing"?

**Tearing** is a visual inconsistency where different components in the same tree render data from different versions of the same external store during a single render pass.

```
Time ────►
[Component A renders] ────► Reads store = "Value 1"
          │
          ├─► (React yields execution to browser / concurrent pause)
          │   External store changes outside React: store = "Value 2"
          │
[Component B renders] ────► Reads store = "Value 2"
          │
          ▼
SCREEN PAINTS: Component A shows "Value 1", Component B shows "Value 2"  (TEARING!)

```

#### Why it happens

* **React Internal State (`useState`):** Safe during concurrent rendering because React versions its internal state using immutable Fiber snapshots.
* **External Stores (Mutable references):** React does not own or version external variables. If an external store updates while React is paused mid-render, components rendered *after* the pause see the new value, while components rendered *before* the pause saw the old value.

---

### How `useSyncExternalStore` Fixes Tearing

When React renders a component using `useSyncExternalStore`:

1. **Snapshot Consistency Check:** It calls `getSnapshot()` during the render phase and tracks the value.
2. **Commit-Time Validation:** Before committing changes to the DOM, React checks if the snapshot changed while rendering was in progress.
3. **Synchronous Fallback:** If a mutation occurred mid-render (a mismatch is detected), React discards the inconsistent WIP tree and immediately re-runs the entire render pass **synchronously**, guaranteeing that every component reads from the exact same store version.

---

### Signature and Parameters

```typescript
const snapshot = useSyncExternalStore(
  subscribe,       // Function to register a callback for store changes
  getSnapshot,     // Function returning an immutable snapshot of client state
  getServerSnapshot // (Optional) Function returning the snapshot for SSR
);

```

* **`subscribe`**: Must accept a single `callback` function and return an unsubscribe cleanup function.
* **`getSnapshot`**: Must return an immutable value or primitive. If it returns a new object reference every call, React will trigger an infinite re-render loop.

---

### Practical Examples

#### Example 1: Subscribing to a Browser API (`navigator.onLine`)

```tsx
import React, { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export function NetworkStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, () => true);

  return (
    <div style={{ color: isOnline ? 'green' : 'red' }}>
      {isOnline ? 'Connected' : 'Disconnected'}
    </div>
  );
}

```

#### Example 2: Subscribing to a Custom External Store

```tsx
// 1. A standalone, non-React store
type Listener = () => void;

class CounterStore {
  private count = 0;
  private listeners = new Set<Listener>();

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    return this.count;
  };

  increment = () => {
    this.count += 1;
    this.listeners.forEach((l) => l());
  };
}

export const counterStore = new CounterStore();

// 2. React component using the store safely
export function CounterDisplay() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={counterStore.increment}>Increment</button>
    </div>
  );
}

```

---

### Key Takeaways

* **Target Audience:** Primarily store library authors (Redux, MobX, Zustand) and components that bind to browser APIs with mutable state.
* **Referential Stability:** Ensure `getSnapshot` returns cached/immutable results (primitives or memoized selectors) to prevent unnecessary re-renders.
* **Replaces `useEffect` Subscriptions:** Replaces the old anti-pattern of `useState` + `useEffect` to listen to external stores, which was susceptible to race conditions and tearing under React 18 Concurrent Mode.

Show how state management libraries like Zustand or Redux use useSyncExternalStoreWithSelector under the hood.

Both React-Redux (v8+) and Zustand rely on an official shim/extension package published by the React team: `use-sync-external-store/shim/with-selector`.

While standard `useSyncExternalStore` accepts only a raw `getSnapshot` function, store libraries need **selectors** and **custom equality checks** (like shallow equality) to prevent components from re-rendering when unrelated slices of the store change.

---

### The Problem with Plain `useSyncExternalStore` + Selectors

If you try to pass an inline selector to standard `useSyncExternalStore`, you hit an infinite re-render loop or redundant renders:

```tsx
// ⚠️ PROBLEM: If selector returns a new object/array, snapshot reference changes every call
const userNames = useSyncExternalStore(
  store.subscribe,
  () => store.getState().users.map(u => u.name) // New array reference on EVERY getSnapshot()!
);

```

To fix this, `useSyncExternalStoreWithSelector` adds a memoization and equality-checking layer on top of the native hook.

---

### Signature of `useSyncExternalStoreWithSelector`

```typescript
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

const selectedState = useSyncExternalStoreWithSelector(
  subscribe,          // (listener) => unsubscribe
  getSnapshot,        // () => RootStoreState
  getServerSnapshot,  // SSR snapshot (optional)
  selector,           // (state) => SelectedSlice
  isEqual             // (a, b) => boolean (optional, defaults to Object.is)
);

```

---

### How It Works Internally

The core implementation uses `useMemo` and `useRef` to cache the previous raw state, the selected slice, and the equality comparison:

```javascript
// Simplified internal logic of useSyncExternalStoreWithSelector
function useSyncExternalStoreWithSelector(
  subscribe,
  getSnapshot,
  getServerSnapshot,
  selector,
  isEqual = Object.is
) {
  // A ref to hold memoized values across render passes
  const memoizedRef = useRef(null);

  // 1. Wrap getSnapshot with selector memoization
  const getSelection = useMemo(() => {
    let hasMemo = false;
    let prevRawState;
    let prevSelectedSlice;

    return () => {
      const nextRawState = getSnapshot();

      if (!hasMemo) {
        hasMemo = true;
        prevRawState = nextRawState;
        prevSelectedSlice = selector(nextRawState);
        return prevSelectedSlice;
      }

      // If root state didn't change, return cached selected slice
      if (Object.is(prevRawState, nextRawState)) {
        return prevSelectedSlice;
      }

      // State changed -> compute new selection
      const nextSelectedSlice = selector(nextRawState);

      // If selection is structurally equal (e.g., shallowEqual), keep old reference
      if (isEqual(prevSelectedSlice, nextSelectedSlice)) {
        return prevSelectedSlice;
      }

      prevRawState = nextRawState;
      prevSelectedSlice = nextSelectedSlice;
      return nextSelectedSlice;
    };
  }, [getSnapshot, selector, isEqual]);

  // 2. Delegate to the native, tear-free useSyncExternalStore
  return useSyncExternalStore(subscribe, getSelection, getServerSnapshot);
}

```

---

### Practical Implementation: Building a Mini-Zustand

Here is how a simplified Zustand-like store uses `useSyncExternalStoreWithSelector` under the hood:

```typescript
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

type State = { count: number; text: string };
type SetState<T> = (partial: Partial<T> | ((prev: T) => Partial<T>)) => void;

function createStore<T extends object>(initialState: T) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState: SetState<T> = (updater) => {
    const nextState = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...nextState };
    // Notify all subscribers
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // Custom hook generated for this store
  function useStore<Slice>(
    selector: (state: T) => Slice = (s) => s as unknown as Slice,
    equalityFn: (a: Slice, b: Slice) => boolean = Object.is
  ): Slice {
    return useSyncExternalStoreWithSelector(
      subscribe,
      getState,
      getState, // SSR fallback
      selector,
      equalityFn
    );
  }

  return { getState, setState, subscribe, useStore };
}

```

#### Consuming the Store

```tsx
// 1. Create the store
const useCounterStore = createStore({ count: 0, text: 'Hello' });

// 2. Component A: Only re-renders when `count` changes
function CounterButton() {
  const count = useCounterStore.useStore((s) => s.count);

  return (
    <button onClick={() => useCounterStore.setState((s) => ({ count: s.count + 1 }))}>
      Count: {count}
    </button>
  );
}

// 3. Component B: Only re-renders when `text` changes
function TextInput() {
  const text = useCounterStore.useStore((s) => s.text);

  return (
    <input
      value={text}
      onChange={(e) => useCounterStore.setState({ text: e.target.value })}
    />
  );
}

```

---

### Why Redux and Zustand Rely on This

1. **Guaranteed Tear-Free Concurrency:** All external store subscriptions plug directly into React 18's Fiber scheduling and priority bailouts.
2. **Selective Subscriptions:** Components only re-render if `equalityFn(prevSlice, nextSlice)` returns `false`.
3. **No Stale Closures:** Even if selectors capture changing props, `useSyncExternalStoreWithSelector` properly refreshes its internal memoization cache without dropped notifications.

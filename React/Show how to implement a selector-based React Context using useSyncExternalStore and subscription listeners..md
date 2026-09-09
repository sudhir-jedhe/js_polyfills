***  Show how to implement a selector-based React Context using useSyncExternalStore and subscription listeners..md ***

This pattern combines the dependency-injection benefits of **React Context** with the fine-grained performance of **`useSyncExternalStore`**. Context provides the store instance to the component subtree, while `useSyncExternalStore` subscribes directly to selected state slices, completely bypassing React Context's default whole-tree re-render penalty.

---

**Step 1: Create the Store Factory**

The store manages the current state, a set of subscriber callbacks, and methods to update and read state.

```typescript
// store.ts
export type Listener = () => void;

export interface Store<T> {
  getState: () => T;
  setState: (fn: (prevState: T) => T) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    setState: (fn) => {
      const nextState = fn(state);
      if (!Object.is(state, nextState)) {
        state = nextState;
        // Notify all subscribers of the mutation
        listeners.forEach((listener) => listener());
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      // Return cleanup function to unsubscribe
      return () => listeners.delete(listener);
    },
  };
}

```

---

**Step 2: Build the Context Provider and Custom Selector Hook**

Use `useRef` to guarantee the store instance identity remains stable throughout the provider's lifecycle, and pass the store itself (not the raw state) through Context.

```typescript
// StoreContext.tsx
import React, { createContext, useContext, useRef, useSyncExternalStore } from 'react';
import { createStore, Store } from './store';

interface AppState {
  count: number;
  text: string;
}

const StoreContext = createContext<Store<AppState> | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Store instance remains persistent across renders
  const storeRef = useRef<Store<AppState>>();
  if (!storeRef.current) {
    storeRef.current = createStore<AppState>({ count: 0, text: 'Hello' });
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

// Selector Hook leveraging useSyncExternalStore
export function useStoreSelector<Selected>(
  selector: (state: AppState) => Selected
): [Selected, Store<AppState>['setState']] {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStoreSelector must be used within a StoreProvider');
  }

  // useSyncExternalStore automatically handles subscription and prevents UI tearing
  const selectedState = useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()) // Server snapshot for SSR
  );

  return [selectedState, store.setState];
}

```

---

**Step 3: Consume in Components with Isolated Re-renders**

Each consuming component re-renders **only** when its specific selector output changes by reference (`Object.is`).

```tsx
// CounterDisplay.tsx
export function CounterDisplay() {
  // Subscribes ONLY to state.count
  const [count, setState] = useStoreSelector((state) => state.count);

  console.log('CounterDisplay rendered');

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={() => setState((prev) => ({ ...prev, count: prev.count + 1 }))}>
        Increment Count
      </button>
    </div>
  );
}

```

```tsx
// TextInputDisplay.tsx
export function TextInputDisplay() {
  // Subscribes ONLY to state.text
  const [text, setState] = useStoreSelector((state) => state.text);

  console.log('TextInputDisplay rendered');

  return (
    <div>
      <h3>Text: {text}</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setState((prev) => ({ ...prev, text: e.target.value }))}
      />
    </div>
  );
}

```

---

**How This Eliminates Unnecessary Re-renders**

* **Context Value Never Changes:** The `StoreContext.Provider` value is the stable `store` object reference, so the Context mechanism itself never triggers consumer re-renders.
* **Granular Fiber Updates:** When `setState` fires, `useSyncExternalStore` evaluates the component's `selector(store.getState())`. If the selected slice is strictly equal (`===`) to the previous snapshot, React skips rendering that component entirely.
* Typing into `TextInputDisplay` re-renders **only** `TextInputDisplay`; `CounterDisplay` does not re-render at all.

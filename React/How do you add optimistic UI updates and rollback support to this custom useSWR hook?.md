*** copy How do you add optimistic UI updates and rollback support to this custom useSWR hook?.md ***

An **optimistic mutation** immediately writes the anticipated new state into the cache so the UI updates instantly. If the asynchronous operation fails, the store automatically rolls back to the previous snapshot and re-throws the error.

---

### Step 1: Extend `SWRStore` with Mutation & Rollback Support

We add a `mutate` method that takes either an optimistic payload or an async promise, backing up the prior state before applying changes:

```javascript
// swrStore.js
class SWRStore {
  constructor() {
    this.cache = new Map();     // key -> { data, error, isValidating, cachedAt }
    this.listeners = new Map(); // key -> Set<listenerCallback>
    this.inFlight = new Map();  // key -> Promise
  }

  static DEFAULT_STATE = { data: undefined, error: null, isValidating: false, cachedAt: 0 };

  getSnapshot(key) {
    if (!key) return SWRStore.DEFAULT_STATE;
    return this.cache.get(key) || SWRStore.DEFAULT_STATE;
  }

  subscribe(key, listener) {
    if (!key) return () => {};
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(listener);

    return () => {
      const set = this.listeners.get(key);
      if (set) {
        set.delete(listener);
        if (set.size === 0) this.listeners.delete(key);
      }
    };
  }

  _notify(key) {
    const set = this.listeners.get(key);
    if (set) set.forEach((fn) => fn());
  }

  _setEntry(key, partial) {
    const current = this.cache.get(key) || SWRStore.DEFAULT_STATE;
    this.cache.set(key, { ...current, ...partial });
    this._notify(key);
  }

  /**
   * Optimistic mutation with automated rollback
   */
  async mutate(key, dataOrPromise, options = {}) {
    const {
      optimisticData,
      rollbackOnError = true,
      revalidate = true,
      fetcher,
    } = options;

    if (!key) return;

    // 1. Snapshot previous state for rollback
    const previousSnapshot = this.getSnapshot(key);

    // 2. Apply optimistic data immediately to UI
    if (optimisticData !== undefined) {
      const formattedData =
        typeof optimisticData === 'function'
          ? optimisticData(previousSnapshot.data)
          : optimisticData;

      this._setEntry(key, { data: formattedData, error: null });
    }

    try {
      // 3. Execute the actual mutation (if provided)
      let result;
      if (typeof dataOrPromise === 'function') {
        result = await dataOrPromise(previousSnapshot.data);
      } else if (dataOrPromise !== undefined) {
        result = await dataOrPromise;
      }

      // If mutation returned concrete data, update store
      if (result !== undefined) {
        this._setEntry(key, { data: result, error: null, cachedAt: Date.now() });
      }

      // 4. Optionally trigger background revalidation to guarantee server sync
      if (revalidate && fetcher) {
        await this.revalidate(key, fetcher);
      }

      return result;
    } catch (err) {
      // 5. Rollback on failure
      if (rollbackOnError) {
        this._setEntry(key, {
          data: previousSnapshot.data,
          error: err,
        });
      }
      throw err;
    }
  }

  revalidate(key, fetcher) {
    if (!key || typeof fetcher !== 'function') return;
    if (this.inFlight.has(key)) return this.inFlight.get(key);

    this._setEntry(key, { isValidating: true });

    const promise = (async () => {
      try {
        const data = await fetcher(key);
        this._setEntry(key, {
          data,
          error: null,
          isValidating: false,
          cachedAt: Date.now(),
        });
        return data;
      } catch (error) {
        this._setEntry(key, { error, isValidating: false });
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}

export const globalSWRStore = new SWRStore();

```

---

### Step 2: Expose `mutate` in the `useSWR` Hook

```javascript
// useSWR.js
import { useSyncExternalStore, useEffect, useCallback, useRef } from 'react';
import { globalSWRStore } from './swrStore';

export function useSWR(key, fetcher, options = {}) {
  const { dedupingInterval = 2000 } = options;
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const subscribe = useCallback(
    (onStoreChange) => globalSWRStore.subscribe(key, onStoreChange),
    [key]
  );

  const getSnapshot = useCallback(
    () => globalSWRStore.getSnapshot(key),
    [key]
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Hook-scoped mutate wrapper bound to current key & fetcher
  const mutate = useCallback(
    (dataOrPromise, mutateOptions = {}) => {
      return globalSWRStore.mutate(key, dataOrPromise, {
        fetcher: fetcherRef.current,
        ...mutateOptions,
      });
    },
    [key]
  );

  useEffect(() => {
    if (!key) return;
    if (state.data === undefined || Date.now() - state.cachedAt > dedupingInterval) {
      globalSWRStore.revalidate(key, fetcherRef.current);
    }
  }, [key, state.data, state.cachedAt, dedupingInterval]);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.data === undefined && state.error === null,
    isValidating: state.isValidating,
    mutate,
  };
}

```

---

### Step 3: Usage in a React Component (e.g., Todo List)

```jsx
import React, { useState } from 'react';
import { useSWR } from './useSWR';

const fetchTodos = async (url) => {
  const res = await fetch(url);
  return res.json();
};

export function TodoList() {
  const [text, setText] = useState('');
  const { data: todos, error, mutate } = useSWR('/api/todos', fetchTodos);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTodo = { id: Date.now(), text, completed: false };
    const optimisticTodos = [...(todos || []), newTodo];
    setText('');

    try {
      await mutate(
        // The async API call
        fetch('/api/todos', {
          method: 'POST',
          body: JSON.stringify(newTodo),
        }).then((res) => res.json()),
        {
          optimisticData: optimisticTodos, // 1. Instant UI update
          rollbackOnError: true,           // 2. Auto rollback if POST fails
          revalidate: true,                // 3. Sync with DB response
        }
      );
    } catch (err) {
      alert('Failed to add todo! Reverting UI.');
    }
  };

  return (
    <div>
      <form onSubmit={handleAddTodo}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add Todo</button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      <ul>
        {todos?.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

### The Optimistic Flow Under the Hood

```text
User Submits Action
        │
        ▼
1. Take Snapshot of current cache ({ data: [...] })
        │
        ▼
2. Write `optimisticData` to store ──► React components re-render immediately
        │
        ▼
3. Dispatch Async API Request
        │
        ├──► [Success] ──► Write API response / revalidate ──► UI locks in server state
        │
        └──► [Failure] ──► Restore Snapshot ───────────────► UI rolls back seamlessly

```

*** copy How do you build a custom useSWR hook in React using useSyncExternalStore?.md ***

Building a custom `useSWR` hook with **`useSyncExternalStore`** connects an external cache directly to React 18+ Concurrent Mode while ensuring zero tearing and automatic re-rendering whenever background revalidations finish.

---

### Step 1: Create the Global SWR Store

The store handles caching, subscriber notifications, and deduplicating concurrent fetches.

```javascript
// swrStore.js
class SWRStore {
  constructor() {
    this.cache = new Map();         // key -> { data, error, isValidating, cachedAt }
    this.listeners = new Map();     // key -> Set<listenerCallback>
    this.inFlight = new Map();      // key -> Promise
  }

  // Stable default state
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
    if (set) {
      set.forEach((listener) => listener());
    }
  }

  _setEntry(key, partial) {
    const current = this.cache.get(key) || SWRStore.DEFAULT_STATE;
    // Keep object reference immutable so React snapshot checks detect changes
    this.cache.set(key, { ...current, ...partial });
    this._notify(key);
  }

  revalidate(key, fetcher) {
    if (!key || typeof fetcher !== 'function') return;

    // Deduplicate in-flight fetch requests for the same key
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
        this._setEntry(key, {
          error,
          isValidating: false,
        });
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

### Step 2: Build the `useSWR` Hook

We bind `useSyncExternalStore` and trigger the SWR revalidation logic in `useEffect`.

```javascript
// useSWR.js
import { useSyncExternalStore, useEffect, useCallback, useRef } from 'react';
import { globalSWRStore } from './swrStore';

export function useSWR(key, fetcher, options = {}) {
  const { dedupingInterval = 2000, revalidateOnFocus = true } = options;
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // 1. Subscribe to external store changes for this key
  const subscribe = useCallback(
    (onStoreChange) => globalSWRStore.subscribe(key, onStoreChange),
    [key]
  );

  // 2. Read snapshot from store
  const getSnapshot = useCallback(
    () => globalSWRStore.getSnapshot(key),
    [key]
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // 3. Stale-While-Revalidate Trigger
  const mutate = useCallback(
    () => globalSWRStore.revalidate(key, fetcherRef.current),
    [key]
  );

  useEffect(() => {
    if (!key) return;

    const shouldRevalidate =
      state.data === undefined ||
      Date.now() - state.cachedAt > dedupingInterval;

    if (shouldRevalidate) {
      mutate();
    }
  }, [key, state.data, state.cachedAt, dedupingInterval, mutate]);

  // 4. Optional: Window Focus Revalidation
  useEffect(() => {
    if (!revalidateOnFocus || !key) return;

    const handleFocus = () => {
      if (Date.now() - state.cachedAt > dedupingInterval) {
        mutate();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [key, state.cachedAt, dedupingInterval, revalidateOnFocus, mutate]);

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

### Step 3: Usage in Components

```jsx
import React from 'react';
import { useSWR } from './useSWR';

const fetchUser = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export function UserProfile({ userId }) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    fetchUser
  );

  if (isLoading) return <p>Initial loading spinner...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>{data.name}</h3>
      <p>Email: {data.email}</p>
      {isValidating && <small style={{ color: 'orange' }}>Refreshing in background...</small>}

      <button onClick={() => mutate()} disabled={isValidating}>
        Force Refresh
      </button>
    </div>
  );
}

```

---

### What Makes This Architecture Resilient?

* **No Tearing:** `useSyncExternalStore` reads synchronously, guaranteeing no stale or partially updated frames during concurrent rendering.
* **Shared State Across Components:** If two separate components invoke `useSWR('/api/user/1', fetcher)`:
* Only **one** network request is sent.
* Both components re-render simultaneously once the background fetch resolves.

* **Instant Mounts (Stale Data):** When navigating back to a previously mounted route, `data` is immediately available from cache while revalidating in the background.

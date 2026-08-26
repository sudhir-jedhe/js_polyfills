*** copy Show how to update this useFetch hook to implement the stale-while-revalidate (SWR) caching pattern.md ***

Here is the updated `useFetch` hook implementing the **Stale-While-Revalidate (SWR)** pattern.

The strategy works by immediately returning existing cached data (even if stale) to keep the UI instant, while concurrently dispatching a background network request to revalidate and update the cache and UI without triggering a full loading state.

---

**1. SWR-Enabled `useFetch.js**`

```javascript
// src/hooks/useFetch.js
import { useState, useEffect, useRef, useCallback } from 'react';

// In-memory cache store: Map<string, { data: any, timestamp: number }>
const cache = new Map();

export const cacheManager = {
  clearCache: (key) => {
    if (key) cache.delete(key);
    else cache.clear();
  },
  get: (key) => cache.get(key) || null,
  set: (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
  },
};

/**
 * Custom hook implementing Stale-While-Revalidate (SWR) caching with AbortController.
 * @param {string} url - Target endpoint.
 * @param {RequestInit} [options] - Native fetch options.
 * @param {Object} [config] - Hook configuration.
 * @param {boolean} [config.skip=false] - Skip immediate execution.
 * @param {boolean} [config.useCache=true] - Enable SWR caching.
 * @param {number} [config.staleTime=30000] - Max age (ms) before data is considered stale and triggers background revalidation.
 */
export function useFetch(
  url,
  options = {},
  config = { skip: false, useCache: true, staleTime: 30000 }
) {
  const { skip = false, useCache = true, staleTime = 30000 } = config;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [error, setError] = useState(null);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const executeFetch = useCallback(
    async (signal, isManualRefetch = false) => {
      if (!url) return;

      const cacheKey = `${optionsRef.current.method || 'GET'}:${url}`;
      const cached = useCache ? cacheManager.get(cacheKey) : null;
      const isStale = !cached || Date.now() - cached.timestamp > staleTime;

      // 1. Stale-While-Revalidate resolution
      if (cached && !isManualRefetch) {
        setData(cached.data);
        setError(null);

        // Data is still fresh; skip background network fetch entirely
        if (!isStale) {
          setLoading(false);
          setIsRevalidating(false);
          return;
        }

        // Data is stale: serve cached data instantly, mark background fetch active
        setIsRevalidating(true);
      } else {
        // No cache exists or manual refetch forced: trigger full initial loading
        setLoading(true);
      }

      try {
        const response = await fetch(url, {
          ...optionsRef.current,
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
        }

        const freshData = await response.json();

        // 2. Update cache and component state with fresh payload
        if (useCache) {
          cacheManager.set(cacheKey, freshData);
        }

        setData(freshData);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to revalidate data');
        }
      } finally {
        setLoading(false);
        setIsRevalidating(false);
      }
    },
    [url, useCache, staleTime]
  );

  useEffect(() => {
    if (skip || !url) return;

    const controller = new AbortController();
    executeFetch(controller.signal);

    return () => {
      controller.abort();
    };
  }, [url, skip, executeFetch]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    executeFetch(controller.signal, true);
  }, [executeFetch]);

  return { data, loading, isRevalidating, error, refetch };
}

```

---

**2. Example Usage Component (`PostDashboard.jsx`)**

```jsx
// src/components/PostDashboard.jsx
import React, { useState } from 'react';
import { useFetch, cacheManager } from '../hooks/useFetch';

export default function PostDashboard() {
  const [postId, setPostId] = useState(1);

  // Stale after 10 seconds; serves cached data instantly and revalidates in the background
  const { data: post, loading, isRevalidating, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { headers: { Accept: 'application/json' } },
    { useCache: true, staleTime: 10000 }
  );

  return (
    <div style={{ maxWidth: '500px', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Post Viewer (SWR)</h3>
        {isRevalidating && (
          <span style={{ fontSize: '0.8rem', color: '#0066cc' }}>
            ● Updating in background...
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <button onClick={() => setPostId(1)}>Post 1</button>
        <button onClick={() => setPostId(2)}>Post 2</button>
        <button onClick={() => refetch()}>Force Network Refresh</button>
      </div>

      {loading && <p>Loading initial data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {post && (
        <div style={{ border: '1px solid #e0e0e0', padding: '1rem', borderRadius: '6px' }}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      )}
    </div>
  );
}

```

---

**Key Mechanics**

* **Instant Rendering:** If a cache entry exists, `setData(cached.data)` executes synchronously, eliminating blank screen transitions when switching tabs or items.
* **Non-Blocking Background Fetch (`isRevalidating`):** Revalidation runs silently without toggling `loading: true`. The UI provides an optional `isRevalidating` indicator to display subtle update spinners.
* **Cache Rehydration:** Once the background fetch resolves, `cacheManager.set` updates the store and the component re-renders with fresh data seamlessly.

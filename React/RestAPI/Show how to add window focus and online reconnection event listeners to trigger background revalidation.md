***  Show how to add window focus and online reconnection event listeners to trigger background revalidation.md ***

Here is the updated `useFetch` hook incorporating **automatic background revalidation on window focus** (when a user switches tabs or returns to the browser) and **network reconnection** (when the internet connection drops and restores).

---

**1. Updated `useFetch.js` with Focus & Reconnect Listeners**

```javascript
// src/hooks/useFetch.js
import { useState, useEffect, useRef, useCallback } from 'react';

const cache = new Map();

export const cacheManager = {
  clearCache: (key) => (key ? cache.delete(key) : cache.clear()),
  get: (key) => cache.get(key) || null,
  set: (key, data) => cache.set(key, { data, timestamp: Date.now() }),
};

/**
 * Custom hook with SWR caching, window focus revalidation, and reconnect triggers.
 * @param {string} url - Target URL.
 * @param {RequestInit} [options] - Native fetch options.
 * @param {Object} [config] - Configuration.
 * @param {boolean} [config.skip=false] - Skip initial execution.
 * @param {boolean} [config.useCache=true] - Enable SWR caching.
 * @param {number} [config.staleTime=30000] - Age (ms) before data is stale.
 * @param {boolean} [config.revalidateOnFocus=true] - Revalidate on window focus/visibility change.
 * @param {boolean} [config.revalidateOnReconnect=true] - Revalidate when browser regains internet.
 */
export function useFetch(
  url,
  options = {},
  config = {
    skip: false,
    useCache: true,
    staleTime: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  }
) {
  const {
    skip = false,
    useCache = true,
    staleTime = 30000,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
  } = config;

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

      // 1. SWR serving
      if (cached && !isManualRefetch) {
        setData(cached.data);
        setError(null);

        if (!isStale) {
          setLoading(false);
          setIsRevalidating(false);
          return;
        }

        setIsRevalidating(true);
      } else {
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

        if (useCache) {
          cacheManager.set(cacheKey, freshData);
        }

        setData(freshData);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch data');
        }
      } finally {
        setLoading(false);
        setIsRevalidating(false);
      }
    },
    [url, useCache, staleTime]
  );

  // Initial fetch and dependency handling
  useEffect(() => {
    if (skip || !url) return;

    const controller = new AbortController();
    executeFetch(controller.signal);

    return () => controller.abort();
  }, [url, skip, executeFetch]);

  // Window focus and tab visibility revalidation
  useEffect(() => {
    if (!revalidateOnFocus || skip || !url) return;

    let controller = new AbortController();

    const handleFocus = () => {
      // Avoid revalidating if document is hidden or network is offline
      if (document.visibilityState === 'visible' && navigator.onLine) {
        controller.abort(); // Cancel any existing background call
        controller = new AbortController();
        executeFetch(controller.signal);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      controller.abort();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [revalidateOnFocus, skip, url, executeFetch]);

  // Online network reconnect revalidation
  useEffect(() => {
    if (!revalidateOnReconnect || skip || !url) return;

    let controller = new AbortController();

    const handleOnline = () => {
      controller.abort();
      controller = new AbortController();
      executeFetch(controller.signal);
    };

    window.addEventListener('online', handleOnline);

    return () => {
      controller.abort();
      window.removeEventListener('online', handleOnline);
    };
  }, [revalidateOnReconnect, skip, url, executeFetch]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    executeFetch(controller.signal, true);
  }, [executeFetch]);

  return { data, loading, isRevalidating, error, refetch };
}

```

---

**2. Example Usage Component (`LiveStockFeed.jsx`)**

```jsx
// src/components/LiveStockFeed.jsx
import React from 'react';
import { useFetch } from '../hooks/useFetch';

export default function LiveStockFeed() {
  const {
    data: stock,
    loading,
    isRevalidating,
    error,
    refetch,
  } = useFetch(
    'https://jsonplaceholder.typicode.com/posts/1',
    { headers: { Accept: 'application/json' } },
    {
      useCache: true,
      staleTime: 10000, // Revalidates on focus only if cache is older than 10s
      revalidateOnFocus: true, // Listens to tab switches / window focus
      revalidateOnReconnect: true, // Triggers when Wi-Fi reconnects
    }
  );

  return (
    <div style={{ maxWidth: '480px', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3>Live Feed</h3>
        {isRevalidating && (
          <span style={{ fontSize: '0.8rem', color: '#0070f3', fontWeight: 'bold' }}>
            ● Syncing...
          </span>
        )}
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {stock && (
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h4>{stock.title}</h4>
          <p>{stock.body}</p>
        </div>
      )}

      <button onClick={() => refetch()} style={{ marginTop: '1rem' }}>
        Force Manual Refresh
      </button>
    </div>
  );
}

```

---

**Key Enhancements**

* **`visibilitychange` + `focus` Handling:** Fires only when `document.visibilityState === 'visible'` to avoid wasted background fetches while the tab remains minimized.
* **`navigator.onLine` Guard:** Prevents unnecessary network request failures when the window gains focus while the user has no network connection.
* **Automatic Request Cancellation:** If a user rapidly focuses and unfocuses a tab, previous pending background abort controllers are cancelled before dispatching a new revalidation request.

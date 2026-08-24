Here is the updated `useFetch` hook featuring **TTL-based (Time-To-Live)** cache expiration, automatic cleanup of stale entries, and a standalone `clearCache` helper function.

---

**1. Updated `useFetch.js` with TTL and `clearCache**`

```javascript
// src/hooks/useFetch.js
import { useState, useEffect, useRef, useCallback } from 'react';

// In-memory cache: Map<string, { data: any, expiry: number }>
const cache = new Map();

/**
 * Cache management utility functions.
 */
export const cacheManager = {
  /**
   * Clears specific cache key or the entire cache.
   * @param {string} [key] - Optional specific key (e.g. 'GET:https://api.com/users').
   */
  clearCache: (key) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  },

  /**
   * Retrieves active, non-expired cache value.
   */
  get: (key) => {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      cache.delete(key); // Evict expired entry
      return null;
    }
    return entry.data;
  },

  /**
   * Stores value with calculated expiry timestamp.
   */
  set: (key, data, ttlMs) => {
    cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  },
};

/**
 * Custom hook for data fetching with TTL-based caching and AbortController.
 * @param {string} url - Target URL.
 * @param {RequestInit} [options] - Native fetch options.
 * @param {Object} [config] - Hook configuration.
 * @param {boolean} [config.skip=false] - Skip initial fetch on mount.
 * @param {boolean} [config.useCache=true] - Toggle caching behavior.
 * @param {number} [config.ttl=60000] - Cache Time-To-Live in milliseconds (default: 60s).
 */
export function useFetch(
  url,
  options = {},
  config = { skip: false, useCache: true, ttl: 60000 }
) {
  const { skip = false, useCache = true, ttl = 60000 } = config;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip && Boolean(url));
  const [error, setError] = useState(null);

  // Keep options stable across re-renders
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const executeFetch = useCallback(
    async (signal, isForceRefetch = false) => {
      if (!url) return;

      const cacheKey = `${optionsRef.current.method || 'GET'}:${url}`;

      // 1. Check valid unexpired cache
      if (useCache && !isForceRefetch) {
        const cachedData = cacheManager.get(cacheKey);
        if (cachedData !== null) {
          setData(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...optionsRef.current,
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
        }

        const result = await response.json();

        // 2. Write to cache with TTL
        if (useCache) {
          cacheManager.set(cacheKey, result, ttl);
        }

        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Network request failed');
        }
      } finally {
        setLoading(false);
      }
    },
    [url, useCache, ttl]
  );

  // Trigger fetch on mount / parameter change
  useEffect(() => {
    if (skip || !url) return;

    const controller = new AbortController();
    executeFetch(controller.signal);

    return () => {
      controller.abort();
    };
  }, [url, skip, executeFetch]);

  // Force refetch bypassing cache
  const refetch = useCallback(() => {
    const controller = new AbortController();
    executeFetch(controller.signal, true);
  }, [executeFetch]);

  return { data, loading, error, refetch };
}

```

---

**2. Example Usage with Cache Control & Expiration**

```jsx
// src/components/UserProfile.jsx
import React, { useState } from 'react';
import { useFetch, cacheManager } from '../hooks/useFetch';

export default function UserProfile() {
  const [userId, setUserId] = useState(1);

  // Cached for 15 seconds (15000 ms)
  const { data: user, loading, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    { headers: { Accept: 'application/json' } },
    { useCache: true, ttl: 15000 }
  );

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h3>User Profile (15s TTL Cache)</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => refetch()}>Force Refetch (Bypass Cache)</button>
        <button onClick={() => cacheManager.clearCache()} style={{ color: 'red' }}>
          Clear All Cache
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {user && !loading && (
        <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '6px' }}>
          <h4>{user.name}</h4>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      )}
    </div>
  );
}

```

---

**Key Improvements**

* **Timestamp Validation (`Date.now() > entry.expiry`):** When accessing a cached item, `cacheManager.get` evaluates if the entry is older than its TTL. Stale entries are evicted on the fly.
* **Granular or Global Clearing:** `cacheManager.clearCache('GET:https://...')` invalidates a single endpoint, while `cacheManager.clearCache()` wipes the entire store.
* **Per-Request TTL Configuration:** You can configure varying cache durations per query (e.g., `ttl: 5000` for dynamic dashboard stats, `ttl: 300000` for static config lists).

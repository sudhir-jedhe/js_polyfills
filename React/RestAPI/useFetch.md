***  useFetch.md ***

Here is a complete, production-ready implementation of a custom `useFetch` hook in React featuring an in-memory cache, loading/error states, manual refetching, and cleanup via `AbortController`.

---

**1. The `useFetch` Hook (`useFetch.js`)**

```javascript
// src/hooks/useFetch.js
import { useState, useEffect, useRef, useCallback } from 'react';

// In-memory cache shared across hook instances
const cache = new Map();

/**
 * Custom hook for data fetching with caching and AbortController.
 * @param {string} url - Target URL.
 * @param {RequestInit} [options] - Native Fetch options (headers, method, etc.).
 * @param {Object} [config] - Hook configuration.
 * @param {boolean} [config.skip=false] - Skip immediate fetching on mount.
 * @param {boolean} [config.useCache=true] - Toggle caching behavior.
 */
export function useFetch(url, options = {}, config = { skip: false, useCache: true }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!config.skip && Boolean(url));
  const [error, setError] = useState(null);

  // Stabilize options object reference to prevent infinite effect loops
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(
    async (overrideUrl = url, isRefetch = false) => {
      if (!overrideUrl) return;

      const cacheKey = `${optionsRef.current.method || 'GET'}:${overrideUrl}`;

      // 1. Serve from cache if available and not explicitly refetching
      if (config.useCache !== false && !isRefetch && cache.has(cacheKey)) {
        setData(cache.get(cacheKey));
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const controller = new AbortController();

      try {
        const response = await fetch(overrideUrl, {
          ...optionsRef.current,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
        }

        const result = await response.json();

        // 2. Save result in cache
        if (config.useCache !== false) {
          cache.set(cacheKey, result);
        }

        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    },
    [url, config.useCache]
  );

  useEffect(() => {
    if (config.skip || !url) return;

    const controller = new AbortController();

    async function execute() {
      const cacheKey = `${optionsRef.current.method || 'GET'}:${url}`;

      if (config.useCache !== false && cache.has(cacheKey)) {
        setData(cache.get(cacheKey));
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...optionsRef.current,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (config.useCache !== false) {
          cache.set(cacheKey, result);
        }

        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    }

    execute();

    // Abort ongoing network request if component unmounts or URL changes
    return () => {
      controller.abort();
    };
  }, [url, config.skip, config.useCache]);

  const refetch = useCallback(() => fetchData(url, true), [fetchData, url]);

  return { data, loading, error, refetch };
}

```

---

**2. Example Usage Component (`UserList.jsx`)**

```jsx
// src/components/UserList.jsx
import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function UserList() {
  const [userId, setUserId] = useState('1');

  const { data: user, loading, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    { headers: { Accept: 'application/json' } },
    { useCache: true }
  );

  return (
    <div style={{ maxWidth: '450px', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>User Inspector</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <button onClick={() => setUserId('1')}>User 1</button>
        <button onClick={() => setUserId('2')}>User 2</button>
        <button onClick={() => setUserId('3')}>User 3</button>
        <button onClick={() => refetch()}>Force Refetch</button>
      </div>

      {loading && <p>Loading user data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {user && !loading && (
        <div>
          <h4>{user.name}</h4>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.address?.city}</p>
          <p><strong>Company:</strong> {user.company?.name}</p>
        </div>
      )}
    </div>
  );
}

```

---

**Key Features Included**

* **Automatic Cleanup:** Binds an `AbortController` signal to every fetch call to cleanly abort pending requests if the component unmounts or the URL changes before completion.
* **In-Memory Cache:** Avoids duplicate network calls when toggling between already-fetched URLs.
* **Manual Cache Busting:** The exposed `refetch()` method forces a fresh network call, bypassing and updating the cache entry.
* **Race Condition Protection:** Fast switching between IDs cancels the previous request before updating the active state.

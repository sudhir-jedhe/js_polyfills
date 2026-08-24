# Problem: In-Memory Cache Layer for Repeated Fetches

**Requirements:**
- Multiple components fetching the same URL within a session should not each fire their own network request.
- A second call for a URL already in flight should reuse the same pending promise (deduplication), not start a new request.
- Once resolved, subsequent calls for the same URL should return the cached value instantly (no network call) until the cache is explicitly cleared/invalidated.

## Solution

```jsx
import { useEffect, useState } from 'react';

// module-level cache — shared across every component that imports this file
const cache = new Map(); // url -> { status: 'pending' | 'resolved' | 'rejected', promise, data, error }

function getCacheEntry(url) {
  let entry = cache.get(url);
  if (!entry) {
    const promise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        entry.status = 'resolved';
        entry.data = data;
        return data;
      })
      .catch((error) => {
        entry.status = 'rejected';
        entry.error = error;
        throw error;
      });

    entry = { status: 'pending', promise, data: null, error: null };
    cache.set(url, entry);
  }
  return entry;
}

function useCachedFetch(url) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const entry = getCacheEntry(url);

    if (entry.status === 'pending') {
      entry.promise
        .catch(() => {}) // already recorded on the entry; avoid unhandled rejection noise
        .finally(() => {
          if (!cancelled) forceRender((n) => n + 1);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [url]);

  const entry = cache.get(url) ?? getCacheEntry(url);
  return {
    data: entry.data,
    loading: entry.status === 'pending',
    error: entry.error,
  };
}

// Call this after a mutation that invalidates a cached URL
// (e.g., after creating a new item, invalidate the list endpoint).
function invalidateCache(url) {
  cache.delete(url);
}

export { useCachedFetch, invalidateCache };
```

## Usage — deduplication across sibling components

```jsx
function HeaderAvatar() {
  const { data: user, loading } = useCachedFetch('/api/users/me');
  if (loading) return <Skeleton />;
  return <img src={user.avatarUrl} alt={user.name} />;
}

function ProfileCard() {
  const { data: user, loading } = useCachedFetch('/api/users/me');
  if (loading) return <Skeleton />;
  return <p>{user.name}</p>;
}

// Both components mount at the same time; only ONE network request
// fires for /api/users/me — the second component's effect finds the
// entry already 'pending' and just awaits the same promise.
```

**Notes:**
- This is a deliberately minimal cache (no TTL, no automatic revalidation, no focus-refetch) — it demonstrates the core idea (dedup in-flight requests, reuse resolved data) that libraries like React Query build on top of. In a real app, prefer adopting such a library once caching needs grow beyond this.
- `invalidateCache(url)` is the escape hatch for mutations — call it after a POST/PUT/DELETE that makes the cached GET response stale, so the next read refetches.

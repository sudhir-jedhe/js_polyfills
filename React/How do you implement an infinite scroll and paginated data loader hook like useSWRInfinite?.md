*** copy How do you implement an infinite scroll and paginated data loader hook like useSWRInfinite?.md ***

An **infinite pagination hook** (like `useSWRInfinite`) builds on top of base caching by managing a dynamic array of page keys and aggregating each page's response into a unified 2D array: `[ [Page 1 Data], [Page 2 Data], ... ]`.

---

### Step 1: Implement `useSWRInfinite`

The hook accepts a `getKey` function `(pageIndex, previousPageData) => key | null`. If `getKey` returns `null`, pagination stops (reached the end).

```javascript
// useSWRInfinite.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSWR } from './useSWR';
import { globalSWRStore } from './swrStore';

export function useSWRInfinite(getKey, fetcher, options = {}) {
  const [size, setSize] = useState(1);
  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // 1. Resolve keys for all active pages
  const pageKeys = [];
  let prevData = null;

  for (let i = 0; i < size; i++) {
    const key = getKeyRef.current(i, prevData);
    if (key === null) break; // End of list reached

    pageKeys.push(key);
    const snapshot = globalSWRStore.getSnapshot(key);
    prevData = snapshot.data ?? null;
  }

  // 2. Aggregate data, loading, validating, and error states across pages
  const data = [];
  let error = null;
  let isValidating = false;
  let isInitialLoading = true;

  for (let i = 0; i < pageKeys.length; i++) {
    const key = pageKeys[i];
    // Read directly from SWRStore snapshot
    const pageSnapshot = globalSWRStore.getSnapshot(key);

    if (pageSnapshot.data !== undefined) {
      data.push(pageSnapshot.data);
      isInitialLoading = false;
    }
    if (pageSnapshot.error) {
      error = pageSnapshot.error;
    }
    if (pageSnapshot.isValidating) {
      isValidating = true;
    }
  }

  // 3. Fetch missing pages
  useEffect(() => {
    pageKeys.forEach((key) => {
      const pageSnapshot = globalSWRStore.getSnapshot(key);
      if (pageSnapshot.data === undefined && !pageSnapshot.isValidating) {
        globalSWRStore.revalidate(key, fetcherRef.current);
      }
    });
  }, [pageKeys.join(',')]);

  // 4. Determine if reaching the end
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (data.length > 0 && getKeyRef.current(data.length, data[data.length - 1]) === null);

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [isReachingEnd, isValidating]);

  // Flattened utility: data is [[item1, item2], [item3, item4]] -> [item1, item2, item3, item4]
  const flatData = data.flat();

  return {
    data,              // 2D Array of pages
    flatData,          // Flattened 1D Array of all items
    error,
    size,
    setSize,
    loadMore,
    isLoading: isInitialLoading && !error,
    isValidating,
    isReachingEnd,
  };
}

```

---

### Step 2: Use in an Infinite Scrolling Component

```jsx
import React, { useRef, useEffect } from 'react';
import { useSWRInfinite } from './useSWRInfinite';

const PAGE_SIZE = 10;

// Key generator: returns null when the last page had fewer items than PAGE_SIZE
const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && previousPageData.length === 0) return null; // Reached end
  if (previousPageData && previousPageData.length < PAGE_SIZE) return null; // Last batch was partial

  return `https://jsonplaceholder.typicode.com/posts?_page=${pageIndex + 1}&_limit=${PAGE_SIZE}`;
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export function InfinitePostList() {
  const {
    flatData: posts,
    error,
    loadMore,
    isLoading,
    isValidating,
    isReachingEnd,
  } = useSWRInfinite(getKey, fetcher);

  const sentinelRef = useRef(null);

  // Auto-trigger loadMore with IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isReachingEnd && !isValidating) {
        loadMore();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, isReachingEnd, isValidating]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Infinite Posts Feed</h2>

      {isLoading && <p>Loading initial posts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: 12 }}>
            <strong>#{post.id}: {post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      {/* Intersection Sentinel */}
      <div ref={sentinelRef} style={{ height: 20, textAlign: 'center' }}>
        {isValidating && <p>Loading next page...</p>}
        {isReachingEnd && <p>🎉 You have reached the end!</p>}
      </div>
    </div>
  );
}

```

---

### How Page Chaining Works

```text
Page 0 (Index 0, PrevData = null)       ──► Key: "/posts?_page=1" ──► Fetch Page 1 [Items 1..10]
                                                                             │
Page 1 (Index 1, PrevData = Page 1)     ──► Key: "/posts?_page=2" ──► Fetch Page 2 [Items 11..20]
                                                                             │
Page 2 (Index 2, PrevData = Page 2)     ──► Key: "/posts?_page=3" ──► Empty / Less than limit
                                                                             │
getKey returns null ─────────────────────────────────────────────────────────┴─► isReachingEnd = true

```

* **Independent Page Caching:** Each page key (e.g., `_page=1`, `_page=2`) is stored independently in `SWRStore`, enabling instant back-navigation and individual cache revalidation.
* **Auto-Termination:** Returning `null` from `getKey` cleanly stops observers and buttons from dispatching redundant requests.

*** copy OptimizedSearchList.md ***

An optimized search and filter architecture in React combining a custom **Debounce Hook**, **Intersection Observer API** for infinite scrolling, and an **AbortController** to prevent race conditions during rapid querying.

---

### 1. Custom Debounce Hook (`useDebounce.js`)

Delays updating the search query until the user stops typing for $300\text{ms}$.

```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

```

---

### 2. Mock API Service with Pagination (`api.js`)

Simulates a remote backend endpoint supporting query filtering and cursor/page pagination.

```javascript
// 60-item mock database
const MOCK_DB = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Item #${i + 1} - ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][i % 5]}`,
  category: ['Electronics', 'Books', 'Clothing'][i % 3],
}));

export async function fetchItems({ query = '', category = '', page = 1, limit = 10, signal }) {
  // Simulate 350ms network latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const filtered = MOCK_DB.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    return matchesQuery && matchesCategory;
  });

  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < filtered.length;

  return { data: paginatedData, hasMore, total: filtered.length };
}

```

---

### 3. Main Component (`OptimizedSearchList.jsx`)

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { fetchItems } from './api';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing'];
const PAGE_SIZE = 10;

export default function OptimizedSearchList() {
  const [rawSearch, setRawSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce the input state
  const debouncedSearch = useDebounce(rawSearch, 300);

  // Reset list & pagination whenever filters change
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(false);
  }, [debouncedSearch, category]);

  // Data Fetching with AbortController for race condition avoidance
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchItems({
      query: debouncedSearch,
      category: category === 'All' ? '' : category,
      page,
      limit: PAGE_SIZE,
      signal: controller.signal,
    })
      .then((res) => {
        setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
        setHasMore(res.hasMore);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Failed to load records.');
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, category, page]);

  // Infinite Scroll Trigger via IntersectionObserver ref callback
  const observerRef = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div style={styles.container}>
      <h2>Optimized Search & Infinite Scroll</h2>

      {/* Control Bar */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search items..."
          value={rawSearch}
          onChange={(e) => setRawSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div style={styles.list}>
        {items.map((item, index) => {
          const isLastElement = items.length === index + 1;
          return (
            <div
              key={`${item.id}-${index}`}
              ref={isLastElement ? lastElementRef : null}
              style={styles.card}
            >
              <div>
                <strong>{item.title}</strong>
                <div style={styles.badge}>{item.category}</div>
              </div>
              <span style={styles.idTag}>ID: #{item.id}</span>
            </div>
          );
        })}

        {/* Status Indicators */}
        {loading && <div style={styles.status}>Loading items...</div>}
        {error && <div style={{ ...styles.status, color: '#e53e3e' }}>{error}</div>}
        {!loading && !hasMore && items.length > 0 && (
          <div style={styles.status}>You have reached the end of the results.</div>
        )}
        {!loading && items.length === 0 && (
          <div style={styles.status}>No matching records found.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '0 16px',
    color: '#1a202c',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    flex: 2,
    padding: '10px 14px',
    fontSize: '0.95rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    outline: 'none',
  },
  select: {
    flex: 1,
    padding: '10px',
    fontSize: '0.95rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    backgroundColor: '#fff',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  badge: {
    fontSize: '0.75rem',
    display: 'inline-block',
    marginTop: '4px',
    padding: '2px 8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    color: '#4a5568',
  },
  idTag: {
    fontSize: '0.8rem',
    color: '#a0aec0',
  },
  status: {
    textAlign: 'center',
    padding: '16px',
    color: '#718096',
    fontSize: '0.9rem',
  },
};

```

---

### Architectural Highlights

* **Debounced State Isolation:** Separating `rawSearch` (instant UI feedback) from `debouncedSearch` (triggers network requests) ensures keystrokes remain non-blocking.
* **Race Condition Prevention:** The `AbortController` terminates ongoing in-flight HTTP requests whenever a user types before the previous fetch finishes.
* **Ref-Based `IntersectionObserver`:** Attaching a callback ref directly to the last DOM node dynamically re-observes the bottom element as the array grows, eliminating window scroll listener overhead.

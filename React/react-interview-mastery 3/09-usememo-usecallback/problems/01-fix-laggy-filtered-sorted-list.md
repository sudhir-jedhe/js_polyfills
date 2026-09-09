***  01-fix-laggy-filtered-sorted-list.md ***

# Problem 1: Fix a Laggy Filtered/Sorted List With `useMemo`

## The problem

`ProductTable` renders 20,000 products. It filters by a search term and sorts by price on every render. There's also an unrelated `tick` counter in the same parent (simulating some other UI state, like a live clock or a websocket-driven badge) that re-renders `App` every second — and every one of those re-renders re-triggers the full filter+sort over 20,000 items, even though neither the search term nor the price data changed.

## Before: recomputed on every render

```jsx
import { useState, useEffect } from 'react';

function generateProducts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Product ${i}`,
    price: Math.round(Math.random() * 1000),
  }));
}

const ALL_PRODUCTS = generateProducts(20000);

function expensiveFilterAndSort(products, query) {
  // Deliberately simulate real cost: a substring filter plus a full sort
  // over a large array — the kind of thing that's cheap once but adds up
  // if repeated every render for no reason.
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.sort((a, b) => a.price - b.price);
}

function ProductTableBefore({ query }) {
  const start = performance.now();
  const visible = expensiveFilterAndSort(ALL_PRODUCTS, query); // recomputed EVERY render
  const duration = (performance.now() - start).toFixed(2);

  return (
    <div>
      <p>Computed in {duration}ms (before fix)</p>
      <ul>
        {visible.slice(0, 20).map((p) => (
          <li key={p.id}>{p.name} — ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}

function AppBefore() {
  const [query, setQuery] = useState('');
  const [tick, setTick] = useState(0);

  // Simulates unrelated state changing elsewhere in the app (a clock, a
  // websocket counter, anything) — this alone forces ProductTableBefore
  // to re-render and, with it, redo the full filter+sort.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p>Unrelated tick: {tick}</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
      />
      <ProductTableBefore query={query} />
    </div>
  );
}
```

Every second, `tick` changes, `App` re-renders, `ProductTableBefore` re-renders, and `expensiveFilterAndSort` reruns over all 20,000 products — even though `query` hasn't changed since the last keystroke. On a slower device this is visibly janky (the ms figure logged/rendered will show a real, repeated cost).

## After: `useMemo` keyed only on what actually matters

```jsx
import { useState, useEffect, useMemo } from 'react';

function ProductTableAfter({ query }) {
  const start = performance.now();
  const visible = useMemo(
    () => expensiveFilterAndSort(ALL_PRODUCTS, query),
    [query] // recomputes only when query changes — NOT on every render
  );
  const duration = (performance.now() - start).toFixed(2);

  return (
    <div>
      <p>Computed in {duration}ms (after fix)</p>
      <ul>
        {visible.slice(0, 20).map((p) => (
          <li key={p.id}>{p.name} — ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}

function AppAfter() {
  const [query, setQuery] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p>Unrelated tick: {tick}</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
      />
      <ProductTableAfter query={query} />
    </div>
  );
}
```

## Before/after render-timing difference

If you log `duration` on every render:

- **Before:** every `tick` update (every 1s) shows a nonzero, real filter+sort cost (e.g., `8.42ms`, `9.10ms`, `8.77ms`...) — it never goes away, because the computation reruns unconditionally every render.
- **After:** the first render (and each render where `query` actually changed) shows the real cost once. Every render caused by `tick` alone shows effectively `0.00ms`-level work inside `ProductTableAfter` for the memoized computation, because `useMemo` returns the cached array without calling `expensiveFilterAndSort` again — the `performance.now()` measurement now only wraps a cache read, not a recompute.

The fix doesn't make the filter/sort itself faster — it eliminates the *redundant* runs that had nothing to do with the actual dependency (`query`).

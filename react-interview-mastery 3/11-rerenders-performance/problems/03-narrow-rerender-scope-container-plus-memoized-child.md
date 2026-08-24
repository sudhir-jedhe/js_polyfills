# Problem 3: Narrow the Re-Render Scope — Split a Large Stateful Component Into a Container + Memoized Presentational Child

## The problem

`ProductPage` is one large component that owns all of its own state — search text, sort order, *and* a `wishlist` `Set` of favorited product IDs — and renders both the search/sort controls and a large `ProductGrid` of 500 products directly in its own JSX. Every keystroke in the search box re-renders the entire component function, including the logic that builds all 500 `ProductCard` elements, even though the grid's actual visible content depends only on the filtered/sorted result, not on every keystroke transiently.

## Before: one large stateful component

```jsx
import { useState } from 'react';

function ProductPageBefore({ products }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [wishlist, setWishlist] = useState(new Set());

  console.log('ProductPageBefore render'); // fires on every keystroke, every sort change, every wishlist toggle

  const visible = products
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price));

  function toggleWishlist(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      {/* All 500 cards are re-created and re-rendered on every single keystroke */}
      <div className="grid">
        {visible.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => toggleWishlist(p.id)}>
              {wishlist.has(p.id) ? '★ Wishlisted' : '☆ Wishlist'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Every keystroke: `ProductPageBefore` re-renders, which recomputes `visible` (a filter + sort over up to 500 items) and re-renders every single `ProductCard`-equivalent `<div>` inline in the JSX, since none of it is memoized or split out.

## After: container + memoized presentational child

Split the responsibilities: `ProductPageContainer` owns state and orchestration; `ProductGrid` is a pure, memoized presentational component that only re-renders when its actual inputs (the already-computed `visible` list, and `wishlist`) change by reference.

```jsx
import { useState, useMemo, useCallback } from 'react';

// --- Container: owns all state, does the expensive filter/sort, passes
// stable, minimal props down. ---
function ProductPageContainer({ products }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [wishlist, setWishlist] = useState(new Set());

  console.log('ProductPageContainer render'); // still fires every keystroke — that's fine, this part is cheap

  const visible = useMemo(
    () =>
      products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) =>
          sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price
        ),
    [products, query, sortBy]
  );

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <ProductGrid products={visible} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
    </div>
  );
}

// --- Presentational, memoized: only re-renders when `products`, `wishlist`,
// or `onToggleWishlist` actually change by reference. ---
const ProductGrid = React.memo(function ProductGrid({ products, wishlist, onToggleWishlist }) {
  console.log('ProductGrid render');
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          isWishlisted={wishlist.has(p.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
});

const ProductCard = React.memo(function ProductCard({ product, isWishlisted, onToggleWishlist }) {
  console.log('ProductCard render', product.id);
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onToggleWishlist(product.id)}>
        {isWishlisted ? '★ Wishlisted' : '☆ Wishlist'}
      </button>
    </div>
  );
});
```

## Why this is better, precisely

- `visible` is now behind `useMemo`, so typing a character that doesn't change the filtered/sorted result set's *reference* (e.g., typing then immediately backspacing to the same query) still recomputes correctly whenever `query`/`sortBy`/`products` change — but the recompute itself, not the render, is what's expensive, and it's now isolated from re-render count.
- `ProductGrid` and `ProductCard` are both `React.memo`-wrapped. Since `toggleWishlist` is stabilized via `useCallback` and `visible`/`wishlist` only change reference when their actual contents change (not on every container render), `ProductGrid` — and every individual `ProductCard` — skips re-rendering on renders where nothing relevant to it changed.
- Toggling a single product's wishlist status now only re-renders `ProductGrid` (because `wishlist` — a new `Set` — legitimately changed reference) and, within it, only causes each `ProductCard` to re-render if `isWishlisted` for *that* card actually flipped, thanks to `React.memo`'s per-prop shallow comparison.
- Search/sort UI changes still re-render the container (cheap — it's just two inputs) and, when the filtered list result changes, the grid — but this was already unavoidable, since the visible list of cards must genuinely update when the user filters.

This mirrors the general strategy from `theory/06-identifying-and-narrowing-rerenders.md`: splitting narrows the *scope* of what a given state change forces to re-render, and memoizing the split-out pieces ensures that scope actually gets enforced rather than silently cascading anyway.

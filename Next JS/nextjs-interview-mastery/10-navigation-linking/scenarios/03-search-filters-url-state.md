# Scenario: Shareable, bookmarkable search filters driven by the URL

**Problem:** A product listing page has sort and category filters. The team wants filter state to live in the URL (so a filtered view is shareable and survives a refresh) rather than in component state (which resets on reload and can't be shared via link) — but changing a filter shouldn't feel like a full page navigation, and the underlying Server Component needs to read the current filters to fetch the right data.

**Approach:** Read initial/server-rendered filter state from `searchParams` in the Server Component page, and use `useRouter` + `usePathname` in a Client Component filter control to update the URL (via `router.push` with the new query string) without a full page reload — the Server Component re-runs its data fetch automatically because the URL (and therefore `searchParams`) genuinely changed.

```tsx
// app/products/page.tsx (Server Component)
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  const { sort = 'newest', category = 'all' } = await searchParams;
  const products = await getProducts({ sort, category });

  return (
    <div>
      <FilterBar currentSort={sort} currentCategory={category} />
      <ProductGrid products={products} />
    </div>
  );
}

// components/filter-bar.tsx (Client Component)
'use client';
import { useRouter, usePathname } from 'next/navigation';

export function FilterBar({
  currentSort,
  currentCategory,
}: {
  currentSort: string;
  currentCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams({ sort: currentSort, category: currentCategory });
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      <select value={currentSort} onChange={(e) => updateFilter('sort', e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
      </select>
      <select value={currentCategory} onChange={(e) => updateFilter('category', e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
      </select>
    </div>
  );
}
```

`router.push` here triggers an App Router transition, not a full reload — the shared layout persists, only the `page.tsx` segment re-fetches with the updated `searchParams`. Because the URL fully encodes the filter state, sharing the link or hitting refresh reproduces the exact same filtered view; `scroll: false` prevents the page from jumping to the top on every filter tweak, which would otherwise feel jarring for a user scrolled partway down a long product grid.

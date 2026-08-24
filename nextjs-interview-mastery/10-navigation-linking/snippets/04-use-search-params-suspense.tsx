// app/products/page.tsx (Server Component) + sort-indicator.tsx (Client Component)
// useSearchParams requires BOTH 'use client' AND a Suspense boundary
// around the component that calls it, when rendered inside an
// otherwise-static page.

// --- sort-indicator.tsx ---
'use client';

import { useSearchParams } from 'next/navigation';

export function SortIndicator() {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') ?? 'relevance';
  return <span>Sorted by: {sort}</span>;
}

// --- app/products/page.tsx ---
import { Suspense } from 'react';
import { SortIndicator } from './sort-indicator';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      {/* Only this leaf is wrapped -- the rest of the page stays static. */}
      <Suspense fallback={<span>Sorted by: —</span>}>
        <SortIndicator />
      </Suspense>
      <ProductGridStatic />
    </div>
  );
}

function ProductGridStatic() {
  return <div>Static product grid content, unaffected by query string.</div>;
}

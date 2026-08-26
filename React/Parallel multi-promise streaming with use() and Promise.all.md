When streaming multiple asynchronous resources in React 19, combining **`Promise.all`** with **`use()`** allows you to initiate multiple data-fetching operations concurrently on the server and stream a single, synchronized result tuple to the client inside a `<Suspense>` boundary.

This pattern is ideal when datasets are interdependent and displaying partial data would cause layout shifts or invalid intermediate UI states (e.g., side-by-side product comparisons, exchange rate conversions, or correlated analytics).

---

### Architecture & Data Flow

```
[Server Component (RSC)]
     │
     ├── 1. Fires multiple fetches in parallel (non-blocking):
     │      p1 = fetchProduct(idA)  (e.g., 150ms)
     │      p2 = fetchProduct(idB)  (e.g., 300ms)
     │
     ├── 2. Combines them: `combinedPromise = Promise.all([p1, p2])`
     │
     └── 3. Streams HTML Shell + Flight pointer ($@tuple) immediately
                 │
                 ▼ (HTTP Stream)
[Client Browser]
     ├── Renders `<Suspense fallback={<ComparisonSkeleton />}>`
     │
     └── [When slowest fetch resolves (~300ms)]
           └── Flight resolves tuple chunk ──▶ `use(combinedPromise)` unwraps `[p1, p2]`
           └── `<ComparisonView />` paints both cards simultaneously (0 layout shift)

```

---

### Step 1: Combine Promises on the Server

Do **not** `await` `Promise.all` in the Server Component. Instead, construct the tuple promise and pass it as a raw prop down to the client component wrapped in `<Suspense>`:

```tsx
// app/compare/page.tsx (Server Component)
import { Suspense } from 'react';
import { ProductComparisonClient } from './ProductComparisonClient';
import { fetchProduct } from '@/lib/api';

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { a = 'prod_1', b = 'prod_2' } = await searchParams;

  // 1. Kick off both server requests in parallel
  const productAPromise = fetchProduct(a);
  const productBPromise = fetchProduct(b);

  // 2. Group into a single combined Promise tuple (do not await!)
  const comparisonPromise = Promise.all([productAPromise, productBPromise]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Product Comparison</h1>

      {/* 3. Wrap consumer in a Suspense boundary */}
      <Suspense fallback={<ComparisonSkeleton />}>
        <ProductComparisonClient comparisonPromise={comparisonPromise} />
      </Suspense>
    </main>
  );
}

function ComparisonSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 animate-pulse">
      <div className="h-64 bg-gray-100 rounded-lg border border-gray-200" />
      <div className="h-64 bg-gray-100 rounded-lg border border-gray-200" />
    </div>
  );
}

```

---

### Step 2: Unwrap the Tuple with `use()` in the Client Component

In the Client Component, `use()` suspends until **both** promises inside the tuple resolve, providing structured destructuring directly in the render body:

```tsx
// app/compare/ProductComparisonClient.tsx
'use client';

import { use } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  specs: Record<string, string>;
}

export function ProductComparisonClient({
  comparisonPromise,
}: {
  comparisonPromise: Promise<[Product, Product]>;
}) {
  // `use` unwraps the resolved [Product, Product] tuple
  const [productA, productB] = use(comparisonPromise);

  return (
    <div className="grid grid-cols-2 gap-6 border rounded-xl p-6 shadow-sm bg-white">
      {/* Product A Column */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">{productA.name}</h2>
        <p className="text-lg font-semibold text-blue-600">${productA.price}</p>
        <ul className="text-sm space-y-1 text-gray-600">
          {Object.entries(productA.specs).map(([key, val]) => (
            <li key={key}>
              <strong>{key}:</strong> {val}
            </li>
          ))}
        </ul>
      </div>

      {/* Product B Column */}
      <div className="space-y-3 border-l pl-6">
        <h2 className="text-xl font-bold text-gray-900">{productB.name}</h2>
        <p className="text-lg font-semibold text-blue-600">${productB.price}</p>
        <ul className="text-sm space-y-1 text-gray-600">
          {Object.entries(productB.specs).map(([key, val]) => (
            <li key={key}>
              <strong>{key}:</strong> {val}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

```

---

### `Promise.all` vs. Multiple Individual `use()` Calls

When coordinating multiple parallel promises, you have two design options:

#### Option A: `Promise.all` + Single `use()`

```tsx
// Server:
const combined = Promise.all([fetchA(), fetchB()]);

// Client:
const [dataA, dataB] = use(combined);

```

* **Render Strategy:** Atomic ("all-or-nothing").
* **Behavior:** The component suspends once and renders both sections at the exact same moment.
* **Best For:** Side-by-side diffs, mathematical calculations across two data points, charts plotting correlated series.

#### Option B: Multiple Independent `use()` Calls

```tsx
// Client:
const dataA = use(promiseA);
const dataB = use(promiseB);

```

* **Render Strategy:** Suspends sequentially in the render flow until all consumed promises finish.
* **Behavior:** If inside a single Suspense boundary, the user still waits for the slowest promise. However, if separated into **independent `<Suspense>` boundaries**, `dataA` can paint immediately without waiting for `dataB`.
* **Best For:** Unrelated widgets on a dashboard (e.g., user avatar vs. recent transactions).

---

### Handling Partial Rejections with `Promise.allSettled`

If one of the parallel fetches is non-critical and shouldn't reject the entire batch, swap `Promise.all` for **`Promise.allSettled`**:

```tsx
// Server Component
const resilientPromise = Promise.allSettled([
  fetchCriticalMetrics(),
  fetchOptionalMarketingFeed(),
]);

```

```tsx
// Client Component
export function MetricsView({
  resilientPromise,
}: {
  resilientPromise: Promise<[PromiseSettledResult<Metrics>, PromiseSettledResult<Feed>]>;
}) {
  const [metricsResult, feedResult] = use(resilientPromise);

  return (
    <div className="space-y-4">
      {metricsResult.status === 'fulfilled' ? (
        <MetricsDisplay data={metricsResult.value} />
      ) : (
        <p className="text-red-500">Failed to load core metrics.</p>
      )}

      {feedResult.status === 'fulfilled' ? (
        <FeedDisplay data={feedResult.value} />
      ) : (
        <p className="text-gray-400 text-sm">Marketing feed currently unavailable.</p>
      )}
    </div>
  );
}

```

---

### Summary Checklist

* **Parallel Execution:** Always initiate all server promises concurrently before bundling them into `Promise.all`.
* **Zero Client Waterfalls:** Because the network requests are fired in parallel during the server render, the total wait time is bounded by $\max(T_1, T_2, \dots, T_n)$, rather than $\sum T_n$.
* **Suspense Pairing:** Always wrap the component calling `use(Promise.all(...))` in a dedicated `<Suspense>` boundary to prevent blocking the root page shell.

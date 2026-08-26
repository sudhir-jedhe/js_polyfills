To coordinate multiple parallel async operations in React 19 without blocking the initial HTML stream or creating sequential waterfalls, you initiate all promises concurrently on the server and stream them to the client.

Depending on your UI requirements, you coordinate them using either **Independent Granular Suspense Boundaries** (progressive out-of-order rendering) or **Batched Suspense Boundaries** (synchronized "all-or-nothing" rendering).

---

### Pattern 1: Granular Parallel Streaming (Recommended)

When subtrees should render as soon as their respective data resolves (e.g., fast data appears first, slow data appears later without blocking the fast data).

#### 1. Server Component (Kicks off parallel fetches without `await`)

```tsx
// app/dashboard/page.tsx (Server Component)
import { Suspense } from 'react';
import { AnalyticsCardClient } from './AnalyticsCardClient';
import { RecentOrdersClient } from './RecentOrdersClient';
import { fetchAnalytics, fetchRecentOrders } from '@/lib/api';

export default function DashboardPage() {
  // 1. Fire both promises in parallel — DO NOT await them here
  const analyticsPromise = fetchAnalytics();     // e.g. takes 200ms
  const ordersPromise = fetchRecentOrders();       // e.g. takes 1200ms

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boundary A: Resolves and paints first (~200ms) */}
        <Suspense fallback={<CardSkeleton title="Loading Analytics..." />}>
          <AnalyticsCardClient dataPromise={analyticsPromise} />
        </Suspense>

        {/* Boundary B: Resolves and paints independently (~1200ms) */}
        <Suspense fallback={<CardSkeleton title="Loading Orders..." />}>
          <RecentOrdersClient dataPromise={ordersPromise} />
        </Suspense>
      </div>
    </main>
  );
}

function CardSkeleton({ title }: { title: string }) {
  return (
    <div className="p-4 border rounded animate-pulse bg-gray-50 h-40">
      <p className="text-gray-400 font-medium">{title}</p>
    </div>
  );
}

```

#### 2. Client Components (Unwrap individual promises with `use()`)

```tsx
// app/dashboard/AnalyticsCardClient.tsx
'use client';

import { use } from 'react';

export function AnalyticsCardClient({
  dataPromise,
}: {
  dataPromise: Promise<{ revenue: number; views: number }>;
}) {
  const analytics = use(dataPromise);

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-semibold text-lg">Analytics Overview</h3>
      <p>Views: {analytics.views.toLocaleString()}</p>
      <p>Revenue: ${analytics.revenue.toLocaleString()}</p>
    </div>
  );
}

```

```tsx
// app/dashboard/RecentOrdersClient.tsx
'use client';

import { use } from 'react';

export function RecentOrdersClient({
  dataPromise,
}: {
  dataPromise: Promise<Array<{ id: string; item: string }>>;
}) {
  const orders = use(dataPromise);

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-semibold text-lg">Recent Orders</h3>
      <ul className="list-disc pl-5">
        {orders.map((order) => (
          <li key={order.id}>{order.item}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Pattern 2: Batched Parallel Streaming with `Promise.all`

When two datasets are tightly coupled and must render together or not at all (preventing layout shifts or partial UI states).

#### Server Component

```tsx
// app/comparison/page.tsx (Server Component)
import { Suspense } from 'react';
import { CombinedComparisonView } from './CombinedComparisonView';
import { fetchProductA, fetchProductB } from '@/lib/api';

export default function ComparisonPage() {
  // Combine parallel promises on the server into a single tuple promise
  const comparisonPromise = Promise.all([
    fetchProductA(),
    fetchProductB(),
  ]);

  return (
    <main className="p-6">
      <Suspense fallback={<div>Loading side-by-side comparison...</div>}>
        <CombinedComparisonView comparisonPromise={comparisonPromise} />
      </Suspense>
    </main>
  );
}

```

#### Client Component

```tsx
// app/comparison/CombinedComparisonView.tsx
'use client';

import { use } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

export function CombinedComparisonView({
  comparisonPromise,
}: {
  comparisonPromise: Promise<[Product, Product]>;
}) {
  // `use` unwraps the tuple once both promises resolve
  const [productA, productB] = use(comparisonPromise);

  return (
    <div className="grid grid-cols-2 gap-4 border p-4 rounded">
      <div>
        <h2 className="font-bold">{productA.name}</h2>
        <p>${productA.price}</p>
      </div>
      <div>
        <h2 className="font-bold">{productB.name}</h2>
        <p>${productB.price}</p>
      </div>
    </div>
  );
}

```

---

### Multi-Promise Unwrapping Inside a Single Client Component

You can call `use()` multiple times within a single component. When doing so, the component suspends on the first pending promise and continues evaluating as subsequent promises fulfill:

```tsx
'use client';

import { use } from 'react';

export function UserDashboardWidget({
  userPromise,
  settingsPromise,
}: {
  userPromise: Promise<User>;
  settingsPromise: Promise<Settings>;
}) {
  // Both promises were initiated concurrently on the server
  const user = use(userPromise);
  const settings = use(settingsPromise);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Theme: {settings.theme}</p>
    </div>
  );
}

```

---

### Comparison of Parallel Coordination Strategies

| Strategy                              | Structure                                                                           | UI Behavior                                                                          | Best Used For                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Independent Suspense**              | Multiple `<Suspense>` wrappers around distinct components consuming `use(promise)`. | Incremental streaming; fast parts render immediately without waiting for slow parts. | Dashboards, feeds with sidebars, multi-widget pages.              |
| **`Promise.all` + Single `use()**`    | `Promise.all([p1, p2])` passed to one `<Suspense>` boundary.                        | Atomic display; UI appears all at once only when all data is ready.                  | Side-by-side diffs, synchronized comparison tables.               |
| **Multiple `use()` in One Component** | Calling `use(p1)` and `use(p2)` in the same component under one `<Suspense>`.       | Suspends until all consumed promises fulfill.                                        | Tightly coupled layouts requiring multiple independent endpoints. |

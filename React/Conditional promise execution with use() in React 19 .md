Unlike standard React hooks (`useState`, `useEffect`, `useMemo`), the **`use()` API is not bound by the traditional Rules of Hooks**. You can call `use()` conditionally inside **`if` statements, ternary operators, `switch` blocks, loops, and after early returns**.

This allows you to defer suspending a component and reading a Promise until specific conditions (such as user interactions, role checks, or prop flags) are met.

---

### 1. Conditional Unwrapping of Optional Streams

When data is only needed under specific conditions (e.g., when a user expands an accordion, opens a tab, or toggles comments), place `use()` inside an `if` statement:

```tsx
'use client';

import { use } from 'react';

interface CommentsProps {
  isOpen: boolean;
  commentsPromise?: Promise<Array<{ id: string; text: string }>>;
}

export function PostComments({ isOpen, commentsPromise }: CommentsProps) {
  // 1. Guard clause: Do not suspend if comments are collapsed
  if (!isOpen || !commentsPromise) {
    return <p className="text-gray-500 text-sm">Comments are hidden.</p>;
  }

  // 2. Conditional suspension: Suspends ONLY when `isOpen` is true
  const comments = use(commentsPromise);

  return (
    <ul className="space-y-2 mt-2">
      {comments.map((comment) => (
        <li key={comment.id} className="p-2 border rounded bg-gray-50">
          {comment.text}
        </li>
      ))}
    </ul>
  );
}

```

* **When `isOpen === false`:** The component renders immediately without suspending or touching the pending promise.
* **When `isOpen` changes to `true`:** React executes `use(commentsPromise)`, suspends the component to the nearest `<Suspense>` boundary, and renders the comment list once resolved.

---

### 2. Branching Between Multiple Promises (Role / Tab Switching)

You can conditionally select and unwrap different promise streams using standard JavaScript branching:

```tsx
'use client';

import { use } from 'react';

interface MetricsProps {
  role: 'admin' | 'viewer';
  adminPromise: Promise<{ revenue: number; serverHealth: string }>;
  viewerPromise: Promise<{ publicViews: number }>;
}

export function DashboardMetrics({ role, adminPromise, viewerPromise }: MetricsProps) {
  if (role === 'admin') {
    // Unwraps admin data; suspends strictly on adminPromise
    const data = use(adminPromise);
    return (
      <div className="p-4 bg-purple-50 border border-purple-200 rounded">
        <h3>Admin Analytics</h3>
        <p>Revenue: ${data.revenue.toLocaleString()}</p>
        <p>Health: {data.serverHealth}</p>
      </div>
    );
  }

  // Unwraps viewer data; suspends strictly on viewerPromise
  const publicData = use(viewerPromise);
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded">
      <h3>Public Views</h3>
      <p>Total Views: {publicData.publicViews.toLocaleString()}</p>
    </div>
  );
}

```

---

### 3. Early Return Guards Before `use()`

`use()` can be placed after early return statements without violating React lifecycle constraints:

```tsx
'use client';

import { use } from 'react';

interface OrderProps {
  orderId?: string | null;
  orderPromise?: Promise<{ id: string; total: number; status: string }>;
}

export function OrderSummary({ orderId, orderPromise }: OrderProps) {
  // Early return if missing inputs
  if (!orderId) {
    return <div className="text-gray-400">Please select an order.</div>;
  }

  if (!orderPromise) {
    return <div className="text-amber-500">Order stream not initialized.</div>;
  }

  // Safely executed only when inputs are valid
  const order = use(orderPromise);

  return (
    <div className="p-3 border rounded">
      <h4>Order #{order.id}</h4>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total.toFixed(2)}</p>
    </div>
  );
}

```

---

### The #1 Anti-Pattern: Creating Promises in the Render Body

While **unwrapping** with `use()` can be conditional, **instantiating a Promise directly inside the render pass is strictly forbidden**:

```tsx
// ❌ WRONG: Creates a new Promise instance on EVERY render pass
function BadComponent({ id, shouldFetch }) {
  if (shouldFetch) {
    // ⚠️ Causes an infinite Suspense loop / memory leak!
    const data = use(fetch(`/api/data/${id}`).then((res) => res.json()));
    return <div>{data.title}</div>;
  }
  return null;
}

```

#### Where to Create the Promise Safely

1. **Server Components:** Initiate the fetch in a Server Component without `await` and stream it down as a prop.
2. **Event Handlers / Actions:** Create the Promise inside an event callback (`onClick`, `startTransition`) and store its reference in state (`useState(promise)`).
3. **Server Cache:** Wrap server-side data fetchers with `React.cache()` to ensure stable reference equality across renders.

---

### Rules of Hooks Comparison

| Hook / API                   | Allowed in `if` / `switch` | Allowed in Loops | Allowed After Early Return | Suspends on Pending Promise     |
| ---------------------------- | -------------------------- | ---------------- | -------------------------- | ------------------------------- |
| **`useState` / `useEffect**` | ❌ No                       | ❌ No             | ❌ No                       | ❌ No                            |
| **`useContext(Context)`**    | ❌ No                       | ❌ No             | ❌ No                       | ❌ No                            |
| **`use(Context)`**           | ✅ **Yes**                  | ✅ **Yes**        | ✅ **Yes**                  | ❌ No                            |
| **`use(Promise)`**           | ✅ **Yes**                  | ✅ **Yes**        | ✅ **Yes**                  | ✅ **Yes** (inside `<Suspense>`) |

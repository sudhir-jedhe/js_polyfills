Because React 19’s **`use()`** API is not bound by the traditional Rules of Hooks, you can call it inside **`if` statements, ternary operators, early return guards, and `switch` blocks**.

This allows a component to suspend and unwrap a streamed Promise **only when a specific condition is met**, avoiding unnecessary suspense states or unneeded data unwrapping.

---

### 1. Conditional Unwrapping with Optional Props

When a streamed Promise is optional (e.g., fetching comments only when a drawer is open or when an ID exists), you can guard `use()` behind an `if` condition:

```tsx
// components/PostCommentsClient.tsx
'use client';

import { use } from 'react';

interface CommentsProps {
  showComments: boolean;
  commentsPromise?: Promise<Array<{ id: string; text: string }>>;
}

export function PostCommentsClient({ showComments, commentsPromise }: CommentsProps) {
  // If the user hasn't opened comments, the component does NOT suspend
  if (!showComments || !commentsPromise) {
    return <p className="text-gray-500 text-sm">Comments are collapsed.</p>;
  }

  // ✅ VALID in React 19: `use()` is executed conditionally
  const comments = use(commentsPromise);

  return (
    <ul className="space-y-2">
      {comments.map((comment) => (
        <li key={comment.id} className="p-2 border rounded bg-gray-50">
          {comment.text}
        </li>
      ))}
    </ul>
  );
}

```

* **When `showComments` is `false`:** The component renders immediately without suspending or reading the pending promise.
* **When `showComments` is toggled to `true`:** React reaches `use(commentsPromise)`, suspends the component to the nearest `<Suspense>` boundary, and paints the comments once resolved.

---

### 2. Dynamic Promise Branching (Ternaries / Switch Cases)

You can conditionally select and unwrap different promises depending on runtime props or user roles:

```tsx
'use client';

import { use } from 'react';

interface DashboardViewProps {
  userRole: 'admin' | 'viewer';
  adminMetricsPromise: Promise<{ revenue: number; serverLoad: string }>;
  viewerMetricsPromise: Promise<{ publicStats: string }>;
}

export function DashboardMetrics({
  userRole,
  adminMetricsPromise,
  viewerMetricsPromise,
}: DashboardViewProps) {
  if (userRole === 'admin') {
    // Unwraps admin data; only suspends on adminMetricsPromise
    const data = use(adminMetricsPromise);
    return <div>Admin Revenue: ${data.revenue} | Load: {data.serverLoad}</div>;
  }

  // Unwraps public data; only suspends on viewerMetricsPromise
  const publicData = use(viewerMetricsPromise);
  return <div>Public Stats: {publicData.publicStats}</div>;
}

```

---

### 3. Early Return Guards Before `use()`

You can execute early exits before calling `use()`, preventing invalid promise unwraps when preliminary data is invalid:

```tsx
'use client';

import { use } from 'react';

export function OrderDetails({
  orderId,
  orderPromise,
}: {
  orderId?: string;
  orderPromise?: Promise<Order>;
}) {
  // 1. Guard clause: Return early without invoking `use`
  if (!orderId || !orderPromise) {
    return <div>Select an order to view details.</div>;
  }

  // 2. Safely unwrap only if orderId is valid
  const order = use(orderPromise);

  return <div>Order #{order.id}: Total ${order.total}</div>;
}

```

---

### Golden Rule: Never Create Promises Directly Inside Render

While **unwrapping** with `use()` can be conditional, you must **never instantiate a new Promise directly inside a client render body**:

```tsx
// ❌ WRONG: Creates a new unresolved promise on every single render pass
function BadComponent({ id, shouldFetch }) {
  if (shouldFetch) {
    // ⚠️ Causes an infinite suspend/re-render loop!
    const data = use(fetch(`/api/item/${id}`).then(res => res.json()));
    return <div>{data.title}</div>;
  }
  return null;
}

```

#### The Safe Patterns for Creating Promises

1. **Initiate in a Server Component:** Create the Promise in a Server Component and stream it down as a prop.
2. **Initiate in an Event Handler / Action:** Create the Promise inside a user event (e.g., `onClick`, `startTransition`) and store the Promise reference in state (`useState(promise)`).
3. **Cache with React `cache()`:** If fetching on the server, wrap the fetch function with `React.cache()` to share stable references.

---

### Summary: `useContext` vs `use(Context)` vs `use(Promise)`

| API                       | Accepts Conditions? | Accepts Loops? | Suspends on Pending?            |
| ------------------------- | ------------------- | -------------- | ------------------------------- |
| **`useContext(Context)`** | ❌ Forbidden         | ❌ Forbidden    | ❌ No                            |
| **`use(Context)`**        | ✅ **Allowed**       | ✅ **Allowed**  | ❌ No                            |
| **`use(Promise)`**        | ✅ **Allowed**       | ✅ **Allowed**  | ✅ **Yes** (Inside `<Suspense>`) |

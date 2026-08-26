# Scenario: Refactoring a client-fetch dashboard widget, measuring the bundle impact

**Problem:** A "Recent Orders" widget on a dashboard fetches its data client-side in `useEffect`, contributing a loading skeleton delay and a chunk of client JS (the fetch logic, loading/error state, and a date-formatting library used to display order timestamps) to every dashboard page load — even though the underlying data is available at request time and isn't personalized beyond "which orders belong to this logged-in user," a fact already known server-side from the session.

```tsx
'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns'; // ships to the client for date formatting

export function RecentOrdersWidget({ userId }: { userId: string }) {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch(`/api/orders?userId=${userId}&limit=5`)
      .then((r) => r.json())
      .then(setOrders);
  }, [userId]);

  if (!orders) return <WidgetSkeleton />;

  return (
    <ul>
      {orders.map((o) => (
        <li key={o.id}>
          {format(new Date(o.createdAt), 'MMM d, yyyy')} — ${o.total}
        </li>
      ))}
    </ul>
  );
}
```

**Approach:** Move the fetch and date formatting server-side, since neither actually depends on any client-only capability — `date-fns`'s `format` function runs identically on the server, and there's no reason to ship it (or the fetch/loading-state logic) to the browser at all if the widget has no remaining interactive behavior.

```tsx
// app/dashboard/recent-orders-widget.tsx (Server Component)
import { format } from 'date-fns'; // now runs server-side only, never in the client bundle

async function getRecentOrders(userId: string) {
  const res = await fetch(`https://api.example.com/orders?userId=${userId}&limit=5`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function RecentOrdersWidget({ userId }: { userId: string }) {
  const orders = await getRecentOrders(userId);

  return (
    <ul>
      {orders.map((o: { id: string; createdAt: string; total: number }) => (
        <li key={o.id}>
          {format(new Date(o.createdAt), 'MMM d, yyyy')} — ${o.total}
        </li>
      ))}
    </ul>
  );
}
```

**Conceptual bundle impact:** Before, the client bundle for any page rendering this widget included: the `useState`/`useEffect` fetch-and-loading-state logic, the `date-fns` `format` function and its locale data, and React's client-side reconciliation overhead for a component that re-renders on data arrival. After, none of that ships — `RecentOrdersWidget` produces plain HTML server-side, and `date-fns` never appears in the client bundle at all for this component, since it's now purely a server-side dependency. The practical way to *verify* this rather than just assert it is exactly the bundle-analyzer workflow from topic 11: run `ANALYZE=true next build` before and after the refactor and confirm the `date-fns` chunk and the widget's own JS disappear from the client output for the dashboard route.

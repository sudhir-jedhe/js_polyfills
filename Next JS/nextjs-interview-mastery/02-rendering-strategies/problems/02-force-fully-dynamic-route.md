# Problem 2: Force a Route to Be Fully Dynamic (SSR)

## Task

Build `app/orders/live/page.tsx`, an internal order-tracking page that must show the exact current queue of pending orders for the currently logged-in warehouse worker (identified via a session cookie), with zero caching — every request must reflect the live database state. Force this route into dynamic (SSR) rendering and explain why it's necessary here specifically (not just "add force-dynamic everywhere").

## Solution

```tsx
// app/orders/live/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic' // explicit, in addition to cookies() below

async function getPendingOrders(workerId: string) {
  const res = await fetch(`https://api.example.com/orders/pending?workerId=${workerId}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function LiveOrdersPage() {
  const workerId = cookies().get('worker_id')?.value
  if (!workerId) redirect('/login')

  const orders = await getPendingOrders(workerId)

  return (
    <div>
      <h1>Pending Orders</h1>
      <ul>
        {orders.map((o: { id: string; sku: string; qty: number }) => (
          <li key={o.id}>{o.sku} × {o.qty}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Why forcing dynamic is necessary here

Two independent signals both point to dynamic rendering being required, and it's worth understanding each: `cookies()` reads the `worker_id` cookie to determine *which* worker's queue to show — this is inherently request-specific, since two different workers hitting this URL must see two different, correct result sets; a cached response would leak one worker's orders to another. Separately, `cache: 'no-store'` on the fetch ensures the order data itself is never stale — pending orders can be created, claimed, or completed by other workers seconds apart, and this page's entire purpose is to reflect the current queue accurately for operational decisions (a worker picking a stale "pending" order that's already been claimed causes real-world conflicts).

The explicit `export const dynamic = 'force-dynamic'` is technically redundant given `cookies()` already forces dynamic rendering, but it's good practice to declare intent explicitly on routes where dynamic behavior is a deliberate requirement (not an accident) — it documents to future maintainers that this page must never be cached, and it protects against the route accidentally becoming static if the `cookies()` call is later refactored away without someone noticing the caching implication.

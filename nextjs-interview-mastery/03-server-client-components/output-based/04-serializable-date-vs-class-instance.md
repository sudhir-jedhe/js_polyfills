# Output: Which Prop Breaks?

```tsx
// app/page.tsx — Server Component
import { OrderSummary } from './OrderSummary'

class Money {
  constructor(public cents: number) {}
  format() {
    return `$${(this.cents / 100).toFixed(2)}`
  }
}

export default async function Page() {
  const order = {
    id: 'ord_123',
    placedAt: new Date(), // Date instance
    total: new Money(4999), // class instance
  }

  return <OrderSummary order={order} />
}
```

```tsx
// app/OrderSummary.tsx
'use client'

export function OrderSummary({ order }: { order: { id: string; placedAt: Date; total: Money } }) {
  return (
    <div>
      <p>Order {order.id}</p>
      <p>Placed: {order.placedAt.toLocaleDateString()}</p>
      <p>Total: {order.total.format()}</p>
    </div>
  )
}
```

Which of `placedAt` and `total` causes a problem crossing the Server-to-Client boundary, and which is fine?

**Answer:** `placedAt` (a `Date`) crosses the boundary fine — React's RSC serialization format explicitly supports `Date` objects, so `OrderSummary` receives a real `Date` instance with `.toLocaleDateString()` intact. `total` (a `Money` class instance) does **not** survive — it gets serialized down to a plain object (or errors, depending on the exact setup), losing its prototype chain, so `order.total.format()` throws a runtime error like "order.total.format is not a function" because the client-side `order.total` is no longer a genuine `Money` instance — it's just `{ cents: 4999 }` without any methods attached.

**Why:** React's serialization boundary supports a specific, limited set of types beyond plain JSON — primitives, plain objects/arrays, and a handful of built-ins like `Date`, `Map`, and `Set` are specially handled. Arbitrary class instances are not on that list: only their own enumerable data properties survive the trip, and any methods defined on the prototype are lost, because the class definition itself isn't shipped across the boundary — only a data snapshot. The fix is to avoid passing custom class instances as props entirely: either serialize `Money` into a plain value before passing it down (e.g., pass the pre-formatted string, or a plain `{ cents: number }` object) and reconstruct/format on the client side with a plain function rather than a class method, or format the money value entirely on the server and pass just the resulting string.

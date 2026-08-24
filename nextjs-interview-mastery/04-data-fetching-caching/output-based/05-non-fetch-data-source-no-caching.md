# Output: Is This ORM Query Cached Like `fetch()`?

```tsx
// app/products/page.tsx
import { db } from '@/lib/db' // Prisma-style ORM, not using fetch() internally

export const revalidate = 3600

export default async function ProductsPage() {
  const products = await db.product.findMany() // direct DB query, no fetch()
  return <ProductGrid products={products} />
}
```

A developer sets `export const revalidate = 3600`, expecting the `db.product.findMany()` result to be cached for an hour, the same way a `fetch()` call with `next: { revalidate: 3600 }` would be. Is that what happens?

**Answer:** Not automatically in the way they expect. `revalidate = 3600` at the route level does control how long the *route's rendered output* (Full Route Cache) is considered fresh before the next request triggers a re-render — so in that sense, ISR-style behavior for the whole page does apply. But the ORM call itself gets no special Data-Cache treatment the way a `fetch()` call would; it's simply a regular async function call that re-executes in full every time the route actually re-renders (at build time, and again whenever the ISR window triggers a background regeneration). There's no separate, finer-grained caching layer for `db.product.findMany()` itself the way there is for `fetch()`.

**Why:** Next.js's Data Cache and its `fetch()`-level options (`cache`, `next.revalidate`, `next.tags`) are implemented specifically around a patched global `fetch()` — that's the mechanism the framework can intercept and cache transparently. Database clients, ORMs, and most SDKs don't go through that patched `fetch()`; they use their own drivers (raw TCP/sockets in many cases). So while the *route-level* `revalidate` export still governs the Full Route Cache lifecycle (meaning the page as a whole does behave like ISR), the specific database call has no independent tag-based revalidation or per-call cache duration the way a tagged `fetch()` would. If you need `fetch()`-equivalent caching semantics (e.g., independent revalidation, tagging) for a non-`fetch()` data source like this, wrap it explicitly with React's `cache()` (for request-level memoization) or Next.js's `unstable_cache()` (for Data-Cache-equivalent persistence with its own revalidate/tags options) rather than relying on `fetch()`-specific behavior applying implicitly.

## Why does this GET route return the same data forever in production?

```js
// app/api/featured/route.js
export async function GET() {
  const featured = await db.product.findMany({ where: { featured: true } });
  return Response.json(featured);
}
```

The team adds a new featured product in the database, but `/api/featured` keeps returning the old list in the deployed (production build) app — even after several minutes. It works fine in `next dev`.

**Answer:** In a production build, this `GET` handler reads no dynamic request data (no `searchParams`, no `cookies()`, no `headers()`), so Next.js treats it as **static** and evaluates/caches it once at build time, serving the same cached JSON on every request afterward. `next dev` re-evaluates handlers on every request regardless, which is why the staleness only shows up in production.

**Why:** Route Handlers follow the same static/dynamic heuristics as pages. If a `GET` handler's behavior *could* be determined at build time — no reliance on request-specific or explicitly uncached data — Next.js opts it into static generation for performance. The fix is to make the dynamic behavior explicit: either add `export const dynamic = 'force-dynamic'` to always re-run the handler per request, or use `export const revalidate = 60` to time-based revalidate every 60 seconds (ISR-style), or call `revalidatePath('/api/featured')` / `revalidateTag(...)` from the mutation that changes `featured` products so the cache invalidates on-demand instead of on a timer.

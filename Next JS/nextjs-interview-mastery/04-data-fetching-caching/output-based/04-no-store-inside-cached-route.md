# Output: Is the Whole Page Fresh, or Just One Fetch?

```tsx
// app/dashboard/page.tsx
async function getStaticConfig() {
  const res = await fetch('https://api.example.com/config') // default cache
  return res.json()
}

async function getLiveAlerts() {
  const res = await fetch('https://api.example.com/alerts', { cache: 'no-store' })
  return res.json()
}

export default async function DashboardPage() {
  const config = await getStaticConfig()
  const alerts = await getLiveAlerts()

  return (
    <div>
      <h1>{config.title}</h1>
      <AlertBanner alerts={alerts} />
    </div>
  )
}
```

A developer expects: "only `getLiveAlerts` is uncached — `getStaticConfig` should still benefit from caching, so this page is a sensible hybrid." Is that how it actually behaves?

**Answer:** Not quite — while it's true that `getStaticConfig`'s individual fetch result is still cached in the Data Cache (that part of the intuition is correct), the *route as a whole* is forced into fully dynamic rendering. Every single request to `/dashboard` re-executes the entire `DashboardPage` component, including re-calling `getStaticConfig()`, even though that specific fetch's *data* comes back from cache rather than the network.

**Why:** `cache: 'no-store'` on any fetch within a route's render path is one of the strongest dynamic signals in the App Router's model — it forces the whole route to render per-request (no Full Route Cache entry can exist, since one of the route's data dependencies is explicitly guaranteed-fresh-per-request). So while `getStaticConfig()`'s Data Cache entry does get reused across these repeated renders (saving a network round-trip for that specific data), the component function itself, and everything else in the page, still re-runs on every request — there's no "statically cache the parts that can be, dynamically render the rest" split at the route-rendering level in the base (non-PPR) model. The practical implication: mixing one `no-store` fetch into an otherwise-cacheable page doesn't give you "mostly static, one fresh piece" — it gives you "fully dynamic route, with one piece of its data still coming from a persistent cache." If genuinely static-mostly behavior with one fresh island is the goal, that requires either Partial Prerendering or isolating the live piece into a separately-fetched Client Component/Route Handler instead.

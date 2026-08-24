# Output: Does Memoization Save the Second User Too?

```tsx
// app/page.tsx
async function getHomepageContent() {
  const res = await fetch('https://api.example.com/homepage')
  return res.json()
}

export default async function HomePage() {
  const content = await getHomepageContent()
  return <h1>{content.headline}</h1>
}
```

User A requests `/` at 10:00:00. User B requests `/` at 10:00:01, one second later. Assume no `revalidate` option is set anywhere (so `fetch()` uses its default caching). Does User B's request trigger a fresh network call to `https://api.example.com/homepage`, or does it reuse something from User A's request?

**Answer:** User B does not trigger a fresh network call — but not because of Request Memoization. It's because the default `fetch()` caching behavior (`cache: 'force-cache'`, backed by the **Data Cache**) already cached the result from User A's request, and since this route has no dynamic functions and no `revalidate`/`no-store` overrides, it's likely statically rendered entirely — served from the **Full Route Cache** without re-running `HomePage` or its fetch at all for User B.

**Why:** This is the classic trap of attributing cross-request caching to Request Memoization, which is explicitly scoped to a *single* render pass and is cleared immediately afterward — it cannot explain why User B's *separate* request avoids a network call. The actual mechanism here is layered differently: because `getHomepageContent`'s fetch defaults to cached and nothing in the route forces dynamic rendering, Next.js likely rendered this route once (at build time or on the very first request) and stored the resulting HTML in the Full Route Cache — User B's request is served directly from that stored HTML, never re-executing `HomePage`'s code, let alone reaching the fetch call or the Data Cache. Even in a scenario where the route *does* re-render per-request (e.g., if it were forced dynamic for some other reason), the Data Cache — not Request Memoization — would be what allows User B's fetch to reuse User A's cached result instead of hitting the network again.

# The Three Caching Layers: Request Memoization, Data Cache, Full Route Cache

This is consistently one of the most confused — and most-tested — areas of Next.js. There are **three distinct caching mechanisms** operating at different scopes and lifetimes, and conflating them leads to wrong mental models about why a page is (or isn't) showing fresh data.

## 1. Request Memoization

**Scope:** a single server render pass (one incoming request). **Lifetime:** cleared the moment that render completes.

If multiple Server Components on the *same page*, during the *same request*, call `fetch()` with identical URL and options, React deduplicates them — only the first call actually hits the network; every subsequent identical call in that same render reuses the in-flight/completed promise. This exists purely to let you fetch the same data from multiple components without manually lifting state or prop-drilling, without paying for duplicate network calls.

```tsx
// app/layout.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user') // call #1
  return res.json()
}

export default async function Layout({ children }) {
  const user = await getUser()
  return <div>{user.name}{children}</div>
}

// app/page.tsx — same render pass, same fetch signature
async function getUser() {
  const res = await fetch('https://api.example.com/user') // deduped, not a second network call
  return res.json()
}
export default async function Page() {
  const user = await getUser()
  return <p>Welcome, {user.name}</p>
}
```

Only one actual network request happens for this one page load, even though `getUser()` is called from two different components. This memoization does **not** persist across separate requests — the next user's request starts a fresh memoization scope.

## 2. Data Cache

**Scope:** the whole server, persists **across requests and even across deployments**. **Lifetime:** until explicitly revalidated (by time, via `revalidate`, or on-demand via `revalidateTag`/`revalidatePath`) or until `cache: 'no-store'` is used.

This is the cache that backs `fetch()`'s `force-cache` default and `next: { revalidate: N }`. Unlike Request Memoization, this genuinely persists data between different users' requests and different deploys — it's a durable, shared cache layer (backed by the filesystem locally, and typically a more distributed store in production platforms like Vercel).

```tsx
export const revalidate = 3600
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 3600 } })
  return res.json()
}
```

The first request that runs this fetch populates the Data Cache; every request afterward, from any user, reuses that cached value until the hour elapses (or `revalidateTag`/`revalidatePath` invalidates it sooner).

## 3. Full Route Cache

**Scope:** the entire rendered output (HTML + RSC payload) of a route, at build time for static routes. **Lifetime:** persists until the next deploy, or until invalidated by `revalidatePath`/on-demand revalidation for that route.

This is the mechanism behind static rendering itself — when a route has no dynamic functions and its data dependencies are cacheable, Next.js renders the *entire route* once and stores the resulting HTML/RSC output, serving that stored output directly for subsequent requests without re-running any component code at all (not even to hit the Data Cache — the render itself is skipped).

## How they interact

For a static route, a request typically never touches the Data Cache or does any fetching at all — it's served straight from the Full Route Cache. The Data Cache only gets consulted when a route actually re-renders (e.g., during the build, during an ISR background regeneration, or on every request for a dynamic route). Request Memoization only matters *within* a single one of those render passes, deduping fetches that happen to overlap during that specific execution. Revalidating the Data Cache via `revalidateTag`/`revalidatePath` typically also invalidates the Full Route Cache for affected routes, since a route's cached HTML is only valid as long as the data it was built from is considered fresh.

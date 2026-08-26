# Output: Which Cache Setting Wins?

```tsx
// app/report/page.tsx
export const revalidate = 3600

export default async function ReportPage() {
  const data = await fetch('https://api.example.com/report', {
    cache: 'no-store',
  })
  const report = await data.json()
  return <ReportView data={report} />
}
```

There's a route-level `revalidate = 3600` (1 hour) alongside a `fetch()` call explicitly using `cache: 'no-store'`. What actually happens — does this route get cached for an hour, or is it dynamic?

**Answer:** The route becomes fully dynamic — `cache: 'no-store'` wins. The `revalidate = 3600` export has no effect here.

**Why:** `cache: 'no-store'` on a `fetch()` call is one of the strongest signals in the App Router's caching model: it explicitly tells Next.js this specific request must never be served from cache and must hit the network every time. Because that fetch happens during the route's Server Component render, and its result can never be cached, the entire route is forced into dynamic rendering — there's no meaningful way to "statically cache the page for an hour" when one of its data dependencies is guaranteed fresh-per-request by design. This is a common misconfiguration in real codebases: someone adds `revalidate = 3600` at the top of a file expecting ISR, without realizing a `no-store` fetch elsewhere in the same render path silently overrides the intended caching strategy for the whole route. The fix, if ISR was actually intended, is to change the fetch to `next: { revalidate: 3600 }` (or omit `cache` and rely on the route-level default) instead of `no-store`.

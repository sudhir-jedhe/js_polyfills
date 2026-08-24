# A developer benchmarks navigation speed locally and files a bug

```tsx
import Link from 'next/link';

export function ProductLink({ id }: { id: string }) {
  return <Link href={`/products/${id}`}>View product</Link>;
}
```

The developer runs `next dev`, opens the network tab, scrolls a list of these links into view, and sees **no prefetch requests fire**. They conclude prefetching is broken and file a bug. Clicking the link is noticeably slower than expected. What's actually going on?

**Answer:** Nothing is broken — `<Link>` prefetching is **intentionally disabled in development mode** (`next dev`). It only activates in production builds (`next build && next start`, or a production deployment). The developer's local benchmark is measuring exactly the behavior Next.js designed for dev mode: no prefetch, so every navigation triggers a fresh fetch, matching what you'd want while actively editing code (you don't want stale prefetched data/bundles from before your last save).

**Why:** Development mode prioritizes fast iteration and always-fresh output over navigation performance — prefetching in dev would mean fetching and caching route data that could be invalidated by the very next file save, adding overhead with no benefit. This is a common trap when engineers try to "prove" or "disprove" App Router performance claims using a local dev server; the only valid way to benchmark prefetch/navigation behavior is against a production build. The fix for the bug report is simply: re-test with `next build && next start` (or a preview deployment) before drawing conclusions.

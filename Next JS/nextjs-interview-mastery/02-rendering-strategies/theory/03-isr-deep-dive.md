# ISR Deep Dive: `revalidate` and the Stale-While-Revalidate Lifecycle

Incremental Static Regeneration is static generation with a self-refresh timer. You set a `revalidate` interval, and Next.js keeps serving the cached static HTML instantly until that interval elapses — at which point the *behavior on the next request* depends on whether you're on a platform with background regeneration support (like Vercel) or the more literal open-source Next.js behavior.

```tsx
// app/news/page.tsx
export const revalidate = 300 // regenerate at most every 5 minutes

export default async function NewsPage() {
  const articles = await getLatestArticles()
  return <ArticleList articles={articles} />
}
```

The request lifecycle for a stale ISR page, conceptually:

1. **Request 1 (t=0s):** No cached page exists yet (or cache expired). Next.js renders synchronously, caches the result, and serves it. This request pays the full render cost.
2. **Requests during the fresh window (t=1s to t=300s):** Every request gets the cached HTML immediately — zero render cost, CDN-speed response.
3. **Request at t=301s (first request after expiry):** The cached page is now stale. Next.js serves the **stale cached version immediately** to this requester (so nobody is ever blocked waiting on a regeneration), while triggering a regeneration in the background.
4. **Regeneration completes** shortly after, and the cache is updated.
5. **Request at t=302s (or whenever it lands after regeneration finishes):** Gets the newly regenerated version. Everyone before that point continued to see the old (slightly stale) content.

This is the "stale-while-revalidate" pattern: you never make a user wait for a rebuild; you serve what you have and quietly refresh in the background for the *next* visitor. It trades a bounded window of staleness for consistently fast responses.

Per-path granularity matters for dynamic routes like `app/products/[id]/page.tsx` — each distinct `id` gets its own independently cached and independently timed regeneration; a spike in traffic to `/products/42` doesn't affect the cache freshness of `/products/7`.

You can bypass the timer entirely with **on-demand revalidation** — calling `revalidatePath('/news')` or `revalidateTag('articles')` (typically from a Server Action or a webhook-triggered Route Handler when your CMS content changes) immediately invalidates the cache regardless of how much of the `revalidate` window remains, so the very next request regenerates fresh content instead of waiting out the timer. This is the standard pattern for "editor publishes a post, users should see it immediately" flows, and it's covered in depth in the data-fetching-and-caching topic.

One common misconception to correct: setting `revalidate = 0` does **not** mean "regenerate instantly on every request" in the ISR sense — it actually means "opt this route out of static caching entirely," which is functionally equivalent to forcing dynamic (SSR-like) rendering, not a very-short ISR interval.

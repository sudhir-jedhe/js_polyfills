# Output: Which Revalidate Interval Actually Applies?

```tsx
// app/news/page.tsx
export const revalidate = 3600 // route-level: 1 hour

async function getHeadlines() {
  const res = await fetch('https://api.example.com/headlines', {
    next: { revalidate: 60 }, // fetch-level: 1 minute
  })
  return res.json()
}

export default async function NewsPage() {
  const headlines = await getHeadlines()
  return <HeadlineList headlines={headlines} />
}
```

There's a route-level `revalidate = 3600` and a fetch-level `next: { revalidate: 60 }` on the same page. Which one governs how often the page's content actually refreshes?

**Answer:** The **shorter** value effectively wins for practical purposes — the page refreshes at the 60-second cadence, not 3600 seconds, because the fetch's own Data Cache entry becomes stale after 60 seconds regardless of what the route-level setting says about the Full Route Cache.

**Why:** These two settings operate on different (though related) caching layers — route-level `revalidate` governs the Full Route Cache (how long the *rendered page output* is considered fresh before a request triggers regeneration), while the fetch-level `next: { revalidate: 60 }` governs that specific Data Cache entry independently. When the route regenerates (triggered by the route-level timer, or by any request after the fetch-level entry goes stale forcing a fresh render to pick up new data), it re-runs `getHeadlines()`, and that fetch's own 60-second staleness governs whether it serves cached or refetched data at that point. In practice, Next.js reconciles these by effectively using the more restrictive (shorter) interval as the meaningful trigger for the page as a whole — a route-level `revalidate` longer than a fetch-level one doesn't "protect" the page from refreshing more often than the route setting implies, because the fetch itself will be treated as needing regeneration on its own faster schedule. The practical lesson: keep route-level and fetch-level `revalidate` values consistent (or explicit about which is meant to be authoritative) rather than setting mismatched intervals expecting the larger one to dominate — it doesn't.

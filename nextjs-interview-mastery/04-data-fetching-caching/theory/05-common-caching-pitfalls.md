# Common Caching Pitfalls and How to Reason About Them

Given how many layers are involved, most real-world "why is my data stale" or "why is my page not static" bugs come down to a handful of recurring mistakes. Building a checklist for these pays off enormously in practice.

**Forgetting that `fetch()` defaults to cached, not fresh.** Developers coming from a plain `fetch()`/Express background often assume every network call is naturally "live" — in the App Router, the opposite is true by default. A `fetch()` with no options caches indefinitely (Data Cache) and can make its route static (Full Route Cache). If you need per-request freshness and don't add `cache: 'no-store'` or a short `revalidate`, you'll see stale data silently, often not noticed until a demo where someone updates data and the change doesn't show up.

```tsx
// Silently cached forever — likely NOT what was intended for live inventory
const res = await fetch('https://api.example.com/inventory')
```

**Mixing dynamic functions with static assumptions.** As covered in the rendering-strategies topic, using `cookies()`/`headers()` anywhere in a route's render path forces the whole route dynamic — a `revalidate` export elsewhere in the same file has no effect once that happens. This is a frequent source of confusion: someone sets `revalidate = 60` expecting ISR, not realizing a nearby `cookies()` call already opted the whole route out of caching.

**Forgetting to invalidate after a mutation.** A Server Action that writes to the database but doesn't call `revalidatePath`/`revalidateTag` leaves cached pages showing pre-mutation data indefinitely (or until the next time-based revalidation, if any is configured). This is the single most common "why doesn't my update show up" bug in production apps using caching aggressively.

**Assuming Request Memoization persists across requests.** It doesn't — it's scoped to a single render pass. Two different users' requests, or even two sequential requests from the same user, each get their own fresh memoization scope; you cannot rely on memoization as a substitute for the Data Cache when you actually need cross-request caching.

**Tagging inconsistently.** If a posts list is tagged `'posts'` but an individual post detail page's fetch is tagged `'post-detail'` instead, calling `revalidateTag('posts')` after an edit won't invalidate the detail page — the tags need to be applied consistently across every fetch that represents the same underlying data if you want one revalidation call to cover all of them.

**Diagnosing a stale-data bug — a practical checklist:**
1. Is any dynamic function (`cookies()`, `headers()`) present anywhere in this route's Server Component tree? If so, the route is dynamic — "staleness" here likely means the *external* API/DB itself is returning old data, not a Next.js caching issue.
2. What's the `cache`/`next.revalidate` option on the specific `fetch()` in question? No options means `force-cache` (indefinite).
3. Is there a route-level `export const revalidate`? Does it conflict with a per-fetch option?
4. After the data-changing action, is `revalidatePath`/`revalidateTag` being called, with a tag/path that actually matches what's cached?
5. Check the `next build` output — does it list the route as Static (○), ISR (with a revalidate interval shown), or Dynamic (λ)? That single table often immediately clarifies which caching layer is actually in play.

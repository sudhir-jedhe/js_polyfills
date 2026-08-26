# Interview Q&A: ISR Mechanics

**Q: Walk through what happens when a request hits an ISR page after its `revalidate` window has expired.**
A: The stale cached HTML is served immediately to that requester — nobody is ever blocked waiting for regeneration. In the background, Next.js triggers a fresh render using current data, and once it completes, the cache is updated. The *next* request after that point gets the newly regenerated version. This is the stale-while-revalidate pattern: staleness is bounded but requests are never slowed down by regeneration.

**Q: If nobody visits an ISR page for a long time after its revalidate window expires, does it regenerate on a timer in the background anyway?**
A: No — regeneration is request-triggered, not proactive. If traffic stops, a stale page can sit stale indefinitely past its `revalidate` window; it only regenerates in response to the next actual request that lands after expiry. This means `revalidate` sets a *minimum* staleness bound, not a guarantee that content refreshes exactly on schedule regardless of traffic.

**Q: What's the difference between the `revalidate` route segment config and on-demand revalidation via `revalidateTag`/`revalidatePath`?**
A: `revalidate` sets a time-based ceiling — content can be at most that many seconds old before the next request triggers regeneration. On-demand revalidation (`revalidateTag`, `revalidatePath`) is event-driven — you explicitly invalidate the cache the moment something actually changes (e.g., a CMS webhook fires, a Server Action completes), so the very next request gets fresh content immediately regardless of how much of the `revalidate` window remains. They're complementary: a `revalidate` value is a safety-net upper bound, while on-demand revalidation gives you immediate freshness when you know exactly when data changed.

**Q: Does `generateStaticParams` need to list every possible dynamic param value?**
A: No. It pre-builds the params you give it at build time; any param not listed still resolves — Next.js renders it on-demand at request time on first visit (since `dynamicParams` defaults to `true`) and then caches that result, behaving like ISR from that point forward for that specific path. Setting `dynamicParams = false` changes this so unlisted params 404 instead.

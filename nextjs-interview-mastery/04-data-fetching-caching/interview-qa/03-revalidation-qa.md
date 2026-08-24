# Interview Q&A: Revalidation Strategies

**Q: What's the difference between `revalidatePath` and `revalidateTag`?**
A: `revalidatePath(path)` invalidates the Full Route Cache (and related Data Cache entries) for a specific route path — you use it when you know exactly which route needs to refresh. `revalidateTag(tag)` invalidates every Data Cache entry across the entire app that was tagged with that string via `fetch(url, { next: { tags: [...] } })`, regardless of which routes use that data — useful when the same underlying data appears in multiple, possibly unrelated, routes.

**Q: Where should `revalidatePath`/`revalidateTag` typically be called from?**
A: Most commonly from a Server Action, immediately after the mutation it's paired with completes (e.g., a "publish post" action calls `revalidateTag('posts')` right after writing to the CMS). They can also be called from a Route Handler, which is the standard pattern for webhook-triggered revalidation — e.g., a CMS sends a webhook to your app when content is published, and that Route Handler calls the revalidation function.

**Q: If a route has both `export const revalidate = 3600` and a Server Action elsewhere calls `revalidateTag` for data used on that route, which takes precedence?**
A: They're complementary, not competing — `revalidate = 3600` is a time-based ceiling ("at most an hour stale"), while `revalidateTag` is an event-driven override that can invalidate the cache immediately, any time, regardless of how much of the hour has elapsed. After an on-demand `revalidateTag` call, the next request regenerates fresh content right away; the 3600-second timer then effectively restarts from that point as the new fallback ceiling.

**Q: What happens if you forget to call any revalidation function after a mutation on cached data?**
A: The mutation succeeds in the underlying data store, but cached pages/fetches keep serving pre-mutation data until whatever time-based `revalidate` window (if any) naturally expires — or indefinitely, if no time-based revalidation is configured at all. This is the most common real-world "my update isn't showing up" bug in apps using aggressive caching, and it's why "mutate, then explicitly revalidate" should be treated as a required pairing, not an optional cleanup step.

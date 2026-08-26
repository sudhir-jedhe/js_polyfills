# Interview Q&A: Navigation Cost and Rendering Model

**Q: In concrete terms, what does "layouts persist across navigations" actually save?**
A: When navigating between two routes that share a layout, that layout's component tree is never unmounted or re-rendered — its data fetches don't re-run, its client-side state (open dropdowns, scroll position, in-progress media playback, context values) survives untouched, and none of its JS needs to be re-downloaded or re-parsed. Only the segment of the tree that actually differs between the old and new URL is fetched and swapped in.

**Q: Is App Router client-side navigation ever slower than a full page reload would have been?**
A: In principle, if a route's *new* segment involves an unusually large data fetch or a large amount of newly-loaded client JS that wasn't prefetched, the perceived cost is dominated by that segment's own work — the "shared layout" savings only apply to the parts of the tree that don't change. It's not literally impossible for a transition to feel slow; the architectural win is specifically eliminating the fixed, guaranteed cost of full document reload (JS re-parse, provider re-init, blank-screen repaint) for the unchanged parts, not a guarantee that every transition is instant regardless of what the changed segment does.

**Q: How does client-side route caching interact with this?**
A: The router caches previously visited and prefetched segments client-side, so re-visiting a route within the same session can be served from cache without a new network request at all, subject to invalidation (time-based expiry for dynamic data, or explicit invalidation via `router.refresh()` or Server Action revalidation). This compounds with layout persistence — not only does the shared layout not re-render, but even the "new" segment might already be sitting in the client cache from an earlier visit or a viewport-triggered prefetch.

**Q: If someone claims "App Router navigation never re-fetches data unnecessarily," how would you push back on that in an interview?**
A: That's an overstatement. Any segment that changes has to fetch fresh data unless it was already prefetched and the cache is still valid; dynamically rendered segments in particular are, by definition, meant to reflect request-time data, so they intentionally re-fetch on most navigations. The accurate claim is narrower and more defensible: unchanged shared layouts don't re-fetch or re-render, which is a meaningful, guaranteed saving — but it's a claim about what's *unchanged*, not a blanket guarantee about the changed segment's cost.

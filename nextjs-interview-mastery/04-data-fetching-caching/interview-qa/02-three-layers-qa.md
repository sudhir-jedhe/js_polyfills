# Interview Q&A: The Three Caching Layers

**Q: Name the three distinct caching mechanisms in the App Router and their scopes.**
A: Request Memoization (scoped to a single render pass, cleared immediately after — dedupes identical `fetch()` calls within one request), the Data Cache (persists across requests and deployments, backs `fetch()`'s default caching and `next.revalidate`/`next.tags`), and the Full Route Cache (the entire rendered HTML/RSC output of a static route, persisting until the next deploy or an explicit `revalidatePath`/tag-based invalidation).

**Q: If two Server Components on the same page call an identical `fetch()`, does that save a network call for the *next* user's request too, or just this one?**
A: Just this one, via Request Memoization — but the *next* user's request likely also avoids a duplicate network call, for a different reason: the Data Cache (assuming the fetch is cacheable, i.e. not `no-store`) persists the result across requests, so the next user's render reuses that cached value instead of hitting the network. It's easy to conflate these two effects since they produce a similar outward symptom ("only one network call happened"), but they're different mechanisms with different scopes.

**Q: Can a route be dynamically rendered on every request but still benefit from the Data Cache?**
A: Yes. A route being dynamic (e.g., because it reads `cookies()`) only means the Full Route Cache doesn't apply — the route's component tree re-executes on every request. Individual `fetch()` calls within that re-execution can still be served from the Data Cache if they're cacheable (not `no-store`), saving the network round-trip even though the surrounding page render itself happens fresh each time.

**Q: Why doesn't Request Memoization help across two different users hitting the same page seconds apart?**
A: Request Memoization's scope is explicitly a single server render — it exists to dedupe fetches *within* one request's component tree, not to serve as a general-purpose cache. Each incoming request gets its own fresh memoization context; there is no shared state between User A's render and User B's render at that layer. Cross-request reuse is the Data Cache's job, not Request Memoization's.

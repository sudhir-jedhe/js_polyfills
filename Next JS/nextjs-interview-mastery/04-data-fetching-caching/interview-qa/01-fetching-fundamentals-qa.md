# Interview Q&A: Data Fetching Fundamentals

**Q: How do you fetch data in an App Router Server Component, compared to the Pages Router?**
A: You `await` data directly inside an `async` Server Component function — no special exported function needed. The Pages Router required `getServerSideProps` or `getStaticProps`, exported separately from the component, running before render; the App Router collapses fetching and rendering into the same function.

**Q: What does `fetch()` do by default in a Server Component, with no options specified?**
A: It uses `cache: 'force-cache'` — the result is cached indefinitely in the Data Cache, reused across requests and users until explicitly invalidated. This default is also what allows a route with no other dynamic dependencies to be statically generated.

**Q: How do you make a `fetch()` call always hit the network fresh?**
A: Pass `cache: 'no-store'`. This disables caching for that specific call and, as a side effect, forces the entire containing route into dynamic (per-request) rendering, since a route can't be statically cached if one of its data dependencies is guaranteed to be freshly fetched every time.

**Q: If you need to fetch two independent pieces of data in one Server Component, what's the pitfall to avoid?**
A: Awaiting them sequentially when they don't depend on each other creates an unnecessary waterfall — the total wait time becomes the sum of both requests instead of the slower of the two. Kick off independent fetches together with `Promise.all([fetchA(), fetchB()])` so they run concurrently.

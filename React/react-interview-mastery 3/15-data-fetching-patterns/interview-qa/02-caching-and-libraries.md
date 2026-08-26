# Interview Q&A: Caching and Libraries

**Q: Why do libraries like React Query or SWR exist when `useEffect` + `fetch` "already works"?**
They solve cross-cutting problems that manual fetching re-implements badly or not at all: caching so the same data isn't refetched unnecessarily, deduplication of identical in-flight requests across components, background refetching on window focus/reconnect, and declarative loading/error states. The core idea is stale-while-revalidate — show cached data instantly while quietly checking the server for updates — which is hard to get right by hand across an entire app.

**Q: What is stale-while-revalidate?**
It's a caching strategy where the UI immediately renders the last known (possibly stale) data from cache while a background request checks for fresher data; if the fresh data differs, the UI updates. This avoids the loading-spinner flash on every navigation back to previously-seen data, trading strict correctness for perceived speed.

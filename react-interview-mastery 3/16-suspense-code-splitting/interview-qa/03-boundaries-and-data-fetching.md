# Interview Q&A: Boundaries and Suspense for Data Fetching

**Q: What's the difference between lazy-loading at the route level vs the component level?**
Route-level splitting creates one chunk per page, so navigating between pages only downloads what's needed for the destination — this is almost always worth doing and has the biggest overall impact. Component-level splitting targets specific heavy, conditionally-rendered pieces within a page (an editor, a chart library, a modal) that aren't needed for the initial render of that page.

**Q: If you wrap multiple lazy components in a single shared `Suspense` boundary, what's the loading behavior?**
The whole subtree is treated as one unit: the fallback stays visible until *every* suspending component in that subtree is ready, then they all appear together. To let each one appear independently as soon as it's ready, you need separate, nested `Suspense` boundaries around each one.

**Q: What does "Suspense for data fetching" mean, and is it something you implement yourself with `useEffect`?**
It's the broader React 18 direction where any async operation that "suspends" (not just lazy component code) can be caught by a `Suspense` boundary — including data fetching, if the fetching mechanism is built to throw a promise while pending and resolve to a cached value once ready. Plain `useEffect` fetching does not do this automatically; Suspense-integrated data fetching is provided by frameworks (Next.js App Router, Relay) or libraries designed for it, not something you typically hand-roll.

**Q: Does using `React.lazy` reduce total code shipped, or just when it's shipped?**
Just when — the total bytes downloaded over a full user session touching every feature can be the same or even slightly more (due to extra request overhead per chunk). The win is deferring cost: the *initial* load is smaller, and unused code for features a user never visits may never be downloaded at all.

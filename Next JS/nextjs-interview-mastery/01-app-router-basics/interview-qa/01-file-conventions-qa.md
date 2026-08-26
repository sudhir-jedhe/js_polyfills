# Interview Q&A: File Conventions

**Q: What's the difference between `layout.js` and `template.js`?**
A: Both wrap a segment's children in shared UI, but `layout.js` persists across navigations between routes that share it — it doesn't re-render, and its internal state survives. `template.js` re-mounts fresh on every navigation, resetting state and re-running effects each time. Use `layout.js` by default; reach for `template.js` only when you need a guaranteed remount, like re-triggering an enter animation or resetting form state on every visit even between sibling routes.

**Q: When does `loading.js` activate, exactly?**
A: Next.js automatically wraps `page.js` (and everything nested below it, down to the next closer `loading.js` if one exists) in a React Suspense boundary using that segment's `loading.js` as the fallback. It activates whenever something inside that boundary suspends — most commonly an `async` Server Component awaiting data. It does not activate for client-side state changes or for errors (that's `error.js`'s job) — only for the initial data-loading/rendering phase of the segment.

**Q: If a segment has both `loading.js` and `error.js`, how do they interact?**
A: They wrap different concerns and can both be present simultaneously without conflict. Structurally, `error.js` (an error boundary) sits around the `loading.js`-driven Suspense boundary for that segment. While data is loading, `loading.js`'s fallback shows. If the data fetch or render throws, the nearest `error.js` catches it and replaces the content with its fallback UI instead. They don't show at the same time — a given render is either still loading, has errored, or has succeeded.

**Q: Does colocating a test file like `page.test.tsx` next to `page.tsx` break the build?**
A: No. Only files matching Next.js's reserved convention names (`page`, `layout`, `loading`, `error`, `not-found`, `template`, `route`, `default`, plus parallel/intercepting route conventions) are treated specially by the router. `page.test.tsx` doesn't match any of those exactly, so it's ignored by routing — it's just a regular file in that folder, safely colocated for your test runner to pick up.

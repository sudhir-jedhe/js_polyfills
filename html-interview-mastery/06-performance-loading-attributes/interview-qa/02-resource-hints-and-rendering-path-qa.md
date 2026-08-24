# Interview Q&A — Resource Hints & Critical Rendering Path

**Q: What's the difference between `preload` and `prefetch`?**
`preload` fetches a resource at high priority for use on the **current** page — for something you know is critical but the browser wouldn't otherwise discover early enough. `prefetch` fetches a resource at low priority, using idle bandwidth, for a **likely future navigation** — a different page the user probably hasn't reached yet.

**Q: What does `preconnect` actually do, and why shouldn't you use it on every third-party domain?**
It performs DNS resolution, the TCP handshake, and TLS negotiation ahead of time, so the first actual request to that origin skips those round trips. Holding a connection open has a real cost, so scattering `preconnect` across many domains wastes resources on connections that may not even end up used soon — it should be reserved for a small number of origins you're confident will be needed imminently.

**Q: Why is `as` required on `<link rel="preload">`, and what happens if it's wrong?**
`as` tells the browser the resource's type, which affects request priority **and** is used to match the preloaded resource to its actual later use. If `as` is missing or doesn't match how the resource is actually requested (e.g., `as="style"` for a file actually loaded as a script), the browser treats the preload and the real request as unrelated, fetching the resource **twice** — the opposite of the intended optimization.

**Q: Why does CSS block rendering but not HTML parsing?**
The browser continues parsing HTML (building the DOM) while a stylesheet downloads, but it withholds the first paint until the CSSOM is ready — the render tree, which is required before layout/paint can happen, can't be constructed without knowing the final computed styles, so painting is blocked even though parsing itself isn't.

**Q: Walk through the critical rendering path in order.**
HTML parsing builds the DOM; CSS parsing builds the CSSOM; DOM + CSSOM combine into the render tree (only visible nodes); layout computes exact positions/sizes; paint draws actual pixels; composite assembles layers onto the screen in the correct order.

**Q: Why does a synchronous script sometimes wait for a preceding stylesheet to finish loading, even though CSS and JS block in "different" ways?**
Because a script might call `getComputedStyle()` or otherwise depend on the CSSOM being fully built — so the browser conservatively delays executing a script until any `<link rel="stylesheet">` that appears before it in the document has finished loading and parsing, even though the script's own blocking behavior is nominally about parsing, not about CSSOM readiness.

**Q: What's the performance downside of CSS `@import` compared to a `<link>` tag?**
`@import` is discovered only after the stylesheet containing it has been fetched and parsed — the browser's HTML-level preload scanner can't see it, since it's a CSS-level construct. This turns what could be a parallel fetch (multiple `<link>` tags) into a sequential chain (fetch the importing file, then fetch what it imports), adding extra round trips to the critical rendering path.

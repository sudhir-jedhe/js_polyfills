# Interview Q&A: Runtimes and Performance

**Q: What are the practical tradeoffs between the Edge Runtime and the Node.js runtime?**
A: Edge offers lower cold-start latency and runs physically closer to end users via a distributed network, but only supports a subset of Web-standard APIs — no Node-native modules, no filesystem access, no native-binding npm packages. Node.js supports the full npm ecosystem and Node APIs but runs from a smaller number of regions with higher cold-start overhead. The choice depends on whether the handler's actual dependencies are Edge-compatible, not just on wanting the latency win.

**Q: Does Middleware ever run on the Node.js runtime?**
A: No — Middleware always runs on the Edge Runtime; there's no opt-out. This constrains what's safe to write inside `middleware.ts` regardless of preference — no Node-native database drivers or filesystem calls there.

**Q: What are the three Core Web Vitals, and what does each measure?**
A: LCP (Largest Contentful Paint) — how long until the biggest visible element renders, the main "does it feel loaded" signal. CLS (Cumulative Layout Shift) — how much content unexpectedly moves during load. INP (Interaction to Next Paint) — how quickly the page responds visually to a user interaction, measured across the page's lifecycle.

**Q: How does `@next/bundle-analyzer` help with performance work, and what's a common finding it surfaces?**
A: It generates a treemap of what's actually inside each build output chunk, making it possible to see exactly which packages/routes are contributing to bundle size rather than guessing. A very common finding is a barrel/wildcard import (`import * as X from 'library'`) that defeats tree-shaking and pulls an entire library into the client bundle when only one export is actually used — or a large library imported into a component that didn't need to be a Client Component in the first place.

**Q: A page has good LCP and CLS scores but poor INP. What's a likely cause, and where would you look first?**
A: Poor INP usually points to excessive client-side JavaScript — either too much of the page is unnecessarily marked `'use client'` (more hydration work, larger bundle competing for main-thread time), or an event handler is doing expensive synchronous work that blocks the main thread during the interaction itself. The first place to look is the scope of `'use client'` boundaries and whether any handler does heavy computation inline rather than deferring or optimizing it.

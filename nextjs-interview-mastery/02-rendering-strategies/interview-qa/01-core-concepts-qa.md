# Interview Q&A: Core Rendering Concepts

**Q: In one sentence, what's the difference between SSG and ISR?**
A: SSG generates HTML once at build time and never changes it until the next deploy; ISR does the same initial generation but adds a `revalidate` interval after which Next.js regenerates the page in the background on the next request, without requiring a full redeploy.

**Q: What makes a route "dynamic" by default in the App Router?**
A: Using a dynamic function (`cookies()`, `headers()`) or the `searchParams` prop in a Server Component, using `fetch(url, { cache: 'no-store' })`, or explicitly setting `export const dynamic = 'force-dynamic'` (or `export const revalidate = 0`). Any of these opts the whole route out of static generation and causes it to render fresh on every request.

**Q: Does marking a component `"use client"` mean it skips server rendering?**
A: No. Client Components are still rendered to HTML on the server (or at build time) for the initial response — `"use client"` only marks where client-side hydration and interactivity begin, not where server rendering stops. A `"use client"` page can still be fully static if nothing in it depends on request-time data.

**Q: Why does the App Router default to static rendering instead of dynamic?**
A: Performance and cost — static HTML can be served instantly from a CDN with zero per-request server compute, which is the best outcome whenever it's correct to do so. The App Router assumes routes are static unless proven otherwise (by the presence of a dynamic function or explicit opt-out), rather than requiring developers to explicitly ask for static generation as in the Pages Router's `getStaticProps`.

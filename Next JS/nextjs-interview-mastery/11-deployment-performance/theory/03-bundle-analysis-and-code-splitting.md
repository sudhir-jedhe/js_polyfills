# Bundle Analysis and Automatic Code-Splitting

Understanding what actually ships to the browser — and why the App Router needs less manual intervention here than older architectures — is a practical performance skill that goes beyond "just use dynamic import everywhere."

## Code-splitting is automatic, per route

In the App Router, each route segment's JavaScript is its own chunk by default, without any manual configuration. Visiting `/dashboard` doesn't download the code for `/settings` or `/blog/[slug]` — only the code needed for the currently-rendered route tree (the active layouts and page) is fetched. This is a structural consequence of file-based routing combined with the framework's build tooling, not something a developer opts into; it's the same reason navigating between routes with `<Link>` only fetches the *new* segment's payload rather than re-downloading everything.

## Server Components ship zero JS by default

A bigger lever than traditional code-splitting: Server Components never send their own component code to the browser at all — only their rendered HTML/RSC payload. A large Server Component that imports a heavy server-only library (a markdown parser, a PDF generator, an ORM client) contributes **nothing** to the client bundle, regardless of how large that library is, because none of that code needs to run in the browser. This is why the general advice (covered in topic 03) to keep `'use client'` boundaries as small and as deep in the tree as possible is also a bundle-size lever, not just an architectural preference — every component pulled unnecessarily across the client boundary drags its dependencies into the client bundle with it.

## `@next/bundle-analyzer`

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ...rest of your config
});
```

```bash
ANALYZE=true next build
```

This wraps the build with a plugin that generates an interactive treemap visualization of what's actually inside each output chunk — which packages, how large, and which route they belong to. It's the practical tool for answering "why did my bundle grow after this PR": a common discovery is an accidentally client-imported large library (a date-formatting library imported in full instead of tree-shaken, a chart library pulled into a component that didn't need to be a Client Component at all, a barrel-file import that pulls in far more than what's actually used).

## `next/dynamic` for further manual splitting

```tsx
'use client';
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // opt out of server rendering for client-only libraries (e.g. relying on `window`)
});
```

Even with automatic per-route splitting, a single route can still contain a heavy Client Component that's only needed conditionally (behind a tab, a modal, an accordion). `next/dynamic` lets you defer that component's JS until it's actually needed, independent of the route-level split — this is a manual, deliberate lever layered on top of the automatic per-route behavior, not a replacement for it.

## The practical workflow

Run the bundle analyzer periodically (or wire it into CI as a size-budget check), look for unexpectedly large chunks tied to routes that shouldn't need them, and cross-reference against recent `'use client'` additions — the analyzer tells you *what* is large, but tracing *why* almost always comes back to either an unnecessarily wide client boundary or an unoptimized third-party import.

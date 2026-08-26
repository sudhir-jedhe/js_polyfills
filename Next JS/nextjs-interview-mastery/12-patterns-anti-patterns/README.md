# 12 — Patterns & Anti-Patterns

Knowing the App Router's APIs isn't the same as using them well. This topic covers the practical mapping from Pages Router to App Router (still relevant since many jobs run Pages Router in production), and the handful of anti-patterns that account for most real-world App Router performance and maintainability problems: unnecessarily wide `'use client'` boundaries, client-side `useEffect` fetching where a Server Component fetch would do, skipping `next/image`/`next/font`, overusing middleware for logic that belongs in a Route Handler, and missing loading/error boundaries.

## Key takeaways

- `getServerSideProps` → Server Component with `fetch(..., { cache: 'no-store' })`; `getStaticProps`/`getStaticPaths` → `generateStaticParams()` + `revalidate`; there is no App Router equivalent of `getInitialProps`, and referencing `getServerSideProps` inside `app/` does nothing (it's simply not a recognized export there — the failure is silent, not an error).
- Every component is a Server Component by default; `'use client'` should be applied as narrowly as possible, as deep in the tree as possible — placing a client boundary (or a context provider) high in the tree, including accidentally in the root layout, drags everything beneath it into the client bundle regardless of whether it's actually interactive.
- Fetching data in `useEffect` inside a Client Component, when the data is known at render time and isn't client-only, forces an avoidable loading state and client-server round trip; a Server Component `fetch` (or direct async call) resolves before any HTML reaches the browser, eliminating both.
- Raw `<img>`/Google Fonts `<link>` tags skip automatic image optimization/lazy-loading and font self-hosting/metric-matching, directly costing CLS and LCP — `next/image` and `next/font` fix both, and the severity compounds when the pattern repeats across many instances (e.g., a long list of avatars).
- Middleware runs on the Edge Runtime for every matching request before routing resolves — it belongs to fast, stateless decisions (auth gating, redirects, header manipulation), not business logic (DB writes, blocking external calls); missing `loading.tsx`/`error.tsx` means a slow fetch shows nothing and an unhandled error's blast radius extends to the nearest ancestor boundary, which with none defined is effectively the whole app.

## Index

### theory/
- `01-pages-router-vs-app-router.md`
- `02-anti-pattern-unnecessary-use-client.md`
- `03-anti-pattern-useEffect-fetch.md`
- `04-anti-pattern-skipping-image-font-optimization.md`
- `05-anti-pattern-middleware-overuse-and-missing-boundaries.md`

### snippets/
- `01-getServerSideProps-vs-server-component.tsx`
- `02-getStaticProps-paths-vs-generateStaticParams.tsx`
- `03-use-client-scope-fix.tsx`
- `04-useEffect-fetch-vs-server-fetch.tsx`
- `05-route-handler-vs-middleware.ts`
- `06-loading-error-boundaries.tsx`

### output-based/
- `01-use-client-boundary-misplacement.md` — root-layout `'use client'` "fix" gone wrong
- `02-useEffect-fetch-waterfall.md` — sequential client fetches hidden inside two `useEffect`s
- `03-raw-img-vs-next-image-cls.md` — CLS compounding across a repeated list
- `04-middleware-blocking-every-request.md` — unscoped, blocking middleware slowing the whole site
- `05-missing-error-boundary-crash-blast-radius.md` — one widget's crash takes down the app shell
- `06-getServerSideProps-mental-model-in-app-router.md` — silently-ignored Pages Router export
- `07-client-bundle-bloat-from-unnecessary-provider-nesting.md` — provider placement determines bundle blast radius

### scenarios/
- `01-migrate-pages-to-app.md`
- `02-refactor-client-fetch-to-server.md`
- `03-audit-project-anti-patterns.md`
- `04-middleware-vs-route-handler-decision.md`

### interview-qa/
- `01-pages-vs-app-router-qa.md`
- `02-common-anti-patterns-qa.md`
- `03-boundaries-and-image-font-qa.md`

### problems/
- `01-convert-getServerSideProps-page.md`
- `02-refactor-useEffect-fetch-to-server-component.md`
- `03-audit-code-listing-for-anti-patterns.md`

### assets/
- `README.md` — placeholder for original notes/images

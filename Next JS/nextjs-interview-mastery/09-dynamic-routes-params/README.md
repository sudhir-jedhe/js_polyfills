# 09 — Dynamic Routes & Params

Dynamic segments are how the App Router turns a filesystem into a routing table for content that isn't known ahead of time: blog posts, product pages, user profiles, documentation trees. This topic covers the three bracket syntaxes for dynamic segments, how to read the resulting values in a Server Component, how to control which of those values get pre-rendered at build time versus rendered on demand, and the two advanced routing primitives (parallel and intercepting routes) that power patterns like modal-over-page navigation.

## Key takeaways

- `[slug]` matches exactly one path segment (`string`); `[...slug]` (catch-all) matches one-or-more segments (`string[]`) and never matches the bare parent path; `[[...slug]]` (optional catch-all) matches zero-or-more, including the bare parent, with `undefined` (not `[]`) when nothing is captured.
- `params` and `searchParams` are `Promise`s in Next.js 15 — always `await` them. `params` values are always strings; parse and validate before using them numerically or as IDs.
- Reading `searchParams` forces a page into dynamic rendering (query strings can't be enumerated ahead of time); reading only `params` keeps a page eligible for static generation via `generateStaticParams`.
- `generateStaticParams()` decides which values of a dynamic segment get pre-rendered at build time. `dynamicParams` decides what happens for values *not* in that list: `true` (default) renders on-demand and caches; `false` returns a 404 immediately, treating the list as a closed allowlist.
- `generateStaticParams` and `revalidate` are independent knobs — one controls *which* paths are built ahead of time, the other controls *how often* any rendered path (pre-built or on-demand) is refreshed.
- Parallel routes (`@slot`) let a layout render multiple independently-navigable sections at once; intercepting routes (`(.)`, `(..)`, `(...)folder`) render a route differently depending on whether navigation originated client-side from within the app or as a direct/hard navigation. Combined, they implement the modal-over-feed pattern where the URL stays shareable and refresh-safe.

## Index

### theory/
- `01-dynamic-segments.md` — `[slug]`, `[...slug]`, `[[...slug]]`, and the multiple-dynamic-segments-at-one-level constraint
- `02-reading-params-and-searchparams.md` — async `params`/`searchParams`, typing, and the static/dynamic rendering implication
- `03-generateStaticParams-and-dynamicParams.md` — pre-rendering dynamic routes at build time and the `dynamicParams` 404-vs-on-demand switch
- `04-parallel-and-intercepting-routes.md` — `@slot` and `(.)folder` conceptually, with the photo-modal pattern

### snippets/
- `01-basic-dynamic-segment.tsx` — single `[slug]` page with `notFound()`
- `02-catch-all-route.tsx` — `[...slug]` docs-style route
- `03-optional-catch-all-route.tsx` — `[[...slug]]` category browser
- `04-reading-search-params.tsx` — `searchParams` with sort/page/tag filtering
- `05-generate-static-params-basic.tsx` — pre-render recent posts, on-demand for the rest
- `06-parallel-routes-layout.tsx` — `@team`/`@analytics` slots in a dashboard layout

### output-based/
- `01-params-are-always-strings.md` — string-vs-number comparison trap
- `02-generateStaticParams-key-mismatch.md` — silently ignored pre-rendering due to a key typo
- `03-dynamicParams-false-404.md` — legitimate content 404ing because of a closed allowlist
- `04-catch-all-vs-optional-catch-all.md` — root-path matching differences and route conflicts
- `05-searchParams-cannot-drive-generateStaticParams.md` — why query strings can't be pre-rendered like path segments
- `06-intercepting-route-convention-mismatch.md` — modal never appears due to missing parallel-slot wiring
- `07-multiple-dynamic-segments-same-level.md` — build failure from ambiguous sibling dynamic segments

### scenarios/
- `01-blog-with-hybrid-ssg.md` — pre-render recent posts, on-demand for the long tail
- `02-docs-site-catch-all.md` — arbitrary-depth content tree with one route file
- `03-photo-modal-intercepting.md` — full modal + direct-link pattern walkthrough
- `04-ecommerce-product-variants.md` — bounding build time for a large SKU catalog

### interview-qa/
- `01-dynamic-segments-qa.md`
- `02-generateStaticParams-qa.md`
- `03-parallel-intercepting-routes-qa.md`

### problems/
- `01-blog-slug-generateStaticParams.md` — implement the hybrid blog route
- `02-docs-catch-all-route.md` — implement the arbitrary-depth docs route
- `03-photo-modal-intercepting-routes.md` — implement the full modal-over-page pattern

### assets/
- `README.md` — placeholder for original notes/images

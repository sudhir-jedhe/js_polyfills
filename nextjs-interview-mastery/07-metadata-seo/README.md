# 07 — Metadata & SEO

The App Router's Metadata API replaces `next/head` with declarative
`metadata` exports and async `generateMetadata()` functions, resolved
server-side before any HTML streams to the client. This topic covers static
vs. dynamic metadata, how metadata inherits and merges across nested
layouts, Open Graph/Twitter card setup for social sharing, programmatic
`sitemap.js`/`robots.js` generation, and why Server Components give App
Router apps a stronger SEO baseline by default.

## Key takeaways

- Use a static `metadata` object when values don't depend on fetched data;
  use async `generateMetadata()` whenever a dynamic route needs per-entity
  titles/descriptions (a blog post, a product page).
- Calling the same data-fetching function in both `generateMetadata()` and
  the page component isn't wasteful — Next.js deduplicates identical
  `fetch()` calls within a render via request memoization.
- Metadata **shallow-merges** across nested layouts field by field, but
  nested objects like `openGraph`/`twitter` are **fully replaced**, not
  deep-merged, when a child segment redefines them — overriding `openGraph`
  means re-specifying every field you still want, including ones the parent
  already set. This is the single most common cause of broken social share
  previews.
- `title: { template: '%s | Site' }` at the root wraps plain-string child
  titles automatically; `title: { absolute: '...' }` opts a page out of that
  template entirely.
- `metadataBase` (set once, usually in the root layout) is required for
  relative image/URL paths elsewhere in metadata to resolve to absolute
  URLs — many crawlers and social platforms fail silently on relative OG
  image URLs without it.
- `sitemap.js`/`robots.js` generate `/sitemap.xml` and `/robots.txt`
  programmatically, and should pull dynamic content (blog slugs, product
  slugs) from the real data source rather than a hand-maintained list —
  remember these fetches are cacheable too and need a sensible
  `revalidate`/tag strategy so new content shows up promptly.
- Server Components fetch and render content server-side, so it's present in
  the very first HTML response — a fundamentally stronger default for
  crawlers and link-unfurling bots than client-fetched SPA patterns, with no
  extra SEO-specific code required.
- A missing/invalid dynamic-route entity needs *both* sensible fallback
  metadata (`robots: { index: false }`) *and* a real `notFound()` call in the
  page component — metadata alone doesn't produce a true HTTP 404 status.

## Index

### theory/
1. `01-static-vs-dynamic-metadata.md` — static `metadata` vs. `generateMetadata()`, request deduplication.
2. `02-metadata-inheritance-and-merging.md` — shallow merge rules, `title.template`/`absolute`, the `openGraph` full-replace trap.
3. `03-open-graph-twitter-cards.md` — OG/Twitter fields, `metadataBase`, testing/re-scraping share previews.
4. `04-sitemap-robots-conventions.md` — `sitemap.js`/`robots.js` conventions, `generateSitemaps()` for scale.
5. `05-server-components-and-seo.md` — why server-rendered content and server-resolved metadata beat client-fetching SPAs for SEO.

### snippets/
1. `01-static-metadata-page.jsx` — plain static `metadata` export.
2. `02-generate-metadata-dynamic.jsx` — `generateMetadata()` fetching per-route data.
3. `03-title-template-root-layout.jsx` — `title.template`/`default` at the root, `metadataBase`.
4. `04-open-graph-twitter.jsx` — full OG + Twitter card object for a blog post.
5. `05-robots.js` — `robots.js` with per-agent rules and a sitemap reference.
6. `06-sitemap.js` — static routes + dynamic post slugs combined.
7. `07-not-found-metadata.jsx` — pairing fallback metadata with `notFound()`.

### output-based/
1. `01-opengraph-lost-on-override.md` — child `openGraph` override drops inherited `siteName`/`images`.
2. `02-relative-og-image-fails.md` — missing `metadataBase` breaks relative OG image resolution.
3. `03-client-component-metadata-export.md` — `metadata` export in a `'use client'` file fails the build.
4. `04-generic-title-on-404-slug.md` — soft-404 anti-pattern: missing `notFound()` call plus a nonsensical fallback title.
5. `05-title-template-not-applied.md` — `title.absolute` intentionally bypassing the parent template.
6. `06-sitemap-missing-new-posts.md` — default `fetch` caching makes `sitemap.js` serve stale content.

### scenarios/
1. `01-dynamic-blog-post-metadata.md` — converting a generic blog page to full per-post `generateMetadata()`.
2. `02-dynamic-sitemap-with-cms-content.md` — combining static routes with two CMS-driven content types in one sitemap.
3. `03-fixing-broken-share-preview.md` — a step-by-step debugging walkthrough for a broken product-page share card.

### interview-qa/
1. `01-metadata-api-fundamentals.md` — static vs. dynamic metadata, request dedup, Client Component restriction, `metadataBase`.
2. `02-inheritance-open-graph.md` — merge semantics, title template/absolute, sitemap revalidation tags.
3. `03-seo-and-server-components.md` — why Server Components help SEO, whether Client Components hurt it, metadata resolution timing tradeoffs.

### problems/
1. `01-generate-metadata-blog-post.md` — full `generateMetadata()` implementation for a dynamic blog route, with 404 handling.
2. `02-dynamic-sitemap-static-and-slugs.md` — `sitemap.js` combining static routes and fetched blog slugs.
3. `03-fix-broken-social-share-preview.md` — diagnose-and-fix exercise for a page with static metadata and no OG tags.

### assets/
- `README.md` — placeholder pointing to the original notes source map.

No `projects/` folder for this topic per the assignment scope.

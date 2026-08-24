# 02 — Rendering Strategies

Next.js's App Router supports four rendering strategies — SSR, SSG, ISR, and CSR — and, crucially, decides which one applies to a given route based on what the route's code does, not on an explicit function you must remember to export. This topic covers each strategy's mechanics, the "static by default, dynamic by opt-in" model that governs the App Router, ISR's stale-while-revalidate request lifecycle, when CSR is still the right call, and a practical decision framework for picking a strategy per route.

## Key points

- SSG generates HTML once at build time; SSR generates it fresh per request; ISR is SSG plus a background regeneration timer (`revalidate`); CSR renders/fetches in the browser after hydration.
- The App Router defaults to static rendering for every route unless something forces it dynamic: `cookies()`, `headers()`, `searchParams` usage, `fetch(..., { cache: 'no-store' })`, or `export const dynamic = 'force-dynamic'`.
- ISR never blocks a request on regeneration — stale content is served immediately while a fresh render happens in the background for the next eligible request.
- `revalidate = 0` means "opt out of caching entirely" (dynamic), not "the shortest possible ISR interval."
- `"use client"` does not disable server rendering — Client Components are still rendered to HTML for the initial response; it only marks where client-side hydration/interactivity begins.
- On-demand revalidation (`revalidatePath`, `revalidateTag`) lets you bypass the `revalidate` timer entirely for event-driven freshness (e.g., a CMS publish action).
- Choose per route (and often per component) based on audience-specificity and freshness requirements — most real pages combine more than one strategy.

## Index

### theory/
- `01-ssr-ssg-isr-csr-overview.md` — mechanics of all four strategies with code
- `02-static-by-default-and-opt-in-dynamic.md` — what forces a route into dynamic rendering
- `03-isr-deep-dive.md` — the ISR stale-while-revalidate request lifecycle in detail
- `04-when-to-use-csr.md` — cases where CSR is still the right choice
- `05-decision-framework.md` — practical questions to pick a strategy per route

### snippets/
- `ssg-static-blog-post.tsx` — `generateStaticParams` + default cached fetch
- `isr-product-page.tsx` — `revalidate` export and fetch-level override
- `ssr-dashboard-page.tsx` — `cookies()` forcing dynamic rendering
- `force-dynamic-config.tsx` — explicit `export const dynamic = 'force-dynamic'`
- `csr-live-ticker-island.tsx` — CSR island inside a static/ISR shell
- `on-demand-revalidation.tsx` — tag-based fetch + `revalidateTag` in a Server Action

### output-based/
- `01-implicit-dynamic-from-cookies.md` — `cookies()` silently overriding a `revalidate` export
- `02-revalidate-zero-meaning.md` — why `revalidate = 0` means dynamic, not "instant ISR"
- `03-stale-request-serving-order.md` — which visitor sees stale vs. fresh content and why
- `04-searchparams-forces-dynamic.md` — `searchParams` usage forcing dynamic rendering
- `05-fetch-cache-override-conflict.md` — `no-store` fetch overriding a route-level `revalidate`
- `06-generatestaticparams-fallback-behavior.md` — on-demand rendering for unlisted params
- `07-client-component-page-still-server-rendered-shell.md` — `"use client"` doesn't disable SSR

### scenarios/
- `01-ecommerce-catalog-rebuild-too-slow.md` — moving 50k SSG products to ISR
- `02-accidentally-dynamic-marketing-site.md` — diagnosing an accidental dynamic opt-out
- `03-personalized-but-cacheable-homepage.md` — isolating a small personalized fragment
- `04-choosing-strategy-for-new-features.md` — picking strategies for three new page types

### interview-qa/
- `01-core-concepts-qa.md` — SSG vs ISR, what forces dynamic, use client and SSR
- `02-isr-mechanics-qa.md` — stale-while-revalidate lifecycle, on-demand vs timed revalidation
- `03-choosing-strategy-qa.md` — decision-making judgment questions

### problems/
- `01-configure-isr-with-revalidate.md` — implement ISR and trace the stale-request lifecycle
- `02-force-fully-dynamic-route.md` — force SSR for a per-user live-data page
- `03-identify-strategy-for-three-page-types.md` — implement blog/ticker/landing with justified strategies

### assets/
- `README.md` — placeholder for original notes' images/PDFs

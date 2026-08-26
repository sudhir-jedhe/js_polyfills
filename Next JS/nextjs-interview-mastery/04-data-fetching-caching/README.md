# 04 — Data Fetching and Caching

Data fetching in the App Router collapses into plain `async/await` inside Server Components — no `useEffect`, no `getServerSideProps`. Layered on top is Next.js's extended `fetch()` caching model and, most importantly, three genuinely distinct caching mechanisms — Request Memoization, the Data Cache, and the Full Route Cache — that operate at different scopes and are one of the most confused (and most-tested) areas of the framework. This topic covers all of it, plus on-demand revalidation for keeping cached content correct after mutations.

## Key points

- Server Components fetch data with plain `async/await` — no special exported function, and independent fetches should use `Promise.all` to avoid an accidental waterfall.
- `fetch()` defaults to `cache: 'force-cache'` (cached indefinitely); `cache: 'no-store'` disables caching and forces the route dynamic; `next: { revalidate: N }` gives ISR-style time-bounded caching; `next: { tags: [...] }` enables on-demand invalidation.
- **Request Memoization** dedupes identical `fetch()` calls within a single render pass only — it does not persist across requests.
- **Data Cache** persists across requests and deployments, backing `fetch()`'s default caching and time/tag-based revalidation.
- **Full Route Cache** stores a static route's entire rendered output, served without re-running any component code until invalidated.
- `revalidatePath`/`revalidateTag` provide event-driven, on-demand invalidation that bypasses time-based `revalidate` windows entirely — the standard "mutate, then invalidate" pattern.
- Non-`fetch()` data sources (ORMs, SDKs) don't get this caching automatically — use React's `cache()` or Next.js's `unstable_cache()` for equivalent behavior.

## Index

### theory/
- `01-fetching-in-server-components.md` — async/await data fetching directly in components
- `02-extended-fetch-caching.md` — `force-cache`, `no-store`, `revalidate`, and `tags` fetch options
- `03-three-caching-layers.md` — Request Memoization vs Data Cache vs Full Route Cache in depth
- `04-on-demand-revalidation.md` — `revalidatePath` and `revalidateTag` mechanics
- `05-common-caching-pitfalls.md` — a diagnostic checklist for stale-data and unexpected-dynamic bugs

### snippets/
- `basic-async-server-component-fetch.tsx` — plain async/await fetching, no useEffect
- `cache-options-comparison.tsx` — `force-cache`, `no-store`, and `revalidate` side by side
- `request-memoization-demo.tsx` — the same fetch called from two components, deduped
- `tag-based-revalidation.tsx` — tagged fetch plus a Server Action calling `revalidateTag`
- `revalidate-path-server-action.tsx` — `revalidatePath` after a profile update
- `parallel-vs-sequential-fetches.tsx` — avoiding a waterfall with `Promise.all`

### output-based/
- `01-how-many-network-calls.md` — Request Memoization across three call sites
- `02-memoization-vs-data-cache-scope.md` — why cross-request reuse isn't memoization
- `03-revalidatetag-without-matching-tag.md` — a tag mismatch silently no-oping revalidation
- `04-no-store-inside-cached-route.md` — one `no-store` fetch forcing the whole route dynamic
- `05-non-fetch-data-source-no-caching.md` — an ORM query not getting `fetch()`-level caching
- `06-revalidate-mismatch-fetch-vs-route.md` — conflicting route-level and fetch-level revalidate values
- `07-post-fetch-not-cached-by-default.md` — POST requests aren't cached like GET by default

### scenarios/
- `01-stale-pricing-after-admin-update.md` — adding tag-based revalidation to an admin price-update flow
- `02-duplicate-api-calls-slow-dashboard.md` — diagnosing why memoization isn't deduping as expected
- `03-cms-editor-cant-see-draft-preview.md` — a dedicated uncached preview route alongside public ISR
- `04-inconsistent-tags-across-team.md` — fixing inconsistent cache tag naming across a growing team

### interview-qa/
- `01-fetching-fundamentals-qa.md` — async/await fetching, default cache behavior, waterfalls
- `02-three-layers-qa.md` — scope and interaction of the three caching mechanisms
- `03-revalidation-qa.md` — `revalidatePath` vs `revalidateTag`, when and where to call them

### problems/
- `01-prove-request-memoization.md` — instrument a page to prove deduplication within one request
- `02-tag-based-revalidation-cms-flow.md` — implement a full tag-and-revalidate CMS-like update flow
- `03-diagnose-fix-stale-data-bug.md` — diagnose and fix a page stuck showing pre-mutation data

### assets/
- `README.md` — placeholder for original notes' images/PDFs

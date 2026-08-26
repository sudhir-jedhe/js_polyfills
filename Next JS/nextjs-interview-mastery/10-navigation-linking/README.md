# 10 — Navigation & Linking

Navigation is where the App Router's rendering model becomes visible to users: `<Link>`'s automatic prefetching and partial re-renders are the reason transitions feel instant compared to a traditional full page reload. This topic covers the declarative (`<Link>`) and imperative (`useRouter`) navigation APIs, the client-only hooks for reading the current URL (`usePathname`, `useSearchParams`, `useSelectedLayoutSegment`), the Suspense requirement that trips up `useSearchParams` specifically, and the concrete cost model behind "layouts persist across navigations."

## Key takeaways

- `<Link>` renders a real `<a>` (preserving native behaviors like middle-click and right-click) but intercepts left-clicks for client-side transitions, and automatically prefetches the target route on viewport entry — in production only, never in `next dev`.
- `useRouter()` (from `next/navigation`) is Client-Component-only and provides `push` (adds a history entry), `replace` (overwrites the current entry — use for redirects that shouldn't be revisitable), `back`/`forward`, and `refresh` (re-fetches current-route server data without losing client state or changing the URL).
- `usePathname()` and `useSearchParams()` are both Client-Component-only. `useSearchParams()` has an additional requirement: a component using it needs a `<Suspense>` boundary when nested inside an otherwise statically-rendered page, or the build fails/de-opts to full client rendering.
- App Router transitions are partial re-renders: shared layouts between the old and new route stay mounted, keeping their state and skipping re-fetch/re-render, while a full page reload (`<a>` tag) tears down and rebuilds everything, including shared UI.
- `useSelectedLayoutSegment`/`useSelectedLayoutSegments` give layout-relative active-route info without manually parsing `usePathname()`, and correctly return `null` (not a string) when a layout's own index route is active — a common source of "why isn't my tab highlighted" bugs.

## Index

### theory/
- `01-next-link-and-prefetching.md`
- `02-useRouter-programmatic-navigation.md`
- `03-usePathname-and-useSearchParams.md`
- `04-navigation-cost-and-layout-persistence.md`
- `05-useSelectedLayoutSegment.md`

### snippets/
- `01-link-basic.tsx` — string href, object href, prefetch/scroll overrides
- `02-router-push-replace-back.tsx` — push, replace, back, refresh
- `03-use-pathname.tsx` — active-link highlighting
- `04-use-search-params-suspense.tsx` — correct Suspense isolation pattern
- `05-active-link-selected-segment.tsx` — `useSelectedLayoutSegment` tabs
- `06-unsaved-changes-guard.tsx` — `beforeunload` + guarded `router.push`

### output-based/
- `01-prefetch-dev-vs-prod.md` — dev mode disables prefetching
- `02-useSearchParams-missing-suspense.md` — silent full-page client de-opt
- `03-router-push-vs-link-href.md` — accessibility/semantics gap
- `04-usePathname-in-server-component.md` — missing `'use client'` crash
- `05-replace-vs-push-back-button.md` — login redirect loop from wrong history method
- `06-dynamic-href-object-encoding.md` — manual query string encoding bug
- `07-useSelectedLayoutSegment-null-case.md` — index route returns `null`, not a segment name

### scenarios/
- `01-active-nav-highlighting.md` — prefix-aware active state for nested sidebars
- `02-unsaved-changes-guard.md` — full guard covering both navigation paths
- `03-search-filters-url-state.md` — shareable filter state via `searchParams` + `router.push`
- `04-breadcrumbs-from-pathname.md` — auto-generated breadcrumbs from the URL

### interview-qa/
- `01-link-vs-anchor-qa.md`
- `02-navigation-hooks-qa.md`
- `03-navigation-cost-qa.md`

### problems/
- `01-active-nav-link-component.md`
- `02-confirm-before-leaving-unsaved-changes.md`
- `03-fix-useSearchParams-suspense-bug.md`

### assets/
- `README.md` — placeholder for original notes/images

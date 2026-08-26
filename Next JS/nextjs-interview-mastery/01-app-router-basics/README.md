# 01 — App Router Basics

The App Router (`app/`) is the file-convention-driven routing system that has been the recommended default in Next.js since 13.4. This topic covers the reserved file conventions that define a route segment, how nested layouts persist across client-side navigation (and why that matters for state), route groups for organizing code without touching the URL, colocation of non-routable files inside route folders, and a high-level contrast with the legacy Pages Router.

## Key points

- `page.js`, `layout.js`, `loading.js`, `error.js`, `not-found.js`, and `template.js` are reserved filenames that plug into specific slots of an implicit per-segment component tree — only `page.js` makes a segment a navigable route.
- `layout.js` persists across navigations between routes that share it — it does not re-render or lose state; `template.js` is the opposite, remounting fresh on every navigation.
- `loading.js` is an automatic Suspense boundary around a segment; `error.js` is an automatic Client Component error boundary — they wrap different concerns and can coexist.
- Route groups (`(folderName)`) organize routes and let you scope shared layouts — including multiple independent root layouts — without adding a segment to the URL.
- Only reserved-name files are routable; everything else in a route folder (components, tests, styles, utils) is safe to colocate.
- The App Router and Pages Router (`pages/`) can coexist in one project during migration; App Router components are Server Components by default, Pages Router components are Client Components by default.

## Index

### theory/
- `01-file-conventions.md` — the reserved App Router filenames and what each one does
- `02-nested-layouts-persistence.md` — why layouts persist across navigation and what that means for state
- `03-route-groups.md` — organizing routes with `(folder)` groups, including multiple root layouts
- `04-colocation.md` — colocating non-routable files safely inside route folders
- `05-app-vs-pages-router.md` — conceptual contrast with the legacy Pages Router

### snippets/
- `root-layout.tsx` — the mandatory root layout with `<html>`/`<body>`
- `nested-dashboard-layout.tsx` — a nested layout persisting across sub-route navigation
- `loading-and-error.tsx` — `loading.tsx` + `error.tsx` pair for a segment
- `not-found.tsx` — triggering and rendering a segment-scoped `not-found.tsx`
- `route-group-marketing-vs-app.tsx` — two route groups with independent layouts
- `template-vs-layout.tsx` — a `template.tsx` that remounts on every navigation

### output-based/
- `01-layout-state-persistence.md` — does a layout's `useState` reset on sibling navigation?
- `02-loading-boundary-scope.md` — which `loading.js` fires for a nested slow route?
- `03-route-group-url-collision.md` — two route groups defining the same URL
- `04-colocated-file-routability.md` — are colocated non-convention files routable?
- `05-error-boundary-scope.md` — blast radius of a segment-scoped `error.js`
- `06-template-remount-effect.md` — how many times a `template.js` effect re-fires
- `07-missing-page-file.md` — what renders when a folder has a layout but no `page.js`

### scenarios/
- `01-persistent-video-player.md` — keeping a media player alive across lesson navigation
- `02-marketing-app-split.md` — splitting one shell into two route groups with independent root layouts
- `03-flash-of-blank-page.md` — fixing a missing `loading.js` causing blank screens
- `04-third-party-outage-crash.md` — scoping `error.js` to limit blast radius of a failing widget

### interview-qa/
- `01-file-conventions-qa.md` — layout vs template, loading/error interaction, colocation safety
- `02-layouts-and-groups-qa.md` — why layouts can't read searchParams, multiple root layouts, group URL collisions
- `03-app-vs-pages-qa.md` — coexistence, rendering-model differences, which to pick for new projects

### problems/
- `01-nested-layout-structure.md` — build root → dashboard → page layouts and reason about re-renders
- `02-loading-and-error-boundaries.md` — implement `loading.js`/`error.js` for a flaky async route
- `03-route-groups-marketing-app.md` — organize `(marketing)` and `(app)` sections without URL leakage

### assets/
- `README.md` — placeholder for original notes' images/PDFs

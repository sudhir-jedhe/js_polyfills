# Navigation Cost: App Router Transitions vs. Full Page Reload

Understanding *why* App Router navigation is fast is as important as knowing the API surface — it's a frequent "explain the tradeoffs" interview question, and the answer centers on what gets re-rendered versus what persists.

## What a full page reload actually costs

A traditional multi-page navigation (or any `<a href>` to an internal route) throws away the entire JavaScript runtime state: the browser requests a fresh HTML document, downloads and parses all JS/CSS bundles again, re-establishes any WebSocket or long-lived connections, re-runs every provider's initialization, and repaints from a blank white screen before anything is visible. Even if the new page shares 95% of its UI (nav bar, sidebar, footer) with the previous page, all of it is torn down and rebuilt from scratch.

## What an App Router transition costs

```
app/
  layout.tsx          <- persists across ALL navigations within the app
  dashboard/
    layout.tsx          <- persists across navigations WITHIN /dashboard/*
    page.tsx
    settings/
      page.tsx
```

Navigating from `/dashboard` to `/dashboard/settings` via `<Link>` or `router.push`:

1. The router diffs the new URL against the current route tree to find the **shared layout boundary** — here, both `app/layout.tsx` and `app/dashboard/layout.tsx` are unchanged, so neither re-renders or re-fetches.
2. Only the segment that actually differs (`page.tsx` under `settings/`) is fetched — as an RSC payload, not a full HTML document — and swapped into the `children` slot of the persisting layout.
3. Client state inside the persisting layouts (an open sidebar, a video mid-playback, scroll position of a persistent panel, in-memory context) survives untouched, because those components were never unmounted.

This is the practical meaning of "layouts persist" — it's not just a performance optimization, it's also a UX guarantee: anything living in a shared layout keeps its state across sibling route changes.

## Client-side caching further reduces cost

The Router also maintains a client-side cache of previously visited (and prefetched) segments, so navigating back to a route visited earlier in the session can be near-instant, served from cache without a new network request at all — subject to that cache's invalidation rules (time-based for dynamic segments, invalidated by `router.refresh()` or a revalidation triggered by a Server Action).

## Where the App Router model still costs something

It's worth being precise in an interview rather than overselling this as "always free": the segment(s) that *do* change still need their data fetched (unless served from prefetch cache) and their component tree rendered, and any Client Component in the newly-loaded segment still needs to hydrate. The saving is specifically in **not re-doing the work for the parts of the tree that didn't change** — the win scales with how much of the UI is shared layout versus how much is genuinely new content per route.

## The concrete comparison to state in an interview

| | Full page reload (`<a>`) | App Router transition (`<Link>`/`useRouter`) |
|---|---|---|
| JS/CSS bundle | Re-downloaded, re-parsed | Already loaded; only new code (if any) fetched |
| Shared layouts | Fully torn down and rebuilt | Persist, untouched |
| Client state in shared layout | Lost | Preserved |
| Data fetch scope | Entire page | Only the changed segment (or nothing, if prefetched) |
| Visual result | Blank screen, then repaint | Immediate transition, often with `loading.tsx` streaming in |

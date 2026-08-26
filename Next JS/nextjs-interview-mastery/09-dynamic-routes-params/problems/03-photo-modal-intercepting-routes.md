# Problem 3: Photo grid with modal-over-page via intercepting routes

## Task

Implement a photo feed at `/feed` where clicking a photo thumbnail opens it in a modal overlay (feed stays visible/scrolled underneath), but:

- Directly visiting `/photo/[id]` (typed URL, shared link, new tab) renders a full standalone page — no modal, no feed.
- Refreshing the browser while the modal is open also renders the full standalone page (this is the same underlying behavior as the direct-link case — interception only applies to client-side navigations originating from `/feed`).

## Requirements

1. Create the real full-page route: `app/photo/[id]/page.tsx`.
2. Create the feed route: `app/feed/page.tsx`, using `<Link href={`/photo/${id}`}>` for each thumbnail (not `router.push` inside an `onClick`, and not a raw `<a>`).
3. Add a parallel route slot (`@modal`) to `app/feed/`, wired into `app/feed/layout.tsx`.
4. Add `app/feed/@modal/default.tsx` returning `null` (so other feed sub-routes don't 404 when nothing should render in the slot).
5. Add the intercepted view: `app/feed/@modal/(.)photo/[id]/page.tsx`, rendering the same underlying photo data inside a `Modal` component.
6. Both the modal and full-page views should fetch photo data via a shared `getPhoto(id: string)` function — no duplicated data-fetching logic.

## Starter shape

```
app/
  feed/
    layout.tsx
    page.tsx
    @modal/
      default.tsx
      (.)photo/[id]/page.tsx
  photo/[id]/page.tsx
```

## Self-check

- From `/feed`, clicking a thumbnail: does the URL change to `/photo/[id]` while the feed remains visible behind a modal?
- Pasting that `/photo/[id]` URL into a fresh tab: does it render the full page, not a broken empty modal?
- Refreshing mid-modal: same full-page result, not an error or blank screen?
- Navigating from `/feed` to some other feed sub-route that isn't a photo: does the `@modal` slot correctly render nothing (via `default.tsx`) instead of 404ing?

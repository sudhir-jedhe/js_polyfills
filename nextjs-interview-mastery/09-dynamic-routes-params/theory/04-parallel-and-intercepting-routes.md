# Parallel Routes (`@slot`) and Intercepting Routes (`(.)folder`)

These are the two most advanced routing primitives in the App Router. You won't use them every day, but the "photo modal that also works as a direct link" pattern (Instagram, Twitter/X photo grids) is a canonical interview scenario, and it needs both together.

## Parallel routes: rendering multiple pages in the same layout

A folder prefixed with `@` defines a **named slot** that a layout can render independently of the main page content — think of it as multiple independently-routable sub-trees rendered side by side.

```
app/
  dashboard/
    layout.tsx
    page.tsx
    @team/
      page.tsx
    @analytics/
      page.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2">
      <div>{children}</div>
      <div>
        {team}
        {analytics}
      </div>
    </div>
  );
}
```

Each slot (`team`, `analytics`) is injected as a prop matching its folder name (minus the `@`), and each has its own loading/error boundaries and can navigate independently — a huge win for dashboards where one panel shouldn't block or crash another. If a slot has no matching route for the current URL, Next.js needs a `default.tsx` in that slot to render as a fallback (otherwise you get a 404 for the whole layout on hard navigation/refresh).

## Intercepting routes: rendering a route in a different context

A folder prefixed with `(.)`, `(..)`, `(..)(..)`, or `(...)` **intercepts** navigation to a matching route and renders it in the current layout context instead of doing a full route transition — but only when the navigation happens via client-side `<Link>`/`router.push` from within the app. A hard refresh or direct URL visit bypasses the interception and renders the actual target route normally.

```
app/
  feed/
    page.tsx
    @modal/
      (.)photo/[id]/
        page.tsx
  photo/[id]/
    page.tsx
```

- `(.)` intercepts a route at the **same** level.
- `(..)` intercepts one level **up**.
- `(...)` intercepts from the **root**.

## The classic combo: photo-in-modal, direct-link-to-page

```tsx
// app/feed/page.tsx — the grid, links use normal <Link>
<Link href={`/photo/${photo.id}`}>
  <img src={photo.thumbnailUrl} />
</Link>
```

```tsx
// app/feed/@modal/(.)photo/[id]/page.tsx — rendered when navigated
// to /photo/[id] FROM within /feed
export default function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Modal>
      <PhotoDetail id={params} />
    </Modal>
  );
}
```

```tsx
// app/photo/[id]/page.tsx — the real, full-page route
export default function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  return <FullPhotoLayout id={params} />;
}
```

Clicking a photo from the feed intercepts navigation and overlays a modal (URL still updates to `/photo/123`, so it's shareable and back-button-friendly). Pasting that same URL directly, or refreshing the page while the modal is open, renders `app/photo/[id]/page.tsx` as a genuine full page — no modal, no feed behind it. This is the mechanism, not a hack with `useState` and a query param; the routing system itself understands "same destination, different presentation depending on navigation origin."

At a conceptual level for interviews: parallel routes solve "multiple independent views in one layout," intercepting routes solve "same URL, contextual presentation," and they're commonly composed together because a modal-over-feed needs both a slot to render into and interception to trigger it only on soft navigation.

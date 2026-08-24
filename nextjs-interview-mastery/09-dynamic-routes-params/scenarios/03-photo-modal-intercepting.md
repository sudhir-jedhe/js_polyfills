# Scenario: Photo grid that opens photos in a modal, but supports shareable direct links

**Problem:** Product wants an Instagram-style photo feed: clicking a thumbnail should open the photo in an overlay modal without leaving the feed (so the grid stays scrolled to the same position underneath), but the resulting URL must be directly shareable/bookmarkable — pasting that link into a new tab, or refreshing the page while the modal is open, should show a proper full standalone photo page, not a broken modal-with-no-feed-behind-it.

**Approach:** Combine a parallel route slot (to render the modal alongside the feed without replacing it) with an intercepting route (to trigger the modal only when navigation originates from inside the feed via client-side routing).

```
app/
  feed/
    layout.tsx           # renders {children} and {modal} slots
    page.tsx              # the grid, links use <Link href={`/photo/${id}`}>
    @modal/
      default.tsx          # renders null when no photo is "open"
      (.)photo/[id]/
        page.tsx            # the MODAL view, intercepted from /feed
  photo/
    [id]/
      page.tsx              # the REAL full-page view
```

```tsx
// app/feed/layout.tsx
export default function FeedLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}

// app/feed/@modal/(.)photo/[id]/page.tsx
import { Modal } from '@/components/modal';

export default async function InterceptedPhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhoto(id);
  return (
    <Modal>
      <PhotoDetail photo={photo} />
    </Modal>
  );
}

// app/photo/[id]/page.tsx — used for direct nav, refresh, and shared links
export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhoto(id);
  return <FullPagePhotoLayout photo={photo} />;
}
```

Clicking a thumbnail from `/feed` uses a normal `<Link href="/photo/123">`; because that navigation originates client-side from within `/feed`, the `(.)photo/[id]` interceptor catches it and renders the modal into the `@modal` slot while the feed stays mounted underneath — the URL bar shows `/photo/123` the entire time. A teammate pasting that same `/photo/123` URL, or the user hitting refresh, is not a client-side navigation *from* `/feed`, so interception doesn't apply and Next.js renders `app/photo/[id]/page.tsx` — the real standalone page — directly. Closing the modal (e.g., via `router.back()`) returns to `/feed` with the grid scroll position intact, since the feed was never unmounted.

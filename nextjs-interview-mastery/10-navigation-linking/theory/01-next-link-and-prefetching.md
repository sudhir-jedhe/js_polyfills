# `next/link` and Prefetching Behavior

`<Link>` is the primitive that makes App Router navigation feel instant, and the reason it's near-mandatory for internal navigation instead of a raw `<a>` tag comes down to two things: client-side transitions and automatic prefetching.

## Basic usage

```tsx
import Link from 'next/link';

export function PostCard({ slug, title }: { slug: string; title: string }) {
  return <Link href={`/blog/${slug}`}>{title}</Link>;
}
```

Under the hood, `<Link>` renders a real `<a>` tag (so middle-click, right-click "open in new tab," and `Ctrl+click` all work exactly as users expect), but it intercepts plain left-clicks and hands navigation off to the Next.js client-side router instead of letting the browser do a full page load.

## Prefetching by default in production

In production builds, `<Link>` automatically prefetches the linked route as soon as it enters the viewport (using `IntersectionObserver`), for links whose target uses static rendering — the route's data/RSC payload is fetched and cached client-side *before* the user ever clicks. For statically rendered routes this means the full page (data included) is often already in the client cache by the time the user clicks, making the transition feel instantaneous. For dynamically rendered routes, prefetching still happens but only fetches the shared layout shell (not the dynamic data), since dynamic content can't be safely computed ahead of the actual request. In development, prefetching is disabled entirely — this trips up developers who benchmark navigation speed locally and see something noticeably slower than what ships.

You can override the default with the `prefetch` prop: `prefetch={false}` disables it entirely (useful for a very long list of links where prefetching all of them would waste bandwidth — e.g., an infinite-scroll feed), and `prefetch={true}` forces full prefetching even for dynamic routes (fetches the full payload, not just the shell), which should be used sparingly since it defeats some of the point of dynamic rendering.

## Why not just use `<a href="...">`?

```tsx
// Avoid for internal navigation:
<a href="/dashboard">Dashboard</a>
```

A raw anchor tag triggers a **full page reload**: the browser discards the entire React tree, re-downloads and re-parses all JS/CSS, re-runs every layout's data fetch from scratch, and repaints from a blank screen. `<Link>` instead performs a **partial re-render** — shared layouts (nav bars, sidebars, providers) stay mounted, only the segments that actually changed are fetched and swapped in, and React state inside persistent layouts (like a video player mid-playback in a persistent layout, or scroll position in a sidebar) survives the transition.

## `href` as an object

```tsx
<Link
  href={{
    pathname: '/products',
    query: { sort: 'newest', page: 2 },
  }}
>
  Newest, page 2
</Link>
```

This is useful when a query string is built from dynamic values, since string-templating a query string manually (`?sort=${sort}&page=${page}`) is error-prone with encoding (spaces, special characters). `href` accepts either a plain string or this structured object form, both resolving to the same underlying URL.

## Scroll behavior

By default, `<Link>` scrolls the new page into view (top of viewport) after navigation, mimicking native browser behavior. Pass `scroll={false}` to opt out — common for tab-like UIs where the URL changes but the current scroll position should be preserved rather than jumping back to the top.

The interview-ready summary: `<Link>` isn't just syntactic sugar over `<a>` — it changes the navigation *mechanism* from a full document reload to a partial React re-render backed by an automatic, viewport-driven prefetch cache, which is the single biggest lever for perceived navigation speed in an App Router app.

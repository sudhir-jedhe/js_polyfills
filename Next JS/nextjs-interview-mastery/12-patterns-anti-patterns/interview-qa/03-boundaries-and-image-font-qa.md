# Interview Q&A: Boundaries, Images, and Fonts

**Q: What does `error.tsx` need that `loading.tsx` doesn't, structurally?**
A: `error.tsx` must be a Client Component (`'use client'` at the top) because it uses interactive state and an event handler (the `reset` function passed to it, typically wired to a retry button). `loading.tsx` has no such requirement — it's typically a plain Server Component rendering static fallback UI, since it doesn't need any client-side interactivity of its own.

**Q: If a route segment has both `loading.tsx` and a slow Client Component fetching data in `useEffect`, does `loading.tsx` cover that client-side loading state?**
A: No — `loading.tsx` is wired to React Suspense and specifically covers the time a Server Component's `async` rendering (data fetching) takes before the segment's HTML is ready. A Client Component's own `useEffect`-driven loading state (its own `isLoading` flag, its own skeleton) is a separate, component-level concern that `loading.tsx` doesn't automatically handle — this is actually another argument for preferring Server Component fetches where possible, since it means one consistent loading mechanism covers the whole segment instead of two separate ones.

**Q: What specifically does `next/image` require that a raw `<img>` doesn't, and why is that requirement not just extra boilerplate?**
A: `width` and `height` (or `fill` plus a sized, positioned parent). This isn't incidental strictness — it's exactly what lets the browser reserve the correct layout space for the image before its data arrives, directly preventing the image-triggered layout shift that raw `<img>` tags are prone to without manually-specified dimensions or `aspect-ratio` CSS.

**Q: Why does `next/font` avoid the render-blocking round trip that a Google Fonts `<link>` tag causes?**
A: `next/font` downloads the font file at build time and self-hosts it as a static asset served from the same origin as the rest of the app — there's no runtime request to a third-party font host (DNS lookup, connection, download) blocking text rendering. It also computes fallback font metrics to reduce the visual shift when the real font swaps in, addressing both the render-blocking and layout-shift costs of the raw `<link>` approach.

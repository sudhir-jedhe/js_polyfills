# Core Web Vitals as a Practical Performance Framework

Core Web Vitals give "make it fast" a concrete, measurable definition, and they map cleanly onto specific Next.js features — which makes them a natural framework for diagnosing *and* discussing performance problems in an interview, rather than reasoning about speed in the abstract.

## The three metrics

- **LCP (Largest Contentful Paint)** — time until the largest visible content element (usually a hero image, a large block of text, or a banner) finishes rendering. This is the primary "does the page feel loaded" signal. Good: under 2.5s.
- **CLS (Cumulative Layout Shift)** — a score measuring how much visible content unexpectedly shifts position during load (images popping in without reserved space, web fonts swapping in and reflowing text, ads/embeds injecting late). Good: under 0.1.
- **INP (Interaction to Next Paint)** — the time between a user interaction (click, tap, keypress) and the next visual update, measured across the page's full lifecycle (replaced FID, First Input Delay, as the official "responsiveness" metric in 2024). Good: under 200ms.

## How Next.js features target each metric

**LCP** — this is where rendering strategy (topic 02) and `next/image` (topic 08) do the heaviest lifting. Server-rendered/statically-generated HTML means the browser has real content to paint immediately rather than waiting for client-side JS to fetch data and render — a Client-Component-with-`useEffect`-fetch pattern (see topic 12) is a common LCP killer, since the largest element often can't render until a client-side fetch resolves *after* hydration. `next/image` further helps LCP specifically via automatic `priority` hinting for above-the-fold images (skipping lazy-load deferral for the one image that IS the LCP element) and serving appropriately-sized, modern-format images so the byte payload for that critical image is minimized.

**CLS** — `next/image` requires explicit `width`/`height` (or `fill` with a sized parent), so the browser reserves the correct space before the image loads, eliminating the classic "image pops in and pushes text down" shift. `next/font` (topic 08) similarly prevents a font-swap layout shift by self-hosting and preloading fonts with calculated fallback metrics, avoiding the flash-of-unstyled-text-then-reflow pattern that raw `<link>` Google Fonts tags are prone to.

**INP** — this is more about client-side JS discipline than a single Next.js API: minimizing unnecessary `'use client'` boundaries (topic 03) keeps the main thread less busy with hydration and re-render work, and avoiding large synchronous computations in event handlers keeps interactions responsive. Code-splitting (this topic) also matters here indirectly — a smaller initial JS bundle means less time spent parsing/executing JS that could otherwise block the main thread when a user interacts early in the page's life.

## Using this as a diagnostic framework

When a page is reported as "slow," Core Web Vitals gives a structured way to ask *which* kind of slow:

1. Is the largest element rendering late (LCP)? → Check rendering strategy — is this Server Component/statically generated, or is it waiting on a client-side fetch? Check whether the LCP image has `priority` and correct dimensions.
2. Is content jumping around during load (CLS)? → Check for images/embeds without reserved dimensions, and font-loading strategy.
3. Does the page feel laggy to interact with, even after it looks loaded (INP)? → Check client bundle size and unnecessary `'use client'` scope, check for expensive synchronous work in event handlers.

This framework is also the natural bridge back to the rendering-strategy decision tree from topic 02: the fastest fix for a poor LCP score is very often "this should be a Server Component fetching data server-side and/or statically generated," not a micro-optimization within an already-wrong architecture.

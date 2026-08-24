# Native Lazy Loading: `loading="lazy"` for Images and Iframes

The `loading` attribute lets the browser defer fetching off-screen `<img>` and `<iframe>` content until the user scrolls near it, with zero JavaScript required.

## Basic usage

```html
<img src="photo.jpg" alt="A photo" loading="lazy" width="800" height="600">
<iframe src="https://example.com/embed" loading="lazy"></iframe>
```

## The three values

| Value | Behavior |
|---|---|
| `lazy` | Defer fetching until the element is near the viewport (the browser determines the exact threshold — implementation-defined, generally a few viewport-heights ahead) |
| `eager` | Fetch immediately, regardless of viewport position (the default browser behavior if `loading` is omitted) |
| `auto` | Let the browser decide the loading strategy (effectively today's default; exists as an explicit opt-out from any future heuristic changes) |

## Why `width`/`height` (or `aspect-ratio`) matters alongside `loading="lazy"`

Without explicit dimensions, the browser doesn't know how much space an image will occupy before it loads — as lazily-loaded images pop in while scrolling, the surrounding content jumps to accommodate them, causing **layout shift** (hurting Cumulative Layout Shift, a Core Web Vital). Always pair `loading="lazy"` with explicit `width`/`height` attributes (or CSS `aspect-ratio`) so the browser reserves the correct space immediately, before the image has even started downloading.

```html
<!-- Good: browser reserves 800x600 space immediately, no shift when it loads in -->
<img src="photo.jpg" alt="" loading="lazy" width="800" height="600">
```

## Don't lazy-load above-the-fold content

Applying `loading="lazy"` to an image that's visible immediately on page load (e.g., a hero banner) is counterproductive — it can *delay* that image's fetch (since the browser may deprioritize it slightly relative to `eager`) exactly when you want it to load as fast as possible. Reserve `loading="lazy"` for images below the fold; for a genuinely critical above-the-fold image, `loading="eager"` (or no attribute) — and often `fetchpriority="high"` — is the right call instead.

```html
<!-- Hero image, visible immediately: don't lazy-load, and hint high priority -->
<img src="hero.jpg" alt="" fetchpriority="high" width="1200" height="500">

<!-- Below-the-fold gallery image: lazy-load -->
<img src="gallery-3.jpg" alt="" loading="lazy" width="400" height="300">
```

## Iframes

The same attribute works identically on `<iframe>` — commonly used for embedded YouTube videos, maps, or ads placed further down a page, deferring the (often heavy) third-party iframe payload until it's actually about to be seen.

```html
<iframe
  src="https://www.youtube.com/embed/example"
  loading="lazy"
  width="560"
  height="315"
  title="Demo video">
</iframe>
```

## Browser support and fallback behavior

Native `loading="lazy"` is broadly supported in modern evergreen browsers. Unsupported browsers simply ignore the attribute and load the resource normally (`eager` behavior) — it degrades gracefully with no JavaScript fallback required, which is why it's now generally preferred over JS-based lazy-loading libraries (`IntersectionObserver`-based solutions) for the common case, those libraries remaining relevant mainly for finer-grained control (custom thresholds, placeholder swap-in animations) than the native attribute exposes.

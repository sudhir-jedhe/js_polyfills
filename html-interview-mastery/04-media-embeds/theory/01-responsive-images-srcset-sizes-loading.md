# Responsive Images: `srcset`, `sizes`, `loading`, `decoding`

## The problem `srcset` solves

A single `<img src="hero.jpg">` forces every device — a small phone and a 4K monitor alike — to download the exact same file. `srcset` lets the browser choose the most appropriate image from a set of candidates, based on the device's actual viewport size and pixel density, without any JavaScript.

## Two kinds of descriptors

**Width descriptors (`w`)** — used with `sizes`, for images whose rendered size varies with viewport:

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="A mountain landscape at sunset">
```

Here, `sizes` tells the browser how wide the image will actually be *rendered* at each breakpoint (not the image's file dimensions) — "at viewports up to 600px wide, this image renders at 100% of the viewport width; otherwise, 50% of the viewport width." The browser combines this with the device's actual pixel density and picks whichever `srcset` candidate best matches the real rendered pixel size, downloading only that one file.

**Density descriptors (`x`)** — used for images with a fixed display size, just needing different resolutions for different pixel densities:

```html
<img src="icon.png" srcset="icon.png 1x, icon@2x.png 2x, icon@3x.png 3x" alt="Settings icon">
```

No `sizes` needed here — the image's CSS/layout size is fixed, only the pixel density varies.

## `loading="lazy"`

```html
<img src="below-fold.jpg" alt="..." loading="lazy">
```

Defers loading an image until it's near the viewport, reducing initial page load time and bandwidth for images the user may never scroll to. **Never use it on above-the-fold images** (hero images, logos) — this actually *delays* their load relative to the default `eager` behavior and can hurt Largest Contentful Paint (LCP), a key Core Web Vitals metric. `loading="lazy"` is a native, JS-free replacement for the older IntersectionObserver-based lazy-load libraries.

## `decoding="async"`

```html
<img src="photo.jpg" alt="..." decoding="async">
```

Hints that image decoding can happen off the main thread, not blocking rendering of the rest of the page while a large image decodes. `decoding="sync"` (rare, mostly relevant when an image must appear atomically with other content to avoid visual flicker) forces decoding to complete before the image is presented. `async` is a safe default for most images.

## `fetchpriority`

```html
<img src="hero.jpg" alt="..." fetchpriority="high">
```

A newer hint (separate from `loading`) that tells the browser to prioritize this fetch relative to other resources competing for bandwidth — commonly paired with a page's single most important LCP image (`fetchpriority="high"` + explicit `loading="eager"` or simply omitting `loading` since eager is the default).

## Comparison table

| Attribute | Purpose | Typical use |
|---|---|---|
| `srcset` (`w`) + `sizes` | Serve different resolutions for different rendered sizes | Responsive hero/content images |
| `srcset` (`x`) | Serve different resolutions for different pixel densities at a fixed size | Icons, logos, fixed-size thumbnails |
| `loading="lazy"` | Defer offscreen image loading | Below-the-fold images, image-heavy feeds/galleries |
| `loading="eager"` (default) | Load immediately | Above-the-fold, especially LCP candidate images |
| `decoding="async"` | Don't block rendering on decode | Most images, especially large ones |
| `fetchpriority="high"` | Prioritize this fetch over others | The single most important above-the-fold image |

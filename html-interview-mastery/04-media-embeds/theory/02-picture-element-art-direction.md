# The `<picture>` Element and Art Direction

## `srcset` vs. `<picture>` — a critical distinction

`srcset` on a plain `<img>` gives the browser several **resolutions of the same image** to choose from — it can pick any of them, because they're all just different-sized versions of identical content. `<picture>` is for **art direction**: serving genuinely *different images* (different crops, different compositions, sometimes entirely different photos) at different breakpoints — something `srcset` alone cannot express, because `srcset` assumes all candidates are interchangeable other than resolution.

## Basic structure

```html
<picture>
  <source media="(max-width: 600px)" srcset="hero-mobile-crop.jpg">
  <source media="(max-width: 1200px)" srcset="hero-tablet-crop.jpg">
  <img src="hero-desktop-crop.jpg" alt="Team collaborating around a table">
</picture>
```

The browser evaluates each `<source>`'s `media` condition top to bottom and uses the **first matching one**; if none match, it falls back to the `<img>`. The `<img>` inside `<picture>` is not optional decoration — it's the required fallback and also the element that actually carries the `alt` text (a `<source>` never has its own `alt`).

## Why art direction matters beyond just "different sizes"

A wide landscape hero photo that looks great at desktop width often becomes an unreadable, over-cropped mess when the same image is simply scaled down to phone width — the subject may end up tiny, or important content might sit outside a mobile-appropriate crop entirely. Art direction solves this by deliberately serving a **different composition** (a tighter vertical crop focusing on the subject) at narrow viewports, not just a smaller version of the same wide shot.

## `<picture>` for format fallback (a second common use)

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Product photo">
</picture>
```

Here `type` (not `media`) is the selector — the browser picks the first `<source>` whose declared MIME type it actually supports, letting you serve modern, smaller formats (AVIF, WebP) to browsers that support them while falling back to universally-supported JPEG for those that don't, all without any JS feature-detection.

## Combining format fallback with responsive sizing

```html
<picture>
  <source
    srcset="photo-400.avif 400w, photo-800.avif 800w"
    sizes="(max-width: 600px) 100vw, 50vw"
    type="image/avif">
  <source
    srcset="photo-400.webp 400w, photo-800.webp 800w"
    sizes="(max-width: 600px) 100vw, 50vw"
    type="image/webp">
  <img src="photo-800.jpg" srcset="photo-400.jpg 400w, photo-800.jpg 800w"
       sizes="(max-width: 600px) 100vw, 50vw" alt="Product photo">
</picture>
```

Each `<source>` can carry its own `srcset`/`sizes` combination independently — the browser first picks a matching/supported `<source>` (by `type` and/or `media`), then within that source's own `srcset`/`sizes`, picks the best resolution candidate exactly as it would for a plain `<img>`.

## Comparison table

| | `srcset` on `<img>` alone | `<picture>` |
|---|---|---|
| Candidates | Same image, different resolutions | Can be genuinely different images/crops |
| Selector | Browser's own resolution/density heuristics | `media` (viewport) or `type` (format support) conditions you explicitly control |
| Use case | Serve the right resolution | Art direction, format fallback |
| Fallback | N/A — it's a single `<img>` | The `<img>` inside `<picture>` is always the fallback |

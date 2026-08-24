# Responsive Images: `srcset`, `sizes`, and `<picture>`

Responsive images solve two genuinely different problems, and it's a common interview trap to conflate them: **resolution switching** (same image content, different file sizes for different screen densities/viewport widths, purely a performance concern) and **art direction** (genuinely different image crops/content for different layouts, a design concern). `srcset`/`sizes` on `<img>` solves the first; `<picture>` solves the second (and can also do the first).

## Resolution switching with `srcset` + `sizes` (same image, multiple resolutions)

```html
<img
  src="photo-800w.jpg"
  srcset="
    photo-400w.jpg 400w,
    photo-800w.jpg 800w,
    photo-1200w.jpg 1200w,
    photo-1600w.jpg 1600w
  "
  sizes="(min-width: 1024px) 50vw, 100vw"
  alt="A description of the photo"
/>
```

- `srcset` lists candidate image files, each annotated with its **intrinsic width** in pixels (the `w` descriptor — note this is the image file's actual pixel width, not a CSS value).
- `sizes` tells the browser what CSS width the image will actually be *rendered at*, for a given viewport condition — read left to right, first matching media condition wins: "if the viewport is at least 1024px wide, this image will render at 50% of the viewport width; otherwise, it renders at 100% of the viewport width."
- The browser combines `sizes` (rendered width) with the device's pixel density and picks whichever `srcset` candidate is the best match — smallest file that still satisfies the required resolution. This selection is left entirely to the browser; you cannot force a specific candidate via CSS.

This is purely a bandwidth/performance optimization — a phone doesn't need to download a 1600px-wide file to display a 400px-wide image slot, even less so a low-DPI one, but a high-DPI ("Retina") display rendering that same 400px CSS-width slot may need the 800px file to look sharp.

## `x` descriptors — the simpler density-only variant

```html
<img
  src="icon.png"
  srcset="icon.png 1x, icon@2x.png 2x, icon@3x.png 3x"
  alt="Icon"
/>
```

Used when the image is always rendered at the same CSS size regardless of viewport (e.g. a fixed-size icon or logo) — here you're only accounting for device pixel ratio, not responsive width, so `sizes` isn't needed at all.

## Art direction with `<picture>` (genuinely different images per condition)

```html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-wide.jpg" />
  <source media="(min-width: 640px)" srcset="hero-square.jpg" />
  <img src="hero-portrait.jpg" alt="A hero banner appropriate to the current viewport" />
</picture>
```

`<picture>` contains multiple `<source>` elements, each with its own `media` condition, plus a required fallback `<img>` (which also provides the actual rendered `alt` text and acts as the fallback for browsers/conditions where no `<source>` matches). The browser evaluates `<source>` elements top to bottom and uses the first one whose `media` condition matches — this is for cases where a wide layout genuinely needs a differently *cropped* image (e.g. a landscape hero on desktop vs. a tighter portrait crop on mobile so the subject doesn't get lost), not just a smaller version of the same image.

`<picture>` can also combine with `type` attributes on `<source>` for format switching (e.g. serving `.avif`/`.webp` to browsers that support them, with a `.jpg` fallback) — a third, related use case beyond pure art direction.

## Quick decision guide

| Need | Use |
|---|---|
| Same image, just serve an appropriately-sized file per device/viewport | `<img srcset sizes>` |
| Same image, only accounting for pixel density (fixed-size image) | `<img srcset>` with `x` descriptors |
| Genuinely different crops/content per breakpoint | `<picture>` with `media` on `<source>` |
| Modern format with fallback (AVIF/WebP → JPEG) | `<picture>` with `type` on `<source>` |

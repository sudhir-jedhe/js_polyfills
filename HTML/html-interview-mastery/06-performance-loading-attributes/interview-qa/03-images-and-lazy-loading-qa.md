*** copy 03-images-and-lazy-loading-qa.md ***

# Interview Q&A — Images & Lazy Loading

**Q: What does `loading="lazy"` do, and where should you NOT use it?**
It defers fetching an `<img>` or `<iframe>` until it's near the viewport, saving bandwidth for content the user might never scroll to. You should not use it on above-the-fold content that's visible immediately on page load — there's no benefit (it fetches right away regardless) and it can add slight, unnecessary loading-priority overhead compared to eager/default loading.

**Q: Why should `loading="lazy"` always be paired with `width`/`height` attributes?**
Without explicit dimensions, the browser doesn't know how much space an image will occupy until it has actually downloaded — as lazily-loaded images pop in during scrolling, surrounding content shifts to make room, causing layout shift (a Core Web Vital regression). Declaring `width`/`height` (or CSS `aspect-ratio`) lets the browser reserve the correct space immediately, before the image has loaded, eliminating the shift.

**Q: What's the difference between the `lazy`, `eager`, and `auto` values of the `loading` attribute?**
`lazy` defers fetching until the element is near the viewport. `eager` fetches immediately regardless of position (the default if the attribute is omitted). `auto` explicitly lets the browser choose its own strategy — functionally similar to omitting the attribute, but stated explicitly.

**Q: Does `loading="lazy"` work on `<iframe>` as well as `<img>`?**
Yes — it's commonly used for below-the-fold embedded content like YouTube videos or maps, deferring the often-heavy third-party iframe payload until the user scrolls near it.

**Q: What happens in a browser that doesn't support `loading="lazy"`?**
The attribute is simply ignored, and the image/iframe loads normally (`eager` behavior) — there's no error and no broken image, which is why it's generally safe to use without a JS-based fallback for the common case.

**Q: What's `fetchpriority="high"` used for, and how does it relate to lazy loading?**
It's essentially the opposite tool — a hint that a specific resource (often an above-the-fold hero image) should be prioritized *above* other competing resources, useful precisely for the images you'd never want to mark `loading="lazy"`.

**Q: Why might a native `loading="lazy"` image still cause a Cumulative Layout Shift issue even with dimensions set?**
If the dimensions are set via CSS with a fixed aspect ratio that doesn't match the actual image's natural aspect ratio, the reserved box will be the wrong shape, and the image (once loaded) may be cropped/stretched via `object-fit` rather than shifting layout — a display issue rather than a layout-shift issue, but worth distinguishing: dimensions must be accurate, not just present, to fully avoid shift while also avoiding visual distortion.

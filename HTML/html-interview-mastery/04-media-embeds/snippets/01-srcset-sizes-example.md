*** copy 01-srcset-sizes-example.md ***

# Snippet: `srcset` + `sizes` Responsive Image

```html
<img
  src="banner-800.jpg"
  srcset="
    banner-400.jpg 400w,
    banner-800.jpg 800w,
    banner-1200.jpg 1200w,
    banner-1600.jpg 1600w"
  sizes="(max-width: 500px) 100vw, (max-width: 1000px) 80vw, 1200px"
  alt="Product lineup banner"
  width="1200" height="600"
  loading="lazy">
```

At a 375px-wide phone with a 2x pixel density, the browser computes an effective needed width of ~750px (375 × 2) against the `sizes` rule "100vw at this breakpoint," and picks `banner-800.jpg` (the smallest candidate that still covers 750px) rather than downloading the full 1600px version. `width`/`height` are still set even though the image is responsive — they establish the correct aspect ratio for the browser to reserve layout space before the image loads, preventing layout shift.

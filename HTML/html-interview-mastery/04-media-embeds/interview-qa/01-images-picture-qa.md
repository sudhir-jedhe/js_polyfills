*** copy 01-images-picture-qa.md ***

# Interview Q&A — Images & `<picture>`

**Q: What's the difference between `srcset` on a plain `<img>` and using `<picture>`?**
`srcset` on `<img>` offers the browser several resolutions of the *same* image, letting it pick the best match for the device — all candidates are interchangeable other than size. `<picture>` is for true art direction: serving genuinely different images (different crops/compositions, or different formats) at different breakpoints, something `srcset` alone can't express.

**Q: What does the `sizes` attribute actually describe?**
How wide the image will be *rendered* (in CSS pixels, as a function of viewport width) at each breakpoint — not the image file's own dimensions. The browser combines `sizes` with the actual viewport width and device pixel density to compute the required real pixel width, then picks the smallest `srcset` candidate that satisfies it.

**Q: When should you use `loading="lazy"`, and when should you avoid it?**
Use it on offscreen/below-the-fold images to defer their network requests and reduce initial page load. Avoid it on above-the-fold images — especially a likely Largest Contentful Paint candidate — since it can delay, not help, their load relative to the default eager behavior.

**Q: How does `<picture>` decide which `<source>` to use?**
First-match, evaluated top to bottom against each `<source>`'s `media` and/or `type` condition. If none match, it falls back to the required `<img>` element, which also always supplies the `alt` text regardless of which source (if any) actually loaded.

**Q: Why doesn't a `<source>` element inside `<picture>` have its own `alt` attribute?**
Because `alt` describes the image's *content/meaning*, which doesn't change across the different crops/formats a `<picture>` might select — only the `<img>` fallback carries `alt`, and it applies uniformly no matter which `<source>` was actually chosen for display.

**Q: What's the purpose of `decoding="async"`?**
It hints that image decoding can happen off the main thread rather than blocking rendering of the rest of the page while a (potentially large) image decodes — a reasonable default for most images, especially ones not required to appear atomically alongside other content.

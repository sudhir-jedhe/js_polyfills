*** copy 03-optimizing-image-loading-performance.md ***

# Scenario: Optimizing an Image-Heavy Product Listing Page for Performance

**Scenario:** A product listing page renders 60 product thumbnails on load, all as plain `<img src="...">` with no other attributes. A performance audit shows all 60 images fetch immediately, competing with each other and with the page's CSS/JS for bandwidth, causing a slow Largest Contentful Paint even though only ~8 images are actually visible above the fold. Fix it.

**Diagnosis:** Every image is being treated identically regardless of whether it's immediately visible — the browser has no signal to distinguish "this needs to load now" from "this can wait until the user scrolls near it," so all 60 requests fire at once and contend for the same limited network/CPU resources as the genuinely critical above-the-fold content.

**Fix:**

```html
<!-- Above-the-fold thumbnails (first ~8): load eagerly, no change needed beyond correct sizing -->
<img src="product-1-thumb.jpg" srcset="product-1-thumb-2x.jpg 2x" alt="Wireless headphones" width="300" height="300">

<!-- Below-the-fold thumbnails (remaining ~52): lazy-load -->
<img src="product-9-thumb.jpg" srcset="product-9-thumb-2x.jpg 2x" alt="Bluetooth speaker"
     width="300" height="300" loading="lazy" decoding="async">
```

```html
<!-- Also apply loading="lazy" to any below-fold iframes/embeds on the same page (reviews widget, etc.) -->
<iframe src="/reviews-widget" loading="lazy" title="Customer reviews"></iframe>
```

**Additional layered improvements:**
- Serve modern formats via `<picture>`/`type` fallback (AVIF/WebP → JPEG) for further byte savings on top of lazy-loading, since format efficiency and load-timing are independent, stackable optimizations.
- Add explicit `width`/`height` (as shown) on every thumbnail — this reserves layout space immediately, preventing the cumulative layout shift that occurs when 52 images pop into existence and push content around as they load in.
- Consider `fetchpriority="high"` on just the single first/most prominent above-fold image if it's likely the actual LCP element, complementing (not replacing) the lazy-loading strategy for the rest.

**Why this resolves the audit finding:** the 8 above-the-fold images continue loading immediately (unchanged, correctly prioritized), while the 52 below-the-fold images now defer their network requests until the user scrolls near them — removing ~52 competing requests from the critical initial-load path entirely, which is what was actually starving the above-the-fold content of bandwidth and slowing LCP. The fix costs nothing in markup complexity (`loading="lazy"` and `decoding="async"` are both native, one-attribute additions) and requires no JavaScript library.

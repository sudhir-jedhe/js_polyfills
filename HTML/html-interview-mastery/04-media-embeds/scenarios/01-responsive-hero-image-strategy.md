*** copy 01-responsive-hero-image-strategy.md ***

# Scenario: Designing a Responsive Hero Image Strategy

**Scenario:** A marketing site's homepage hero image is currently a single 2400px-wide JPEG (1.8MB) served identically to every device. Lighthouse flags it as the single largest contributor to slow mobile load times and poor LCP. Design also wants a tighter, more portrait-oriented crop on mobile rather than just a shrunk version of the wide desktop shot. Propose a complete fix.

**Diagnosis:** Two distinct problems are bundled together here: (1) a pure **file-size/resolution** problem (mobile devices downloading a desktop-sized file), and (2) an **art-direction** problem (the same wide composition doesn't work well cropped down for narrow viewports). `srcset` alone would solve problem 1 but not problem 2 — this needs `<picture>`.

**Fix:**

```html
<picture>
  <source
    media="(max-width: 600px)"
    srcset="hero-mobile-500.jpg 500w, hero-mobile-1000.jpg 1000w"
    sizes="100vw">
  <source
    media="(max-width: 1100px)"
    srcset="hero-tablet-800.jpg 800w, hero-tablet-1600.jpg 1600w"
    sizes="100vw">
  <img
    src="hero-desktop-1600.jpg"
    srcset="hero-desktop-1600.jpg 1600w, hero-desktop-2400.jpg 2400w"
    sizes="100vw"
    alt="New summer collection, model wearing the featured jacket"
    width="2400" height="1000"
    fetchpriority="high">
</picture>
```

**Why this fully addresses both problems:**
- The mobile `<source>` references genuinely different, pre-cropped images (`hero-mobile-*.jpg`) — not a scaled-down version of the wide desktop shot — solving the art-direction concern directly.
- Each `<source>` (and the fallback `<img>`) still carries its own `srcset`/`sizes` pair, so within each breakpoint's art-directed image, the browser further picks the right *resolution* for the device's actual pixel density — solving the file-size concern on top of the art direction.
- `fetchpriority="high"` on the final fallback `<img>` (which is what actually renders and is fetched, regardless of which `<source>` matched) signals to the browser this is a high-priority resource, directly targeting the LCP metric Lighthouse flagged.
- `width`/`height` reserve the correct aspect ratio space immediately, preventing layout shift as the image loads — relevant to Cumulative Layout Shift, a separate but related Core Web Vitals concern.

**Expected outcome:** mobile devices now download a ~500-1000px pre-cropped file (likely under 150KB with modern compression) instead of the full 2400px/1.8MB desktop file — a meaningful, measurable LCP improvement — while desktop users still get the full-resolution wide shot they need.

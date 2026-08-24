# Scenario: Images Are Blurry on Retina Displays but Slow to Load on Mobile

**Scenario:** A product listing page uses a single `<img src="product.jpg">` for every product photo, at one fixed 1200px-wide source file. Users on standard-DPI laptops report the page is slow, especially on mobile data connections — the images are much larger than they need to be for a phone screen. Meanwhile, users on high-DPI ("Retina") displays report the same images look slightly soft/blurry despite the file being large. How is it possible for the same image to be simultaneously "too big" and "not sharp enough," and how do you fix both problems at once?

**Diagnosis:**

Both complaints come from the same root cause: a single fixed-resolution file can't be correctly sized for every combination of viewport width *and* device pixel ratio at once. The mobile-data users are downloading a 1200px file to display in, say, a 350px-wide card — 3-4x more pixel data than needed, wasting bandwidth. The Retina users may be seeing the image rendered at, say, 400px of CSS width on a 2x DPR screen, which needs 800 real device pixels to look sharp — if the "1200px" file is actually being *downscaled* further by responsive CSS sizing rules elsewhere in the page's design system in a way that isn't accounted for, or if the perceived softness is due to the image being stretched up rather than an exact resolution match, a single static source can't adapt to both extremes correctly. Serving one fixed file is fundamentally the wrong tool — the fix is resolution switching.

**Fix:**

```html
<img
  src="product-800w.jpg"
  srcset="
    product-400w.jpg 400w,
    product-800w.jpg 800w,
    product-1200w.jpg 1200w,
    product-1600w.jpg 1600w
  "
  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
  alt="Product name and short description"
  loading="lazy"
/>
```

Generating multiple resolutions of each product photo and letting `srcset`/`sizes` do resolution switching solves both complaints simultaneously: mobile users on narrow viewports get routed to a small candidate (e.g. `400w`) sized appropriately for their actual rendered width, cutting bandwidth dramatically, while Retina users get a candidate with enough real pixel density for their DPR to render sharply, without over-serving unnecessarily large files to everyone else. `loading="lazy"` is a complementary, low-effort addition that defers off-screen images entirely until they're about to scroll into view, which helps initial page load time on a long product listing regardless of the resolution-switching fix.

**Why not just always serve the largest file "to be safe":** that fully solves the sharpness complaint but makes the bandwidth complaint strictly worse for the majority of users (most viewport/DPR combinations don't need the largest file) — `srcset`/`sizes` exists precisely because "always serve the biggest" and "always serve one fixed size" are both wrong answers to a problem that genuinely varies per user.

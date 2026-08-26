*** copy 01-build-responsive-image-component.md ***

# Problem: Build a Responsive Image Component with `srcset`

## Problem Statement

Build a reusable product-image markup pattern: the image renders at 100% width on mobile (up to 600px viewport) and 33% width on desktop (in a 3-column grid), needs to support 1x/2x/3x pixel densities at each size, must reserve correct aspect-ratio space to avoid layout shift, and should lazy-load (it's a product grid, most images are below the fold).

## Constraints

- Must use width-descriptor `srcset` + `sizes` (not density descriptors) since the rendered size itself changes across breakpoints, not just density.
- Provide at least 4 width candidates covering the realistic range of actual rendered pixel sizes across common devices.
- No layout shift as images load.
- Correctly marked as deferred for below-the-fold usage.

## Solution

```html
<img
  src="product-42-600.jpg"
  srcset="
    product-42-300.jpg 300w,
    product-42-600.jpg 600w,
    product-42-900.jpg 900w,
    product-42-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 33vw"
  alt="Ceramic pour-over coffee dripper, matte black"
  width="600" height="600"
  loading="lazy"
  decoding="async">
```

**Reasoning through the candidate set:**
- At mobile (≤600px viewport), the image renders at 100vw — up to 600px on a typical phone, or up to 1200px of *actual pixels* at 2x density. The `900w`/`1200w` candidates cover that high end.
- At desktop, the image renders at 33vw — on a 1440px-wide desktop viewport, that's ~475px of CSS pixels, or ~950px at 2x. The `600w`/`900w` candidates cover that range without ever needing the full `1200w` file on most desktop layouts (it's reserved for high-density mobile).
- `width="600" height="600"` (matching the `src` fallback's actual dimensions, a 1:1 aspect ratio) lets the browser compute and reserve the correct box before any candidate image finishes loading, regardless of which one gets selected — this is why explicit `width`/`height` remain necessary even on a fully responsive image; they only need to encode the correct *ratio*, not the exact rendered pixel size, which `srcset`/`sizes` handle separately.
- `loading="lazy"` and `decoding="async"` are appropriate here specifically because this is one card among many in a product grid, most of which sit below the fold — this pattern should NOT be applied verbatim to, say, a single hero image at the top of a page (see the output-based file on this exact pitfall).

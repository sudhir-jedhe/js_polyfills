*** copy 02-lazy-loading-infinite-gallery.md ***

# Problem: Build a Lazy-Loading Image Gallery with No Layout Shift

## Problem Statement

Given an array of image metadata (`url`, `width`, `height`, `alt`), generate the HTML markup for a gallery where the first 4 images load eagerly (above the fold) and the rest load lazily, with zero layout shift as lazy images pop in.

## Requirements

- Write a function `renderGallery(images)` that returns an HTML string for the gallery.
- The first 4 images must NOT have `loading="lazy"` (they're above the fold).
- Every image (all of them, not just the lazy ones) must have explicit `width` and `height` attributes taken from its metadata, so the browser can reserve the correct aspect ratio before any image loads.
- Every image must have a non-empty `alt` attribute (fall back to an empty string only if explicitly marked decorative).
- The single most visually important image (`images[0]`) should get `fetchpriority="high"`.

## Approach

Iterate the array with its index; branch behavior purely on whether `index < 4`. Build each `<img>` tag's attribute string conditionally rather than duplicating the whole template for the eager/lazy cases, keeping the two code paths' only actual difference (the `loading` attribute) isolated to a single ternary.

## Solution

```js
function renderGallery(images) {
  const EAGER_COUNT = 4;

  const imgTags = images.map((img, index) => {
    const isEager = index < EAGER_COUNT;
    const loadingAttr = isEager ? '' : ' loading="lazy"';
    const priorityAttr = index === 0 ? ' fetchpriority="high"' : '';
    const altText = img.alt ?? ''; // explicit empty string for decorative images

    return (
      `<img src="${img.url}" alt="${altText}" ` +
      `width="${img.width}" height="${img.height}"` +
      `${loadingAttr}${priorityAttr}>`
    );
  });

  return `<div class="gallery">\n  ${imgTags.join('\n  ')}\n</div>`;
}

// --- verification ---
const images = [
  { url: 'hero.jpg', alt: 'Featured product', width: 1200, height: 600 },
  { url: 'p2.jpg', alt: 'Product 2', width: 400, height: 400 },
  { url: 'p3.jpg', alt: 'Product 3', width: 400, height: 400 },
  { url: 'p4.jpg', alt: 'Product 4', width: 400, height: 400 },
  { url: 'p5.jpg', alt: 'Product 5', width: 400, height: 400 },
  { url: 'p6.jpg', alt: 'Product 6', width: 400, height: 400 },
];

console.log(renderGallery(images));
/*
<div class="gallery">
  <img src="hero.jpg" alt="Featured product" width="1200" height="600" fetchpriority="high">
  <img src="p2.jpg" alt="Product 2" width="400" height="400">
  <img src="p3.jpg" alt="Product 3" width="400" height="400">
  <img src="p4.jpg" alt="Product 4" width="400" height="400">
  <img src="p5.jpg" alt="Product 5" width="400" height="400" loading="lazy">
  <img src="p6.jpg" alt="Product 6" width="400" height="400" loading="lazy">
</div>
*/
```

**Why `width`/`height` are included on ALL images, not just the lazy ones:** Layout shift is possible for eager images too (e.g., a slow network still delays their decode relative to surrounding text), so reserving space via explicit dimensions is good practice universally — restricting it to only the lazy-loaded images would leave the eager ones still vulnerable to the exact problem lazy loading is being paired with dimensions to solve.

**Why `fetchpriority="high"` is applied only to `images[0]`, not the whole eager group:** `fetchpriority` is a *relative* prioritization hint among competing resources — applying "high" to several images at once dilutes its usefulness, since the browser can no longer distinguish which one actually matters most; reserving it for the single most important image (typically the hero/featured image) keeps the hint meaningful.

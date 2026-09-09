***  03-image-heavy-product-gallery.md ***

# Scenario: An Image-Heavy Product Gallery Page Loads Slowly and Jumps Around

**Scenario:** An e-commerce category page shows a grid of 60 product images. Users on slower connections report the page takes a long time to become usable, and separately report that the page "jumps" while scrolling through the grid — images popping in and shifting other content down as they load. How do you fix both issues using native HTML attributes, without a JS library?

**Diagnosis:** Two distinct problems, two distinct fixes. The slow initial load is because all 60 images fetch immediately on page load, competing for bandwidth with everything else, even though the user can only see the first handful without scrolling. The jumping is a **layout shift** problem: images without explicit dimensions collapse to zero height until they load, so the surrounding grid reflows every time one pops in — both issues have simple, native, JS-free fixes.

**Fix — combine `loading="lazy"` with explicit `width`/`height` on every image:**

```html
<div class="product-grid">
  <!-- First row: visible on load, don't lazy-load these -->
  <img src="product-1.jpg" alt="Product 1" width="300" height="300">
  <img src="product-2.jpg" alt="Product 2" width="300" height="300">
  <img src="product-3.jpg" alt="Product 3" width="300" height="300">
  <img src="product-4.jpg" alt="Product 4" width="300" height="300">

  <!-- Remaining 56 images: below the fold, lazy-load them -->
  <img src="product-5.jpg" alt="Product 5" loading="lazy" width="300" height="300">
  <!-- ... repeated for the rest of the grid ... -->
</div>
```

```css
.product-grid img {
  aspect-ratio: 1 / 1; /* reinforces the reserved space at the CSS layer too */
  object-fit: cover;
}
```

**Why the fix addresses both complaints:**
- **Slow initial load:** only the first visible row(s) of images fetch on page load; the other ~56 don't start downloading until the user scrolls near them, dramatically cutting the initial page weight and freeing bandwidth for what's actually on screen.
- **Layout jumping:** the `width`/`height` attributes (reinforced by `aspect-ratio` in CSS) let the browser compute and reserve each image's box in the grid layout **before** any image data has arrived — so when a lazily-loaded image does pop in, it fills a space that was already reserved for it, with zero reflow of surrounding content.

**Why not lazy-load the first row too, for consistency?** Lazy-loading content that's immediately visible on load provides no benefit (it's fetched right away regardless) and can add slight timing overhead — the rule of thumb is: lazy-load what's below the fold, load what's above it eagerly (and prioritize it, via `fetchpriority="high"` on the single most important image if there is one, like a featured product).

*** copy 04-lazy-loading-image-gallery.md ***

# Snippet: Lazy-Loaded Image Gallery with Reserved Space

```html
<div class="gallery">
  <!-- above the fold: eager, no lazy loading -->
  <img src="hero.jpg" alt="Featured" width="1200" height="600" fetchpriority="high">

  <!-- below the fold: lazy, with dimensions to prevent layout shift -->
  <img src="photo-1.jpg" alt="" loading="lazy" width="400" height="300">
  <img src="photo-2.jpg" alt="" loading="lazy" width="400" height="300">
  <img src="photo-3.jpg" alt="" loading="lazy" width="400" height="300">
</div>
```

Only `hero.jpg` fetches immediately on page load. `photo-1.jpg` through `photo-3.jpg` don't start downloading until the user scrolls near them — but since `width`/`height` are declared on every image (letting the browser compute the correct aspect ratio and reserve that box in layout before the image data has even arrived), none of them cause a layout shift when they pop in.

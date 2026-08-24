# Problem: Build a Responsive Image Gallery with Correct `srcset`/`sizes`

## Problem Statement

Build a photo gallery that lays out as 1 column on mobile, 2 columns on tablet, and 4 columns on desktop — and, critically, serves appropriately-sized image files for each layout state via `srcset`/`sizes`, so mobile users on a 1-column layout never download desktop-sized (4-column-appropriate) image files.

## Requirements

- CSS grid layout: 1 column below 640px, 2 columns from 640–1023px, 4 columns at 1024px and up.
- Each `<img>` uses `srcset` with at least 4 candidate widths, and a `sizes` attribute that accurately reflects the rendered width at each of the three layout states.
- Images are lazy-loaded except for the first visible row (above-the-fold images should load eagerly).
- No layout shift as images load (reserve space via `aspect-ratio`).

## Approach

The `sizes` attribute needs to mirror the grid's actual breakpoints exactly, expressed as a fraction of the viewport at each — a 4-column grid means each image is roughly `25vw` wide (accounting for gaps, close enough for the browser's resource-selection purposes), a 2-column grid means roughly `50vw`, and 1-column means roughly `100vw`. Getting `sizes` right is what makes the browser's `srcset` candidate selection actually reflect the real rendered size, rather than defaulting to overly conservative (large) assumptions.

## Solution

```html
<div class="gallery">
  <figure class="gallery-item">
    <img
      src="photo-01-800w.jpg"
      srcset="
        photo-01-400w.jpg 400w,
        photo-01-800w.jpg 800w,
        photo-01-1200w.jpg 1200w,
        photo-01-1600w.jpg 1600w
      "
      sizes="
        (min-width: 1024px) 25vw,
        (min-width: 640px) 50vw,
        100vw
      "
      alt="Description of photo 1"
      loading="eager"
      fetchpriority="high"
    />
  </figure>
  <!-- remaining items use loading="lazy" -->
  <figure class="gallery-item">
    <img
      src="photo-02-800w.jpg"
      srcset="
        photo-02-400w.jpg 400w,
        photo-02-800w.jpg 800w,
        photo-02-1200w.jpg 1200w,
        photo-02-1600w.jpg 1600w
      "
      sizes="
        (min-width: 1024px) 25vw,
        (min-width: 640px) 50vw,
        100vw
      "
      alt="Description of photo 2"
      loading="lazy"
    />
  </figure>
</div>
```

```css
.gallery {
  display: grid;
  grid-template-columns: 1fr; /* 1 column on mobile */
  gap: 12px;
}

@media (min-width: 640px) {
  .gallery { grid-template-columns: repeat(2, 1fr); } /* 2 columns on tablet */
}

@media (min-width: 1024px) {
  .gallery { grid-template-columns: repeat(4, 1fr); gap: 16px; } /* 4 columns on desktop */
}

.gallery-item img {
  width: 100%;
  aspect-ratio: 4 / 3; /* reserves space before the image loads, preventing layout shift */
  object-fit: cover;
  display: block;
}
```

**Why `sizes` must mirror the grid's actual breakpoints exactly (and why getting it "close enough" matters):** if `sizes` claimed `100vw` at every viewport width (a lazy/incorrect default), the browser would always assume the image needs to fill the full viewport width, and would select an unnecessarily large `srcset` candidate even in the 4-column desktop layout where each image only actually renders at roughly a quarter of that. The `(min-width: 1024px) 25vw` etc. conditions in `sizes` need to track the same breakpoints as the actual CSS grid layout for the browser's automatic candidate selection to be accurate — this is a common real-world bug where the CSS grid's breakpoints get updated by a designer/developer but the `sizes` attribute is forgotten, silently reintroducing the "downloading oversized images" problem despite `srcset` technically being present.

**Why only the first image gets `loading="eager"` and `fetchpriority="high"`:** it's the only one guaranteed to be above the fold on load; loading every gallery image eagerly would defeat the purpose of lazy loading and slow down the initial page render for images the user may never even scroll to.

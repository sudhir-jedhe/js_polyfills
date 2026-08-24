# Problem: Build a Responsive Photo Gallery

## Problem Statement

Build a photo gallery grid where: each photo is at least `200px` wide and never wider than `320px`, photos fill each row completely (stretching to split any leftover space evenly) rather than leaving blank trailing space, the grid reflows its column count continuously across all viewport widths with zero media queries, and every photo maintains a square aspect ratio regardless of its source image's dimensions.

## Constraints

- No media queries.
- Must use `auto-fit`, not `auto-fill` (leftover space should never be left blank).
- Must cap maximum photo width at `320px` even on very wide viewports with few photos.
- Photos must stay square (`aspect-ratio: 1 / 1`) regardless of column width.

## Solution

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, min(1fr, 320px)));
  gap: 12px;
}

.gallery__photo {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 6px;
}

.gallery__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* crops the source image to fill the square box without distortion */
}
```

```html
<div class="gallery">
  <figure class="gallery__photo"><img src="a.jpg" alt="" /></figure>
  <figure class="gallery__photo"><img src="b.jpg" alt="" /></figure>
  <figure class="gallery__photo"><img src="c.jpg" alt="" /></figure>
  <!-- ...more photos -->
</div>
```

**Why `minmax(200px, min(1fr, 320px))` satisfies every constraint at once:** the `200px` floor ensures photos never get uncomfortably small; `auto-fit` ensures leftover space in a partially-filled row is distributed to the existing photos rather than left blank (stretch behavior); wrapping the `1fr` in `min(1fr, 320px)` caps how large that stretch can grow an individual photo — without the `min()`, a row with only 1–2 photos on an ultrawide monitor could stretch a "photo" track to 800px+, which is the exact bug covered in the `04-grid/scenarios` folder. `aspect-ratio: 1 / 1` on the photo wrapper, combined with `object-fit: cover` on the `<img>`, keeps every photo square regardless of its resolved column width or the source image's native aspect ratio.

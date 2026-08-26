*** copy 06-object-fit-cover-example.md ***

# Snippet: `object-fit: cover` for a Uniform Thumbnail Grid

```html
<div class="thumb-grid">
  <img src="photo1.jpg" alt="Sunset over the mountains" class="thumb">
  <img src="photo2.jpg" alt="City skyline at night" class="thumb">
  <img src="photo3.jpg" alt="Forest trail in autumn" class="thumb">
</div>
```

```css
.thumb-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.thumb {
  width: 100%;
  height: 200px;       /* fixed box, regardless of each photo's native aspect ratio */
  object-fit: cover;   /* crop to fill the box without distortion */
  object-position: center top; /* bias crop toward the top, in case subjects sit high in frame */
}
```

Without `object-fit: cover`, three photos with different native aspect ratios (a portrait, a wide landscape, a square) forced into identical `200px`-tall boxes via plain `width`/`height` would each be stretched/squished into that box independently — `object-fit: cover` instead scales each proportionally and crops the overflow, producing a uniform grid with zero visible distortion in any of the three images.

# Snippet: `auto-fit` Responsive Cards

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
```

```html
<div class="gallery">
  <div class="photo">1</div>
  <div class="photo">2</div>
  <div class="photo">3</div>
  <!-- with auto-fit, any tracks that would otherwise sit empty COLLAPSE to 0px,
       and the 3 real items stretch to fill the freed-up space instead -->
</div>
```

This is the standard "responsive card grid, no media queries" recipe: as the container narrows, fewer tracks fit and items reflow to fewer per row automatically; as it widens with few items present, the existing items grow to fill the row rather than leaving blank trailing space — almost always the desired behavior for card/gallery grids, which is why `auto-fit` is the far more commonly reached-for of the two keywords in practice.

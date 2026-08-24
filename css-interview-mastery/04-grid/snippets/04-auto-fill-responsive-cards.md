# Snippet: `auto-fill` Responsive Cards

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
```

```html
<div class="gallery">
  <div class="photo">1</div>
  <div class="photo">2</div>
  <div class="photo">3</div>
  <!-- only 3 items: with auto-fill, if more tracks fit than there are items,
       the extra tracks stay in the layout, empty, sized per minmax(180px, 1fr) —
       items DON'T stretch to fill the remaining row width -->
</div>
```

Use `auto-fill` deliberately when you want a **consistent item size** regardless of how many items exist, even if that leaves visible blank space in a sparsely-filled row — see the `auto-fit` snippet for the alternative (and the `output-based/` folder for the full worked numeric comparison).

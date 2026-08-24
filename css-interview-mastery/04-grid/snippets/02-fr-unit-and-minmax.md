# Snippet: `fr` Unit and `minmax()`

```css
.grid {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 2fr minmax(100px, 200px);
  gap: 12px;
}
```

```html
<div class="grid">
  <div>Sidebar (flexible, 150px floor)</div>
  <div>Main (twice as flexible as the sidebar)</div>
  <div>Rail (flexible between 100–200px)</div>
</div>
```

If the container is wide enough, the first column takes 1 share and the second takes 2 shares of the leftover space (after the third column claims its own share, clamped between 100–200px) — but the first column never renders narrower than `150px`, and the third never narrower than `100px` or wider than `200px`, regardless of how the `fr` math would otherwise resolve.

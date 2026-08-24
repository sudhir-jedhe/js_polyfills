# Snippet: `static` vs `relative` Offset Behavior

```html
<div class="row">
  <div class="box static">static (offsets ignored)</div>
  <div class="box relative">relative (shifted, space still reserved)</div>
  <div class="box normal">next box — note it does NOT shift to fill the gap</div>
</div>
```

```css
.row {
  display: flex;
  gap: 8px;
}
.box {
  padding: 12px;
  background: #cde;
}
.static {
  position: static;
  top: 20px;
  left: 20px; /* no effect at all — position is static */
}
.relative {
  position: relative;
  top: 10px;
  left: 10px; /* visually shifted 10px down/right; original space still reserved in the flex row */
}
```

`.relative` moves visually but the layout engine still reserves its original box — nothing reflows around it. `.static` doesn't move at all, because offsets are only honored on positioned elements (anything other than `static`).

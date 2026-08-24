# Snippet: `absolute` Anchors to the Nearest Positioned Ancestor

```html
<div class="card">
  <span class="badge">New</span>
  <p>Card content...</p>
</div>
```

```css
.card {
  position: relative; /* no offsets needed — just establishes the containing block */
  width: 240px;
  padding: 16px;
  border: 1px solid #ccc;
}
.badge {
  position: absolute;
  top: 8px;
  right: 8px; /* relative to .card's padding box, not the page */
  background: crimson;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}
```

Removing `position: relative` from `.card` doesn't make `.badge` disappear — it makes it jump to be positioned relative to the **initial containing block** (roughly the viewport, at the top of the document), since `.card` no longer qualifies as a positioned ancestor. This is the most common cause of "my absolutely positioned element teleported to the top of the page."

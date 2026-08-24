# Snippet: `order` for Visual Reordering

```css
.layout { display: flex; }

.sidebar  { order: 2; flex: 0 0 240px; }
.main     { order: 1; flex: 1 1 auto; }
.aside    { order: 3; flex: 0 0 200px; }

@media (max-width: 640px) {
  .sidebar { order: 1; } /* on mobile, sidebar nav moves to the top, without touching the HTML */
  .main    { order: 2; }
  .aside   { order: 3; }
}
```

```html
<div class="layout">
  <nav class="sidebar">Nav</nav>
  <main class="main">Content</main>
  <aside class="aside">Related links</aside>
</div>
```

`order` only changes *visual* order — the DOM order (and therefore tab order and screen-reader reading order) stays `sidebar → main → aside` regardless of the CSS. Use `order` for purely cosmetic reflow; if the logical reading order genuinely needs to change per breakpoint, move the markup instead.

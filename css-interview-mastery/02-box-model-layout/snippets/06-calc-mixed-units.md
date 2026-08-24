# Snippet: `calc()` With Mixed Units

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr; /* fixed sidebar, flexible content — shown here without calc for contrast */
}

.full-bleed-hero {
  /* full viewport height minus a fixed 72px sticky header */
  height: calc(100vh - 72px);
}

.gutter-aware-column {
  /* three equal columns inside a container, with two 20px gaps between them */
  width: calc((100% - 40px) / 3); /* 40px = 2 gaps * 20px */
  margin-right: 20px;
}

.fluid-heading {
  /* scales with viewport, but never smaller than 1.25rem or larger than 2.5rem */
  font-size: clamp(1.25rem, 1rem + 1.5vw, 2.5rem);
}

.centered-fixed-width-modal {
  width: min(500px, 90vw); /* never wider than 500px, never wider than 90% of the viewport */
}
```

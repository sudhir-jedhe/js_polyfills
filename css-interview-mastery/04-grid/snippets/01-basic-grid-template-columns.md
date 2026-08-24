# Snippet: Basic `grid-template-columns`

```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr;
  gap: 16px;
  min-height: 100vh;
}
```

```html
<div class="layout">
  <nav style="grid-column: 1; grid-row: 1 / span 2;">Sidebar</nav>
  <header style="grid-column: 2; grid-row: 1;">Header</header>
  <main style="grid-column: 2; grid-row: 2;">Main content</main>
</div>
```

A fixed `220px` sidebar spanning both rows, with a flexible `1fr` content column split into a header row and a main content row — the `1fr` column absorbs all remaining width after the fixed sidebar is sized.

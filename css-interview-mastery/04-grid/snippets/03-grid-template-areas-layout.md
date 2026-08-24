# Snippet: `grid-template-areas` Dashboard Layout

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-rows: 64px 1fr 1fr;
  grid-template-areas:
    "sidebar header  header"
    "sidebar chart-a chart-b"
    "sidebar table   table";
  gap: 16px;
  height: 100vh;
}

.sidebar  { grid-area: sidebar; }
.header   { grid-area: header; }
.chart-a  { grid-area: chart-a; }
.chart-b  { grid-area: chart-b; }
.table    { grid-area: table; }
```

```html
<div class="dashboard">
  <nav class="sidebar">Sidebar</nav>
  <header class="header">Header</header>
  <div class="chart-a">Chart A</div>
  <div class="chart-b">Chart B</div>
  <div class="table">Data Table</div>
</div>
```

The sidebar spans all 3 rows (its name repeats in every row string); the header spans both right-hand columns in row 1; `chart-a`/`chart-b` split row 2; `table` spans both right-hand columns in row 3 — the whole layout's shape is legible directly from the CSS.

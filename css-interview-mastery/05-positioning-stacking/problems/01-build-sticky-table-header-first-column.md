# Problem: Build a Table with a Sticky Header *and* a Sticky First Column

## Problem Statement

Build a scrollable data table where the header row stays pinned to the top of the scroll area, the first column stays pinned to the left, and the single cell where they overlap (top-left corner) stays pinned in both directions simultaneously — all using pure CSS `position: sticky`, no JavaScript.

## Requirements

- The table lives inside a fixed-height, both-axes-scrollable container.
- The `<thead>` row stays visible at the top while scrolling vertically.
- The first `<td>`/`<th>` of every row stays visible at the left while scrolling horizontally.
- The corner cell (header row, first column) stays visible in both directions at once.
- All sticky cells need an opaque background so scrolling content doesn't show through underneath them.
- The corner cell must visually stack above both the sticky header row and the sticky first column as they scroll past each other.

## Approach

Each sticky cell needs its own `top`/`left` offset depending on its role — header cells stick to `top: 0`, first-column cells stick to `left: 0`, and the corner cell needs *both* at once. Since sticky cells that overlap will fight over paint order as they scroll, the corner cell needs a higher `z-index` than the other two sticky roles (which, in turn, need a higher `z-index` than ordinary scrolling cells) — all three sticky "layers" here happen to sit in the same stacking context (the `<table>`'s own, since none of `thead`/`td`/`th` introduce a new one on their own beyond what `position: sticky` itself creates), so plain `z-index` comparisons work directly.

## Solution

```html
<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th class="corner">#</th>
        <th class="col-header">Q1</th>
        <th class="col-header">Q2</th>
        <th class="col-header">Q3</th>
        <!-- ...more columns... -->
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="row-header">Revenue</th>
        <td>120</td>
        <td>134</td>
        <td>140</td>
      </tr>
      <!-- ...more rows... -->
    </tbody>
  </table>
</div>
```

```css
.table-scroll {
  height: 400px;
  overflow: auto; /* the ONE scroll container all sticky offsets measure against */
  position: relative;
}

table {
  border-collapse: separate; /* required — collapse breaks sticky cell backgrounds/borders */
  border-spacing: 0;
}

th, td {
  padding: 8px 16px;
  background: white; /* opaque — prevents scrolling content showing through beneath sticky cells */
  border: 1px solid #ddd;
  white-space: nowrap;
}

/* Header row: sticky to the top */
.col-header {
  position: sticky;
  top: 0;
  z-index: 2; /* above ordinary body cells, below the corner cell */
}

/* First column: sticky to the left */
.row-header {
  position: sticky;
  left: 0;
  z-index: 2; /* same layer as .col-header — they never overlap each other, only ordinary cells */
}

/* Corner cell: sticky in both directions, must beat both other sticky layers */
.corner {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3; /* higher than both .col-header and .row-header, since it visually overlaps both as you scroll */
}
```

**Why `z-index` ordering matters here:** as the user scrolls both directions, the corner cell will visually pass over both the sticky header row (scrolling horizontally under it) and the sticky first column (scrolling vertically under it) at different moments — without the corner cell out-ranking both, it would flicker beneath one of them depending on scroll direction. `border-collapse: separate` is required because `collapse` causes browsers to detach cell borders/backgrounds from individual cells in a way that breaks correctly rendering sticky backgrounds at the seams.

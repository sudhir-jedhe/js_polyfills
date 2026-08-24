# `grid-template-areas`

`grid-template-areas` lets you lay out a grid as a visual, named ASCII diagram — arguably the most readable way to express a page-level layout in CSS.

## Basic usage

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr 180px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  min-height: 100vh;
  gap: 16px;
}

.page__header { grid-area: header; }
.page__nav    { grid-area: nav; }
.page__main   { grid-area: main; }
.page__aside  { grid-area: aside; }
.page__footer { grid-area: footer; }
```

```html
<div class="page">
  <header class="page__header">Header</header>
  <nav class="page__nav">Nav</nav>
  <main class="page__main">Main</main>
  <aside class="page__aside">Aside</aside>
  <footer class="page__footer">Footer</footer>
</div>
```

Each string in `grid-template-areas` is one row; each word within a string is one column's area name for that row. Repeating a name across adjacent cells (horizontally or vertically) makes that item span multiple tracks — `"header header header"` makes `header` span all 3 columns in that row.

## Rules and gotchas

- Every row string must have the **same number of columns** (same number of space-separated names) — mismatched column counts are an invalid declaration and the whole `grid-template-areas` value is dropped.
- A named area's cells must form a **single rectangle** — an L-shaped or otherwise non-rectangular region using the same name is invalid.
- Use a literal `.` (period) for a cell that's part of the grid but has no named area assigned (an empty cell): `"header header ."`.
- Responsive re-layout is often just redefining `grid-template-areas` (and the corresponding `grid-template-columns`) inside a media query — no need to touch the HTML at all:

```css
@media (max-width: 700px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "nav"
      "aside"
      "footer";
  }
}
```
This is one of Grid's biggest practical advantages over flexbox for page-level layout: reflowing an entire multi-region layout at a breakpoint is a matter of rewriting one declaration, rather than juggling `order`, `flex-direction`, and multiple nested flex containers.

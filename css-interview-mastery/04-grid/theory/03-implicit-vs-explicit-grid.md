# Implicit vs. Explicit Grid

## Explicit grid

The tracks you define directly via `grid-template-columns`, `grid-template-rows`, or `grid-template-areas`. These are fixed, named/sized tracks the author controls precisely.

## Implicit grid

When grid items are placed outside the explicit grid — either because there are more items than explicit cells, or because an item is explicitly positioned (via `grid-row`/`grid-column`) beyond the defined tracks — the browser automatically generates additional tracks to hold them. These auto-generated tracks form the **implicit grid**.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* explicit: exactly 3 columns */
  grid-auto-rows: 120px; /* sizing rule for any IMPLICIT rows the grid has to generate */
}
```
```html
<div class="grid">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div> <!-- these land on an implicitly-generated second row, sized 120px per grid-auto-rows -->
</div>
```
With 6 items and only 3 explicit columns, items 4–6 overflow onto a new row that was never explicitly declared — the browser generates it automatically, sized according to `grid-auto-rows` (default `auto`, meaning "size to content" if not otherwise specified).

## `grid-auto-columns` and `grid-auto-rows`

These control the sizing of any implicitly-generated tracks, in whichever dimension isn't explicitly defined by `grid-auto-flow`'s direction:

```css
.grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto); /* implicit rows are at least 100px, grow to fit taller content */
}
```

## `grid-auto-flow`

Controls how auto-placed items (items without explicit `grid-row`/`grid-column` positioning) fill the grid:

```css
grid-auto-flow: row;        /* default: fill row by row, generating new rows as needed */
grid-auto-flow: column;     /* fill column by column instead, generating new COLUMNS as needed (pairs naturally with grid-auto-columns) */
grid-auto-flow: row dense;  /* fills row by row, but backfills earlier gaps left by differently-sized items, out of source order if needed */
```

`dense` is specifically useful for masonry-like photo grids with mixed item sizes (some items spanning 2 columns/rows) where you want to minimize visual gaps, at the cost of items potentially rendering out of their original DOM order — which is a real accessibility/reading-order tradeoff to weigh, the same way `order` is in flexbox.

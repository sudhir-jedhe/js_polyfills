# Output: Implicit Rows — Auto-Generated Tracks

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 120px;
}
```
```html
<div class="grid">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
  <div>7</div><div>8</div>
</div>
```

**Question:** How many rows does the grid generate, how tall is each one, and is the last row (with only 2 items instead of 3) sized any differently?

**Answer:** 3 rows are generated, each exactly `120px` tall — including the last, partially-filled row.

**Why:** `grid-template-rows` is never set here, meaning there's **no explicit row track** at all — every row this grid ever renders is implicit, generated on demand as items are auto-placed. With 8 items and 3 explicit columns, the default `grid-auto-flow: row` fills row 1 (items 1–3), row 2 (items 4–6), then row 3 (items 7–8) — 3 rows total (`ceil(8/3) = 3`). Every one of those rows is sized by `grid-auto-rows: 120px`, uniformly — `grid-auto-rows` applies to each implicitly-generated row track as a whole, regardless of how many cells within that row actually contain an item. Row 3 having only 2 filled cells (instead of 3) doesn't shrink it or change its height; the 3rd cell in row 3 simply renders empty at the same `120px` height as its row.

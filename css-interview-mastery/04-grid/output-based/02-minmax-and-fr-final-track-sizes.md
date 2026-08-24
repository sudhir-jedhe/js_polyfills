# Output: `minmax()` Combined With `fr` — Final Track Sizes

```css
.grid {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 300px minmax(100px, 2fr);
  width: 900px;
}
```

**Question:** What's the rendered width of each of the 3 columns?

**Answer:** `200px, 300px, 400px`

**Why:** the middle column is a plain fixed `300px` track — sized first, unaffected by anything else. Remaining space = `900 - 300 = 600px`. The other two columns are both flexible (`minmax(min, 1fr)`/`minmax(min, 2fr)` — their upper bound is an `fr` value, which makes them participate in `fr` distribution): total shares = `1 + 2 = 3`. Column 1 gets `600 × (1/3) = 200px`; column 3 gets `600 × (2/3) = 400px`. Both results comfortably clear their respective minimums (`150px` and `100px`), so the `minmax()` floor never actually needed to kick in here — but if the remaining space had been small enough that proportional distribution would push a column below its minimum, that column would be clamped to its `minmax()` floor instead, and the remaining space would be re-distributed among the other flexible tracks in a second pass.

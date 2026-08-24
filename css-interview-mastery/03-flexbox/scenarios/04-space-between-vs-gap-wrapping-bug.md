# Scenario: `justify-content: space-between` Breaks Column Alignment on Wrap

**Scenario:** A responsive product grid uses `display: flex; flex-wrap: wrap; justify-content: space-between;` with items at `flex: 0 0 30%` (roughly 3 per row). It looks correct whenever the item count is a multiple of 3, but whenever the last row has only 1 or 2 items, they visually misalign — a lone last-row item sits flush at the far left (correct-looking by accident), but a row of exactly 2 leftover items spreads to the far left AND far right edges, breaking the illusion of a 3-column grid the rows above established. How do you fix the alignment without changing the "roughly 3 per row" sizing?

**Diagnosis:** `justify-content: space-between` distributes leftover space **within each flex line independently** — it has no awareness of how many items were on the *previous* line. A full line of 3 items has no leftover space to distribute (they fill the row), so `space-between` is invisible there; but a partial last line of 2 items has real leftover space, and `space-between` dutifully pushes those 2 items to the line's start and end edges — which happens to visually break the column grid the rows above it implied, even though each line individually is behaving exactly as specified.

**Fix — replace `justify-content: space-between` (which reacts to leftover space per line) with `gap` (which imposes a fixed value between items, per line, regardless of how many happen to be on it):**

```css
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* fixed spacing, works identically whether a line has 1, 2, or 3 items */
}
.product-card {
  flex: 0 0 calc((100% - 2 * 16px) / 3); /* fixed 3-per-row width, gap-aware (2 gaps between 3 columns) */
}
```

With `gap`, a partial last line of 2 items keeps the same `16px` spacing between them (and the same width per item) as a full line of 3 — there's no leftover space for `gap` to "distribute" unevenly, since `gap` isn't a distribution strategy at all, it's a fixed insertion between adjacent items, so the last row's 2 items simply sit left-aligned, at the same column positions the rows above established.

**Why this is also where Grid genuinely becomes the better tool:** this entire class of "partial last row" bug is one of the reasons `display: grid` with `repeat(auto-fit, minmax(...))` (see `04-grid`) is often preferred for card grids over flex-wrap + basis math — grid's explicit column tracks guarantee column alignment across every row, including partial ones, without needing a hand-tuned `calc()` width formula at all.

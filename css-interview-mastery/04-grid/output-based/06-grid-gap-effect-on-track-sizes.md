# Output: `gap`'s Effect on `fr` Track Sizes

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 600px;
}
```

**Question:** What's the rendered width of each of the 3 equal `1fr` columns?

**Answer:** `186.67px` each (approximately)

**Why:** `gap` is subtracted from the container's width **before** the remaining space is divided among the `fr` tracks — gaps are not part of any track's size, and `fr` never distributes space into the gaps themselves. With 3 columns, there are `3 - 1 = 2` gaps between them, consuming `2 × 20px = 40px` total. Remaining space for the tracks themselves: `600 - 40 = 560px`. Split evenly across 3 equal `1fr` tracks: `560 / 3 ≈ 186.67px` each. Check: `3 × 186.67 + 2 × 20 ≈ 560 + 40 = 600px`. ✓

**Contrast with no gap:** the same `repeat(3, 1fr)` on a `600px` container with `gap: 0` would give each column exactly `200px` (`600 / 3`) — so adding a `20px` gap here cost each column roughly `13.33px` of width, not simply "20px total absorbed somewhere neutral." This is a common practical gotcha when retrofitting `gap` onto an existing grid: adding gap always shrinks `fr`-sized tracks somewhat, since gap space is reserved before the flexible tracks are computed, unlike fixed-px tracks which are entirely unaffected either way.

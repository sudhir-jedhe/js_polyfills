# Output: `fr` Unit Distribution Alongside Fixed Tracks

```css
.grid {
  display: grid;
  grid-template-columns: 150px 1fr 2fr 150px;
  width: 900px;
}
```

**Question:** What's the rendered width of each of the 4 columns?

**Answer:** `150px, 200px, 400px, 150px`

**Why:** fixed-length tracks are sized first and removed from consideration: `150px + 150px = 300px` is claimed by the two fixed columns. Remaining space = `900 - 300 = 600px`. That remaining space is distributed only among the `fr` tracks, proportional to their fraction: total shares = `1 + 2 = 3`. The `1fr` column gets `600 × (1/3) = 200px`; the `2fr` column gets `600 × (2/3) = 400px`. Check: `150 + 200 + 400 + 150 = 900px`. ✓ Fixed tracks are never affected by `fr` math in either direction — they always get exactly their declared size first.

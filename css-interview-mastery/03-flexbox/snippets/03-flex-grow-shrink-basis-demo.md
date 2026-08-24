# Snippet: `flex-grow`, `flex-shrink`, `flex-basis` in Action

```css
.row { display: flex; width: 900px; }

.item-a { flex: 1 1 100px; background: #fdd; } /* grow:1 shrink:1 basis:100px */
.item-b { flex: 2 1 100px; background: #dfd; } /* grow:2 — takes twice A's/C's share of extra space */
.item-c { flex: 1 1 100px; background: #ddf; } /* grow:1 shrink:1 basis:100px */
```

```html
<div class="row">
  <div class="item-a">A</div>
  <div class="item-b">B</div>
  <div class="item-c">C</div>
</div>
```

Sum of bases = 300px, container = 900px, free space = 600px, sum of grow = 4. A and C each get `600 × 1/4 = 150px` (final `250px`), B gets `600 × 2/4 = 300px` (final `400px`). Final widths: **A = 250px, B = 400px, C = 250px** (sums to 900px). See `output-based/` for the full worked derivation and a shrink-side example.

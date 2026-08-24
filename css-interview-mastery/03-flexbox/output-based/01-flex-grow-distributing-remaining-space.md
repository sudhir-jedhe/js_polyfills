# Output: `flex-grow` Distributing Remaining Space

```css
.row { display: flex; width: 1000px; }
.a { flex: 1 1 150px; } /* grow:1 */
.b { flex: 1 1 150px; } /* grow:1 */
.c { flex: 2 1 150px; } /* grow:2 */
.d { flex: 0 1 150px; } /* grow:0 */
```
```html
<div class="row">
  <div class="a">A</div><div class="b">B</div><div class="c">C</div><div class="d">D</div>
</div>
```

**Question:** What's the final rendered width of each item?

**Answer:** A = 250px, B = 250px, C = 350px, D = 150px

**Why, step by step:**
1. Sum of bases: `150 × 4 = 600px`. Container is `1000px`, so free space = `1000 - 600 = 400px`.
2. Sum of `flex-grow` across all items: `1 + 1 + 2 + 0 = 4`.
3. A: `400 × (1/4) = 100px` growth → `150 + 100 = 250px`.
4. B: same as A → `250px`.
5. C: `400 × (2/4) = 200px` growth → `150 + 200 = 350px`.
6. D: `flex-grow: 0` means it participates in the "sum of grow" denominator as a 0, so its share is `400 × (0/4) = 0px` → stays at its basis, `150px`.
7. Check: `250 + 250 + 350 + 150 = 1000px`. ✓

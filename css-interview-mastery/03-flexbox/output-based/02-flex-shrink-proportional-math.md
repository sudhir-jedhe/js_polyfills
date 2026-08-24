# Output: `flex-shrink` Proportional (Basis-Weighted) Math

```css
.row { display: flex; width: 400px; }
.a { flex: 0 1 150px; } /* shrink:1 */
.b { flex: 0 2 150px; } /* shrink:2 */
.c { flex: 0 1 150px; } /* shrink:1 */
```
```html
<div class="row">
  <div class="a">A</div><div class="b">B</div><div class="c">C</div>
</div>
```

**Question:** What's the final rendered width of each item?

**Answer:** A = 137.5px, B = 125px, C = 137.5px

**Why, step by step:**
1. Sum of bases: `150 × 3 = 450px`. Container is `400px`, so overflow = `450 - 400 = 50px` — items must collectively shrink by 50px.
2. `flex-shrink` is NOT applied as a flat ratio — each item's **scaled shrink factor** is `flex-shrink × flex-basis`: A = `1 × 150 = 150`, B = `2 × 150 = 300`, C = `1 × 150 = 150`. Sum = `600`.
3. A's shrink share: `50 × (150/600) = 12.5px` → final `150 - 12.5 = 137.5px`.
4. B's shrink share: `50 × (300/600) = 25px` → final `150 - 25 = 125px`.
5. C's shrink share: same as A → `137.5px`.
6. Check: `137.5 + 125 + 137.5 = 400px`. ✓

**The trap:** B has `flex-shrink: 2` — twice A's and C's — and it does shrink by exactly twice as many pixels here (`25px` vs `12.5px`), but *only* because all three items share the same `flex-basis` (150px). If B's basis were smaller than A's/C's, its scaled shrink factor (and therefore its actual pixel loss) could easily end up *smaller* than a sibling with a lower `flex-shrink` but a larger basis — `flex-shrink` alone never tells you the outcome in isolation.

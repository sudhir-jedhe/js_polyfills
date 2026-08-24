# Output: Mixed `flex-grow`/`flex-basis` — Final Widths

```css
.row { display: flex; width: 700px; }
.a { flex: 1 1 100px; } /* grow:1, basis:100px */
.b { flex: 0 1 200px; } /* grow:0, basis:200px */
.c { flex: 2 1 100px; } /* grow:2, basis:100px */
```
```html
<div class="row"><div class="a">A</div><div class="b">B</div><div class="c">C</div></div>
```

**Question:** What's the final rendered width of each item?

**Answer:** A = 200px, B = 200px, C = 300px

**Why, step by step:**
1. Sum of bases: `100 + 200 + 100 = 400px`. Container is `700px`, so free space = `700 - 400 = 300px` — this is a **growing** scenario (bases fit, with room to spare), so `flex-shrink` never comes into play at all here.
2. Sum of `flex-grow` across all items: `1 + 0 + 2 = 3`. B's `flex-grow: 0` means it gets none of the free space and stays exactly at its basis.
3. A: `300 × (1/3) = 100px` growth → `100 + 100 = 200px`.
4. B: `300 × (0/3) = 0px` growth → stays at `200px`.
5. C: `300 × (2/3) = 200px` growth → `100 + 200 = 300px`.
6. Check: `200 + 200 + 300 = 700px`. ✓

**Note:** B ends up the same final width (`200px`) as A, despite A actively growing and B not growing at all — purely because B started from a larger basis. This is a good illustration of why "does it have `flex-grow`" and "how big does it render" are two separate questions.

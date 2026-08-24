# Output: `auto-fill` vs. `auto-fit` — Full Numeric Comparison

```css
.grid-fill { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); width: 650px; gap: 0; }
.grid-fit  { display: grid; grid-template-columns: repeat(auto-fit,  minmax(150px, 1fr)); width: 650px; gap: 0; }
```
Both contain exactly **2** grid items.

**Question:** How many tracks does each grid create, how wide does each real item render, and how much blank space (if any) is left over?

**Answer:**

| | `auto-fill` | `auto-fit` |
|---|---|---|
| Tracks created | 4 | 4 (computed identically)... |
| Empty tracks | 2, kept in the layout | 2, then **collapsed to 0px** |
| Real item width | 162.5px each | 325px each |
| Blank trailing space | 325px (2 empty tracks × 162.5px) | 0px |

**Why, step by step:**
1. **Track count** (identical for both): `floor(650 / 150) = 4` — since `4 × 150 = 600 ≤ 650` but `5 × 150 = 750 > 650`.
2. **`auto-fill`:** all 4 tracks persist. Extra space = `650 - 600 = 50px`, split evenly across all 4 `fr` tracks → `+12.5px` each → every track (filled or empty) renders at `162.5px`. The 2 real items take up `325px` total; the 2 empty tracks occupy the remaining `325px` as visible blank space at the row's end.
3. **`auto-fit`:** track count computation is identical (4), but the 2 tracks with no item get collapsed to `0px` after placement. Only the 2 non-empty tracks remain for `fr` distribution: extra space = `650 - 2×150 = 350px`, split evenly across those 2 tracks → `+175px` each → each real item renders at `150 + 175 = 325px`, together filling the full `650px` row with no blank space left over.

**Takeaway:** the track-*count* math is always identical between the two keywords — the difference only shows up in what happens to tracks that end up empty, which is exactly why the two keywords produce visually identical results whenever there are enough items to fill every possible track (no empty tracks means nothing to collapse).

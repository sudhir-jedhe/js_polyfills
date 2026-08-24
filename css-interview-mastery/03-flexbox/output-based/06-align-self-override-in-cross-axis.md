# Output: `align-self` Overriding the Container's Cross-Axis Alignment

```css
.row { display: flex; height: 200px; align-items: flex-start; }
.item { width: 80px; } /* no height set — cross-size is auto, sized to content (~24px single-line text) */
.item--fixed { height: 40px; } /* explicit cross-size opts OUT of stretch entirely */
.item--stretch { align-self: stretch; }
```
```html
<div class="row">
  <div class="item">A</div>
  <div class="item item--fixed">B</div>
  <div class="item item--stretch">C</div>
</div>
```

**Question:** What's the rendered height of each item?

**Answer:** A ≈ 24px (content height), B = 40px, C = 200px

**Why:** the container sets `align-items: flex-start`, which applies to every item by default — items align to the cross-axis start without stretching, sized to their own content/explicit height. A has no `height` set at all, so it renders at its natural content height (roughly one line of text, ~24px depending on font-size/line-height). B has an explicit `height: 40px`, which is respected as-is under `flex-start`. C has `align-self: stretch`, which overrides `align-items` for that one item, making it stretch to fill the container's full `200px` cross-axis size.

**The detail that matters:** `stretch` only takes effect on items whose cross-size is `auto` (unset) — it does **not** override an explicitly-set `height`/`width`. If C also had `height: 40px` set explicitly alongside `align-self: stretch`, the explicit height would win and C would render at `40px`, not `200px` — `stretch` never forces an item smaller or larger than a size the author explicitly declared, it only fills in for the "unset" case. This is also exactly why `align-items: stretch` (the actual default when no `align-items` is specified at all) commonly appears to "do nothing" in real layouts: it only stretches items that never had a cross-size set in the first place.

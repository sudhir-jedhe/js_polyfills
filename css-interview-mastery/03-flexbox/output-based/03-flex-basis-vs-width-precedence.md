# Output: `flex-basis` vs. `width` Precedence

```css
.row { display: flex; width: 500px; }
.item { flex: 1 1 150px; width: 300px; }
```
```html
<div class="row"><div class="item">Only item</div></div>
```

**Question:** Is the item's starting main-size (its flex-basis) `150px` or `300px`? What's its final rendered width?

**Answer:** Starting basis is **150px** (the explicit `flex-basis` wins over `width`). Final rendered width is **500px**.

**Why:** when `flex-basis` is set to an explicit length (not `auto`), it takes full precedence over the `width` property for determining the item's main-size in a `row`-direction flex container — `width` is simply ignored for this purpose. So the starting basis is `150px`, free space is `500 - 150 = 350px`, and with `flex-grow: 1` and only one item (sum of grow = 1), it absorbs all `350px` of free space: `150 + 350 = 500px`, filling the container completely.

**Contrast — if `flex-basis` were `auto` instead:**
```css
.item { flex: 1 1 auto; width: 300px; }
```
Here, `flex-basis: auto` explicitly falls back to the `width` property, so the starting basis becomes `300px`, free space is `500 - 300 = 200px`, and the final width is `300 + 200 = 500px` — same final answer in this single-item case (since one item with `flex-grow: 1` always fills 100% of the container regardless of its starting basis), but the *intermediate* basis value differs, which matters as soon as there's more than one item competing for the same free space.

# Output: `<picture>` `<source>` Evaluation Order

```html
<picture>
  <source media="(min-width: 1200px)" srcset="wide.jpg">
  <source media="(min-width: 700px)" srcset="medium.jpg">
  <img src="narrow.jpg" alt="Store front">
</picture>
```

**Question:** At a viewport width of 1400px, which image loads? What about at exactly 700px? What about 500px?

**Answer:** At **1400px**: `wide.jpg` — the first `<source>`'s condition (`min-width: 1200px`) is true, and sources are evaluated top-to-bottom, using the first match. At **700px**: `medium.jpg` — the first source's condition (`min-width: 1200px`) is false, but the second (`min-width: 700px`) is true (700 satisfies `min-width: 700px` inclusively). At **500px**: `narrow.jpg` — neither `<source>`'s `media` condition matches, so the browser falls through to the required `<img>` fallback.

**Why:** `<picture>`'s `<source>` selection is a **first-match** algorithm evaluated in document order, not a "best match" or "closest match" algorithm — this is why source order matters and is typically written from most-specific/largest breakpoint down to least-specific/smallest, mirroring how `@media` cascades are commonly organized. The `<img>` is not just a "smallest size" option — it's the mandatory fallback used whenever *no* `<source>` condition matches at all, so a `<picture>` with only `min-width` conditions and no unconditioned smallest-breakpoint source relies entirely on the `<img>` to cover every viewport below the smallest declared `min-width`.

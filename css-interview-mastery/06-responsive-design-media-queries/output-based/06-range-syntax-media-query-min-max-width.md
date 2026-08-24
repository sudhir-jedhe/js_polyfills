# Range Syntax: Does This Media Query Match?

```css
@media (600px <= width < 900px) {
  .banner { display: block; }
}
```

**Question:** Does `.banner`'s rule apply at a viewport width of exactly `900px`? What about `899px`? What about `600px`?

**Answer:** `900px` — no, does not apply. `899px` — yes, applies. `600px` — yes, applies.

**Why:** The range syntax `(600px <= width < 900px)` is read exactly like a mathematical double inequality: it matches when the viewport width is greater than or equal to `600px` **and** strictly less than `900px`. At exactly `900px`, the `width < 900px` half of the condition is false (`900 < 900` is false), so the whole query doesn't match — this is the equivalent of the old syntax `(min-width: 600px) and (max-width: 899.98px)`, except the range syntax expresses the exclusive upper bound exactly, with no rounding/fractional-pixel workaround needed. At `899px`, both halves are true (`899 >= 600` and `899 < 900`), so it matches. At exactly `600px`, the lower bound is inclusive (`<=`), so `600 >= 600` is true, and it matches (assuming the upper bound also holds, which it does at `600px`). This exact-boundary precision is one of the concrete advantages of range syntax over the older `min-width`/`max-width` prefixed features, which are always inclusive on both ends and require an explicit fractional offset (like `899.98px`) to express a true exclusive upper bound.

# Which Breakpoint's Rule Actually Applies?

```css
.box { color: black; }

@media (min-width: 600px) {
  .box { color: blue; }
}

@media (min-width: 900px) {
  .box { color: green; }
}

@media (min-width: 1200px) {
  .box { color: purple; }
}
```

**Question:** At a viewport width of `1000px`, what color is `.box`?

**Answer:** `green`.

**Why:** At `1000px`, both the `(min-width: 600px)` and `(min-width: 900px)` queries match (`1000 >= 600` and `1000 >= 900`), but `(min-width: 1200px)` does not (`1000 < 1200`). All matching `@media` blocks apply their rules — media queries don't "pick the closest match" or short-circuit each other; every block whose condition is true contributes its declarations to the cascade, same as any other CSS rule. Since both the `600px` and `900px` blocks apply, and they target the exact same selector (`.box`) with the same specificity, the normal cascade tiebreaker — source order — decides: the `900px` block's `color: green` appears later in the stylesheet than the `600px` block's `color: blue`, so it wins. This is why mobile-first `min-width` breakpoints are conventionally written in ascending order in the stylesheet — later (larger) breakpoints need to appear after earlier (smaller) ones specifically so they can correctly override them via source order once both match simultaneously.

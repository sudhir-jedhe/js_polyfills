# What Does `clamp()` Compute To at Different Viewport Widths?

```css
h1 {
  font-size: clamp(1.5rem, 1rem + 4vw, 3rem);
}
/* assume the root font-size is the browser default: 1rem = 16px */
```

**Question:** What is the computed `font-size` of `h1` at viewport widths of `300px`, `800px`, and `1600px`?

**Answer:**

- At `300px`: preferred value = `1rem + 4vw` = `16px + (4% of 300px)` = `16px + 12px` = `28px` = `1.75rem`. This is between the floor (`1.5rem` = `24px`) and ceiling (`3rem` = `48px`), so the computed value is `28px`.
- At `800px`: preferred value = `16px + (4% of 800px)` = `16px + 32px` = `48px` = `3rem`. This exactly equals the ceiling, so the computed value is `48px` (the clamp is right at its maximum here).
- At `1600px`: preferred value = `16px + (4% of 1600px)` = `16px + 64px` = `80px`. This exceeds the ceiling (`48px`), so `clamp()` caps it — the computed value is `48px`, not `80px`.

**Why:** `clamp(MIN, PREFERRED, MAX)` evaluates the `PREFERRED` expression continuously, then clamps the result between `MIN` and `MAX`. At `300px` the preferred value (`28px`) already falls inside the floor/ceiling range, so it's used as-is. At `800px` the preferred value happens to land exactly on the ceiling. Past `800px`, the preferred value keeps growing (`4vw` scales with viewport width) but the *computed* value stops growing, since it's now clamped at the `3rem` maximum — this is the entire point of the ceiling argument, preventing runaway text size on very wide viewports. Below the floor, symmetric logic applies: the preferred value would keep shrinking as viewport width decreases, until it hits `1.5rem`, at which point it stops shrinking further.

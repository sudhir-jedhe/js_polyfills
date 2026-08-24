# Fluid Typography with `clamp()`, `min()`, and `max()`

These three CSS math functions let you compute a size that responds continuously to the viewport (or any other length-producing value), without needing discrete `@media` breakpoints at all — the value smoothly scales instead of jumping at fixed points.

## `clamp(minimum, preferred, maximum)`

```css
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
}
```

Reads as: "use the *preferred* value (`4vw + 1rem`, a viewport-relative formula), but never let it go below `1.75rem`, and never let it go above `3.5rem`." As the viewport shrinks, the preferred value shrinks too, until it hits the `1.75rem` floor and stops shrinking further; as the viewport grows, it grows until it hits the `3.5rem` ceiling and stops. This produces smooth, continuous scaling between the floor and ceiling, with hard limits on both ends — no abrupt jump at any specific breakpoint, and no risk of text becoming unreadably small or absurdly large at extreme viewport sizes.

## `min()` and `max()`

```css
.sidebar {
  width: min(300px, 100%); /* whichever is SMALLER: 300px, or 100% of the container */
  /* → never wider than 300px, but shrinks below that on narrow containers instead of overflowing */
}

.container {
  padding-inline: max(16px, 4vw); /* whichever is LARGER: 16px, or 4% of viewport width */
  /* → never less than 16px of padding, but grows generously on wide viewports */
}
```

`min()` picks the smallest of its arguments (useful for capping a size — "grow, but never past this"), and `max()` picks the largest (useful for flooring a size — "shrink, but never below this"). `clamp(MIN, VAL, MAX)` is exactly equivalent to `max(MIN, min(VAL, MAX))` — it's really just a readable shorthand combining both.

## Why fluid sizing is generally preferred over breakpoint-jump typography

```css
/* Old approach: discrete jumps at breakpoints */
h1 { font-size: 2rem; }
@media (min-width: 768px) { h1 { font-size: 2.5rem; } }
@media (min-width: 1200px) { h1 { font-size: 3.5rem; } }
```

```css
/* Modern approach: one line, continuous scaling, no jump */
h1 {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
}
```

The breakpoint version has a visible, sudden size change exactly at 768px and 1200px — resize the browser slowly and you'll see the text visibly "jump." The `clamp()` version scales fluidly at every pixel of viewport width in between, which reads as noticeably more polished, and also requires far less code (one declaration instead of three).

## Working out the "preferred" middle value

A common formula pattern for fluid sizing between two explicit endpoints (e.g. "16px at 320px viewport width, up to 24px at 1280px viewport width") is a linear interpolation using `vw`:

```
slope = (maxSize - minSize) / (maxViewport - minViewport)
intersection = minSize - slope * minViewport (in px, then converted to rem base)
```

In practice, most teams either use one of the widely available "fluid type scale" generator tools to compute the `vw` coefficient, or reach for a slightly looser hand-picked formula like `4vw + 1rem` (as in the first example) rather than solving the exact linear equation by hand — precision to the pixel rarely matters for text sizing.

## Accessibility note: don't clamp text to a maximum that's too restrictive

Because a *browser's own zoom feature* also effectively scales `vw`-based values (since it changes what the CSS viewport itself measures), a `clamp()` ceiling that's too low can still limit how much a user can visually enlarge text purely by browser zoom, in some zoom implementations — using `rem`-based preferred values instead of, or in addition to, `vw` (i.e. an expression that includes a `rem` term, not `4vw` alone) helps ensure the fluid size still responds proportionally to the user's base font-size setting, not only to viewport width.

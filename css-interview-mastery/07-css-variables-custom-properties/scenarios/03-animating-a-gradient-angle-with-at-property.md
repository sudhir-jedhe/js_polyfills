# Scenario: A Gradient-Based Loading Animation Won't Animate Smoothly

**Scenario:** A designer wants a subtle, continuously rotating gradient border effect for a "processing" state indicator. An engineer implements it with a `conic-gradient()` driven by a custom property representing the rotation angle, animated via `@keyframes`, but the effect renders as an abrupt jump-cut every second instead of a smooth rotation — like a strobe rather than a spin. What's wrong, and how do you fix it?

**Diagnosis:**

```css
/* The broken version */
.loading-ring {
  --rotation: 0deg;
  background: conic-gradient(from var(--rotation), #3b82f6, transparent 50%);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    --rotation: 360deg;
  }
}
```

Plain custom properties are completely untyped, and the browser has no defined way to interpolate between two arbitrary token streams (`0deg` and `360deg` here) during an animation — it doesn't know these are angles that can be smoothly tweened, and it treats the change as a single, instantaneous jump from the start keyframe's value to the end keyframe's value, right at the boundary, rather than a smooth in-between motion. This is a fundamental limitation of plain custom properties, not a mistake in the `@keyframes` syntax itself — the code above is syntactically valid, it just can't animate the way it's written.

**Fix — register `--rotation` with `@property` so the browser knows it's an interpolatable angle:**

```css
@property --rotation {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.loading-ring {
  --rotation: 0deg;
  background: conic-gradient(from var(--rotation), #3b82f6, transparent 50%);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    --rotation: 360deg;
  }
}
```

With `--rotation` registered as `syntax: '<angle>'`, the browser now knows exactly how to interpolate between `0deg` and `360deg` — every intermediate animation frame computes a genuinely intermediate angle value (e.g. `90deg`, `180deg`, `270deg`, and everywhere in between), so `conic-gradient(from var(--rotation), ...)` recomputes smoothly across the full animation duration, producing an actual continuous spin instead of an instant jump. This is the primary real-world reason to reach for `@property` at all — it's specifically what unlocks animating values that don't have a "normal CSS property" equivalent to hang the animation off of (there's no built-in `rotation-angle` property that a `conic-gradient`'s `from` argument could bind `animation`/`transition` to directly, which is exactly the gap a typed custom property fills).

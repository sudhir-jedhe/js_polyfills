# Problem: Build an Animated SVG-Free Progress Ring Using a Typed Custom Property

## Problem Statement

Build a circular progress ring (0–100%) using only `conic-gradient()` and a single typed custom property for the current percentage — no SVG, no `<canvas>`. The ring must animate smoothly whenever the percentage changes (e.g. from 30% to 75%), sweeping through every intermediate value, not jump-cutting.

## Requirements

- A circular ring showing progress as a colored arc against a track color.
- Center displays the current percentage as text.
- Updating the progress value (via JS) animates the arc smoothly over ~500ms.
- Implemented with `@property` + `conic-gradient()`, not SVG `stroke-dasharray`.

## Approach

Register a custom property typed as `<number>` (representing the percentage, 0–100) via `@property`, so it's animatable, then drive a `conic-gradient()`'s stop position from that number using `calc()`, and put a `transition` on the custom property itself. JS only ever needs to update the one custom property; the browser handles interpolating and repainting the gradient across every intermediate frame.

## Solution

```html
<div class="progress-ring" style="--progress: 30;">
  <span class="progress-label">30%</span>
</div>
```

```css
@property --progress {
  syntax: '<number>';
  initial-value: 0;
  inherits: false;
}

.progress-ring {
  --progress: 0;
  --ring-color: #3b82f6;
  --track-color: #e5e5e5;

  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;

  background: conic-gradient(
    var(--ring-color) calc(var(--progress) * 1%),
    var(--track-color) 0
  );

  transition: --progress 0.5s ease; /* only works because --progress is a REGISTERED, typed number */
}

.progress-ring::before {
  content: '';
  position: absolute;
  inset: 12px; /* creates the "ring" look by masking the center as a hole */
  background: white;
  border-radius: 50%;
}

.progress-label {
  position: relative; /* sits above the ::before mask */
  font-weight: 600;
}
```

```js
function setProgress(el, percent) {
  el.style.setProperty('--progress', percent);
  el.querySelector('.progress-label').textContent = `${percent}%`;
}

const ring = document.querySelector('.progress-ring');
setTimeout(() => setProgress(ring, 75), 1000); // triggers a smooth 30% → 75% sweep
```

**Why `@property` is required, not optional, for this to animate correctly:** without registering `--progress` as `syntax: '<number>'`, the `transition: --progress 0.5s ease;` line would have no effect — a plain, untyped custom property can't be interpolated by the transition/animation engine, so the `conic-gradient()`'s stop position would jump instantly from `30%` to `75%` with no in-between frames, defeating the entire purpose of the exercise. This is the canonical real-world use case for `@property`: unlocking a smooth transition/animation for a value that has no built-in CSS property to attach to directly, by giving the browser just enough type information (`<number>`, in this case) to know how to interpolate it.

**Why `conic-gradient(..., calc(var(--progress) * 1%), ...)` rather than a raw percentage:** `--progress` is registered as a plain `<number>` (not `<percentage>`), so multiplying by `1%` converts the interpolated number into a percentage value usable as the gradient's color-stop position — this keeps the custom property's type simpler (a `<number>` is often easier to reason about and combine with other math than mixing numbers and percentages), while still producing the correct visual result.

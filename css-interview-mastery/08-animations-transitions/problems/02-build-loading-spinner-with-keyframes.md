# Problem: Build a Loading Spinner Using Only `@keyframes` and Compositor-Cheap Properties

## Problem Statement

Build a circular loading spinner (a rotating partial-ring, the common "spinning arc" pattern) using pure CSS `@keyframes` — no JavaScript-driven animation, no SVG `<animate>`, no image assets — that runs smoothly indefinitely without contributing to main-thread jank even while other work is happening on the page (a realistic scenario for a loading spinner, which typically appears exactly while the app is busy doing something else, like a network request or heavy computation).

## Requirements

- A circular spinner with a visible rotating arc (not a full solid circle — a partial ring showing rotation clearly).
- Loops indefinitely at a constant, smooth rotation speed.
- Must be implementable using only compositor-cheap properties, so it doesn't compete with other main-thread work for smoothness.
- Respects `prefers-reduced-motion` (continuous, indefinite rotation is exactly the kind of motion that benefit from a reduced-motion fallback).

## Approach

Build the ring shape using `border` (a transparent border on three sides, a colored border on the fourth, creating the "arc" illusion via border-color contrast) and animate rotation purely via `transform: rotate()` inside `@keyframes`, using `linear` timing (constant velocity is what reads as a natural continuous spin, unlike an eased eased curve which would look like it's oddly speeding up/slowing down every loop).

## Solution

```html
<div class="spinner" role="status" aria-label="Loading">
  <span class="sr-only">Loading…</span>
</div>
```

```css
.spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid #e5e5e5;       /* the "track" — visible on all four sides */
  border-top-color: #3b82f6;       /* the "arc" — a contrasting color on just one side */
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 2.5s; /* slowed significantly, rather than fully removed —
                                  a loading spinner still needs to communicate
                                  "something is happening," so a static, fully
                                  motionless version could be misread as a stalled/broken state */
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
```

**Why `transform: rotate()` inside `@keyframes` rather than animating a rotation-related layout property:** rotation via `transform` is purely a compositor-stage operation — the element's actual layout box never changes size or position in the document flow, only its visual presentation during compositing, so this spinner can rotate indefinitely at a rock-solid, consistent frame rate entirely independent of whatever else is happening on the main thread (which, again, is exactly the situation a loading spinner is usually shown during — the main thread is likely busy with the very work the spinner is indicating is in progress).

**Why `linear` timing specifically, and not `ease`/`ease-in-out`:** a continuous, repeating rotation needs constant angular velocity to read as a smooth, natural spin — any easing curve would cause a visible "speeding up, then slowing down" pulse at the seam of every loop iteration, since the curve resets to its starting acceleration profile at the start of each new iteration; `linear` avoids that discontinuity entirely, since its rate of change never varies within or across iterations.

**Why the reduced-motion override slows the animation rather than removing it outright:** unlike purely decorative motion (a parallax effect, a hover bounce), a loading spinner communicates meaningful state (work is actively in progress) — for a user with a reduced-motion preference, an appropriate compromise is often a significantly slower, calmer rotation rather than eliminating the motion entirely, since a fully static spinner risks being misread as the page having frozen or the loading process having stalled, which is arguably a worse outcome than a slow, gentle rotation.

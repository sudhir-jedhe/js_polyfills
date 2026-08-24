# Problem: Build a Staggered List Entrance Animation

## Problem Statement

Build a list where items animate in one after another with a slight delay between each (a "stagger" effect — item 1 starts, then shortly after item 2 starts, then item 3, and so on), using pure CSS (no JS-driven per-item timing loop), and respecting `prefers-reduced-motion`.

## Requirements

- A list of N items, each fading/sliding in from below.
- Each item's entrance is delayed slightly relative to the previous one, creating a cascading effect.
- Solution should work for a dynamic, unknown-in-advance number of items, not require manually writing a CSS rule per specific item count.
- Entrance must reliably play (not silently skip due to the "no committed before-frame" mount problem).
- Respects `prefers-reduced-motion` by removing the staggered delay/motion.

## Approach

Use `@keyframes` (which, unlike `transition`, plays automatically from its `from` state on mount — sidestepping the "transition doesn't fire on first render" problem entirely, since animations don't have that same "needs a prior committed frame" requirement) combined with the CSS `:nth-child()` selector to assign a progressively increasing `animation-delay` per item, using `calc()` so the delay scales with each item's position without hardcoding a fixed number of rules.

## Solution

```html
<ul class="stagger-list">
  <li class="stagger-item">Item 1</li>
  <li class="stagger-item">Item 2</li>
  <li class="stagger-item">Item 3</li>
  <li class="stagger-item">Item 4</li>
  <li class="stagger-item">Item 5</li>
  <!-- any number of items works the same way -->
</ul>
```

```css
@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  opacity: 0; /* matches the animation's 'from' state, avoiding a flash of
                 full-opacity content before the animation has a chance to run */
  animation: fade-slide-in 0.4s ease-out forwards;
  animation-delay: calc(var(--stagger-index, 0) * 80ms);
}

/* Assign an incrementing --stagger-index per item without JS, up to a reasonable cap */
.stagger-item:nth-child(1) { --stagger-index: 0; }
.stagger-item:nth-child(2) { --stagger-index: 1; }
.stagger-item:nth-child(3) { --stagger-index: 2; }
.stagger-item:nth-child(4) { --stagger-index: 3; }
.stagger-item:nth-child(5) { --stagger-index: 4; }
/* extend as far as a realistic maximum list length requires, or generate
   these rules programmatically (e.g. via a CSS preprocessor loop, or a
   small inline <style> block server-rendered alongside the list) */

@media (prefers-reduced-motion: reduce) {
  .stagger-item {
    opacity: 1;
    animation: none; /* no stagger, no motion — content just appears immediately */
  }
}
```

**Why `animation` (with `forwards`) rather than `transition` for this specific effect:** the entrance needs to play automatically on mount, for every item, with no external trigger event to hang a `transition` off of — `@keyframes`-driven `animation` starts running as soon as the element exists and matches the rule, sidestepping the "transition doesn't fire on first render without a forced intermediate frame" problem entirely, since an animation is inherently designed to play from its `from` keyframe without needing a separately-committed "before" state first.

**Why `--stagger-index` as a custom property multiplied via `calc()`, rather than writing a separate `animation-delay` value directly in each `:nth-child()` rule:** it keeps the actual stagger *timing* (`80ms` per step) defined in exactly one place (the base `.stagger-item` rule), while the `:nth-child()` rules only need to assign a plain sequential index — if the stagger interval needs to change later (e.g. from `80ms` to `50ms` for a snappier feel), it's a one-line edit, rather than needing to recalculate and update every individual `:nth-child()` rule's hardcoded delay value.

**A CSS-only limitation worth naming explicitly:** this approach requires a capped, finite number of `:nth-child()` rules written in advance (or generated at build/render time) — a genuinely unbounded, unknown-length list would eventually exceed however many `:nth-child()` rules were pre-written, at which point items beyond that cap would simply share the last defined `--stagger-index` (no error, just no further staggering beyond the cap) — for a list whose length is truly unbounded and needs infinite/dynamic staggering, JS setting `element.style.setProperty('--stagger-index', i)` per item at render time removes this limitation entirely, at the cost of no longer being purely CSS-only.

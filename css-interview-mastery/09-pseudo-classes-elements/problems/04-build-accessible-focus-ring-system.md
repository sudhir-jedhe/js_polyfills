# Problem: Build a Reusable, Accessible Focus-Ring System

## Problem Statement

Build a single set of CSS rules that provides consistent, accessible focus indication across native interactive elements (`button`, `a`, `input`) and custom ARIA-based widgets (`div[role="button"]`), without showing a distracting ring on mouse clicks.

## Requirements

- Keyboard/AT-driven focus always shows a visible ring.
- Mouse-click-driven focus does not show a ring (avoid the "flash on click" complaint).
- Works consistently for both native and custom (`role="button"`) interactive elements.
- Ring color/offset should be overridable per-component via a CSS custom property.
- Provide a graceful fallback for browsers without `:focus-visible` support.

## Solution

```css
:root {
  --focus-ring-color: #2563eb;
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
}

/* Base: suppress the plain focus ring everywhere focus-visible is supported */
a, button, input, select, textarea,
[role="button"], [tabindex] {
  outline: none;
}

/* The actual visible ring, gated to keyboard/AT-detected focus */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* Per-component override example */
.btn-danger {
  --focus-ring-color: #dc2626;
}

/* Fallback for browsers that don't support :focus-visible at all:
   feature-detect it and fall back to plain :focus everywhere so keyboard
   users are never left without ANY visible indication. */
@supports not selector(:focus-visible) {
  a:focus, button:focus, input:focus, select:focus, textarea:focus,
  [role="button"]:focus, [tabindex]:focus {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
}
```

**Why this works:** centering the ring's color/width/offset in custom properties means any component can override just `--focus-ring-color` (as `.btn-danger` does) without redeclaring the whole rule. `@supports not selector(:focus-visible)` is a feature query that tests whether the browser understands `:focus-visible` as a *selector* at all — in browsers that don't, it falls back to always-visible `:focus`, which is the safe default (visible focus for everyone) rather than silently having no focus indication at all, which is what would happen if the base `outline: none` rule shipped unconditionally to a non-supporting browser. Explicitly listing `[role="button"]`/`[tabindex]` alongside native elements is necessary because `:focus-visible`'s heuristics and outline defaults are most reliably specified for natively-focusable elements — custom widgets need the same treatment spelled out.

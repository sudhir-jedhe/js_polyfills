# Problem: Convert an LTR-Only Stylesheet to Logical Properties

## Problem Statement

You're given a physical-property stylesheet for a notification toast component that only works correctly in LTR layouts. Convert every direction-dependent property to its logical equivalent so the component works correctly in both LTR and RTL without any `[dir="rtl"]` override rules.

## Starting Point

```css
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 320px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1.25rem;
  padding-right: 1rem;
  border-left: 4px solid #2563eb;
  text-align: left;
}

.toast__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.toast + .toast {
  margin-top: 0.75rem;
}
```

## Constraints

- No `[dir="rtl"]` rules anywhere in the final solution.
- Preserve the exact visual layout in LTR (must look identical to the original in an LTR document).
- The accent border must always appear on the "start" edge, flipping correctly for RTL.

## Solution

```css
.toast {
  position: fixed;
  inset-block-start: 1rem;
  inset-inline-end: 1rem;      /* was: top/right — "top-right corner" concept, in flow-relative terms */
  width: 320px;
  padding-block: 1rem;          /* shorthand for padding-top + padding-bottom */
  padding-inline: 1.25rem 1rem; /* start, then end — was padding-left/padding-right */
  border-inline-start: 4px solid #2563eb; /* was: border-left */
  text-align: start;             /* was: text-align: left */
}

.toast__close {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;     /* was: top/right */
}

.toast + .toast {
  margin-block-start: 0.75rem;  /* was: margin-top */
}
```

**Why this is correct:** in an LTR document, every converted property resolves to exactly the same physical result as the original (`inset-inline-end` → `right`, `padding-inline: 1.25rem 1rem` → `padding-left: 1.25rem; padding-right: 1rem`, etc.), satisfying the "must look identical in LTR" constraint. In an RTL document, the toast now automatically repositions to the top-*left* corner, its accent border flips to the right edge (since `inline-start` becomes the right edge under RTL), and its padding/text-alignment mirror correctly — all without a single `[dir="rtl"]` override rule, because every direction-sensitive property was expressed relative to writing direction rather than a hardcoded physical side.

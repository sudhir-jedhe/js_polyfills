# Problem: Build a Derived Spacing Scale from a Single Base Unit

## Problem Statement

Build a spacing scale (`--space-1` through `--space-8`) where every step is derived from a single base unit custom property, such that changing the base unit proportionally rescales the entire system, and expose the scale as utility classes (`.p-1`, `.m-2`, `.gap-3`, etc.) for use throughout a project.

## Requirements

- One base custom property (`--space-unit`) that the entire scale derives from.
- At least 8 scale steps, each a multiple of the base unit (not necessarily linear — a slightly progressive scale is preferred, matching common design-system conventions).
- Utility classes for `padding`, `margin`, and `gap` at each step.
- Changing `--space-unit` alone should rescale every derived value and every element using the utility classes, without touching any other CSS.

## Approach

Rather than a strictly linear scale (`1×, 2×, 3×...`), use a progressive multiplier scale (a common real design-system pattern — steps grow proportionally larger as the scale increases, since a difference of "1 base unit" matters more at the small end than the large end). Define each step as a `calc()` expression referencing the single base unit, then generate utility classes that reference the step tokens via `var()`.

## Solution

```css
:root {
  --space-unit: 4px; /* the ONE value that controls the entire scale's overall size */

  --space-1: var(--space-unit);                          /* 4px  */
  --space-2: calc(var(--space-unit) * 2);                 /* 8px  */
  --space-3: calc(var(--space-unit) * 3);                 /* 12px */
  --space-4: calc(var(--space-unit) * 4);                 /* 16px */
  --space-5: calc(var(--space-unit) * 6);                 /* 24px */
  --space-6: calc(var(--space-unit) * 8);                 /* 32px */
  --space-7: calc(var(--space-unit) * 12);                /* 48px */
  --space-8: calc(var(--space-unit) * 16);                /* 64px */
}

/* Utility classes — one declaration each, referencing the token scale */
.p-1 { padding: var(--space-1); } .p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); } .p-4 { padding: var(--space-4); }
.p-5 { padding: var(--space-5); } .p-6 { padding: var(--space-6); }
.p-7 { padding: var(--space-7); } .p-8 { padding: var(--space-8); }

.m-1 { margin: var(--space-1); } .m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); } .m-4 { margin: var(--space-4); }
.m-5 { margin: var(--space-5); } .m-6 { margin: var(--space-6); }
.m-7 { margin: var(--space-7); } .m-8 { margin: var(--space-8); }

.gap-1 { gap: var(--space-1); } .gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); } .gap-4 { gap: var(--space-4); }
.gap-5 { gap: var(--space-5); } .gap-6 { gap: var(--space-6); }
.gap-7 { gap: var(--space-7); } .gap-8 { gap: var(--space-8); }
```

```css
/* Rescaling the entire system, e.g. for a "compact density" mode toggled on a container */
.density-compact {
  --space-unit: 3px; /* every --space-N and every utility class using it rescales automatically */
}
```

**Why deriving every step from one `--space-unit` (rather than hardcoding each step's pixel value directly) matters:** it makes the whole scale rescalable from a single edit — the `.density-compact` example demonstrates this directly: scoping a redefinition of `--space-unit` to any subtree (or the whole page) proportionally shrinks every derived `--space-N` value used anywhere inside that subtree, via ordinary inheritance, with zero changes needed to any of the individual step definitions or utility classes. If each step had instead been hardcoded (`--space-4: 16px;` with no reference to a shared base), achieving the same "compact mode" effect would require redefining all eight steps individually, in every place such a mode needs to apply — the derived-scale approach turns that into a one-line change.

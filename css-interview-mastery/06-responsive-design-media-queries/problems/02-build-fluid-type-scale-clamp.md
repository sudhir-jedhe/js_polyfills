# Problem: Build a Complete Fluid Type Scale with `clamp()`

## Problem Statement

Build a full typographic scale (six sizes: `xs` through `xxl`) for a design system, where every size scales fluidly with the viewport between an explicit minimum (at a 320px "smallest supported" viewport) and an explicit maximum (at a 1440px "largest meaningfully scaling" viewport), with no `@media` breakpoints required.

## Requirements

- Six named sizes: `xs`, `sm`, `base`, `lg`, `xl`, `xxl`.
- Each size has an explicit min value (at 320px viewport) and max value (at 1440px viewport), provided as a design spec (see table below).
- Sizing must be continuous (no jumps) across the full 320px–1440px range, floor below 320px, ceiling above 1440px.
- Exposed as CSS custom properties so components can reference them (`font-size: var(--text-lg)`).

## Design spec (min @ 320px → max @ 1440px)

| Token | Min (px) | Max (px) |
|---|---|---|
| `xs` | 12 | 14 |
| `sm` | 14 | 16 |
| `base` | 16 | 18 |
| `lg` | 20 | 24 |
| `xl` | 24 | 32 |
| `xxl` | 32 | 48 |

## Approach

For each token, compute a linear interpolation formula between the two (viewport, size) points using the standard fluid-typography slope formula, then express it as `clamp(min, preferred-vw-formula, max)`. The formula for the `vw` coefficient is:

```
slope = (maxSizePx - minSizePx) / (maxViewportPx - minViewportPx)
vwCoefficient = slope * 100        (expressed as a vw value)
remIntercept  = (minSizePx - slope * minViewportPx) / 16   (converted to rem, assuming 16px root)
```

## Solution

Worked for `lg` (20px @ 320px → 24px @ 1440px) as an example:

```
slope = (24 - 20) / (1440 - 320) = 4 / 1120 ≈ 0.00357
vwCoefficient = 0.00357 * 100 ≈ 0.357vw
remIntercept = (20 - 0.00357 * 320) / 16 = (20 - 1.14) / 16 ≈ 1.179rem
```

```css
:root {
  --text-xs:  clamp(0.75rem,  0.696rem + 0.179vw, 0.875rem);
  --text-sm:  clamp(0.875rem, 0.804rem + 0.179vw, 1rem);
  --text-base: clamp(1rem,    0.911rem + 0.179vw, 1.125rem);
  --text-lg:  clamp(1.25rem,  1.179rem + 0.357vw, 1.5rem);
  --text-xl:  clamp(1.5rem,   1.357rem + 0.714vw, 2rem);
  --text-xxl: clamp(2rem,     1.714rem + 1.429vw, 3rem);
}

.text-xs  { font-size: var(--text-xs); }
.text-sm  { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg  { font-size: var(--text-lg); }
.text-xl  { font-size: var(--text-xl); }
.text-xxl { font-size: var(--text-xxl); }
```

**Verification for `lg`:** at exactly `320px` viewport width, `0.357vw` = `0.357% of 320px` ≈ `1.14px` ≈ `0.0714rem`; added to the `1.179rem` intercept gives `≈1.25rem` — matches the `20px`/`1.25rem` floor. At exactly `1440px`, `0.357vw` ≈ `5.14px` ≈ `0.32rem`; added to `1.179rem` gives `≈1.5rem` — matches the `24px`/`1.5rem` ceiling. Below `320px` or above `1440px`, `clamp()`'s min/max arguments hold the value flat at the floor/ceiling respectively, so the scale never under- or over-shoots the design spec's intended bounds. In practice, teams typically compute these coefficients with a small script or generator tool rather than by hand for every token, but understanding the underlying linear-interpolation math (as shown here) is exactly what separates "I copy-pasted a `clamp()` value" from "I understand what `clamp()`-based fluid typography is actually doing."

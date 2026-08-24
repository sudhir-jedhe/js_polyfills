# Problem: Build a Cascade-Layer-Based Reset System

## Problem Statement

Design a small cascade-layer architecture for a new app's global stylesheet that guarantees this priority order, from lowest to highest, **without relying on selector specificity or `!important` to enforce it**:

1. A browser-default reset (margins, box-sizing, list styles)
2. Base element defaults (typography, base colors)
3. Reusable components (buttons, cards, badges)
4. Page-specific one-off styles
5. Utility classes that must always win over everything above

Then demonstrate that a low-specificity utility class (`.u-hidden`) correctly overrides a much higher-specificity component rule (`#app .card.featured .card__header`), purely because of layer order.

## Constraints

- Declare the full layer order up front in one statement.
- Show at least one rule per layer.
- The utility layer must win via layer order, not via `!important` or a higher-specificity selector — prove it by writing `.u-hidden` as a plain, single-class selector.

## Solution

```css
/* 1. Declare the full priority order up front — this is the single source of truth for priority */
@layer reset, base, components, page, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body, h1, h2, h3, p, figure, ul, ol { margin: 0; }
  ul, ol { list-style: none; padding: 0; }
}

@layer base {
  body { font-family: system-ui, sans-serif; line-height: 1.5; color: #1a1a1a; }
  h1, h2, h3 { font-weight: 600; }
}

@layer components {
  .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; }
  .card--featured { border-color: gold; }
  .card__header { font-weight: 600; padding-bottom: 0.5rem; }
  /* deliberately over-specific, to prove layer order beats it regardless */
  #app .card.featured .card__header { display: block; }
}

@layer page {
  .home-hero .card { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
}

@layer utilities {
  /* single class, specificity (0,1,0) — the LOWEST possible non-zero weight, no !important */
  .u-hidden { display: none; }
}
```

```html
<div id="app">
  <div class="card featured">
    <div class="card__header u-hidden">Title</div>
  </div>
</div>
```

**Result:** the header is hidden. `#app .card.featured .card__header { display: block; }` in `@layer components` has specificity `(1,2,1)` — enormous compared to `.u-hidden`'s `(0,1,0)` — but `utilities` is declared last, so for normal declarations layer order is checked *before* specificity, and every rule in `utilities` beats every rule in `components` unconditionally.

**Why this design scales:** adding a new component never risks accidentally out-specificity-ing a utility class (a common real-world bug with plain CSS), and utilities never need `!important` to do their job — the layer itself carries that guarantee, which also means the `!important`-reversal gotcha (earlier layers winning for `!important`) never becomes relevant here, since nothing in this system needs `!important` at all.

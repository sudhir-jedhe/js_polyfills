# Problem: Build a Layered Reset + Component Base with `@layer`

## Problem Statement

Build a small foundational stylesheet using native cascade layers, structured so that: a reset always loses to element defaults, which always lose to components, which always lose to utilities — matching an ITCSS-style generic-to-explicit priority order, but enforced by the browser instead of by import-order convention alone.

## Requirements

- Four layers, declared up front, in this priority order (lowest to highest): `reset`, `elements`, `components`, `utilities`.
- The reset must zero out default margins/padding and set `box-sizing: border-box`.
- `elements` should style bare `a`/`button`/`h1`-`h3` with sensible defaults.
- `components` should define a `.card` and a `.btn`.
- `utilities` should define at least one utility (`.u-hidden`) that can override anything in `components`, even if a `components` rule were (hypothetically, and incorrectly) written with higher specificity.

## Solution

```css
@layer reset, elements, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

@layer elements {
  a { color: inherit; text-decoration: none; }
  button { font: inherit; cursor: pointer; }
  h1, h2, h3 { font-weight: 600; line-height: 1.2; }
}

@layer components {
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 1.5rem;
  }
  .btn {
    display: inline-block;
    padding: 0.6em 1.2em;
    border-radius: 8px;
    background: #2563eb;
    color: white;
  }
}

@layer utilities {
  .u-hidden { display: none; }
}
```

```html
<!-- Verification: even though #promo-card below has an ID (which would normally
     dominate specificity), .u-hidden in the later "utilities" layer still wins -->
<div id="promo-card" class="card u-hidden">This is hidden, guaranteed, by layer order.</div>
```

```css
/* Even a deliberately over-specific rule in "components" loses to "utilities" */
@layer components {
  #promo-card.card { display: flex; } /* specificity (1,1,0) — normally very hard to beat */
}
```

**Why this satisfies the requirements:** because layer order is checked before specificity, `.u-hidden` in `utilities` reliably wins against `#promo-card.card` in `components` despite the latter's much higher specificity — the exact guarantee the requirements ask for. This is a stronger guarantee than an ITCSS-only (convention-based) setup could offer, since a convention can be violated by any one contributor writing an overly-specific selector, whereas the layer-order guarantee is enforced by the browser regardless of what any individual selector looks like.

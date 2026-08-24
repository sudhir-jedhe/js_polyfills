# Problem: Convert a Plain-Class Stylesheet to BEM

## Problem Statement

You're given the following markup and CSS for a pricing card component, written with generic, unscoped class names that are already causing collisions elsewhere in the app (`.title`, `.price`, and `.featured` are used by multiple unrelated components). Convert it to BEM.

## Starting Point

```html
<div class="card featured">
  <h3 class="title">Pro Plan</h3>
  <p class="price">$29<span class="period">/mo</span></p>
  <ul class="features">
    <li>Unlimited projects</li>
    <li>Priority support</li>
  </ul>
  <button class="cta">Choose plan</button>
</div>
```

```css
.card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.5rem; }
.featured { border-color: #f59e0b; }
.title { font-size: 1.25rem; margin: 0; }
.price { font-size: 2rem; font-weight: 700; }
.period { font-size: 1rem; color: #6b7280; }
.features { list-style: none; padding: 0; }
.cta { background: #2563eb; color: white; padding: 0.6em 1.4em; border: none; border-radius: 6px; }
```

## Requirements

- Every class must be scoped under a single Block (`pricing-card`) so it can never collide with unrelated `.title`/`.price` classes elsewhere.
- Preserve the `featured` variant as a proper BEM modifier.
- Keep every selector at flat, single-class specificity (0,1,0) — no nesting in the CSS.

## Solution

```html
<div class="pricing-card pricing-card--featured">
  <h3 class="pricing-card__title">Pro Plan</h3>
  <p class="pricing-card__price">$29<span class="pricing-card__period">/mo</span></p>
  <ul class="pricing-card__features">
    <li>Unlimited projects</li>
    <li>Priority support</li>
  </ul>
  <button class="pricing-card__cta">Choose plan</button>
</div>
```

```css
.pricing-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.5rem; }
.pricing-card--featured { border-color: #f59e0b; }
.pricing-card__title { font-size: 1.25rem; margin: 0; }
.pricing-card__price { font-size: 2rem; font-weight: 700; }
.pricing-card__period { font-size: 1rem; color: #6b7280; }
.pricing-card__features { list-style: none; padding: 0; }
.pricing-card__cta { background: #2563eb; color: white; padding: 0.6em 1.4em; border: none; border-radius: 6px; }
```

**Why this solves the stated problem:** every class name is now prefixed with the `pricing-card` block, so `.pricing-card__title` can never collide with an unrelated `.title` elsewhere in the app — collision avoidance comes purely from naming, with zero build tooling required (unlike CSS Modules, which achieves the same goal via generated hashes instead of naming discipline). Every rule remains a single class selector, so specificity stays flat and predictable across the whole component.

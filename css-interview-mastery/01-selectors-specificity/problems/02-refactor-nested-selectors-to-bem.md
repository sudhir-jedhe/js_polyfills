# Problem: Refactor Nested Selectors into BEM

## Problem Statement

You're given the following CSS for a product card component, written with deep, context-dependent nesting. It breaks whenever the card is reused outside `.product-grid` (e.g. inside a "recently viewed" carousel), because the selectors depend on that specific ancestor. Refactor it into flat BEM classes so the component is portable, and update the accompanying HTML.

```css
.product-grid .card {
  border: 1px solid #ddd;
  border-radius: 8px;
}
.product-grid .card .card-header {
  padding: 12px;
  font-weight: 600;
}
.product-grid .card .card-header .badge {
  background: crimson;
  color: white;
}
.product-grid .card .card-body {
  padding: 12px;
}
.product-grid .card.featured {
  border-color: gold;
}
.product-grid .card.featured .card-header {
  background: #fffbe6;
}
```

```html
<div class="product-grid">
  <div class="card featured">
    <div class="card-header">Title <span class="badge">New</span></div>
    <div class="card-body">Description</div>
  </div>
</div>
```

## Constraints

- Every rule's specificity should end up as exactly `(0,1,0)` or `(0,2,0)` for modifier-on-element cases — no selector should depend on `.product-grid` or any other ancestor.
- The component must render identically whether placed inside `.product-grid` or anywhere else.
- Keep the modifier (`featured`) working, expressed as a BEM modifier rather than a bare state class combined with ancestor context.

## Solution

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
}
.card--featured {
  border-color: gold;
}
.card__header {
  padding: 12px;
  font-weight: 600;
}
.card--featured .card__header {
  /* still technically a descendant combinator, but both sides are BEM classes on the SAME block —
     this is fine because it doesn't depend on any ancestor outside the component itself */
  background: #fffbe6;
}
.card__badge {
  background: crimson;
  color: white;
}
.card__body {
  padding: 12px;
}
```

```html
<div class="product-grid">
  <div class="card card--featured">
    <div class="card__header">Title <span class="card__badge">New</span></div>
    <div class="card__body">Description</div>
  </div>
</div>
```

**Why this works:** every selector now only ever references the `.card` block and its own elements/modifiers — never `.product-grid`. The component can be dropped into a carousel, a sidebar, or a modal and render identically, because nothing in its CSS asks "what am I inside of?" The one remaining compound selector, `.card--featured .card__header`, is still acceptable BEM practice: it's scoped entirely within the block itself (modifier affecting a child element), not reaching out to an external ancestor — the distinction that matters for portability is "does this selector depend on the world outside the component," not "does this selector contain more than one class."

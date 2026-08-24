# Problem: Fix a Margin-Collapsing Bug in a Card List

## Problem Statement

Given the following markup and CSS, the design spec calls for exactly 24px of vertical space between each card, and exactly 24px of space between the list container's top edge and the first card. As shipped, the first card has **zero** space above it inside the container (the 24px instead appears above the whole `.card-list` container, pushing the entire list down relative to the page), while the space *between* cards is correct. Fix it so the spec is met exactly, without changing the 24px value or restructuring the markup.

```css
.card-list { background: #fafafa; }
.card { margin-top: 24px; }
```
```html
<div class="card-list">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

## Constraints

- Keep `margin-top: 24px` on `.card` — it's shared, reused typography/spacing scale CSS used elsewhere, and changing its value would break other consumers.
- The fix should live on `.card-list`, scoped to this component.
- Don't use `overflow: hidden` (there's a `box-shadow` on `.card` that must not be clipped).

## Solution

```css
.card-list {
  background: #fafafa;
  display: flow-root; /* new BFC, no clipping side effect — safe for the card's box-shadow */
}
.card {
  margin-top: 24px; /* unchanged, as required */
}
```

**Why this fixes it:** the bug is parent/first-child margin collapse — `.card-list` has no border, padding, or BFC of its own, so the first `.card`'s `margin-top: 24px` was collapsing straight through `.card-list`'s top edge and appearing *above* the container instead of inside it. `display: flow-root` establishes a new block formatting context for `.card-list` with zero other side effects (unlike `overflow: hidden`, which was explicitly ruled out because it would also clip the cards' `box-shadow`). With the collapse stopped, the first card's 24px margin now renders correctly *inside* `.card-list`, giving 24px between the container's top edge and Card 1, while the 24px gaps between Card 1/2 and Card 2/3 — genuine adjacent-sibling collapses, correctly resolving to 24px (both sides are 24px so `max(24,24)=24`) — were never broken and needed no change.

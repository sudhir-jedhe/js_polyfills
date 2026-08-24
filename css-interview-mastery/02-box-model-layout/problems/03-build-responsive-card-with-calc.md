# Problem: Build a Responsive 3-Column Card Row With `calc()`

## Problem Statement

Build a row of exactly 3 equal-width cards inside a container of unknown width, with exactly 16px of gap between cards (and no gap before the first or after the last), using `float: left` cards (assume, for this exercise, that `display: flex`/`gap` are unavailable — practice the underlying box-model arithmetic). Each card also needs `border-box` sizing so an internal 12px padding and 1px border don't throw off the width math.

## Constraints

- Exactly 3 cards, 2 gaps of 16px total between them.
- Cards must not overflow the container at any width.
- Use `calc()` — don't hardcode a pixel width.

## Solution

```css
*, *::before, *::after {
  box-sizing: border-box; /* required so the card's own padding/border don't add to the calc()'d width */
}

.card-row {
  overflow: hidden; /* contains the floated cards (float-collapse fix, see box-model-layout scenarios) */
}

.card {
  float: left;
  width: calc((100% - 2 * 16px) / 3); /* 2 gaps of 16px between 3 cards */
  padding: 12px;
  border: 1px solid #ddd;
  margin-right: 16px;
}

.card:last-child {
  margin-right: 0; /* no gap after the last card, and prevents the 3rd card + its margin from overflowing */
}
```

```html
<div class="card-row">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
</div>
```

**Why the math works:** the 3 cards need to fill `100%` of the container's width in total, minus the 2 gaps of 16px each (`32px` total) that sit between them — so each card gets `(100% - 32px) / 3`. Because of the `border-box` reset, that computed width already includes each card's own `12px` padding and `1px` border, so there's no risk of the 3rd card + its content overflowing past the container's right edge regardless of the container's actual resolved pixel width.

**Why `:last-child` matters here specifically:** without removing the margin on the last card, the total width consumed would be `3 * calc((100% - 32px)/3) + 3 * 16px = (100% - 32px) + 48px = 100% + 16px` — 16px wider than the container, causing exactly the kind of overflow this exercise is meant to avoid. This is precisely the class of "off-by-one-gap" arithmetic bug that `gap` on flex/grid eliminates natively, which is why production code should prefer `gap` the moment flex/grid support is available (see the box-model scenario on this same tradeoff).

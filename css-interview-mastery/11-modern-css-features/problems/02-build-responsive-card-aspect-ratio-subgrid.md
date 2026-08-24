# Problem: Build a Responsive Card Grid with `aspect-ratio` + `subgrid`

## Problem Statement

Build a product card grid where: every card's image maintains a consistent 4:3 ratio regardless of the source image's natural dimensions, and every card's internal rows (image / title / price / button) align across the entire row even when titles vary in length.

## Requirements

- Images must not distort — cropped to fill a fixed 4:3 box.
- No fixed pixel heights anywhere (must remain responsive to column width).
- Title/price/button rows must align horizontally across all cards in a row, even with variable title length.
- No JavaScript.

## Solution

```html
<div class="grid">
  <article class="card">
    <img class="card__img" src="lamp.jpg" alt="" />
    <h3 class="card__title">Desk Lamp</h3>
    <p class="card__price">$34</p>
    <button class="card__cta">Add to cart</button>
  </article>
  <article class="card">
    <img class="card__img" src="chair.jpg" alt="" />
    <h3 class="card__title">Ergonomic Office Chair With Lumbar Support</h3>
    <p class="card__price">$189</p>
    <button class="card__cta">Add to cart</button>
  </article>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-template-rows: auto auto auto auto; /* img / title / price / button — shared tracks */
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
  gap: 0.5rem;
}

.card__img {
  aspect-ratio: 4 / 3;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card__title {
  font-size: 1rem;
  margin: 0;
}

.card__price {
  font-weight: 700;
  color: #111827;
}

.card__cta {
  padding: 0.5em 1em;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: white;
}
```

**Why this satisfies the requirements:** `aspect-ratio: 4/3` combined with `object-fit: cover` locks every `.card__img` to the same proportions regardless of the source image's native size, cropping rather than distorting — fully responsive since no pixel height is set anywhere. `grid-template-rows: subgrid` on `.card` (paired with `grid-row: span 4` matching the grid's four row tracks) means the row containing the longer chair title grows the *shared* title-row track height for every card in that row, keeping price and button rows aligned across all cards — without subgrid, the chair card's two-line title would push only its own price/button down, leaving the lamp card's rows misaligned relative to it.

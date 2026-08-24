# Subgrid

By default, a nested `display: grid` element creates its own **independent** set of tracks — its rows/columns have no relationship to its parent grid's lines, which makes it hard to keep nested content (e.g. multiple cards' headers/bodies/footers) visually aligned across items that are siblings in a larger grid but have their own internal grid layout.

## The problem subgrid solves

```css
.card-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  display: grid;
  grid-template-rows: auto 1fr auto; /* title / body / footer, independently sized PER CARD */
}
```
Without subgrid, each `.card`'s internal rows size to *its own* content — if one card has a two-line title and another has a one-line title, their bodies/footers won't align horizontally across the row, even though the cards themselves are grid items in the same outer row.

## Using `subgrid`

```css
.card-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto; /* parent defines the row tracks that children will align to */
  gap: 16px;
}
.card {
  display: grid;
  grid-row: span 3; /* card spans all 3 of the parent's row tracks */
  grid-template-rows: subgrid; /* instead of defining its own rows, ALIGN to the parent's row tracks */
}
.card__title  { grid-row: 1; }
.card__body   { grid-row: 2; }
.card__footer { grid-row: 3; }
```
With `grid-template-rows: subgrid`, `.card`'s internal rows aren't sized independently anymore — they inherit and align to the **same** row-track boundaries as every other card in `.card-row`. So if one card's title needs two lines, the entire row of title-tracks across *every* card grows to match, and every card's body/footer stays aligned — genuinely not achievable with independent nested grids (or flexbox) without JS-based measurement.

## When to reach for it

Subgrid is specifically for cases where a nested grid's tracks need to participate in — not just visually approximate — the parent's track sizing. Card rows with independently-variable-height internal sections (as above), forms with aligned label/input columns across multiple fieldsets, and any "repeating card" pattern where cross-card alignment must be pixel-exact are the classic use cases.

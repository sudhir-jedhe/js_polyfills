# Problem: Build a Self-Adapting Card Grid Using Container Queries

## Problem Statement

Build a grid of product cards where each individual card adapts its *own* internal layout (image position, text size, button visibility) based on how much space it's actually been allotted by the grid — not the viewport — so the grid remains correct whether it's 1, 2, 3, or 4 columns wide at any given moment, without writing separate CSS per column-count scenario.

## Requirements

- A responsive grid (any number of columns, driven by `auto-fill`/`minmax`, not fixed breakpoints).
- Each card, individually, should show a compact layout (image on top, small text, no secondary button) when its own rendered width is small, and an expanded layout (image beside text, larger text, secondary button visible) when its own rendered width is large.
- The same card component's CSS must work correctly regardless of how many total columns the grid currently has — a card should look identical whenever it happens to be the same width, regardless of total column count.

## Approach

The grid itself uses `repeat(auto-fill, minmax(...))`, which naturally changes column count based on available space, without any explicit breakpoints. Since each grid cell's rendered width isn't something a `@media` viewport query could reason about directly, each card is wrapped in a container-query context (`container-type: inline-size`) at the grid-item level, and the card's internal layout logic reacts to `@container` conditions based on its own actual rendered width.

## Solution

```html
<div class="card-grid">
  <div class="card-cell">
    <article class="card">
      <img src="product.jpg" alt="Product name" />
      <div class="card-body">
        <h3>Product Name</h3>
        <p class="price">$49.00</p>
        <button class="secondary-action">Add to wishlist</button>
      </div>
    </article>
  </div>
  <!-- repeated for each product -->
</div>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.card-cell {
  container-type: inline-size; /* each grid cell independently becomes a query container */
}

.card {
  display: flex;
  flex-direction: column; /* compact default: stacked, small text, no secondary button */
  gap: 8px;
}

.card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.card .secondary-action {
  display: none; /* hidden by default in the compact layout */
}

/* Expanded layout once an individual card cell has enough width */
@container (min-width: 340px) {
  .card {
    flex-direction: row;
    align-items: flex-start;
  }
  .card img {
    width: 40%;
    aspect-ratio: 1 / 1;
  }
  .card .secondary-action {
    display: inline-block;
  }
  .card h3 {
    font-size: 1.15rem;
  }
}
```

**Why this is correct regardless of total column count:** with `auto-fill`/`minmax`, the grid might render 2 wide (~500px cells) or 5 wide (~230px cells) depending on the viewport — a `@media`-based approach would need to somehow correlate "viewport width → column count → per-card width" and write breakpoints for each combination, which breaks the moment `minmax()`'s parameters change or the page's outer layout changes. The container-query version sidesteps all of that: every single `.card-cell`, independent of its siblings or the grid's total column count, simply checks "am I, myself, at least 340px wide?" — a question that's always answerable directly and always correct, because it's asking about the one thing that actually determines the card's ideal internal layout.

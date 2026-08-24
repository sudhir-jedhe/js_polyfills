# Scenario: Aligning a Card Grid's Internal Rows with `subgrid`

**Situation:** A product listing grid shows cards with variable-length titles. Some titles wrap to two lines, some don't — and without any fix, this causes each card's body/footer content to sit at different vertical positions across the row, making the grid look ragged and unaligned.

**Approach:**

```html
<div class="grid">
  <article class="card">
    <h3 class="card__title">Wireless Headphones</h3>
    <p class="card__desc">Noise-cancelling, 30hr battery.</p>
    <button class="card__cta">Add to cart</button>
  </article>
  <article class="card">
    <h3 class="card__title">Mechanical Keyboard With Hot-Swappable Switches</h3>
    <p class="card__desc">Compact 75% layout.</p>
    <button class="card__cta">Add to cart</button>
  </article>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-template-rows: auto auto auto; /* title / desc / cta — the shared tracks every card aligns to */
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-row: span 3;              /* occupy all 3 shared row tracks */
  grid-template-rows: subgrid;    /* align internal rows to those SAME 3 tracks, not independent ones */
  gap: 0.5rem;
}
```

**Why this works:** without `subgrid`, each `.card` would compute its own row heights independently based purely on its own content — the two-line title in the second card would only make *that* card's title row taller, leaving the first card's description/button sitting higher than the second card's. With `grid-template-rows: subgrid`, every card's title/desc/cta rows are the *same* underlying grid tracks as every other card (inherited from `.grid`), so the tallest title in the row forces all cards' title rows to grow together, keeping every card's description and button aligned horizontally across the row — a result that previously required either fixed heights (fragile against content changes) or JavaScript to measure and sync heights.

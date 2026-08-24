# Scenario: Responsive Photo Gallery Without Media Queries

**Scenario:** A photo gallery needs to show as many photos per row as comfortably fit, with each photo at least 220px wide, reflowing to fewer columns as the viewport narrows and more columns as it widens — all the way from a phone to an ultrawide monitor. The team's old approach used 4 separate media-query breakpoints (`grid-template-columns: repeat(2, 1fr)` / `repeat(3, 1fr)` / `repeat(4, 1fr)` / `repeat(6, 1fr)`) which needed manual tuning every time the design added a new breakpoint, and still left dead zones between breakpoints where photos were needlessly cramped or needlessly huge. How do you replace it with a single, breakpoint-free rule?

**Approach:**

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.gallery__photo {
  aspect-ratio: 1 / 1; /* keeps photos square regardless of column width */
  object-fit: cover;
}
```

**Why this works:** `repeat(auto-fit, minmax(220px, 1fr))` computes the maximum number of `220px`-minimum columns that fit the container at *any* width, continuously — not just at 4 hand-picked breakpoints — and because it's `auto-fit` (not `auto-fill`), any row that doesn't have enough photos to fill every possible column has its existing photos stretch to consume the leftover space, so there's never an oddly narrow last row or dead trailing space. This single rule replaces all 4 old breakpoints and continues to "just work" at viewport widths the old breakpoint system never explicitly accounted for (e.g. a 1900px ultrawide monitor gets exactly as many columns as fit at 220px each, without needing a 5th breakpoint added for it).

**One thing to verify when migrating off breakpoints:** confirm the design is genuinely fine with a "however many columns fit" outcome rather than specific counts at specific widths (e.g. "always exactly 3 columns on tablet") — `auto-fit`/`minmax()` optimizes for filling available space at a given minimum size, not for hitting an exact target column count at a given breakpoint. If specific counts at specific widths are a hard requirement, that's a sign media queries (or `clamp()`-based container queries) are still the right tool for that particular constraint.

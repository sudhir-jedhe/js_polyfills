# Scenario: Responsive Card Row That Needs Exact Fixed Gaps

**Scenario:** A design spec calls for a row of exactly 4 equal-width cards with a precise 20px gap between each card (not before the first or after the last), inside a container of unknown/variable width (it's a reusable component embedded in different page widths). The team's older codebase doesn't yet use CSS `gap` on flex/grid consistently in this component's build pipeline and asks for a `calc()`-based solution that works with plain `float`/`inline-block` cards for now, ahead of a planned migration. How do you size the cards?

**Approach:** with 4 cards and exactly 3 gaps between them (not around the outside), each card's width needs to account for its 1/4 share of the container minus its share of the total gap space:

```css
.card-row {
  display: flex; /* still worth using flex even without `gap` support assumptions, for the layout itself */
}
.card {
  width: calc((100% - 3 * 20px) / 4); /* 3 gaps of 20px between 4 cards */
  margin-right: 20px;
}
.card:last-child {
  margin-right: 0; /* no gap after the last card */
}
```

**Why the math works:** total available width for cards alone is `100% - 60px` (the 3 gaps), and dividing that evenly by 4 gives each card's width — so 4 cards at that width plus 3 margins of 20px between them exactly fill `100%` of the container, regardless of what the container's actual pixel width resolves to at runtime, since the entire expression is computed relative to `100%`.

**Better, once `gap` is available (modern browsers all support it on flexbox):**
```css
.card-row {
  display: flex;
  gap: 20px; /* replaces the calc() + :last-child margin reset entirely */
}
.card {
  flex: 1 1 0; /* four equal-width flexible cards, gap handled natively by the container, not per-item calc() */
}
```
`gap` on a flex/grid container only ever inserts space *between* items, never around the outer edges, which is exactly the spec requirement — and it removes the need for the `calc()` width formula and the `:last-child` margin-reset workaround entirely, since the browser handles the "n items, n-1 gaps" arithmetic natively.

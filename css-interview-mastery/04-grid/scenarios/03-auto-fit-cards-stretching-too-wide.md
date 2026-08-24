# Scenario: `auto-fit` Cards Stretching Uncomfortably Wide on Large Screens

**Scenario:** A team adopted `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));` for a product card grid, following the standard responsive-grid recipe. On a typical laptop screen it looks great, but on a 3-item search-results page viewed on a large desktop monitor, the 3 cards stretch to roughly 500px wide each — comically oversized, with huge card padding and disproportionate images, because `auto-fit` is doing exactly what it's designed to do: collapsing the empty tracks and letting the 3 real items consume 100% of the available width. How do you keep the responsive reflow behavior but cap how wide any individual card can grow?

**Diagnosis:** This isn't a bug in `auto-fit` — it's a mismatch between what `auto-fit` optimizes for ("no dead space, ever") and an unstated design requirement the original recipe didn't account for ("but also, never let a card exceed some reasonable maximum size"). `minmax(240px, 1fr)` sets a *floor* but the `1fr` max has no ceiling — so with very few items and a very wide container, cards can grow arbitrarily large.

**Fix — wrap the `fr` upper bound in a `min()` (or use an explicit `max-width` on the item), giving each track both a floor and a ceiling:**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, min(1fr, 380px)));
  gap: 16px;
}
```

`min(1fr, 380px)` means each flexible track still grows to fill leftover space (the `auto-fit` collapse-and-redistribute behavior is unchanged), but is capped at `380px` — once cards would otherwise exceed that width, the browser instead leaves the genuinely leftover space as blank margin on the grid, rather than continuing to stretch the cards.

**Alternative fix (simpler, slightly less precise), constrain the grid container itself instead of individual tracks:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  max-width: 1200px; /* caps how much total space auto-fit ever has to distribute */
  margin-inline: auto;
}
```
This works when a single global content-width cap is acceptable, but doesn't give per-card control the way `min(1fr, 380px)` does — worth choosing based on whether the actual requirement is "cap the grid's total width" or "cap each card's individual width," which are subtly different constraints that happen to look similar in the common case.

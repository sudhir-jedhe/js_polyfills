# Problem: Build an Equal-Height Card Row With Bottom-Aligned Actions

## Problem Statement

Build a row of feature cards (variable, unknown count) where: every card in the row is the same height as the tallest card, each card's "Learn more" link is always flush with the bottom of the card regardless of how much body text precedes it, and cards wrap onto additional rows on narrow viewports with consistent 20px gaps in both directions, staying equal-height only *within* each row (not across separate wrapped rows).

## Constraints

- Pure flexbox (no grid, no JS height-matching).
- Minimum card width of 240px; cards grow to fill extra space evenly within their row.
- "Learn more" must always sit at the card's bottom edge.

## Solution

```css
.card-row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch; /* default, explicit here — makes every card match the tallest one IN ITS OWN LINE */
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column; /* the card's own content stacks vertically */
  flex: 1 1 240px; /* grow/shrink from a 240px minimum-ish basis, wraps below that per flex-wrap */
  min-width: 0; /* prevents text content from forcing the card wider than its flex-basis intends */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}

.card__body {
  flex: 1 1 auto; /* absorbs the vertical slack inside the card, pushing the link down */
}

.card__link {
  flex: 0 0 auto;
  margin-top: 12px;
  align-self: flex-start; /* link doesn't stretch full-width, just sits at its natural size at the bottom */
}
```

```html
<div class="card-row">
  <div class="card">
    <div class="card__body"><h3>Feature One</h3><p>Short description.</p></div>
    <a class="card__link" href="#">Learn more →</a>
  </div>
  <div class="card">
    <div class="card__body"><h3>Feature Two</h3><p>A much longer description that wraps across several lines, pushing this card taller than its siblings would otherwise be.</p></div>
    <a class="card__link" href="#">Learn more →</a>
  </div>
  <div class="card">
    <div class="card__body"><h3>Feature Three</h3><p>Short description.</p></div>
    <a class="card__link" href="#">Learn more →</a>
  </div>
</div>
```

**Why "equal-height only within each wrapped row, not globally" happens automatically:** `align-items: stretch` operates per flex line, not across the whole (potentially multi-line) container — each line's items stretch to match the tallest item *on that line* only, which is exactly the spec'd requirement here (a card on row 2 has no reason to match a much taller card on row 1). Within each card, the same `flex-direction: column` + `flex: 1 1 auto` pattern used in the sticky-footer/holy-grail problems pushes `.card__link` to the bottom, since `.card__body` absorbs all of that card's own leftover vertical space once the card has been stretched to the row's tallest height.

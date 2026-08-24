# Scenario: `fixed` Tooltip Renders in the Wrong Place Inside an Animated Card

**Scenario:** A card component animates on hover using `transform: translateY(-4px)` for a subtle lift effect. Inside that card, a tooltip is implemented with `position: fixed`, intending to always render relative to the viewport near the cursor. But the tooltip appears in the wrong place — offset as if it were positioned relative to the card, not the page. Why, and how do you fix it?

**Diagnosis:**

`transform` on an ancestor — even a small, purely cosmetic one like a hover lift — creates a new containing block for any `fixed` (and `absolute`) descendants. The tooltip's `position: fixed` offsets are no longer resolving against the viewport at all; they're resolving against the card's own box, because the card (having a non-`none` `transform`) qualifies as the nearest ancestor that establishes a containing block for fixed positioning. This is true whether or not the transform is currently "active" — simply having `transform` set to a non-`none` value (including `transform: translateY(0)` at rest, if the property is present and just currently at an identity-ish value) is what matters, not whether it visually looks like it's doing anything at that instant. If the transform is applied conditionally (e.g. only on `:hover` via a CSS transition), the tooltip's positioning will actually change/jump the moment the hover transform kicks in, since the containing block itself changes mid-interaction.

**Fix — two options depending on what's actually needed:**

1. **If the tooltip should truly be positioned relative to the viewport** (e.g. it needs to visually escape the card, follow the cursor, or avoid being clipped by anything), render it via a portal outside the transformed ancestor, exactly as with modals and dropdowns. Once it's no longer a descendant of any transformed element, `position: fixed` resolves against the real viewport again.
2. **If the tooltip is actually meant to be positioned relative to the card** (e.g. "always appear above this specific element"), then the current behavior is arguably correct by accident — in that case, make the intent explicit by using `position: absolute` instead of `fixed`, anchored to a `position: relative` wrapper that does *not* also carry the hover transform (separate the transform-bearing element from the positioning-anchor element into two nested boxes, so the transform doesn't also hijack the containing block).

```css
/* Fix 2: split the "moves on hover" box from the "positioning anchor" box */
.card-anchor {
  position: relative; /* stable containing block for the tooltip — never transformed */
}
.card-lift {
  transform: translateY(0);
  transition: transform 0.15s ease;
}
.card-anchor:has(.card-lift:hover) .card-lift {
  transform: translateY(-4px);
}
.tooltip {
  position: absolute; /* anchored to .card-anchor, unaffected by .card-lift's transform */
  top: -8px;
  left: 50%;
}
```

**Takeaway:** any time a `position: fixed` (or `absolute`) element inside a component behaves as if it's anchored to a nearby box instead of the viewport/expected ancestor, the first thing to check is whether any ancestor between it and its intended containing block has `transform`, `filter`, `perspective`, `backdrop-filter`, or `will-change` naming one of those — animation and "polish" CSS is the most common unintentional source of this.

# Scenario: Building Equal-Height Columns Regardless of Content Length

**Scenario:** A row of three pricing cards needs to always render at the same height as each other — even though the middle card has more feature bullet points than the other two — and each card's internal "Sign up" button should always sit flush at the bottom of the card, regardless of how much text is above it. Historically this layout used floats and required a JS-based height-matching script (`equalizeHeights()`, measuring the tallest card and manually applying that height to the others) that reruns on window resize and is a recurring source of layout-thrash bug reports. How do you replace it with pure CSS?

**Approach — flexbox handles both problems natively, with zero JS:**

```css
.pricing-row {
  display: flex;
  align-items: stretch; /* default value, but explicit here for clarity — items stretch to the tallest one's height */
  gap: 24px;
}
.pricing-card {
  display: flex;
  flex-direction: column; /* stack the card's own content vertically */
  flex: 1 1 0; /* equal width regardless of content */
}
.pricing-card__body {
  flex: 1 1 auto; /* grows to consume any leftover vertical space inside the card */
}
.pricing-card__cta {
  flex: 0 0 auto; /* button stays pinned at its natural height, at the bottom, because __body absorbed the slack above it */
}
```

```html
<div class="pricing-row">
  <div class="pricing-card">
    <div class="pricing-card__body"><!-- title + short bullet list --></div>
    <button class="pricing-card__cta">Sign up</button>
  </div>
  <div class="pricing-card">
    <div class="pricing-card__body"><!-- title + LONGER bullet list --></div>
    <button class="pricing-card__cta">Sign up</button>
  </div>
  <div class="pricing-card">
    <div class="pricing-card__body"><!-- title + short bullet list --></div>
    <button class="pricing-card__cta">Sign up</button>
  </div>
</div>
```

**Why this works:** `.pricing-row`'s `align-items: stretch` (the flexbox default cross-axis behavior) makes every `.pricing-card` stretch to match the height of the tallest card in the row automatically, on every render and every resize, with no measurement/JS required — this is a first-class part of the flex layout algorithm, not a hack. Nested one level in, each card is *itself* a flex container in `column` direction, so its own `__body` (with `flex: 1 1 auto`) absorbs whatever vertical slack exists inside that specific card, which is what pushes the `__cta` button down to sit flush at the bottom regardless of how short the body content is. Deleting the old `equalizeHeights()` script and its resize-listener removes an entire class of layout-thrash and race-condition bugs (e.g. running before web fonts finish loading, producing a wrong measurement) in one change.

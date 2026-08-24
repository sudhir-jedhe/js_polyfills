# Scenario: The Same Component Needs a Different Layout Depending on Where It's Placed

**Scenario:** A `ProductCard` component is used in two places: a narrow (~280px) sidebar "recommended items" list, and a wide (~900px) main content grid. Design wants the card to show a compact, stacked layout in the sidebar, and a spacious, side-by-side image+details layout in the main grid — but it's the exact same component, reused via props, and the team wants to avoid maintaining two separate card components or duplicating markup. The viewport is the same in both cases (it's one page, both placements visible at once on a wide desktop screen), so a `@media` breakpoint can't distinguish between the two placements. How do you solve this?

**Diagnosis:**

This is precisely the scenario container queries were built for. A `@media` query only knows about the viewport — it has no way to know that the same component happens to be rendered inside a narrow box in one place and a wide box in another, on the very same page at the very same viewport width. What actually determines the card's ideal layout is the width of *its own container*, not the page's.

**Fix:**

```css
/* Wrap (or designate) each placement's containing element as a query container */
.sidebar-list,
.main-grid-item {
  container-type: inline-size;
}

/* The card component's own responsive rules — written once, react to the real container */
.product-card {
  display: flex;
  flex-direction: column; /* default: compact/stacked, appropriate for narrow containers */
  gap: 8px;
}

@container (min-width: 500px) {
  .product-card {
    flex-direction: row; /* switches to side-by-side once its OWN container has enough width */
    gap: 16px;
  }
  .product-card img {
    width: 200px;
    flex-shrink: 0;
  }
}
```

Because `.sidebar-list` is only ~280px wide, the `@container (min-width: 500px)` condition never matches there, and the card renders stacked. Because `.main-grid-item` is ~900px wide (or however wide an individual grid cell resolves to), the same condition matches there, and the identical component renders side-by-side — all from one shared component definition, with zero JavaScript measuring, zero prop drilling of a "variant" flag, and correctness that automatically holds even if the sidebar or grid's width changes later (e.g. a design tweak that widens the sidebar would make the card automatically switch to the side-by-side layout too, with no code change needed in the component itself).

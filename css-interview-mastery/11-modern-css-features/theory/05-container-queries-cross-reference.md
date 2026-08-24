# Container Queries — Brief Cross-Reference

Container queries let an element's styling respond to the size of its *containing element* rather than the viewport — full depth (syntax, `container-type`, `container-name`, `@container` query ranges, comparison with media queries, worked examples) is covered in `06-responsive-design-media-queries`. This file exists only to note how container queries interact with the other modern features in this topic.

## The one-line summary

```css
.sidebar {
  container-type: inline-size; /* opt this element in as a query container */
  container-name: sidebar;
}

@container sidebar (min-width: 300px) {
  .widget { display: flex; } /* applies when .sidebar itself is ≥300px wide, regardless of viewport width */
}
```

## How it composes with features covered in this topic

```css
/* Native nesting + container queries together */
.widget {
  display: block;

  @container sidebar (min-width: 300px) {
    display: flex;
    gap: 1rem;
  }
}
```

```css
/* :has() gating which elements become query containers */
.panel:has(.panel__chart) {
  container-type: inline-size;
}
```

```css
/* subgrid inside a container-queried component — a card's internal subgrid rows
   can be combined with container queries that change its grid-template-columns
   at different container widths */
.card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card { grid-template-columns: subgrid; }
}
```

For everything else about container queries — including the important distinction between `inline-size` and `size` containment, why a container can't query its own dimensions via a query targeting itself, and the full range of `@container` syntax — see the dedicated responsive design topic.

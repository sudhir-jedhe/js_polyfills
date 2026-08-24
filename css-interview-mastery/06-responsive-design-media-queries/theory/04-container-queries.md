# Container Queries (`@container`)

`@media` queries respond to the **viewport's** size. `@container` queries respond to the size of a specific **ancestor container element** instead — letting a component adapt to the space it's actually been given, regardless of where it's placed on the page (a wide main column vs. a narrow sidebar, for instance). This is the missing piece that true "component-driven" responsive design needed, since a component's ideal breakpoints usually depend on its *own* available width, not the page's.

## Setting up a query container

An element must opt in to being a query container via `container-type` before any descendant can query its size:

```css
.card-wrapper {
  container-type: inline-size; /* query based on this element's inline (width) dimension */
  container-name: card;        /* optional — lets descendants target this container specifically by name */
}
```

- `container-type: inline-size` — the most common choice; enables querying the container's width (inline dimension in the writing mode).
- `container-type: size` — enables querying both dimensions (width and height), but comes with a real cost: it forces the container into strict size containment, meaning the container's own size can no longer depend on its content's size (its children can't influence its size, only the reverse) — this rules out common patterns like "grow to fit content."
- `container-type: normal` (default) — not a query container at all.

## Querying against it

```css
.card {
  display: block;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 200px 1fr;
    padding: 24px;
  }
}
```

`.card`'s layout now depends entirely on how much space its nearest `container-name: card` ancestor actually has — the exact same `.card` component renders as a stacked layout in a 300px sidebar and as a two-column layout in an 800px main content area, with zero JavaScript and zero awareness of the viewport size at all.

## `@container` vs `@media` — the fundamental distinction

| | `@media` | `@container` |
|---|---|---|
| Responds to | Viewport size (or other environment features) | A specific ancestor container's size |
| Component reusability | A component's internal breakpoints depend on the whole page's viewport, which may not correlate with the component's actual available space | The same component adapts correctly no matter where it's placed, since it queries its real container |
| Requires opt-in on an ancestor | No | Yes — an ancestor needs `container-type` set explicitly |
| Can query non-size features (color scheme, print, etc.) | Yes | No (as of Container Queries Level 1 — `@container` is size/style focused; there's a separate, newer `container-type: style`/`@container style()` query for custom-property-based conditions) |

## The classic interview framing

"A sidebar widget and a main-content widget are the exact same React/Vue component, but need to render differently depending on how much horizontal space they have — how do you do this without JavaScript-measured breakpoints or duplicating the component?" is a textbook container-queries prompt. The answer is: wrap the component (or use a wrapper the design system already provides) with `container-type: inline-size`, then write the component's own internal responsive rules with `@container` instead of `@media`, so the component's presentation is driven by its own box, not the page's.

## A note on `container-type: size` and layout containment

Since `container-type: size` requires the container to have a definite size *before* its children are considered (strict containment), you generally need to give such a container an explicit height (or rely on it being sized by its own parent's layout, e.g. a grid/flex item), otherwise its content may collapse to zero height. `inline-size` avoids this problem for the (far more common) width-based responsive case, since only the width axis is contained, and height can still be driven by content as normal.

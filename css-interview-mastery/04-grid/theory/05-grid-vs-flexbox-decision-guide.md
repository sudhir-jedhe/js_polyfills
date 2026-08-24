# Grid vs. Flexbox — Full Comparison

Both are modern CSS layout models, and they're complementary, not competing — most real UIs use grid for the outer page/component shell and flexbox for the one-dimensional pieces living inside it.

## Core distinction

| | Flexbox | Grid |
|---|---|---|
| Dimensionality | One-dimensional (a single row OR column at a time) | Two-dimensional (rows AND columns together) |
| Layout driven by | Content size + grow/shrink factors on items | Explicit track definitions on the container |
| Item placement | Sequential, along one axis (with `order` for cosmetic reflow) | Can be explicit (`grid-row`/`grid-column`/named areas) or auto-placed |
| Alignment across a "grid" of rows and columns | Not native — requires nested flex containers, which don't align with each other | Native — all tracks/items align to the same shared grid lines |
| Best for | Toolbars, nav bars, one-dimensional item distribution, component internals | Page shells, dashboards, photo/card galleries, anything needing 2D alignment |
| Responsive reflow mechanism | `flex-wrap`, `flex-basis` changes, media queries on `flex-direction`/`order` | `repeat(auto-fit/auto-fill, minmax(...))`, redefining `grid-template-areas` |
| Content-driven sizing | Very natural — items can size to content by default | Requires deliberate `auto`/`minmax()`/`fit-content()` track sizing |
| Gaps | `gap` (modern, well-supported) | `gap` (same property, same behavior) |
| Named regions | Not available | `grid-template-areas` |
| Subgrid support | N/A (concept doesn't apply to one dimension the same way) | `grid-template-columns/rows: subgrid` |

## Decision heuristic

Ask: **"does this layout need to align things across two dimensions at once?"**
- If yes (a dashboard where column widths must line up across multiple rows, a page shell with header/sidebar/main/footer) → **grid**.
- If no (a single row of nav items, a button group, centering one thing) → **flexbox**, since it requires less setup and its content-driven sizing behavior is usually exactly what you want for a single axis of items.

## They compose

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas: "nav main";
}
.page__nav {
  grid-area: nav;
  display: flex;         /* nested flex container for the nav's own internal one-dimensional layout */
  flex-direction: column;
  gap: 8px;
}
```
This pattern — grid for the outer shell, flex for inner components — is how the overwhelming majority of production layouts are actually built; treating grid-vs-flexbox as an either/or choice for an entire page is a common beginner mistake.

# CSS Grid

CSS Grid is a two-dimensional layout model — unlike flexbox, it lets you define rows *and* columns together and place items into that structure explicitly, which makes it the right tool for page-level shells, dashboards, and any layout where alignment needs to hold across both axes at once. This topic covers track definition (`grid-template-columns`/`rows`, the `fr` unit), named-area layout (`grid-template-areas`), the implicit vs. explicit grid distinction, and the single most misunderstood pair of keywords in all of CSS Grid — `auto-fill` vs. `auto-fit` — covered deeply with worked, numeric output-based examples, because this is where interview candidates consistently get tripped up.

## Folder structure

- **`theory/`** — track sizing and the `fr` unit, `grid-template-areas`, implicit vs. explicit grid, `auto-fill` vs. `auto-fit` in depth, a full grid-vs-flexbox comparison, and subgrid.
- **`snippets/`** — 6 runnable examples: basic columns, `fr`/`minmax()`, named areas, `auto-fill` cards, `auto-fit` cards, and subgrid.
- **`output-based/`** — 6 "what track sizes render?" questions, including a full worked `auto-fill` vs. `auto-fit` numeric comparison.
- **`scenarios/`** — 4 real-world layouts: a media-query-free responsive gallery, a named-area dashboard, an `auto-fit` cards-too-wide bug, and migrating a float-based layout to grid.
- **`interview-qa/`** — 9 Q&A pairs across 3 themed files: fundamentals, auto-fill/auto-fit/sizing, and grid-vs-flexbox/advanced.
- **`problems/`** — 3 hands-on challenges: a responsive photo gallery, a dashboard built with `grid-template-areas`, and a holy-grail layout with grid.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- `grid-template-columns`/`grid-template-rows`, the `fr` unit, and `minmax()`
- `grid-template-areas` for named-region layout
- Implicit vs. explicit grid, `grid-auto-rows`/`grid-auto-columns`, `grid-auto-flow` (including `dense`)
- `repeat(auto-fill, ...)` vs. `repeat(auto-fit, ...)` — precisely how each computes track count and what happens to empty tracks, worked through with real container-width numbers
- Grid vs. flexbox: when each is the right tool, with a full side-by-side comparison table (also referenced from `03-flexbox/theory`)
- Subgrid, for aligning a nested grid's tracks to its parent's grid lines

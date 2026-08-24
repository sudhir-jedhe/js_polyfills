# When to Reach for Flexbox

Flexbox is a **one-dimensional** layout model — it's designed to distribute and align items along a single axis (a row, or a column), and while it *can* wrap into multiple lines, it doesn't let you control alignment across both dimensions simultaneously the way a two-dimensional grid does (each flex line sizes somewhat independently; there's no native way to make items in different lines share column widths without extra work).

## Good flexbox use cases

- Navigation bars, toolbars, button groups (single row/column of items)
- Centering content in either or both dimensions (`justify-content` + `align-items: center`)
- Distributing unknown-count, dynamically-sized items along one axis (a tag list, a set of form controls)
- Holy-grail-style layouts where the "columns" are really just one row that needs to grow/shrink flexibly
- Component internals: an icon + label pair, a card's header row (icon, title, action button spread apart)

## When grid is the better fit instead

- Anything that's genuinely two-dimensional: a photo gallery, a dashboard, a page-level layout with header/sidebar/main/footer that needs alignment across *both* rows and columns simultaneously
- Layouts defined by named regions (`grid-template-areas`) that are easier to reason about as a whole shape than as nested flex containers
- Precise, explicit track sizing (e.g. "sidebar is exactly 240px, content is the rest") without needing `flex: 0 0 240px` workarounds

## Quick decision table

| Need | Reach for |
|---|---|
| Items in a single row or column, dynamic count/size | Flexbox |
| A true grid — rows AND columns aligning together | Grid |
| Centering something | Either — flexbox is slightly more common for this |
| Equal-height cards regardless of content length | Flexbox (`align-items: stretch`, default) or Grid (rows implicitly equal-height) |
| A responsive card layout that reflows column count based on available width | Grid (`repeat(auto-fit, minmax(...))`) — genuinely simpler than flex-wrap + basis math for this |
| Page-level app shell layout (header/sidebar/content/footer) | Grid, usually via `grid-template-areas` |

The full flexbox-vs-grid comparison table, with more nuance, lives in `04-grid/theory/05-grid-vs-flexbox-decision-guide.md` — in practice, most real UIs use **both**: grid for the page-level shell, flexbox for the one-dimensional components living inside each grid area.

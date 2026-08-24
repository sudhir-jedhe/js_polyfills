# Scenario: A Float-Based Layout Where the Container Collapses to Zero Height

**Scenario:** A legacy product listing page arranges product cards with `float: left` (predates flexbox/grid adoption in this codebase) inside a `.product-list` container. The container has a visible background and border meant to frame the whole row, but it renders as a 0-height sliver — the cards visually spill out below/past it, with the border only wrapping around empty space where the container "thinks" it has no content.

**Diagnosis:** Classic float-collapse. Floated elements are removed from normal flow, and a parent's `auto` height calculation, by spec, does **not** include the height of floated-only children — as far as `.product-list`'s own height is concerned, it looks empty, even though the floats are visually rendered inside its horizontal bounds.

**Fix — modern approach, `display: flow-root`:**
```css
.product-list {
  display: flow-root; /* forces full containment of floated descendants' height, zero other side effects */
}
```

**Fix — if you need to support genuinely ancient browsers without `flow-root` support, the "clearfix" pseudo-element trick:**
```css
.product-list::after {
  content: "";
  display: block;
  clear: both;
}
```
This inserts an invisible block-level box after the floats that's forced to clear past them (`clear: both`), which — because it's now a real block box inside `.product-list` — forces the container to grow tall enough to include it, and therefore the floats above it too.

**Longer-term recommendation:** since this codebase predates flexbox, the actual highest-value fix (beyond patching the immediate bug) is migrating `.product-list` off floats entirely:
```css
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.product-card {
  /* float: left removed entirely — flex items never have this containment problem, by definition of the flex formatting context */
  flex: 1 1 240px;
}
```
Flex (and grid) containers always include their items' size in their own auto height/size calculation, so the entire class of "container collapses because its children are floated/out-of-flow" bugs simply doesn't exist once the layout is expressed with flex or grid.

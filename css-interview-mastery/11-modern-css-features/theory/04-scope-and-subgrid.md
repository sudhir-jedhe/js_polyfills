# `@scope` and `subgrid`

Two unrelated features that both solve long-standing structural limitations natively.

## `@scope` — donut-scoped styling without a build tool

`@scope` limits a set of rules to apply only within a specific DOM subtree (and optionally, only *until* a specified boundary is reached — the "donut scope").

```css
@scope (.card) {
  :scope { border: 1px solid #e5e7eb; }  /* :scope refers to .card itself */
  h3 { font-size: 1.1rem; }               /* only h3s INSIDE .card */
  p { color: #6b7280; }
}
```

This `h3` rule will not leak out and style headings elsewhere on the page — it's scoped strictly to descendants of `.card`. Compare to a normal `.card h3 { }` selector, which does the same basic containment but with more verbose repetition across many rules and without a lower-priority guarantee.

### The "donut scope" — excluding nested subtrees

`@scope` can also specify a *lower bound*, excluding a nested subtree from the scope entirely — useful for a component that contains other, independently-styled components:

```css
@scope (.card) to (.card__widget) {
  p { color: #6b7280; } /* applies to <p> inside .card, EXCEPT inside any nested .card__widget */
}
```

This means an embedded `.card__widget` (e.g. a third-party embed, or a differently-themed nested component) is protected from the outer `.card` scope's styling — something that plain descendant selectors have no native way to express (you'd need `.card p:not(.card__widget p)`, which doesn't actually work as a selector for arbitrary nesting depth).

### `@scope` vs CSS Modules / BEM for isolation

| Aspect | `@scope` | CSS Modules | BEM |
|---|---|---|---|
| Requires build tooling | No | Yes | No |
| Isolation mechanism | DOM subtree boundary | Generated unique class names | Naming convention (no enforcement) |
| Can exclude nested subtrees ("donut scope") | Yes | No (not applicable — isolation is per-file, not per-DOM-position) | No |
| Specificity impact | `:scope` and the scoping selector don't add specificity to nested rules the way normal ancestor selectors would | N/A — no ancestor selectors involved at all | Flat by convention, not enforced |

## `subgrid` — aligning nested grids to a parent's tracks

Without `subgrid`, a grid nested inside a grid item defines its own independent set of tracks — its columns/rows have no relationship to the parent grid's tracks, making it hard to align nested content (e.g. card headers/bodies/footers across a row of cards) to a shared baseline.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* inherits the ROW tracks from .gallery, not its own independent rows */
}
```

With `grid-template-rows: subgrid`, each `.card`'s internal rows (title/body/footer) align to the *same* row tracks as every other card in the grid — so if one card's title wraps to two lines, every card's title row grows to match, and the bodies/footers all still line up horizontally across the row. Before `subgrid`, achieving this required either fixed heights (fragile) or JavaScript measuring each card and syncing heights manually.

`subgrid` can be applied to `grid-template-columns`, `grid-template-rows`, or both, and only works when the subgridded element is itself a grid item of a grid ancestor (direct parent-child grid relationship, or any depth as long as each intermediate level also opts into `subgrid` for the relevant axis).

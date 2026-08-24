# Interview Q&A — Grid Fundamentals

**Q: What does `display: grid` do, and how is that different from `display: flex`?**
It turns the element into a two-dimensional grid container, letting you define both row and column tracks together via `grid-template-columns`/`grid-template-rows`, and place items into that structure (explicitly or via auto-placement). Flexbox, by contrast, only ever lays items out along a single axis at a time.

**Q: What is the `fr` unit, and how does it differ from a percentage?**
`fr` distributes the container's *remaining* space (after all fixed and content-based tracks are sized) proportionally among the tracks using it — conceptually like `flex-grow` for grid tracks. Unlike a percentage, which is always relative to the *total* container size, `fr` only ever divides up whatever space is left over once non-`fr` tracks have already claimed their share.

**Q: How do you make a grid item span multiple columns or rows?**
Via `grid-column`/`grid-row` with a `span` value (e.g. `grid-column: span 2;`), explicit line numbers (`grid-column: 1 / 3;`), or by repeating a named area across multiple cells in `grid-template-areas` and referencing it with `grid-area`.

**Q: What's the difference between the explicit and implicit grid?**
The explicit grid is whatever tracks you directly define via `grid-template-columns`/`rows`/`areas`. The implicit grid consists of tracks the browser auto-generates when items are placed outside those explicit tracks (more items than explicit cells, or items explicitly positioned beyond them) — sized by `grid-auto-rows`/`grid-auto-columns`.

**Q: What does `grid-auto-flow: dense` do, and what's the tradeoff?**
It backfills earlier gaps in the grid left by differently-sized items, potentially placing later items visually earlier than their DOM order would normally put them, to minimize empty cells. The tradeoff is the same as flexbox's `order`: visual order can diverge from DOM/source order, which affects screen-reader and keyboard-navigation order — a real accessibility consideration, not just a cosmetic one.

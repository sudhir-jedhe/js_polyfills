# Output: Invalid (Non-Rectangular) `grid-template-areas`

```css
.layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "header header header"
    "nav    main   main"
    "nav    extra  main";
}
.extra { grid-area: extra; }
```

**Question:** Is this `grid-template-areas` declaration valid? What renders?

**Answer:** It's **invalid** — the entire `grid-template-areas` declaration is dropped by the browser, and every item falls back to normal auto-placement into the explicit/implicit grid instead.

**Why:** every named area's occupied cells must form a single, unbroken **rectangle**. Here, `main` occupies cell (row 2, col 3), (row 2, col 2)... wait — trace it precisely: row 2 is `nav main main` (main = columns 2–3), row 3 is `nav extra main` (main = column 3 only). `main`'s cells are (row2,col2), (row2,col3), (row3,col3) — an L-shape, not a rectangle, because (row3,col2) belongs to `extra` instead of `main`. Any named region whose cells don't form a perfect rectangle makes the whole `grid-template-areas` value invalid per the CSS Grid specification — not just that one region — so the browser discards the entire declaration and every grid item reverts to default auto-placement (filling row by row through the explicit/implicit grid, ignoring any `grid-area` assignments that referenced the now-nonexistent named areas).

**Fixed version** (splitting `main` into two distinctly-named, individually-rectangular regions):
```css
grid-template-areas:
  "header header header"
  "nav    main-a main-b"
  "nav    extra  main-b";
```
Now `main-b` is a clean 2-row-tall rectangle in column 3, and `main-a`/`extra` are each single, valid rectangular cells.

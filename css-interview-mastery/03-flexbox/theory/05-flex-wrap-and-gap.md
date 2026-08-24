# `flex-wrap` and `gap`

## `flex-wrap`

By default (`nowrap`), flex items are forced onto a single line and will shrink (per `flex-shrink`) to fit, even below their content's natural size if `min-width` doesn't prevent it — this is why unconstrained flex rows can visually crush their content when the viewport gets narrow.

```css
.container { flex-wrap: wrap; }
```
With `wrap`, once items can no longer shrink further (they've hit their basis/min-size, or `flex-shrink: 0` prevents shrinking at all) or simply because the container chooses to respect their basis, additional items flow onto new flex lines instead of being crushed. Each line is then laid out independently along the main axis (its own `justify-content` application), while `align-content` controls how the *set of lines* is distributed along the cross axis.

## `gap` with multi-line wrapped flex

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* applies BOTH between items on the same line, AND between wrapped lines */
}
```
`gap` inserted between wrapped lines is genuinely new space, not something `justify-content`/`align-content` had a good native answer for pre-`gap` — before `gap` was supported on flexbox, spacing between wrapped lines required margin tricks with negative-margin containers to avoid doubled edge spacing.

## The `justify-content: space-between` + wrap trap

A common bug: `justify-content: space-between` on a wrapped container distributes leftover space *per line*, independently — so if the last line has fewer items than a full line, those items spread out to the same start/end edges as a full line, visually misaligning with the grid-like appearance of the lines above it (e.g. 2 items alone on the last line of a 3-per-line grid end up far apart instead of aligned under the first two columns).

```css
/* BUGGY: last (partial) line's items spread to the full container width, breaking column alignment */
.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
```
```css
/* FIX: use gap instead, with fixed/flexible item widths — items on every line honor the same spacing rule, partial or not */
.grid { display: flex; flex-wrap: wrap; gap: 16px; }
.item { flex: 0 0 calc((100% - 2 * 16px) / 3); } /* fixed 3-per-row width, gap-aware */
```
`gap` doesn't try to "spread" a partial line — it just inserts consistent spacing between whatever items exist, so column alignment holds regardless of how many items land on the last line. This is also exactly the kind of problem CSS Grid's explicit column tracks solve even more directly (see `04-grid`).

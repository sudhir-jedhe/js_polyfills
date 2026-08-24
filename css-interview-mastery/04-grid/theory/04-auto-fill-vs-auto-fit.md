# `auto-fill` vs. `auto-fit` — the Classic Grid Interview Question

Both keywords are used as the repetition count inside `repeat()`, replacing a fixed number, to create a responsive number of tracks without a single media query:

```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
grid-template-columns: repeat(auto-fit,  minmax(200px, 1fr));
```

Both compute the **same number of tracks**: as many as can fit in the container without overflowing, based on the `minmax()` minimum (`200px` here) plus any `gap`. The difference is entirely about what happens to tracks that don't end up holding a grid item.

## `auto-fill`: empty tracks are kept, and stay in the layout

If there are fewer items than tracks that could fit, `auto-fill` still generates all the tracks the container has room for — the "extra" ones just render empty, taking up their share of space per the `minmax()`/`fr` sizing, visually leaving blank column-width gaps after the real content.

## `auto-fit`: empty tracks are collapsed to zero width

`auto-fit` behaves identically to `auto-fill` for track-count computation, but then **collapses any track that ends up with no item in it down to `0px`** (and its associated gutters collapse too). Because `fr` distributes remaining space only among tracks that still exist post-collapse, the tracks that *do* have content stretch to consume the space the collapsed tracks would have occupied — visually, items grow to fill the row instead of leaving blank space.

## Worked numeric example

Container is `900px` wide, `gap: 0`, `grid-template-columns: repeat(auto-fill/auto-fit, minmax(200px, 1fr))`, and there are **3** grid items.

1. Compute how many tracks fit: `floor(900 / 200) = 4` tracks (since `4 × 200 = 800 ≤ 900`, but `5 × 200 = 1000 > 900`). This step is identical for both keywords.
2. **`auto-fill`:** all 4 tracks are created. Extra space `900 - 800 = 100px` is distributed evenly across all 4 `fr` tracks (`+25px` each) → each track is `225px`. The 3 real items render at `225px` each (`675px` total), and the 4th track — empty — still occupies `225px` of blank space at the end of the row.
3. **`auto-fit`:** the same 4 tracks are computed for placement, but the 1 empty track (4th) then **collapses to `0px`**. Only 3 non-collapsed `fr` tracks remain to share the space: extra space becomes `900 - 3×200 = 300px`, split evenly across 3 tracks (`+100px` each) → each track is `300px`. All 3 items render at `300px` each, filling the full `900px` row with no blank space.

| | `auto-fill` | `auto-fit` |
|---|---|---|
| Tracks created | 4 (all that fit) | 4 (computed the same way)... |
| Empty tracks | Kept, sized per `minmax`/`fr` | ...then collapsed to `0px` |
| Item width (3 items, 900px container, 200px min) | 225px each, 225px blank space after | 300px each, no blank space |
| Visual result | Items stay a fixed-ish size; gaps appear if there are fewer items than fit | Items stretch to fill the row when there are fewer items than fit |

## When to use which

- **`auto-fit`** is almost always what you want for a responsive card/gallery grid where items should stretch to fill unused space when there aren't enough of them to fill a row — the common "responsive card grid" recipe.
- **`auto-fill`** is correct when you deliberately want a consistent track *size* regardless of item count — e.g. a calendar-like grid, or a design where blank trailing space is preferable to items stretching wider than intended.

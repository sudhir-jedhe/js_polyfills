# Output: `inline` vs. `inline-block` vs. `block` Sizing

```css
.tag { width: 150px; height: 40px; margin: 10px; padding: 10px; background: lightblue; }
```

**Question:** For each of `display: inline`, `display: inline-block`, and `display: block` applied to `.tag`, what actually takes effect: the `width`/`height`, the horizontal margin/padding, and the vertical margin/padding?

**Answer:**

| Property | `inline` | `inline-block` | `block` |
|---|---|---|---|
| `width` / `height` | **Ignored entirely** — box sizes to content | Respected fully | Respected fully |
| Horizontal margin/padding | Respected — pushes surrounding inline content away | Respected fully | Respected fully |
| Vertical margin | **Has no layout effect** — doesn't push other lines apart | Respected fully | Respected fully (and can collapse with siblings/parent) |
| Vertical padding | Painted (background/border extend), but can visually overlap adjacent lines rather than reserving space for it | Respected fully, reserves space | Respected fully, reserves space |
| Line breaks | None — flows inline with surrounding text | None — flows inline, but is a full box | Always starts on a new line, takes full available width |

**Why:** `inline` boxes participate in line layout the same way text does — line boxes only reserve horizontal space for inline content and don't grow vertically to accommodate an inline element's declared height or vertical margin/padding, which is precisely why `inline-block` exists: it keeps the "flows inline, doesn't force a line break" behavior while switching the box's *own* sizing rules to the full block-style model (width/height/all four margins respected).

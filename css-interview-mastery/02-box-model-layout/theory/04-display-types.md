# Display Types: `block`, `inline`, `inline-block`, `none`

`display` determines both how an element generates boxes and how it participates in layout relative to its siblings.

## `block`

- Starts on a new line; takes up the full available width of its container by default.
- Respects `width`, `height`, and all four margins (vertical margins can collapse — see the margin-collapsing file).
- Examples of default block elements: `<div>`, `<p>`, `<h1>`–`<h6>`, `<section>`, `<ul>`/`<li>`.

## `inline`

- Flows within the surrounding text, doesn't force a line break; only takes up as much width as its content needs.
- **Ignores `width` and `height` entirely** — setting them has no effect.
- Only **horizontal** margin/padding visually push neighboring inline content away; **vertical** margin is accepted but has no effect on layout (it doesn't push other lines away), and vertical padding/border is painted but can visually overlap surrounding lines rather than pushing them apart.
- Examples: `<span>`, `<a>`, `<strong>`, `<em>`.

## `inline-block`

- Flows inline with surrounding content like `inline` (sits in the text flow, doesn't force a line break)...
- ...but **respects `width`, `height`, and all four margins/padding fully**, like `block` — the best of both, which is why it was the pre-flexbox tool of choice for things like horizontally-arranged nav items or form controls that still need explicit sizing.
- **Gotcha:** whitespace (a line break or space) in the HTML *between* adjacent `inline-block` elements renders as a visible gap (about the width of a space character), because it's literally still inline content. Fixed by removing the whitespace in markup, setting `font-size: 0` on the parent, or — in practice today — just using flexbox instead, which doesn't have this issue.

## `none`

- Removes the element from the render tree entirely — it takes up **no space**, as if it didn't exist in the document at all.
- Different from `visibility: hidden`, which hides the element visually but **still reserves its layout space**.

| | `display: none` | `visibility: hidden` |
|---|---|---|
| Takes up layout space | No | Yes |
| Accessible to screen readers | No | No |
| Can be transitioned/animated | No (can't animate to/from `none` directly pre-`@starting-style`) | Yes (`visibility` is technically not smoothly animatable either, but jumps at 50%, unlike `display`, and is commonly paired with `opacity` for fades) |
| Click/hover events fire | No | No |

## A note on `display: flow-root`

`flow-root` creates a block-level box that establishes a brand-new block formatting context, with no other side effects (no clipping, no scrollbars, unlike the older `overflow: hidden` trick). Its main real-world use is as the modern, purpose-built fix for two classic layout bugs: containing floated children (replacing the old "clearfix" hack) and preventing unwanted margin collapsing between a parent and its children.

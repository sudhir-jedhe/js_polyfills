# Logical Properties and `aspect-ratio`

## Logical properties: direction-relative instead of side-relative

Traditional CSS box-model properties (`margin-left`, `padding-top`, `width`) are **physical** — tied to a literal screen direction regardless of the document's writing mode. Logical properties are **flow-relative** — tied to the *text direction and writing mode* instead, so the same CSS automatically adapts when the writing mode changes (most commonly LTR vs RTL).

```css
/* Physical — hardcoded to left/right, breaks in RTL layouts */
.card {
  margin-left: 1rem;
  padding-right: 1.5rem;
  border-left: 3px solid #2563eb;
}

/* Logical — adapts automatically based on the element's writing direction */
.card {
  margin-inline-start: 1rem;
  padding-inline-end: 1.5rem;
  border-inline-start: 3px solid #2563eb;
}
```

In an LTR document, `margin-inline-start` behaves exactly like `margin-left`. In an RTL document (`dir="rtl"`, or `direction: rtl`), it automatically behaves like `margin-right` instead — no separate RTL stylesheet or `[dir="rtl"]` override rule needed.

## The `inline` / `block` axis mapping

| Logical term | LTR horizontal writing mode maps to | Meaning |
|---|---|---|
| `inline` axis | Horizontal (left ↔ right) | The direction text flows within a line |
| `block` axis | Vertical (top ↔ bottom) | The direction blocks stack |
| `-inline-start` | `left` | Start of the inline axis (leading edge) |
| `-inline-end` | `right` | End of the inline axis (trailing edge) |
| `-block-start` | `top` | Start of the block axis |
| `-block-end` | `bottom` | End of the block axis |

```css
.box {
  margin-block: 1rem 2rem;      /* margin-top: 1rem; margin-bottom: 2rem; (in horizontal-tb writing mode) */
  padding-inline: 1.5rem;        /* padding-left AND padding-right, shorthand for both */
  inset-inline-start: 0;         /* like "left: 0" in LTR, "right: 0" in RTL */
}
```

## Why this matters for i18n/RTL beyond just Arabic/Hebrew

Logical properties aren't only about RTL languages — they also correctly handle vertical writing modes (used in some Japanese/Chinese typographic contexts, `writing-mode: vertical-rl`), where "inline" and "block" axes rotate entirely. A component authored with logical properties from the start needs zero additional CSS to support both RTL and vertical writing modes; a component authored with physical properties needs a parallel override stylesheet for every writing mode it must support, which is easy to let drift out of sync as the base component evolves.

## `aspect-ratio`

Sets a preferred width-to-height ratio for a box, so height can be derived from width (or vice versa) without JavaScript or the old "padding-top percentage hack."

```css
.video-embed {
  aspect-ratio: 16 / 9;
  width: 100%;
  /* height is now automatically computed to maintain 16:9 as width changes */
}

.avatar {
  aspect-ratio: 1;      /* shorthand for 1/1, a perfect square/circle base */
  width: 48px;
  border-radius: 50%;
}
```

Before `aspect-ratio`, maintaining a ratio on a responsive box required the "padding-top percentage trick" (`padding-top: 56.25%` for 16:9, since percentage padding is calculated relative to the containing block's *width* even for the vertical axis) — a well-known but unintuitive hack. `aspect-ratio` replaces it with a direct, self-explanatory declaration. If both `width` and `height` are explicitly set on the same element, `aspect-ratio` is ignored in favor of the explicit values (it only fills in a *missing* dimension, or constrains intrinsic sizing).

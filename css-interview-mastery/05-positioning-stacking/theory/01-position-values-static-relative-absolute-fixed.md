# The `position` Values: `static`, `relative`, `absolute`, `fixed`

`position` controls two things at once: whether the element is taken out of normal document flow, and which box its `top`/`right`/`bottom`/`left`/`inset` offsets are calculated against (its **containing block**). Getting the containing block right is the whole game — most positioning bugs are "my offsets are relative to the wrong box."

## `static` (the default)

Every element starts as `static`. It flows normally in the document, and `top`/`right`/`bottom`/`left`/`z-index` have **no effect** on it at all — not "no visible effect," they are literally ignored by the spec.

```css
.box {
  position: static;
  top: 50px; /* completely ignored */
}
```

## `relative`

The element still participates in normal flow — it occupies its original space, and other elements lay out as if it weren't offset. Then, *after* layout, it is shifted visually by its offsets, relative to where it would otherwise have been. It does not affect surrounding elements' layout at all, even though it may now overlap them.

```css
.box {
  position: relative;
  top: 10px;
  left: 10px; /* shifted 10px down and right from its normal position; space it left behind is still reserved */
}
```

Two critical side effects of `relative` that show up constantly in interviews:

1. It **creates a new containing block** for any `absolute`-positioned descendants (see below), even if you never set an offset on it. `position: relative;` alone, with no `top`/`left`, is a very common "just make this the anchor point" pattern.
2. It **creates a new stacking context** *only if* combined with a `z-index` value other than `auto` (covered in the stacking-context theory file).

## `absolute`

The element is removed from normal flow entirely — it no longer takes up space, and surrounding elements lay out as if it doesn't exist. It's positioned relative to its **nearest positioned ancestor** (any ancestor whose `position` is not `static`) — or, if there is none, relative to the **initial containing block** (effectively the viewport, at the root of the document, scrolling with the page).

```css
.parent {
  position: relative; /* now the anchor for .child */
}
.child {
  position: absolute;
  top: 0;
  right: 0; /* pinned to the top-right corner of .parent's padding box */
}
```

If `.parent` had been left as `static`, `.child` would instead position itself relative to the initial containing block (near the `<html>` root) — a classic bug where an absolutely-positioned element "jumps" to the top of the page instead of anchoring to its intended wrapper.

## `fixed`

Similar to `absolute` (removed from flow, positioned via offsets), but its containing block is normally the **viewport** — so `fixed` elements stay in place visually as the page scrolls. The important exception, and a frequent interview gotcha: if any ancestor has a `transform`, `filter`, `perspective`, `backdrop-filter`, or `will-change` set to one of those properties, that ancestor becomes the containing block for the `fixed` descendant instead of the viewport — and the "fixed" element now scrolls with that ancestor, which usually isn't what anyone intended.

```css
.card {
  transform: translateZ(0); /* innocuous-looking perf hack... */
}
.card .tooltip {
  position: fixed; /* ...but this is now fixed *to .card*, not the viewport */
  top: 0;
  right: 0;
}
```

## Comparison table

| Value | In normal flow? | Space reserved? | Containing block |
|---|---|---|---|
| `static` | Yes | Yes | N/A — offsets ignored |
| `relative` | Yes | Yes (original spot) | N/A for itself; becomes anchor for `absolute` descendants |
| `absolute` | No | No | Nearest positioned ancestor, else initial containing block |
| `fixed` | No | No | Viewport, unless an ancestor has `transform`/`filter`/`perspective`/`will-change`/`backdrop-filter` |
| `sticky` | Yes (until threshold) | Yes | Nearest scrolling ancestor + flow position (see next file) |

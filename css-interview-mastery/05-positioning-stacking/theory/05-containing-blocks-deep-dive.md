# Containing Blocks: The Full Algorithm

The **containing block** is the box against which a positioned element's size and offset properties (`top`/`right`/`bottom`/`left`/`inset`, and percentage `width`/`height`) are calculated. It's a distinct concept from a stacking context — an element can establish a containing block without establishing a stacking context, and vice versa — but the two often get created by the same trigger properties (`transform` being the prime example), which is why they're easy to conflate.

## How the containing block is determined, by `position` value

- **`static` / `relative`**: the containing block is the content box of the nearest **block-level ancestor** (its normal parent, in effect) — this is essentially just "normal layout," so it rarely comes up as "the containing block" in conversation, but it is one.
- **`absolute`**: the containing block is the **padding box** of the nearest ancestor whose `position` is not `static` (i.e. `relative`, `absolute`, `fixed`, or `sticky`) **or** whose `transform`, `filter`, `perspective`, `backdrop-filter`, or `will-change` (naming one of those properties) is set to something other than its initial value. If no such ancestor exists, the containing block is the **initial containing block** (a box the size of the viewport, anchored at the document origin).
- **`fixed`**: the containing block is the **viewport** by default. But identically to the `absolute` case, if any ancestor has `transform`/`filter`/`perspective`/`backdrop-filter` set to a non-default value, or `will-change` naming one of those properties, *that ancestor's padding box becomes the containing block instead* — and the "fixed" element now moves with that ancestor when it scrolls, rather than staying pinned to the viewport.
- **`sticky`**: containing block follows the same rules as `relative` for layout purposes, but its stick range is bounded by its nearest **scroll container** ancestor (see the `sticky` theory file).

## The property that trips almost everyone up: `transform` on an ancestor "captures" `fixed`

```css
.gallery {
  transform: scale(1); /* identity transform — visually does nothing, but still counts */
}
.gallery .lightbox-close-button {
  position: fixed;
  top: 16px;
  right: 16px; /* intended: pinned to the viewport corner */
  /* actual: pinned to .gallery's corner, because .gallery has a transform */
}
```

This is extremely common with CSS-in-JS animation libraries and any component that applies `transform` for entrance/exit animations, or even `transform: translateZ(0)`/`translate3d(0,0,0)` as a legacy "force GPU layer" hack. Any of those turns that ancestor into the containing block for every `fixed` descendant, silently breaking "pinned to viewport" assumptions.

The same applies to `filter` (even something as innocuous as `filter: blur(0)`), `perspective`, `backdrop-filter`, and `will-change: transform` — all of them create a containing block for `fixed`/`absolute` descendants, on top of also creating a stacking context.

## Percentages resolve against the containing block

`width: 50%`, `height: 100%`, `top: 10%`, etc. on a positioned element resolve against the containing block's corresponding dimension — which is exactly why `height: 100%` inside an `absolute`ly positioned element with no explicit height anywhere up the ancestor chain often computes to `0` (percentage heights need a *defined* — not auto — height on the containing block to resolve against).

## Containing block vs. stacking context — the distinction that matters

| | Containing block | Stacking context |
|---|---|---|
| Purpose | Determines what offsets (`top`/`left`/etc.) and percentage sizes are calculated against | Determines paint order (what's on top of what) |
| Created by `position: relative` alone (no `z-index`) | Yes, for `absolute` descendants | No — needs `z-index` other than `auto` too |
| Created by `position: fixed`/`sticky` alone | Yes, unconditionally | Yes, unconditionally |
| Created by `transform`/`filter`/`will-change` | Yes (for `absolute`/`fixed` descendants) | Yes |
| Created by `opacity < 1` | No | Yes |

That last row is the cleanest illustration that these are genuinely separate mechanisms: `opacity: 0.5` on an ancestor will trap a descendant's `z-index` inside a new stacking context, but it does **not** change what that descendant's `absolute`/`fixed` offsets are calculated against.

# Stacking Contexts: What Creates One

A **stacking context** is a self-contained group of elements that get painted together, as a single unit, relative to sibling stacking contexts. Inside a stacking context, `z-index` values only compete against other elements *in that same context*. Once you leave that context (i.e., compare it against an element outside it), the entire context paints as one atomic layer — no descendant inside it, no matter how high its `z-index`, can ever appear above content that outranks the context itself in its *parent* stacking context. This is the single most important fact in this whole topic, and it's covered in detail with a worked example in the `z-index` theory file.

## The root stacking context

The `<html>` element always establishes the root stacking context, which contains everything.

## What creates a *new* stacking context

Any of the following on an element creates a new stacking context rooted at that element:

- `position: absolute` or `position: relative` **with `z-index` set to anything other than `auto`**
- `position: fixed` or `position: sticky` (these create a stacking context unconditionally — no `z-index` requirement)
- `opacity` less than `1`
- `transform` set to anything other than `none`
- `filter` set to anything other than `none`
- `backdrop-filter` set to anything other than `none`
- `perspective` set to anything other than `none`
- `will-change` specifying a property that would itself create a stacking context (e.g. `will-change: transform` or `will-change: opacity`)
- `isolation: isolate` — exists specifically to create a stacking context with no other side effects, useful when you need isolation without an unwanted visual effect
- `mix-blend-mode` set to anything other than `normal`
- `contain: layout`, `contain: paint`, or `contain: strict`/`content` (composite value including layout+paint)
- Elements with a `mask` or `clip-path` applied
- Flex/Grid items that are direct children of a flex/grid container *and* have `z-index` other than `auto` (the flex/grid container makes its z-indexed children establish stacking contexts, unlike normal-flow children where `position` is also required)
- The top layer: elements shown via the Popover API, native `<dialog>` in its open/modal state, and fullscreen elements

## Why this list matters more than it looks

Several of these are properties people reach for *without realizing they create a stacking context* — `opacity: 0.99` for a fade, `transform: translateZ(0)` as an old performance hack, `will-change: transform` added preemptively before an animation, `filter: drop-shadow(...)` for a shadow effect. Any one of these silently reshuffles the entire stacking order of that element's descendants relative to the rest of the page, which is the root cause behind a large fraction of "why is my dropdown behind this other thing" bugs — the dropdown's ancestor accidentally became a stacking context because of an unrelated visual property, capping how high the dropdown itself can ever paint.

```css
/* .card did not intend to create a stacking context — but opacity < 1 always does */
.card {
  opacity: 0.999; /* often added to force a repaint layer; also creates a stacking context */
}
.card .dropdown-menu {
  position: absolute;
  z-index: 9999; /* trapped inside .card's stacking context no matter how high this goes */
}
```

## Finding stacking contexts in DevTools

Chrome and Firefox DevTools both have a "Layers" or 3D view (and Chrome's Elements panel highlights the nearest stacking-context-establishing ancestor when you inspect `z-index`). When debugging a stacking bug, the fastest manual check is: walk up the DOM tree from the misbehaving element and look for any ancestor with `opacity < 1`, a `transform`, `filter`, `will-change`, or a `position` + `z-index` pairing — the first one you find is very likely capping the element's stacking order.

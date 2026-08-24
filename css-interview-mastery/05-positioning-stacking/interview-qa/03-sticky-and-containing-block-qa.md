# Interview Q&A — `sticky` and Containing Blocks

**Q: What are the three things that most commonly cause `position: sticky` to silently "not work"?**
(1) No offset (`top`/`bottom`/`left`/`right`) was set, so there's no threshold to stick at, and the element just behaves like `relative`. (2) An ancestor between the sticky element and its intended scroll container has `overflow` set to something other than `visible` (even just on one axis, e.g. `overflow-x: hidden`), which changes what the element sticks relative to, or breaks it outright. (3) The sticky element's containing block (typically its direct parent) is exactly as tall as the element itself, leaving no room to travel before hitting the container's boundary.

**Q: What does `position: sticky`'s offset (e.g. `top: 0`) actually measure against?**
The padding edge of the element's nearest ancestor that establishes a scrolling mechanism (an `overflow` other than `visible`, or the viewport if no such ancestor exists). The element sticks at that threshold until it reaches the far edge of its own containing block, at which point it scrolls away with its parent as normal.

**Q: Why does a sticky sidebar inside a `display: flex` row sometimes fail to stick even with a correct offset and no `overflow` issues?**
Because flex items default to `align-items: stretch`, which can stretch the sidebar (or its sticky element directly) to match the height of a taller sibling column — leaving the sticky element's containing block exactly as tall as the element itself, with no room to travel. The fix is `align-items: flex-start` on the flex container (or `align-self: flex-start` on just the sidebar).

**Q: What's the difference between how `absolute`/`fixed` choose a containing block, and how `sticky` does?**
`absolute`/`fixed` pick a containing block purely from the positioned-ancestor/transform-ancestor search. `sticky` behaves like `relative` for layout purposes (its containing block is essentially its normal parent), but its *stick range* — how far it can travel while "stuck" before scrolling away — is separately bounded by the nearest ancestor that's an actual scroll container. These are two different concepts that both matter for `sticky` specifically.

**Q: Can a `transform` on an ancestor affect `position: sticky`, the way it affects `fixed`?**
Not in the same "hijacks the containing block" way that it does for `fixed` — `sticky` was already going to behave like `relative`/normal flow relative to its parent regardless. But a `transform` on an ancestor does create a stacking context and a containing block for any `absolute`/`fixed` *descendants* of that ancestor, which is a separate, unrelated effect worth not conflating with `sticky`'s own scroll-container requirement.

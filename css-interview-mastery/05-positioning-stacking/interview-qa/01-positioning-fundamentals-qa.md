# Interview Q&A — Positioning Fundamentals

**Q: What are the five values of `position`, and which ones remove an element from normal document flow?**
`static` (default), `relative`, `absolute`, `fixed`, and `sticky`. `absolute` and `fixed` remove the element from normal flow entirely — it takes up no space, and surrounding elements lay out as if it weren't there. `static`, `relative`, and `sticky` all remain in flow and continue to reserve their space; `relative` and `sticky` are visually offset from that reserved position but don't affect how siblings lay out.

**Q: What is a "containing block," and why does it matter?**
It's the box against which a positioned element's offset properties (`top`/`right`/`bottom`/`left`/`inset`) and any percentage-based `width`/`height` are calculated. It matters because getting it wrong is the source of most "my element is in the wrong place" bugs — e.g. an `absolute` element anchoring to the viewport instead of its intended wrapper because that wrapper was never given a `position` other than `static`.

**Q: For `position: absolute`, how does the browser decide which ancestor is the containing block?**
It walks up the ancestor chain looking for the nearest ancestor that is positioned (`position` other than `static`) or that has `transform`, `filter`, `perspective`, `backdrop-filter` set to a non-default value, or `will-change` naming one of those properties. The first ancestor that matches becomes the containing block. If none match all the way to the root, the containing block falls back to the initial containing block (roughly the viewport, at the document origin).

**Q: Does `position: relative` with no `top`/`left`/etc. do anything?**
Yes — even with zero offsets, it still makes the element a valid containing-block anchor for any `absolute`ly positioned descendants, and it enables the element to accept a `z-index` (a `z-index` on a `static` element is ignored). This "anchor, but don't actually move" use of `relative` is extremely common and often the whole reason it's applied.

**Q: What's the difference between how `absolute` and `fixed` choose their containing block?**
Both use the same rule (nearest ancestor that is positioned or has a qualifying `transform`/`filter`/`perspective`/`backdrop-filter`/`will-change`), but `fixed`'s fallback, when no ancestor qualifies, is the viewport itself — meaning a `fixed` element with no qualifying ancestor stays pinned in place as the whole page scrolls. `absolute`'s fallback is the initial containing block, which does scroll away with the page (it's tied to the document, not the viewport).

**Q: Can you give a `z-index` to a `static` element and have it do anything?**
No. `z-index` only has an effect on positioned elements (`relative`, `absolute`, `fixed`, `sticky`) — on `static` elements it's simply ignored, the same as `top`/`left`/etc.

# Interview Q&A — Stacking Contexts & `z-index`

**Q: What is a stacking context?**
A self-contained group of elements painted together as a single unit, relative to sibling stacking contexts on the page. Inside a stacking context, descendant `z-index` values are only compared against other elements in that same context. When compared against content *outside* the context, the entire context paints as one atomic layer, ranked by wherever the context-creating element itself falls in its parent's stacking order.

**Q: Name at least five things that create a new stacking context.**
Any of: `position: fixed`/`sticky` (unconditionally); `position: relative`/`absolute` combined with `z-index` other than `auto`; `opacity` less than `1`; `transform` other than `none`; `filter` other than `none`; `will-change` naming a property that would itself trigger a stacking context; `isolation: isolate`; `mix-blend-mode` other than `normal`; and elements in the "top layer" (open `<dialog>`, fullscreen elements, Popover API elements).

**Q: Why would `z-index: 9999` on an element still render behind an element with `z-index: 1`?**
Because the two elements belong to different stacking contexts, and the `z-index: 9999` element's context is nested inside an ancestor whose *own* stacking rank (in its parent context) is lower than the ancestor/context containing the `z-index: 1` element. `z-index` values never compare across stacking-context boundaries directly — only the context-creating ancestors compete against each other at each level, and a descendant can never "reach outside" its own context to outrank something in a sibling context.

**Q: If two sibling elements both have `position: relative` and no `z-index` set (i.e. `z-index: auto`), which one paints on top?**
Neither one establishes a stacking context from the `position` alone (since `z-index: auto` doesn't satisfy the "not auto" trigger), so paint order falls back to DOM/tree order — the later element in the document paints on top, all else equal.

**Q: Does `isolation: isolate` change how an element looks?**
No — unlike `opacity`, `transform`, or `filter`, `isolation: isolate` has no other visual side effect. Its only job is to force a new stacking context, which is useful when you specifically want to contain a subtree's `z-index` values (e.g. to guarantee they can never accidentally out-rank something outside that subtree) without also triggering any visual change like fading or scaling.

**Q: How would you debug "my `z-index` isn't working" in practice?**
Starting from the misbehaving element, walk up the DOM tree checking computed styles for anything that creates a stacking context (`opacity < 1`, `transform`/`filter`/`will-change` set, `position` + non-`auto` `z-index`, `isolation: isolate`, `mix-blend-mode`). The first such ancestor found is the ceiling — the element's `z-index` can never escape it. Then compare that ancestor's own rank against whatever it's failing to out-rank, at that ancestor's own level in the DOM.

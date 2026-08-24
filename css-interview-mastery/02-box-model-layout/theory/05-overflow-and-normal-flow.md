# Overflow and Normal Flow

## Normal flow

"Normal flow" (a.k.a. the normal document flow) is the default layout algorithm: block-level elements stack vertically top to bottom, each taking the full available width; inline elements flow horizontally left to right (in LTR languages), wrapping to new lines as needed. Floats, absolute/fixed positioning, flex, and grid all pull elements out of — or otherwise override — this default flow.

## `overflow`

`overflow` (shorthand for `overflow-x`/`overflow-y`) controls what happens when a box's content is larger than the box itself:

| Value | Behavior |
|---|---|
| `visible` (default) | Content spills outside the box, unclipped, doesn't scroll |
| `hidden` | Content is clipped at the box's padding edge; no scrollbar, overflow is simply invisible and inaccessible via UI (though still focusable/reachable via keyboard/JS in some cases) |
| `scroll` | Always shows a scrollbar (even if content fits — can cause an always-visible, sometimes-unnecessary scrollbar depending on platform/browser) |
| `auto` | Shows a scrollbar **only if** content actually overflows — the common practical choice |
| `clip` | Like `hidden`, but explicitly disallows programmatic scrolling too, and allows tuning the clip edge via `overflow-clip-margin` |

## The gotcha: any value other than `visible` creates a new Block Formatting Context (BFC)

Setting `overflow: hidden`, `auto`, `scroll`, or `clip` on an element doesn't just clip/scroll its content — it also establishes a new BFC for that element. This has two significant, often-unintended side effects that come up constantly in interviews:

1. **It contains floated children.** A classic pre-flexbox layout bug is a container collapsing to zero height because all its children are floated (floats are removed from normal flow and don't contribute to the parent's height). Giving the container `overflow: hidden` (or `auto`) forces it to include the floats' height in its own height, because a new BFC always fully contains its floated descendants. This is the (now largely superseded by `display: flow-root`) "overflow trick" for float containment.
2. **It prevents margin collapsing between the element and its children.** Because a new BFC isolates the element's internal layout from its surroundings, a child's top/bottom margin can no longer "pass through" the parent to collapse with the parent's own margin or an outside sibling — see the margin-collapsing theory file, case 2.

The tradeoff: `overflow: hidden` used *purely* as a float-containment or margin-collapse-prevention hack has the side effect of clipping any content that legitimately needs to overflow (e.g. a dropdown menu, a tooltip, a `box-shadow` that extends past the edge) — which is exactly why `display: flow-root` (a BFC with zero other side effects) is the more correct modern tool when clipping/scrolling isn't actually the goal.

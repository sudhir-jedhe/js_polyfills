# Interview Q&A — `flex-grow`/`flex-shrink`/`flex-basis` Math

**Q: If three flex items have `flex-grow` of 1, 2, and 1, and there's 800px of free space, how is that space distributed?**
Proportionally to each item's share of the total grow: sum of grow = 4, so items get `800 × 1/4 = 200px`, `800 × 2/4 = 400px`, and `800 × 1/4 = 200px` respectively, added on top of their individual flex-basis values.

**Q: Is `flex-shrink` applied as a flat ratio between items, the way `flex-grow` is?**
No — this is the classic trap. `flex-shrink` is weighted by each item's `flex-basis`: the browser computes a scaled shrink factor per item as `flex-shrink × flex-basis`, and distributes the overflow proportionally to that scaled factor, not to the raw `flex-shrink` value alone. Two items with the same `flex-shrink` but different bases will shrink by different absolute amounts.

**Q: Given items with equal `flex-basis`, does a higher `flex-shrink` always mean it loses proportionally more pixels?**
Yes, in that specific case (equal bases) — since the basis term is identical for both, the ratio between their scaled shrink factors reduces to the ratio between their `flex-shrink` values directly. The moment their bases differ, this stops holding, and you have to compute the scaled factors explicitly.

**Q: What does `flex-basis: auto` fall back to?**
The item's `width` property (in a `row`-direction container) or `height` property (in `column`), and if that's also unset, the item's content size (its natural, unconstrained size).

**Q: If an item has both `width: 300px` and `flex-basis: 150px` set explicitly, which one determines its starting main-size?**
`flex-basis`, whenever it's set to an explicit value other than `auto` — `width` is ignored for main-size purposes in that case. `width` only comes back into play as a fallback if `flex-basis` is `auto`.

**Q: What's `min-width: auto`'s role in flex-shrink calculations, and why can text still visually wrap even with it?**
By default, a flex item's automatic minimum size (used to clamp how far `flex-shrink` can shrink it) is based on its content's minimum size — for text, that's typically the width of its longest unbreakable word, which is much smaller than the label's full unwrapped width. So `flex-shrink` can still shrink an item enough to force its text to wrap onto multiple lines before it hits that automatic floor — preventing this requires an explicit `min-width` (or `flex-shrink: 0`, or `white-space: nowrap`), not reliance on the automatic minimum.

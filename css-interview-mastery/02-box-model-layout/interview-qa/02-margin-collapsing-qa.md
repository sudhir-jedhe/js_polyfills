# Interview Q&A — Margin Collapsing

**Q: What is margin collapsing, in one sentence?**
When two or more adjacent vertical margins on block-level, in-flow, same-block-formatting-context boxes combine into a single margin (sized by a specific rule) instead of adding together.

**Q: Name the three main margin-collapsing scenarios.**
Adjacent siblings (bottom margin of one meets top margin of the next), parent and first/last in-flow child (the parent's margin collapses through it with the child's, when nothing separates them), and an empty block (an element with no border/padding/height/content collapses its own top and bottom margins into one, which can then further collapse with neighbors).

**Q: If two positive margins of 20px and 35px collapse, what's the result? What about -10px and -30px? What about 20px and -8px?**
Two positives: the larger, `35px`. Two negatives: the more negative (largest magnitude), `-30px`. Mixed sign: the sum of the largest positive and the smallest (most negative), `20 + (-8) = 12px`.

**Q: What stops margin collapsing between a parent and its first child?**
Any padding or border on that edge of the parent, any inline content/line box between the parent's edge and the child, or the parent establishing a new block formatting context (`overflow` other than `visible`, `display: flow-root`, `display: flex`/`grid`, absolute/fixed positioning, etc.).

**Q: Do margins ever collapse horizontally?**
No — margin collapsing only ever applies to vertical margins in a horizontal writing mode; horizontal margins always add together normally, never collapse.

**Q: Do flex items or grid items ever have their margins collapse with each other?**
No, never — margin collapsing is explicitly excluded within flex and grid formatting contexts, by specification, regardless of how the items are positioned relative to each other.

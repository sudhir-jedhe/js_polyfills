***  03-lists-keys-and-reconciliation-qa.md ***

# Interview Q&A — Lists, Keys, and Reconciliation

**Q: What is the Virtual DOM, and why does React use it?**
It's an in-memory tree of plain JS objects (React elements) representing the desired UI state. On each render, React builds a new virtual tree and diffs it against the previous one (reconciliation), computing the minimal set of real DOM operations needed to reach the new state, then applies them in a batch during the commit phase. This avoids the cost of doing full DOM rebuilds and lets React's diffing algorithm centralize update logic rather than having every component manually manage imperative DOM mutations.

**Q: What role does the `key` prop play in list rendering, and what goes wrong without it?**
`key` gives React a stable identity for each item in a list so it can match elements between renders by "what they are" rather than by position. Without keys (or with unstable keys like array index on a reorderable/filterable list), React falls back to matching by position, which can cause it to reuse the wrong DOM node/component instance for a given piece of data — manifesting as state (like focus, input values, animation state) appearing to "stick" to the wrong row after insertions, deletions, or reorders.

**Q: What does "reconciliation" mean, and what's the type-based heuristic React uses?**
Reconciliation is the process of diffing the new element tree against the previous one to determine the minimal DOM changes needed. React's core heuristic: if an element at a given position has the same type as before, React keeps the underlying DOM/component instance and just updates its props/state; if the type changes, React tears down the old subtree (unmounting it, losing its state) and mounts a completely new one in its place. This is why swapping between differently-typed components at the same tree position — rather than branching inside one component — causes unwanted state loss.

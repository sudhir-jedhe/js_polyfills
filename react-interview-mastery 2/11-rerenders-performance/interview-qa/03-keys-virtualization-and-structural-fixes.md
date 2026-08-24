# Interview Q&A: Keys, Virtualization, and Structural Fixes

**Q: Why is using array index as `key` dangerous for dynamic lists?**
`key` tells React which DOM node/state corresponds to which logical item across renders. Index ties that identity to position, not to the item. If the list reorders, inserts, or deletes anywhere but the end, items shift index and React reuses the wrong node/state for the wrong item — most visibly breaking uncontrolled inputs or component-local state inside list rows.

---

**Q: What is virtualization, and when should you use a library like `react-window`?**
Virtualization renders only the list rows currently in (or near) the viewport, recycling a small, roughly constant number of DOM nodes as the user scrolls, instead of mounting every row up front. Reach for it once a list is long enough (typically hundreds to thousands of rows) that DOM node count — not render logic — is the measured bottleneck; it adds setup complexity (fixed/estimated row heights) that isn't worth it for short lists.

---

**Q: How does splitting a component differ from memoizing it, as a performance strategy?**
Memoizing (via `memo`) tries to *skip* a re-render after it's already been triggered. Splitting a component moves fast-changing state into its own smaller component so the re-render trigger never reaches the rest of the tree in the first place — it addresses the cause rather than short-circuiting the effect, and doesn't depend on prop reference stability to work.

***  02-index-as-key-antipattern.md ***

# Interview Q&A: The Index-as-Key Anti-Pattern

**Q: Why is using the array index as a key considered an anti-pattern?**

Because the index is a property of *position*, not of the *item*. If the list is reordered, filtered, or has items inserted/removed anywhere but the end, items shift indices, and React — matching purely by key — will reuse a component instance (and its state, and its DOM node) for a different logical item than before. This shows up as state (like an open edit box, checked checkbox, or typed input) appearing to "belong" to the wrong row after the list changes.

**Q: What's a real scenario where index-as-key causes a visible bug?**

A todo list where each row has a "click to edit" state stored via `useState` inside the row component, keyed by index. Editing row 2, then deleting row 0, shifts every subsequent item up by one index. React reuses the component instance at index 2 (which still thinks it's in edit mode) but now renders it with the data for what used to be row 3 — so the edit UI appears to jump to the wrong item's data.

**Q: When, if ever, is index-as-key acceptable?**

When the list is static — never reordered, filtered, or has items inserted/removed except possibly appended at the end — and the list items have no internal state that could get mismatched. Even then, it's safer default to a stable id if one exists, since "the list will never change" is a claim that often stops being true as an app evolves.

## Comparison table

| Aspect | Index as key | Stable ID as key |
|---|---|---|
| Correctness on reorder/filter/insert | Breaks — state/DOM gets attached to the wrong item | Correct — React tracks the item wherever it moves |
| Performance | Slightly cheaper to compute (no lookup needed) | Negligible cost difference in practice |
| When it's acceptable | Static list that never reorders and has no per-item state | Always safe; the default choice |

Use stable IDs (database id, UUID, or a unique field) by default. The most common mistake is reaching for `index` out of habit even when the list is filterable or sortable, then being confused when unrelated rows' local state (inputs, toggles) appears to "jump" between rows.

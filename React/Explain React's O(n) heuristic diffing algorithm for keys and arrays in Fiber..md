*** copy Explain React's O(n) heuristic diffing algorithm for keys and arrays in Fiber..md ***

React achieves an **$O(n)$** reconciliation complexity by employing two primary heuristics rather than computing a mathematically optimal minimum-edit tree distance (which runs in $O(n^3)$):

1. **Two elements of different types produce completely different trees.** Changing `<Header>` to `<Footer>` causes React to unmount the entire subtree without diffing children.
2. **Child lists can be tracked stably across renders using the `key` prop.**

Reconciling arrays of children happens in Fiber’s `reconcileChildrenArray()` function during `beginWork()`.

---

**The Challenge: Linked List vs. Array**

* Existing children in the Fiber tree are structured as a **singly-linked list** (`currentFiber.sibling`).
* New children returned from render/JSX are structured as an **Array** (`newChildren[]`).

Because linked lists cannot be indexed in $O(1)$, React optimizes array diffing in **two linear passes** instead of a nested loop.

---

**Pass 1: Fast Path for In-Place Updates (Same Position)**

Most UI updates modify existing elements in place (e.g., text edits, prop updates) without changing order:

```
Index:         0     1     2
Old Fibers:   [A] ->[B] ->[C]
New Elements: [A]   [B']  [C]

```

* React iterates simultaneously through `oldFiber` (via `.sibling`) and `newChildren[newIdx]`.
* If keys and types match, React reuses the Fiber (`updateSlot()`) and marks prop updates if needed.
* **Exit condition:** The first mismatch in `key` (or if either the old list or new array runs out) immediately terminates Pass 1.

If all new children were processed (or all old fibers matched cleanly), reconciliation finishes here in a single $O(n)$ scan.

---

**Pass 2: Map-Based Reconciliation (Reordering, Insertions, Deletions)**

If Pass 1 terminated early due to a reorder or mismatch, React switches to a Map-based lookup:

```
Old Fibers remaining: [B] -> [C] -> [D]
New Array remaining:  [D],   [B],   [E]

```

1. **Build the Map ($O(n)$):** React collects all remaining old fibers into an in-memory hash map:

* Keyed by `key` (or `index` if no key was provided):

```javascript
existingChildren = Map { "b" => FiberB, "c" => FiberC, "d" => FiberD }

```

1. **Iterate Remaining New Elements ($O(n)$):**

* For each new child, React looks up `existingChildren.get(child.key)`.
* **If found:** React removes the fiber from the map, reuses it, and determines if it moved.
* **If not found:** React creates a brand-new Fiber marked with `Placement`.

1. **Cleanup Leftovers:** Any fibers remaining in `existingChildren` after the loop were not matched in the new tree and are marked with `Deletion`.

---

**Tracking Movement: The `lastPlacedIndex` Pointer**

To determine if an element actually needs a physical DOM move (a costly operation) vs. staying put, React tracks a single integer: `lastPlacedIndex`.

`lastPlacedIndex` represents the **highest index in the old tree** that has appeared so far in the new tree order.

* If `matchedFiber.oldIndex >= lastPlacedIndex`:
* The node appears *after* or at the expected position relative to previously placed nodes.
* **No DOM move needed.**
* `lastPlacedIndex` is updated: `lastPlacedIndex = matchedFiber.oldIndex`.

* If `matchedFiber.oldIndex < lastPlacedIndex`:
* The node previously appeared *before* a node that is already placed.
* React marks the fiber with the `Placement` (move) flag.

---

**Concrete Example: Reversing a List**

```
Old List:  [A (0), B (1), C (2), D (3)]
New List:  [D, C, B, A]

```

| New Child | Old Index | `lastPlacedIndex` (Before) | Comparison | Action                  | `lastPlacedIndex` (After) |
| --------- | --------- | -------------------------- | ---------- | ----------------------- | ------------------------- |
| **D**     | `3`       | `0`                        | `3 >= 0`   | Stays in place          | `3`                       |
| **C**     | `2`       | `3`                        | `2 < 3`    | **Marked for DOM Move** | `3`                       |
| **B**     | `1`       | `3`                        | `1 < 3`    | **Marked for DOM Move** | `3`                       |
| **A**     | `0`       | `3`                        | `0 < 3`    | **Marked for DOM Move** | `3`                       |

> **Why Prepends Are Expensive:** If you insert or move an item to index `0`, `lastPlacedIndex` jumps forward immediately, causing every subsequent existing item to receive a `Placement` move flag.

---

**Why Index as a Key Breaks Reconciliation**

When using array indices (`key={index}`):

1. **Unstable Identity:** If an item is unshifted to the start of the list, every item's key shifts by 1 (`key=0` now points to the new item, `key=1` points to the old first item).
2. **Fiber Component State Corruption:** React assumes `key=0` is the same component instance as before, reusing its internal hook state (`useState`, DOM focus, unmanaged `<input>` values) while passing it entirely new props.

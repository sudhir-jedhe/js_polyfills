*** copy 04-virtual-dom-reconciliation-and-keys.md ***

# The Virtual DOM, Reconciliation, and the `key` Prop

Each render produces a new tree of React elements — the "virtual DOM." React diffs this new tree against the previous one (reconciliation) and computes the minimal set of real DOM mutations needed, then applies them in a commit phase. Key heuristics:

- Elements of a **different type** at the same position cause a full subtree teardown/rebuild (unmount old, mount new — losing all local state).
- Elements of the **same type** get their props patched in place (the existing instance and its state survive).
- Siblings in a list are matched by **`key`**, not by position, so an unstable or missing `key` causes React to misattribute state to the wrong item — a very common source of "why did my input lose focus / show the wrong value" bugs.

```jsx
// Bad: index as key when list order can change
{items.map((item, i) => <Row key={i} {...item} />)}

// Good: stable identity
{items.map((item) => <Row key={item.id} {...item} />)}
```

## `key={index}` vs. `key={stableId}`

| Aspect | Index as key | Stable unique id as key |
|---|---|---|
| Correctness when list is static/append-only | Safe | Safe |
| Correctness when list is reordered/filtered/prepended | Breaks — state/DOM gets attached to the wrong item | Correct — identity follows the data |
| Performance | Slightly cheaper to compute (no id needed) | Requires each item to have a stable id |

Use index keys only for lists that never reorder, insert, or delete in the middle. The most common mistake is defaulting to `.map((item, i) => <Row key={i} />)` out of habit for lists that are filterable or sortable, causing uncontrolled inputs and animations to desync from their data.

## Why this matters more than it looks

Reconciliation's type-based heuristic explains a surprising class of bugs: swapping between two *differently-typed* components at the same tree position (e.g. rendering `<AdminPanel>` in one branch and `<UserPanel>` in another) tears down all local state every time the branch flips, even if the two components are visually similar. If that's undesirable, unify them into a single component that branches internally instead, so the element type at that position stays stable.

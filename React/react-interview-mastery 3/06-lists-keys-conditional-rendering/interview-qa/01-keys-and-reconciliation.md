***  01-keys-and-reconciliation.md ***

# Interview Q&A: Keys and Reconciliation

**Q: Why does React require a `key` prop when rendering lists?**

React's reconciler needs a stable way to match elements between the previous render and the new one so it can decide whether to update, move, or destroy-and-recreate a DOM node and its associated component state. Without keys, React falls back to matching children by position, which produces wrong results whenever the list's order or membership changes. Keys give React an identity independent of position.

**Q: Does a key need to be globally unique across the whole application?**

No — only unique among its immediate siblings in a given `.map()`/list. React compares keys within one parent's children list, not across the entire component tree, so the same key value can be reused in a completely different list elsewhere without any conflict.

**Q: Can two `.map()` calls in different parts of the same component reuse the same key values?**

Yes, as long as they're not siblings under the exact same parent. React's key-matching is scoped to each parent's own children, so keys in one list don't need to avoid collisions with keys in an unrelated list, even within the same component.

**Q: How would you render a list where you need to output multiple sibling elements per item without adding a wrapping `<div>`?**

Use a keyed `React.Fragment` (the shorthand `<>...</>` cannot take a `key`, so you need the full `React.Fragment` syntax when mapping):

```jsx
{entries.map((e) => (
  <React.Fragment key={e.id}>
    <dt>{e.term}</dt>
    <dd>{e.definition}</dd>
  </React.Fragment>
))}
```

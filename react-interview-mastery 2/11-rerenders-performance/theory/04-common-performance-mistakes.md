# Common Performance Mistakes

- **Inline object/array/function props** — `<Comp style={{color: 'red'}} />` or `<Comp onClick={() => f()} />` creates a new reference every render, breaking `memo` and causing effects with that value as a dependency to re-fire.
- **Huge, flat component trees** — one giant component holding all state means every keystroke re-renders everything beneath it. Splitting state closer to where it's used shrinks the blast radius.
- **Unkeyed or badly-keyed lists** — using array index as `key` when the list can reorder/insert/delete causes React to misattribute state and DOM nodes between items, leading to bugs and extra DOM churn.

## Array index keys vs stable ID keys

| Aspect | Index as key | Stable unique ID as key |
|---|---|---|
| Behavior on reorder/insert/delete | React misattributes identity — items shift and get the wrong internal state/DOM node | React correctly tracks each item, moving/removing/inserting the right DOM node |
| When it's "safe" | List is static, never reordered/filtered/sorted, no per-item state | Any list that can change order or membership |
| Common mistake | Using `index` "just to silence the key warning" on a dynamic, filterable, or sortable list | None generally — but reusing a non-unique field (e.g. `label`) as key causes the same class of bug |

Use a stable ID from your data (`item.id`) whenever the list can reorder or its membership can change; index keys are only acceptable for genuinely static, append-only-at-the-end lists.

## Why is using array index as `key` dangerous for dynamic lists?

`key` tells React which DOM node/state corresponds to which logical item across renders. Index ties that identity to position, not to the item. If the list reorders, inserts, or deletes anywhere but the end, items shift index and React reuses the wrong node/state for the wrong item — most visibly breaking uncontrolled inputs or component-local state inside list rows.

## Give an example of an inline prop that silently breaks memoization, and how to fix it

`<Row style={{ padding: 8 }} />` passed to a `memo`-wrapped `Row` creates a new object every render, so `memo`'s shallow comparison never matches. Fix by hoisting the object to a module-level constant (if truly static) or wrapping it in `useMemo(() => ({ padding: 8 }), [])` if it depends on props/state.

## A context provider's `value` created inline

A context provider's `value` is `{ theme, setTheme }` created inline in the provider component's body. What's the performance problem, and how do you fix it? Every render of the provider creates a new `value` object, so every consumer of that context re-renders on every provider render, even if `theme` itself hasn't changed. Fix by memoizing the value: `const value = useMemo(() => ({ theme, setTheme }), [theme])` (with `setTheme` from `useState`, which is already stable).

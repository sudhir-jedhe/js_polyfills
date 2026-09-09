***  02-why-keys-exist.md ***

# Why keys exist

React's reconciliation is a diffing algorithm: on every render it compares the new element tree to the previous one and computes the minimal set of DOM mutations. For children of the same parent, React needs a stable identity for each child to know "is this the same logical item, just moved/updated, or is it a brand new item?"

Without keys (or with keys that don't uniquely identify the item), React falls back to matching children by **position**. That's fine if the list never reorders, filters, or has items inserted/removed from the middle. It breaks badly otherwise, because React will reuse the DOM node — and any state hooks attached to a component instance at that position — for whatever item now happens to occupy that index.

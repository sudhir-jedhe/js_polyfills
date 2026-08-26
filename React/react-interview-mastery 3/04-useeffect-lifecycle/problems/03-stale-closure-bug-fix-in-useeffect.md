*** copy 03-stale-closure-bug-fix-in-useeffect.md ***

# Problem: Find and Fix a Stale-Closure Bug in a `useEffect`

## Problem Statement

Given a component where a `useEffect`-managed keyboard shortcut handler reads outdated state (a classic real-world variant of the stale-closure trap), diagnose exactly why it's stale and fix it two different ways: the functional-update approach, and the ref-based approach — demonstrating both fixes named in this topic's guidance and when each one is the better fit.

## The Buggy Component

```jsx
// BUG: pressing "a" is supposed to select all items, but after the list changes
// once, pressing "a" again keeps selecting the ORIGINAL list, not the current one.
function SelectableList({ items }) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'a') {
        // `items` here is captured from whichever render this effect ran in.
        setSelectedIds(items.map(i => i.id));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // <- missing `items` dependency: the closure is frozen at mount

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} style={{ fontWeight: selectedIds.includes(item.id) ? 'bold' : 'normal' }}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## Diagnosis

The effect runs once (`[]`), so `handleKeyDown`'s closure permanently captures `items` as it was on the very first render. If the parent later re-renders `<SelectableList items={newItems} />` with a different array, pressing "a" still calls `setSelectedIds(originalItems.map(...))` — selecting ids from a list that may no longer even be displayed. This is exactly the "effect with an empty dependency array that still reads reactive state" trap described in `../theory/04-stale-closures-in-effects.md`.

## Fix 1: Add the missing dependency (simplest, correct, but re-attaches the listener on every `items` change)

```jsx
function SelectableListFixedWithDeps({ items }) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'a') {
        setSelectedIds(items.map(i => i.id)); // `items` is now always fresh for THIS effect run
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items]); // re-subscribes whenever items changes — correct, if slightly more churn

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} style={{ fontWeight: selectedIds.includes(item.id) ? 'bold' : 'normal' }}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

This is correct and the most honest fix — the effect now genuinely declares that it depends on `items`. The tradeoff: every time `items` changes, the old listener is removed and a new one added (a `removeEventListener`/`addEventListener` pair per change), which is harmless here but could matter for a much hotter dependency.

## Fix 2: Ref-based fix (avoids re-subscribing the listener at all)

```jsx
function SelectableListFixedWithRef({ items }) {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const itemsRef = React.useRef(items);

  // Keep the ref current on every render — cheap, and doesn't need to be a dependency anywhere.
  React.useEffect(() => {
    itemsRef.current = items;
  });

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'a') {
        setSelectedIds(itemsRef.current.map(i => i.id)); // always reads the LATEST items via the ref
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // listener attaches exactly once — itemsRef.current is always fresh regardless

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} style={{ fontWeight: selectedIds.includes(item.id) ? 'bold' : 'normal' }}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

This keeps the `keydown` listener attached exactly once for the component's whole lifetime — no repeated add/remove churn — while still always reading the current `items` at the moment "a" is pressed, because `itemsRef.current` is updated on every render regardless of whether the listener-managing effect re-runs.

## When to use which fix

`setSelectedIds(items.map(...))` here isn't a pure "derive next state from previous state" case (it depends on `items`, not on `selectedIds`), so the functional-update trick from `../theory/03-functional-updates.md` doesn't directly apply the way it does for a simple counter — this is precisely the situation where either adding the dependency (Fix 1) or a ref (Fix 2) is needed instead. Prefer Fix 1 (add the dependency) by default, since it's the most honest and lint-clean expression of what the effect actually depends on; reach for Fix 2 (ref) specifically when the thing you're avoiding re-subscribing is expensive or has externally-visible side effects on every attach/detach (e.g. a WebSocket connection, an expensive third-party widget's event binding) where churn itself is the problem, not just correctness.

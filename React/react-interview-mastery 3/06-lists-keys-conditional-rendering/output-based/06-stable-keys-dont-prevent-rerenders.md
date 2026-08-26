*** copy 06-stable-keys-dont-prevent-rerenders.md ***

# Output-Based: Do `Card` components re-render when a new array reference has the same items in the same order?

```jsx
function Board({ cards }) {
  return (
    <>
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </>
  );
}
```

`cards` is `[{id: 1, name: 'A'}, {id: 2, name: 'B'}]`. The parent re-renders and passes a **new array reference** with the exact same objects and order (e.g., from `[...cards]`). Do the `Card` components re-render?

**Answer:** Yes, all `Card` instances re-render (assuming `Card` isn't wrapped in `React.memo`), even though nothing meaningfully changed.

**Why:** Keys staying the same across renders means React reuses the same component instances (no remount), but that's separate from re-rendering. Without `React.memo`, every child of a re-rendered parent re-renders regardless of prop equality. Stable keys prevent unmount/remount thrashing; they don't by themselves prevent re-renders.

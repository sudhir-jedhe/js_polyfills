*** copy 01-kanban-drag-reorder-index-key-bug.md ***

# Scenario: Drag-to-reorder task board loses per-card edit state

You're building a Kanban board where users can drag cards to reorder them within a column. QA reports: "If I open a card for inline editing, then drag a different card above it, the edit box appears to jump to the wrong card."

**Approach:** This is the classic index-as-key bug. The card list is almost certainly keyed by array index:

```jsx
// Buggy
{column.cards.map((card, index) => (
  <Card key={index} card={card} />
))}
```

When a card is dragged to a new position, the array order changes but the component at each index keeps its local `editing` state — so the state stays with the position, not the card. Fix by keying with the card's own stable id:

```jsx
{column.cards.map((card) => (
  <Card key={card.id} card={card} />
))}
```

Also verify the drag-reorder logic itself mutates a new array (`[...cards]` + splice, not in-place mutation) so React actually detects the array change and reconciles properly.

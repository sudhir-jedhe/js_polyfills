# A List of Draggable Cards Loses Input Focus and Shows Wrong Data After Reordering

You're building a Kanban-style board where cards can be dragged to reorder within a column. Users report that after dragging, the wrong card sometimes appears "selected," and any inline edit text they'd typed jumps to a different card.

**Approach:** This is the index-as-key bug. The list is almost certainly keyed by array index, so reordering the underlying array doesn't correspond to reordering the rendered DOM nodes/component instances correctly — React reuses instances by position, not identity. Fix by keying on each card's actual stable ID.

```jsx
// Before
{cards.map((card, i) => <Card key={i} card={card} />)}

// After
{cards.map((card) => <Card key={card.id} card={card} />)}
```

With `key={card.id}`, React correctly tracks which component instance corresponds to which card across reorders, so local state (selection, in-progress edits) stays attached to the right card instead of "sticking" to a DOM position.

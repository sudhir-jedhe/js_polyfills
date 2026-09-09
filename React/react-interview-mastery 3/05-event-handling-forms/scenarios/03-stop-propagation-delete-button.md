***  03-stop-propagation-delete-button.md ***

# Scenario: Clicking a "Delete" button inside a clickable list-row also opens the row's detail view

You're building a list of items where clicking anywhere on a row navigates to its detail page, but each row also has a "Delete" icon button, and clicking Delete incorrectly also triggers the row's navigation.

**Approach:** The row's `onClick` and the delete button's `onClick` are both firing because the click event bubbles from the button up through the row. Stop it from propagating past the delete button:

```jsx
function ListRow({ item, onNavigate, onDelete }) {
  function handleDeleteClick(e) {
    e.stopPropagation(); // prevent the row's onClick from also firing
    onDelete(item.id);
  }

  return (
    <div className="row" onClick={() => onNavigate(item.id)}>
      <span>{item.name}</span>
      <button onClick={handleDeleteClick} aria-label="Delete">🗑</button>
    </div>
  );
}
```

`stopPropagation()` on the delete button's click event stops it from reaching the row's `onClick` handler, since React delegates and dispatches synthetic events by walking up the component tree — calling it at the innermost handler that "owns" the click prevents outer handlers from also treating it as a row click.

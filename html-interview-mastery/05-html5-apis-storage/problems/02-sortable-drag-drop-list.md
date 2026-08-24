# Problem: Build a Sortable Drag-and-Drop List

## Problem Statement

Given a `<ul>` of `<li draggable="true">` items, implement plain JS (no libraries) that lets a user drag any item and drop it anywhere else in the list to reorder it, with a visual placeholder showing where the item will land.

## Requirements

- Dragging an item and dropping it before/after another item moves it to that position (not a copy).
- While dragging over the list, a placeholder element shows the item's would-be drop position, updating live as the pointer moves.
- Dropping outside the list (or pressing `Escape`, if attempted) cancels the reorder — the item returns to its original position.
- Must use the native HTML Drag and Drop API (`draggable`, `dragstart`/`dragover`/`drop`/`dragend`), not pointer-event dragging.

## Approach

Track the dragged element in a closure variable set on `dragstart`. On `dragover` (which must call `preventDefault()` to be a valid drop target at all), compute whether the pointer is in the top or bottom half of the item being hovered, and move a placeholder `<li>` to just before or after it. On `drop`, insert the actual dragged item where the placeholder currently sits, then remove the placeholder. On `dragend` (fires regardless of whether the drop succeeded), clean up the placeholder if it's still present — covering the "dropped outside the list" cancel case.

## Solution

```html
<ul id="list">
  <li draggable="true" data-id="1">Item 1</li>
  <li draggable="true" data-id="2">Item 2</li>
  <li draggable="true" data-id="3">Item 3</li>
</ul>
```

```js
const list = document.getElementById('list');
let dragged = null;
let placeholder = null;

function createPlaceholder() {
  const el = document.createElement('li');
  el.className = 'placeholder';
  el.style.height = '2px';
  el.style.background = 'dodgerblue';
  return el;
}

list.addEventListener('dragstart', (e) => {
  const item = e.target.closest('li');
  if (!item) return;
  dragged = item;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', item.dataset.id);
  placeholder = createPlaceholder();
  requestAnimationFrame(() => (item.style.opacity = '0.4')); // visual feedback on the source
});

list.addEventListener('dragover', (e) => {
  e.preventDefault(); // required — makes the list a valid drop target
  const target = e.target.closest('li');
  if (!target || target === dragged || target === placeholder) return;

  const rect = target.getBoundingClientRect();
  const isAfter = e.clientY > rect.top + rect.height / 2;
  list.insertBefore(placeholder, isAfter ? target.nextSibling : target);
});

list.addEventListener('drop', (e) => {
  e.preventDefault();
  if (placeholder && placeholder.parentNode) {
    list.insertBefore(dragged, placeholder); // move the REAL item to the placeholder's spot
  }
  cleanup();
});

list.addEventListener('dragend', () => {
  // Fires on both successful drop AND a cancelled drag (e.g. dropped outside the list,
  // or Escape pressed) — if the placeholder is still in the DOM, drop() never ran, so
  // the dragged item stays exactly where it started (we never moved it until drop()).
  cleanup();
});

function cleanup() {
  if (dragged) dragged.style.opacity = '';
  if (placeholder && placeholder.parentNode) placeholder.remove();
  dragged = null;
  placeholder = null;
}
```

**Why the item only moves inside `drop`, not `dragover`:** `dragover` fires continuously (many times per second while hovering) and is used purely to reposition the *placeholder* — a lightweight, disposable element — rather than the real `<li>`, so that a cancelled drag (dropped outside the list, or the browser firing `dragend` without a preceding `drop`) never leaves the list in a half-reordered state. Only `drop`, which fires exactly once on a successful drop, actually relocates the real dragged item, using the placeholder's final position as the insertion point.

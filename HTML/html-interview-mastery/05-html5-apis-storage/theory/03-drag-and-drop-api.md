***  03-drag-and-drop-api.md ***

# The HTML Drag and Drop API

Native drag-and-drop is built into the browser via a set of `draggable` attributes and a sequence of `drag*` events, plus a `DataTransfer` object that carries data between the drag source and the drop target. It doesn't require any library, though libraries (like Sortable.js) exist because the native API has some rough edges (especially around styling drag feedback and mobile/touch support, which this API does not handle at all).

## Making an element draggable

Any element becomes draggable with the `draggable="true"` attribute (note: many elements like images and links are draggable by default; most others are not):

```html
<div id="item" draggable="true">Drag me</div>
<div id="dropzone">Drop here</div>
```

## The event sequence

| Event | Fires on | When |
|---|---|---|
| `dragstart` | Drag source | Drag begins |
| `drag` | Drag source | Continuously while dragging |
| `dragenter` | Drop target | Dragged item enters the target's bounds |
| `dragover` | Drop target | Continuously while hovering over the target |
| `dragleave` | Drop target | Dragged item leaves the target's bounds |
| `drop` | Drop target | Item is released over the target |
| `dragend` | Drag source | Drag operation finishes (whether dropped successfully or cancelled) |

## The critical gotcha: `dragover` must call `preventDefault()`

By default, **no element is a valid drop target** — dropping is disallowed unless the target's `dragover` (and often `dragenter`) handler calls `event.preventDefault()`. This is the single most common source of "drag and drop isn't working" bugs.

```js
const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault(); // REQUIRED — without this, drop never fires
  dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault(); // also prevents the browser's default (e.g. navigating to a dropped link/file)
  dropzone.classList.remove('drag-over');
  const data = e.dataTransfer.getData('text/plain');
  dropzone.textContent = `Dropped: ${data}`;
});
```

## `DataTransfer` — passing data between source and target

```js
const item = document.getElementById('item');

item.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', item.id);
  e.dataTransfer.effectAllowed = 'move'; // hints which operations are allowed
});
```

`dataTransfer` can hold multiple MIME-typed payloads simultaneously (e.g., `text/plain` and `text/html`), which is how you support dropping into different kinds of targets (a plain-text input vs. a rich editor) from the same drag source.

- `effectAllowed` (set on `dragstart`) declares what operations the source permits: `'copy'`, `'move'`, `'link'`, `'copyMove'`, etc.
- `dropEffect` (set on `dragover`/`drop`) tells the browser what cursor/behavior to show, and must be compatible with `effectAllowed`.

## Reordering a list (a common interview task)

```js
let dragged = null;

document.querySelectorAll('.list-item').forEach((item) => {
  item.addEventListener('dragstart', (e) => {
    dragged = item;
    e.dataTransfer.effectAllowed = 'move';
  });

  item.addEventListener('dragover', (e) => {
    e.preventDefault();
    const rect = item.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    item.parentNode.insertBefore(dragged, after ? item.nextSibling : item);
  });
});
```

## Dropping files from the OS

The Drag and Drop API also handles files dragged in from the operating system's file explorer — `dataTransfer.files` is a `FileList`, exactly like an `<input type="file">`:

```js
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files; // FileList
  for (const file of files) {
    console.log(file.name, file.size, file.type);
  }
});
```

## Key limitations

- **No native mobile/touch support** — `touchstart`/`touchmove`/`touchend` don't trigger the drag events at all, so mobile drag-and-drop UIs typically need a JS library or Pointer Events-based custom implementation.
- Styling the "ghost" drag image is possible via `dataTransfer.setDragImage(element, xOffset, yOffset)` but customization is limited compared to a fully custom pointer-based implementation.
- Accessibility is a real concern: native drag-and-drop is not keyboard-operable by default, so any drag-and-drop UI (e.g., reordering a list) generally needs an accessible alternative (buttons, keyboard shortcuts) to meet WCAG requirements.

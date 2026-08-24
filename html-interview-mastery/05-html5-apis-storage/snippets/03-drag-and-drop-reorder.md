# Snippet: Basic Drag and Drop Between Two Zones

```html
<div class="board">
  <ul id="todo" class="zone">
    <li draggable="true" class="card">Write tests</li>
    <li draggable="true" class="card">Fix bug #42</li>
  </ul>
  <ul id="done" class="zone"></ul>
</div>

<script>
  let dragged = null;

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('dragstart', (e) => {
      dragged = card;
      e.dataTransfer.setData('text/plain', card.textContent);
      e.dataTransfer.effectAllowed = 'move';
    });
  });

  document.querySelectorAll('.zone').forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault(); // required, or drop never fires
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.appendChild(dragged); // moves the actual dragged node
    });
  });
</script>
```

Dragging a `<li class="card">` from `#todo` and dropping it on `#done` moves the actual element (not a copy) into the new list — `appendChild` on an already-attached node relocates it rather than duplicating it.

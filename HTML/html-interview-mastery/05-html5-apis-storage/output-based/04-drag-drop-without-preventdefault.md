*** copy 04-drag-drop-without-preventdefault.md ***

# Output: Drag and Drop Without `preventDefault()`

```html
<div id="source" draggable="true">Drag me</div>
<div id="target">Drop zone</div>

<script>
  document.getElementById('target').addEventListener('dragover', () => {
    console.log('dragover fired');
  });

  document.getElementById('target').addEventListener('drop', () => {
    console.log('drop fired');
  });
</script>
```

**Question:** The user drags `#source` over `#target` and releases the mouse button. What gets logged?

**Answer:** Only `"dragover fired"` (repeatedly, while hovering) — `"drop fired"` is never logged.

**Why:** By default, every element is an **invalid drop target**. The `dragover` handler must call `event.preventDefault()` to tell the browser "this element accepts drops" — without it, the browser's default behavior wins (rejecting the drop, often shown as a "no-drop" cursor), and the `drop` event never fires at all. Adding `e.preventDefault()` inside the `dragover` listener is required before `"drop fired"` would ever appear in the console.

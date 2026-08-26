*** copy 03-dialog-show-vs-showmodal-backdrop.md ***

# Output: `show()` vs `showModal()` — Is the Backdrop Visible?

```html
<dialog id="d">
  <p>Hello</p>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(255, 0, 0, 0.6);
  }
</style>

<script>
  document.getElementById('d').show();
</script>
```

**Question:** Does the red backdrop appear behind the dialog? Can the user still click/scroll the rest of the page while the dialog is open?

**Answer:** No red backdrop appears, and yes, the rest of the page remains fully interactive.

**Why:** `::backdrop` and the inert/modal behavior are only produced by `showModal()`, not `show()`. `show()` opens the dialog as a **non-modal** panel — it appears on top visually (dialogs are rendered in the top layer) but does not block interaction with the rest of the document, does not trap focus inside it, does not close on `Escape`, and generates no `::backdrop` box to style. Swapping to `document.getElementById('d').showModal()` would produce the red backdrop, trap focus inside the dialog, and make the rest of the page inert until `close()` is called.

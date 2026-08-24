# Scenario: Replacing a Custom Modal with `<dialog>` for a Confirm-Delete Flow

**Scenario:** Your team's "confirm delete" popup is a hand-rolled `<div class="modal">` with `position: fixed`, a manually-created backdrop `<div>`, JS that sets `tabindex` and loops focus between the first/last focusable child, and a `keydown` listener checking for `Escape`. QA keeps finding focus-trap bugs (Tab key occasionally escapes the modal into content behind it), and a recent accessibility audit flagged that screen reader users can still navigate "behind" the modal while it's open. How do you fix this with less code?

**Diagnosis:** Every bug described — focus escaping the trap, background content still reachable by assistive tech — is exactly what the native `<dialog>` element's `showModal()` handles correctly out of the box: it automatically traps focus inside the dialog, marks everything outside it as inert (unreachable by Tab, screen readers, and pointer clicks) while open, closes on `Escape`, and renders a native `::backdrop`. Swapping the hand-rolled modal for `<dialog>` deletes the custom focus-trap logic and the `Escape`-key listener entirely, while fixing both bugs.

**Before (simplified) — custom modal:**

```js
function openModal() {
  modalEl.style.display = 'block';
  backdropEl.style.display = 'block';
  firstFocusable.focus();
  document.addEventListener('keydown', trapFocusAndEscape); // easy to get subtly wrong
}
```

**After — native `<dialog>`:**

```html
<dialog id="confirm-delete">
  <p>Delete this item? This cannot be undone.</p>
  <form method="dialog">
    <button value="cancel">Cancel</button>
    <button value="confirm" autofocus>Delete</button>
  </form>
</dialog>

<style>
  #confirm-delete::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
</style>

<script>
  const dialog = document.getElementById('confirm-delete');

  function openConfirmDelete(onConfirm) {
    dialog.showModal(); // handles focus trap, inert background, Escape-to-close natively
    dialog.addEventListener(
      'close',
      () => {
        if (dialog.returnValue === 'confirm') onConfirm();
      },
      { once: true }
    );
  }
</script>
```

**Result:** No manual `tabindex` loop, no manual `Escape` listener, no manual `aria-hidden`/`inert` toggling on background content — `showModal()` guarantees all of it. The `autofocus` attribute on the "Delete" button (or "Cancel", depending on the desired default) sets initial focus without extra JS, and `<form method="dialog">` closes the dialog and sets `returnValue` automatically on submit, replacing what used to be manual click handlers on each button.

**Caveat to mention if asked:** Browser support for `<dialog>` is now broad in evergreen browsers, but if the product still needs to support very old browsers, a polyfill (`dialog-polyfill`) closes most of the gap — worth flagging as a follow-up check rather than a blocker to the migration.

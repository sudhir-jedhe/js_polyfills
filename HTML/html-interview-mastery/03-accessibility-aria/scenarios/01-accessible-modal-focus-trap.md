*** copy 01-accessible-modal-focus-trap.md ***

# Scenario: Building an Accessible Modal with Focus Trapping

**Scenario:** Design wants a "Delete Account" confirmation modal. QA's accessibility review finds three issues: (1) when the modal opens, focus stays on the page behind it, so a screen reader user has no idea the modal appeared; (2) Tab can move focus to page content behind the modal while it's open; (3) there's no way to close it with the keyboard. Fix all three.

**Diagnosis:** This is the classic "focus trap" requirement — a modal must both **move focus into itself on open** and **contain focus within itself while open** (a "trap," in the good sense — not the WCAG "keyboard trap" anti-pattern, since Escape must always provide an exit).

**Fix:**

```html
<div id="delete-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
  <h2 id="modal-title" tabindex="-1">Delete Account?</h2>
  <p>This action cannot be undone.</p>
  <button id="cancel-btn">Cancel</button>
  <button id="confirm-btn">Delete</button>
</div>
```

```js
const modal = document.getElementById('delete-modal');
const title = document.getElementById('modal-title');
let lastFocusedEl = null;

function openModal() {
  lastFocusedEl = document.activeElement; // remember who opened it, to restore focus later
  modal.hidden = false;
  title.focus(); // (1) move focus INTO the modal immediately — announces it exists

  document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
  modal.hidden = true;
  document.removeEventListener('keydown', handleModalKeydown);
  lastFocusedEl?.focus(); // return focus to the trigger — otherwise it resets to <body>
}

function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeModal(); // (3) always provide a keyboard escape hatch
    return;
  }
  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus(); // (2) wrap Shift+Tab from the first element to the last
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus(); // (2) wrap Tab from the last element back to the first
    }
  }
}
```

**Why this fixes all three issues:**
1. `title.focus()` on open immediately moves both visual and screen-reader focus into the modal, and `aria-modal="true"` plus `role="dialog"` correctly announce it as a dialog when focus lands there.
2. The `Tab`/`Shift+Tab` wraparound logic keeps focus cycling only among the modal's own focusable elements — page content behind it becomes unreachable via keyboard while open, which is the actual "trap."
3. The dedicated `Escape` handler, checked before the Tab-wrapping logic, guarantees the trap is always escapable — a real keyboard trap (WCAG 2.1.2 violation) would be a focus trap with **no** exit path at all.

Modern alternative: the native `<dialog>` element with `.showModal()` implements most of this (focus trapping, `Escape` to close, a `::backdrop`) natively in current browsers, reducing how much of this needs to be hand-rolled — but the underlying focus-management concepts here are exactly what `<dialog>` handles for you internally, and understanding them is what lets you debug it when `<dialog>`'s defaults don't cover your specific use case.

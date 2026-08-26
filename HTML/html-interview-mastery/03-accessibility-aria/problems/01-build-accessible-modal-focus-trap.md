*** copy 01-build-accessible-modal-focus-trap.md ***

# Problem: Build an Accessible Modal with Focus Trapping from Scratch

## Problem Statement

Build a reusable modal dialog: a trigger button opens it, focus must move into the modal on open and be trapped within it (Tab/Shift+Tab cycle only among the modal's own focusable elements), Escape closes it, clicking a backdrop closes it, and focus must return to the trigger button on close.

## Constraints

- Must work with any number/arrangement of focusable elements inside the modal (don't hardcode "first button, second button").
- Must correctly announce as a dialog to screen readers.
- No use of `<dialog>` — implement the underlying mechanics manually (this is the classic interview version of the exercise).

## Solution

```html
<button id="open-modal-btn">Open Settings</button>

<div class="backdrop" id="backdrop" hidden></div>
<div id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
  <h2 id="modal-title" tabindex="-1">Settings</h2>
  <label for="username">Username</label>
  <input id="username" type="text">
  <button id="save-btn">Save</button>
  <button id="close-btn">Cancel</button>
</div>
```

```js
const openBtn = document.getElementById('open-modal-btn');
const modal = document.getElementById('modal');
const backdrop = document.getElementById('backdrop');
const closeBtn = document.getElementById('close-btn');
const title = document.getElementById('modal-title');

let lastFocused = null;

function getFocusable() {
  return [...modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter(el => !el.disabled && el.offsetParent !== null); // exclude disabled/hidden elements dynamically
}

function openModal() {
  lastFocused = document.activeElement;
  modal.hidden = false;
  backdrop.hidden = false;
  title.focus();
  document.addEventListener('keydown', onKeydown);
}

function closeModal() {
  modal.hidden = true;
  backdrop.hidden = true;
  document.removeEventListener('keydown', onKeydown);
  lastFocused?.focus();
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  if (e.key !== 'Tab') return;

  const focusable = getFocusable(); // recomputed on every Tab press, so it stays correct if modal content changes dynamically
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
```

**Why this satisfies the constraints:** `getFocusable()` is recomputed fresh on every relevant Tab press rather than cached once at open time, so it correctly handles modals whose content changes after opening (e.g. a field becoming disabled). `role="dialog"` + `aria-modal="true"` + `aria-labelledby` gives assistive technology full context the moment focus lands on the programmatically-focused `<h2 tabindex="-1">`. The `Escape` check runs before the Tab-wrapping logic, guaranteeing an exit path always exists (avoiding a true keyboard trap), and `lastFocused?.focus()` on close restores focus exactly where the user left off, rather than letting it silently reset to `<body>`.

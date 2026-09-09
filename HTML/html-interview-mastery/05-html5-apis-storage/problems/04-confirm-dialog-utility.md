***  04-confirm-dialog-utility.md ***

# Problem: Build a Promise-Based `confirmDialog()` Utility Using `<dialog>`

## Problem Statement

Replace `window.confirm()` (blocking, unstyleable, browser-native-looking) with a `confirmDialog(message, options)` utility built on `<dialog>` that returns a `Promise<boolean>`, resolving `true` if confirmed and `false` if cancelled or dismissed via `Escape`/backdrop click.

## Requirements

- `confirmDialog(message, { confirmText = 'Confirm', cancelText = 'Cancel' } = {})` returns a `Promise<boolean>`.
- Only one `<dialog>` element should be created and reused across multiple calls (don't leak a new `<dialog>` into the DOM on every call).
- Pressing `Escape` (native `<dialog>` behavior) must resolve the promise with `false`, same as clicking Cancel.
- Calling `confirmDialog()` again while one is already open must wait for the current one to close before showing the next (no overlapping dialogs).
- Must use `showModal()`, not `show()`, so the rest of the page is properly inert while the prompt is open.

## Approach

Lazily create and cache a single `<dialog>` element (with its Cancel/Confirm buttons) the first time `confirmDialog` is called, reusing it on every subsequent call by just updating its text content. Use `<form method="dialog">` so both buttons and `Escape` naturally set `dialog.returnValue` and close the dialog through the same code path, then read `returnValue` in the `close` event to resolve the promise. Serialize concurrent calls with a simple pending-promise chain so a second call waits for the first dialog to finish closing.

## Solution

```js
let dialogEl = null;
let queue = Promise.resolve(); // serializes overlapping calls

function ensureDialog() {
  if (dialogEl) return dialogEl;

  dialogEl = document.createElement('dialog');
  dialogEl.innerHTML = `
    <p class="confirm-message"></p>
    <form method="dialog">
      <button value="cancel" class="cancel-btn"></button>
      <button value="confirm" class="confirm-btn" autofocus></button>
    </form>
  `;
  document.body.appendChild(dialogEl);
  return dialogEl;
}

function confirmDialog(message, { confirmText = 'Confirm', cancelText = 'Cancel' } = {}) {
  // Chain onto the queue so a second call waits for the first dialog to fully close first.
  const run = () =>
    new Promise((resolve) => {
      const dialog = ensureDialog();
      dialog.querySelector('.confirm-message').textContent = message;
      dialog.querySelector('.cancel-btn').textContent = cancelText;
      dialog.querySelector('.confirm-btn').textContent = confirmText;

      function onClose() {
        dialog.removeEventListener('close', onClose);
        // returnValue is "confirm"/"cancel" from a button, or "" if closed via Escape/backdrop
        resolve(dialog.returnValue === 'confirm');
      }

      dialog.addEventListener('close', onClose);
      dialog.showModal();
    });

  queue = queue.then(run);
  return queue;
}

// --- verification ---
(async () => {
  const ok = await confirmDialog('Delete this file?', { confirmText: 'Delete' });
  console.log('user confirmed:', ok); // true if "Delete" clicked, false if "Cancel" or Escape

  // Two overlapping calls — the second waits for the first dialog to close before opening
  confirmDialog('First?');
  confirmDialog('Second?'); // won't showModal() until the first one's `close` event has resolved
})();
```

**Why `returnValue` is `""` on `Escape`/backdrop dismissal, and why that's handled correctly:** `<dialog>`'s native `Escape` handling calls `close()` without going through the form submission path, so it doesn't set `returnValue` to either button's `value` — it's left as whatever it was (empty string, for a dialog that's never been explicitly closed with a value before). `dialog.returnValue === 'confirm'` correctly evaluates to `false` in that case, exactly matching the desired "cancelled" outcome, without needing a separate `cancel` event listener.

**Why a queue instead of just tracking "is a dialog open":** Reusing a single cached `<dialog>` means a second call before the first resolves would otherwise call `showModal()` on an already-open dialog (which throws) or silently overwrite its message mid-display. Chaining each call onto a shared `Promise` queue guarantees strict FIFO ordering — the second dialog only opens after the first one's `close` event has fully resolved the first call's promise.

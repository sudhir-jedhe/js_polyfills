***  07-template-and-dialog-elements.md ***

# The `<template>` and `<dialog>` Elements

Both are native HTML elements that solve problems developers used to reach for JavaScript libraries to handle: `<template>` for inert, reusable markup fragments, and `<dialog>` for accessible native modals.

## `<template>` — inert, unrendered markup

Content inside `<template>` is parsed by the browser (so it's valid, well-formed HTML) but is **never rendered** and **never executed** — scripts don't run, images don't load, custom elements don't upgrade — until it's cloned out into the live DOM via JavaScript.

```html
<template id="row-template">
  <tr>
    <td class="name"></td>
    <td class="email"></td>
  </tr>
</template>

<table id="users"></table>

<script>
  const template = document.getElementById('row-template');
  const table = document.getElementById('users');

  function addRow(user) {
    const clone = template.content.cloneNode(true); // deep clone the DocumentFragment
    clone.querySelector('.name').textContent = user.name;
    clone.querySelector('.email').textContent = user.email;
    table.appendChild(clone);
  }

  addRow({ name: 'Ada Lovelace', email: 'ada@example.com' });
</script>
```

Key facts:
- `template.content` is a **`DocumentFragment`**, not a live element — you must clone it (`cloneNode(true)`) before inserting into the DOM; appending `template.content` directly *moves* it out, emptying the template for future use.
- `<template>` content is **inert**: `<img>` sources don't fetch, `<script>` tags don't run, `<style>` doesn't apply — until the content is cloned into an active document, at which point it becomes normal live DOM and behaves as expected (scripts *inside a clone* still won't auto-run since they were already parsed as inert; but images will start loading once inserted).
- Before `<template>`, developers stored markup as strings (`innerHTML` blobs) or hidden `<div style="display:none">` blocks — both are worse: string HTML must be parsed on every use, and hidden `<div>`s still fetch resources (images load, scripts could run) since they're not actually inert, just visually hidden.

## `<dialog>` — native modal and non-modal dialogs

`<dialog>` provides a built-in, accessible dialog box with native show/hide, backdrop, and focus-trapping behavior — no ARIA-role plumbing or custom focus-trap JS required for the basics.

```html
<dialog id="confirm-dialog">
  <p>Are you sure you want to delete this item?</p>
  <form method="dialog">
    <button value="cancel">Cancel</button>
    <button value="confirm">Delete</button>
  </form>
</dialog>

<button id="open-btn">Delete item</button>

<script>
  const dialog = document.getElementById('confirm-dialog');
  document.getElementById('open-btn').addEventListener('click', () => {
    dialog.showModal();
  });

  dialog.addEventListener('close', () => {
    console.log('Result:', dialog.returnValue); // "cancel" or "confirm"
  });
</script>
```

### `show()` vs `showModal()`

| | `dialog.show()` | `dialog.showModal()` |
|---|---|---|
| Modal (blocks interaction with rest of page)? | No | Yes |
| Renders a `::backdrop`? | No | Yes — styleable via `::backdrop` |
| Traps focus inside the dialog? | No | Yes |
| Closes on `Escape` key automatically? | No | Yes |
| Rest of the page still interactive? | Yes | No — inert until closed |

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

### Closing a dialog

```js
dialog.close();           // closes, returnValue stays whatever it was
dialog.close('confirmed'); // closes and sets returnValue
```

`<form method="dialog">` is a convenient native pattern: submitting such a form inside a `<dialog>` closes the dialog automatically and sets `dialog.returnValue` to the `value` of whichever submit button (or input) triggered the submission — no JS click handler required for basic Cancel/Confirm flows.

### Why `<dialog>` matters for accessibility

Before `<dialog>`, a "modal" was typically a `<div>` with `role="dialog"`, `aria-modal="true"`, manual `tabindex` focus-trap JS, manual `Escape`-key handling, and manual `inert`/`aria-hidden` on background content — all easy to get subtly wrong. `showModal()` handles focus trapping, `Escape`-to-close, and marking the rest of the page inert to assistive tech, natively and correctly, out of the box.

### The `open` attribute

`<dialog>` also has a plain `open` boolean attribute reflecting its shown/hidden state, but toggling `open` directly via `element.open = true` behaves like `show()` (non-modal) — it does **not** produce a backdrop or focus trap. Always use `showModal()`/`close()` (the methods) rather than toggling the attribute directly when modal behavior is required.

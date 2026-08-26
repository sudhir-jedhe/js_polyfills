*** copy 07-template-and-dialog-together.md ***

# Snippet: `<template>` for a List + `<dialog>` for Confirmation

```html
<template id="item-template">
  <li class="item">
    <span class="item-name"></span>
    <button class="delete-btn">Delete</button>
  </li>
</template>

<ul id="list"></ul>

<dialog id="confirm-dialog">
  <p>Delete this item?</p>
  <form method="dialog">
    <button value="cancel">Cancel</button>
    <button value="confirm">Delete</button>
  </form>
</dialog>

<script>
  const template = document.getElementById('item-template');
  const list = document.getElementById('list');
  const dialog = document.getElementById('confirm-dialog');
  let pendingItem = null;

  function addItem(name) {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.item-name').textContent = name;
    clone.querySelector('.delete-btn').addEventListener('click', (e) => {
      pendingItem = e.target.closest('.item');
      dialog.showModal();
    });
    list.appendChild(clone);
  }

  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm' && pendingItem) {
      pendingItem.remove();
    }
    pendingItem = null;
  });

  addItem('Buy milk');
  addItem('Walk the dog');
</script>
```

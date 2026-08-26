*** copy 03-aria-live-region.md ***

# Snippet: `aria-live` Region

```html
<button id="add-to-cart">Add to Cart</button>
<p id="cart-status" aria-live="polite" class="visually-hidden"></p>
```

```js
document.getElementById('add-to-cart').addEventListener('click', () => {
  addItemToCart();
  document.getElementById('cart-status').textContent = 'Item added to cart. Cart now has 3 items.';
});
```

```html
<!-- assertive: for urgent, interrupting messages (form errors, session timeouts) -->
<div role="alert" aria-live="assertive">Your session is about to expire.</div>

<!-- polite: for non-urgent status updates (cart counts, save confirmations, loading states) -->
<div role="status" aria-live="polite">Changes saved.</div>
```

A live region only announces content that changes *after* the region already exists in the DOM — setting `textContent` on an element the instant it's created (or toggling `aria-live` on at the same moment you set the text) is unreliable across screen readers. The safe pattern is: have the empty live region present in the DOM from page load, and only update its `textContent` later, in response to an event.

***  01-storage-event-does-not-fire-on-same-tab.md ***

# Output: Does the `storage` Event Fire in the Same Tab?

```html
<script>
  window.addEventListener('storage', () => {
    console.log('storage event fired');
  });

  document.getElementById('btn').addEventListener('click', () => {
    localStorage.setItem('count', '1');
    console.log('setItem called');
  });
</script>
<button id="btn">Set</button>
```

**Question:** If this page is open in only ONE tab and the button is clicked, what gets logged?

**Answer:** Only `"setItem called"`. The `storage` event listener never fires.

**Why:** The `storage` event is dispatched only on **other** documents/tabs that share the same storage area — it never fires on the document that actually performed the write. To see `"storage event fired"` logged, you'd need this exact page open in a **second** tab; clicking the button in Tab A would then log `"storage event fired"` in Tab B's console, not Tab A's. This is a frequent trip-up: developers expect a same-tab "storage changed" notification and are surprised none exists — for same-tab reactivity, you typically wrap `setItem` in your own function that also updates local UI state directly.

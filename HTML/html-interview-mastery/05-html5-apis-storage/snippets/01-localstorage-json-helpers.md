*** copy 01-localstorage-json-helpers.md ***

# Snippet: localStorage JSON Read/Write Helpers

```js
function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadState(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback; // handles corrupted/non-JSON data gracefully
  }
}

saveState('cart', { items: ['sku-1', 'sku-2'], total: 42.5 });
loadState('cart', { items: [], total: 0 });
// { items: ['sku-1', 'sku-2'], total: 42.5 }

loadState('missing-key', { items: [], total: 0 });
// { items: [], total: 0 }  — falls back because getItem returned null
```

***  01-web-storage-fundamentals.md ***

# Web Storage Fundamentals: `localStorage`, `sessionStorage`, and the `storage` Event

The Web Storage API gives the browser two synchronous, origin-scoped key/value stores: `localStorage` and `sessionStorage`. Both expose the exact same interface — `setItem`, `getItem`, `removeItem`, `clear`, `key(index)`, and a `.length` property — so the difference between them is purely about **lifetime and scope**, not API shape.

## The shared API

```js
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');        // "dark"
localStorage.removeItem('theme');
localStorage.clear();                 // wipes every key for this origin
localStorage.length;                  // number of stored keys
localStorage.key(0);                  // key name at index 0
```

Everything stored is a **string**. Storing anything else silently calls `.toString()` on it — a classic gotcha:

```js
localStorage.setItem('user', { name: 'Ada' });
localStorage.getItem('user'); // "[object Object]"  — NOT the object back!

// Correct pattern: serialize explicitly
localStorage.setItem('user', JSON.stringify({ name: 'Ada' }));
const user = JSON.parse(localStorage.getItem('user'));
```

`getItem` on a missing key returns `null` (not `undefined`), so always guard before `JSON.parse`:

```js
const raw = localStorage.getItem('user');
const user = raw ? JSON.parse(raw) : null;
```

## `localStorage` vs `sessionStorage`

| | `localStorage` | `sessionStorage` |
|---|---|---|
| **Lifetime** | Persists indefinitely, survives browser restarts, until explicitly cleared | Persists only for the lifetime of the **tab** — cleared when the tab is closed |
| **Scope** | Shared across **all tabs/windows** of the same origin | Isolated **per tab** — even two tabs on the same origin have separate stores |
| **Survives page reload?** | Yes | Yes (same tab) |
| **Survives new tab to same site?** | Yes, same data | No — a fresh tab gets an empty `sessionStorage` |
| **Duplicating a tab** | N/A (shared anyway) | Chrome/Firefox copy `sessionStorage` into the duplicated tab |
| **Typical use case** | User preferences, auth tokens (with caveats), cached data that should persist across visits | Multi-step form state, wizard progress, per-tab UI state that shouldn't leak between tabs |

Both are scoped by **origin** (protocol + host + port) — `https://app.com` and `http://app.com` (different protocol) or `https://app.com:8080` (different port) have entirely separate storage areas, even though they look like "the same site" to a user.

## The `storage` event — cross-tab synchronization

Both storages fire a `storage` event on `window`, but with a crucial asymmetry: **the event fires on every *other* tab/document sharing that storage — never on the tab that made the change.** This makes it a natural tool for cross-tab sync (e.g., "log out in all tabs when the user logs out in one").

```js
window.addEventListener('storage', (e) => {
  console.log(e.key);       // the key that changed (null if clear() was called)
  console.log(e.oldValue);  // previous value (null if key was newly created)
  console.log(e.newValue);  // new value (null if key was removed)
  console.log(e.url);       // URL of the document that made the change
  console.log(e.storageArea); // reference to the localStorage/sessionStorage object
});
```

Because `localStorage` is shared across tabs but `sessionStorage` is per-tab, the `storage` event is only useful for cross-tab communication with `localStorage` — a change to one tab's `sessionStorage` never fires in any other tab, since no other tab even has access to that particular store.

```js
// Tab A
localStorage.setItem('auth', 'logged-out');

// Tab B (same origin, different tab) — this listener fires, Tab A's does NOT
window.addEventListener('storage', (e) => {
  if (e.key === 'auth' && e.newValue === 'logged-out') {
    location.reload(); // force Tab B to reflect the logout too
  }
});
```

## Storage limits and errors

Both storages throw a `DOMException` (`QuotaExceededError`) when the per-origin quota (typically ~5–10MB, browser-dependent) is exceeded. Always wrap writes that might hit the limit:

```js
try {
  localStorage.setItem('cache', JSON.stringify(bigPayload));
} catch (err) {
  if (err.name === 'QuotaExceededError') {
    // evict old entries, or fall back to IndexedDB for large data
  }
}
```

## Security notes

- Web Storage is accessible to **any JavaScript running on the page**, including injected third-party scripts — it is *not* protected against XSS the way an `HttpOnly` cookie is. Storing sensitive tokens in `localStorage` is a common but risky pattern for exactly this reason (see the comparison file for the cookie trade-off).
- Storage is synchronous and blocks the main thread — reading/writing large payloads repeatedly can cause jank, which is one reason IndexedDB (async) exists for anything beyond small key/value data.

# The Classic Comparison: localStorage vs sessionStorage vs Cookies vs IndexedDB

This is one of the most frequently asked HTML/browser interview questions — a single table comparing all four client-side storage mechanisms. Interviewers are usually probing for **capacity, persistence, sync vs. async, and whether the data is automatically sent with every HTTP request** (a huge, often-missed distinction).

## The comparison table

| | `localStorage` | `sessionStorage` | Cookies | IndexedDB |
|---|---|---|---|---|
| **Capacity** | ~5–10MB per origin (browser-dependent) | ~5–10MB per origin | ~4KB **per cookie**, ~20 cookies per domain typically | Hundreds of MB to GB (quota-managed, often disk-space-based) |
| **Persistence** | Until explicitly cleared | Until tab closes | Until expiry date/`Max-Age`, or session-only if omitted | Until explicitly cleared |
| **Sent with every HTTP request?** | **No** — never leaves the browser automatically | **No** | **Yes** — automatically attached to every matching request's `Cookie` header (unless `SameSite`/domain rules exclude it) | **No** |
| **API style** | Synchronous | Synchronous | Synchronous (via `document.cookie`, string-based) | **Asynchronous** (event-based, or Promise-wrapped) |
| **Data types** | Strings only | Strings only | Strings only | Structured data — objects, arrays, `Blob`, `File`, typed arrays — via structured clone |
| **Queryable / indexed?** | No — key/value only | No | No | Yes — supports indexes, cursors, range queries |
| **Accessible from Web Workers?** | No | No | No | Yes |
| **Scope** | Origin | Origin + tab | Domain + path (configurable) | Origin |
| **Server-settable?** | No (JS only) | No (JS only) | Yes, via `Set-Cookie` response header | No (JS only) |
| **Can be `HttpOnly` (hidden from JS)?** | No | No | Yes | No |
| **Typical use case** | Preferences, feature flags, small caches | Per-tab wizard/form state | Auth session identifiers, CSRF tokens, server-read state | Offline app data, large datasets, file caches (PWAs) |

## Why "sent with every request" matters

This is the single most important practical difference and the one interviewers most want to hear articulated clearly:

- **Cookies** are automatically attached to matching requests by the browser itself — this is *why* cookies were historically used for session identifiers (the server just reads the `Cookie` header on every request, no extra JS-side work needed). It's also a performance cost: every cookie set for a domain adds bytes to *every single request* to that domain, including static assets, unless scoped carefully with `Path`/`Domain`.
- **localStorage, sessionStorage, and IndexedDB** are never transmitted automatically. If a server needs data from them, the page's JavaScript has to explicitly read it and attach it (e.g., as an `Authorization` header on a `fetch` call).

## Why cookies can be more secure for auth tokens

A cookie marked `HttpOnly` is **invisible to JavaScript** — `document.cookie` simply won't include it. This means an XSS vulnerability that lets an attacker run arbitrary JS on your page still cannot read an `HttpOnly` cookie, whereas it *can* read anything in `localStorage` or `sessionStorage` (since Web Storage has no equivalent protection — it's fully readable by any script on the page). This is why many security guides recommend `HttpOnly` + `Secure` + `SameSite=Strict` cookies for session tokens over `localStorage`, despite `localStorage` being more convenient to use from JS.

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

- `HttpOnly` — not readable via `document.cookie`/JS
- `Secure` — only sent over HTTPS
- `SameSite=Strict` — not sent on cross-site requests, mitigating CSRF

## Sync vs. async — why IndexedDB is different

`localStorage` and `sessionStorage` are **synchronous** — every call blocks the main thread until it completes, which is fine for tiny reads/writes but a real problem for large data (janky UI, and it can't be used inside Web Workers at all). `IndexedDB` is **asynchronous** and event/Promise-based specifically so large read/write operations (thousands of records, large blobs) don't block rendering:

```js
// IndexedDB — asynchronous, transaction-based
const request = indexedDB.open('my-db', 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore('notes', { keyPath: 'id' });
};

request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('notes', 'readwrite');
  tx.objectStore('notes').put({ id: 1, text: 'Buy milk' });
  tx.oncomplete = () => console.log('saved');
};
```

Because it's async and usable inside Web Workers, IndexedDB is the standard choice for offline-first apps and PWAs storing meaningful amounts of structured data (cached API responses, file attachments, whole app datasets), while Web Storage remains the go-to for small, simple key/value settings.

## Quick decision guide

- Need something read automatically by the **server** on every request? → **Cookie**.
- Need a small client-only value that should persist across visits? → **`localStorage`**.
- Need per-tab, throwaway state (e.g., a multi-step form)? → **`sessionStorage`**.
- Need to store structured objects, files, or a meaningful amount of data, or need it available inside a Web Worker? → **IndexedDB**.

*** copy 06-web-workers-basics.md ***

# Web Workers: Offloading Work Off the Main Thread

JavaScript in the browser is single-threaded by default — a long-running computation (parsing a huge JSON payload, image processing, heavy math) blocks the main thread, freezing scrolling, input, and rendering. **Web Workers** run JavaScript in a background thread, separate from the main (UI) thread, so expensive work doesn't block the page.

## Creating a worker

```html
<!-- index.html -->
<script src="main.js"></script>
```

```js
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ command: 'sum', numbers: [1, 2, 3, 4, 5] });

worker.onmessage = (e) => {
  console.log('Result from worker:', e.data);
};

worker.onerror = (e) => {
  console.error('Worker error:', e.message);
};
```

```js
// worker.js
self.onmessage = (e) => {
  const { command, numbers } = e.data;
  if (command === 'sum') {
    const result = numbers.reduce((a, b) => a + b, 0);
    self.postMessage(result);
  }
};
```

## How communication works: `postMessage` and structured cloning

Workers do **not** share memory with the main thread (with the narrow exception of `SharedArrayBuffer`). Data passed via `postMessage` is copied using the **structured clone algorithm**, not passed by reference — mutating an object on one side after sending it has no effect on the other side's copy. Structured clone supports most data types (objects, arrays, `Map`, `Set`, `Date`, typed arrays) but **not** functions, DOM nodes, or class instances with methods/prototypes (those get stripped or throw).

```js
// Transferable objects avoid a copy for performance-critical large binary data
worker.postMessage(largeArrayBuffer, [largeArrayBuffer]); // ownership transferred, zero-copy
```

## What workers can and can't access

| Available in a Worker | NOT available in a Worker |
|---|---|
| `fetch`, `XMLHttpRequest` | `document`, the DOM |
| `setTimeout`/`setInterval` | `window` object (workers have `self` instead) |
| `IndexedDB` | `localStorage`/`sessionStorage` (synchronous storage is disallowed on worker threads) |
| `Web Sockets` | Direct access to variables/objects on the main thread |
| Most Web APIs not requiring the DOM | Any DOM manipulation whatsoever |

This is the fundamental trade-off: a worker can do heavy computation and I/O in parallel, but it **cannot touch the DOM directly** — any UI update has to happen by posting a message back to the main thread, which then updates the DOM itself.

## Terminating a worker

```js
worker.terminate();   // from the main thread — immediately stops the worker
self.close();         // from inside the worker itself
```

Workers that are no longer needed should be terminated explicitly — they aren't garbage collected just because references to them go out of scope in some cases, and a forgotten worker keeps running (and keeps a background thread alive) indefinitely.

## Dedicated vs. Shared vs. Service Workers (brief distinction)

| | Dedicated Worker | Shared Worker | Service Worker |
|---|---|---|---|
| Accessible from | Single script/page that created it | Multiple tabs/scripts of the same origin | The whole origin, even when no page is open |
| Typical use | Offloading a single page's heavy computation | Coordinating state across multiple open tabs | Network proxy — caching, offline support, push notifications |
| Lifetime | Tied to the page that spawned it | Lives as long as any connected page is open | Can outlive all open tabs (event-driven) |

Service Workers are a large enough topic (offline caching, push notifications, PWA install) that they're typically covered separately — the key HTML/API-integration point here is simply that `new Worker('worker.js')` is the entry point for a **Dedicated Worker**, the simplest and most commonly asked-about form in interviews.

## When to reach for a Worker

- Parsing/transforming large JSON or CSV client-side
- Heavy image/canvas pixel manipulation
- Complex, CPU-bound calculations (cryptography, compression) that would otherwise cause visible jank
- **Not** needed for ordinary async I/O like `fetch` — network requests are already non-blocking on the main thread because they're handled by the browser's networking layer, not JS computation; a Worker only helps with CPU-bound work.

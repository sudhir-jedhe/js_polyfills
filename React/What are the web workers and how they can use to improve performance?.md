**Web Workers** are a browser API that allows JavaScript code to run in background threads, completely separate from the browser’s main execution thread.

JavaScript in the browser is single-threaded by default. The **main thread** handles everything from executing your application code and handling user interactions to running UI layout, style calculations, and screen rendering (the 60/120 FPS paint loop). If a heavy computational task runs on the main thread, the entire page freezes (unresponsive UI, delayed clicks, dropped animations, and poor Interaction to Next Paint / INP).

Web Workers solve this by offloading CPU-intensive tasks to background worker threads.

---

### Main Thread vs. Web Worker Thread

```
[ Main UI Thread ] ──▶ User Clicks ──▶ Animations / Rendering ──▶ Fast INP (Smooth)
                               │ (postMessage)
                               ▼
[ Web Worker Thread ] ──▶ Heavy Parsing / Image Processing / Crypto / Math Crunching
                               │ (postMessage)
                               ▼
[ Main UI Thread ] ◀── Receives Clean Data / Updates State

```

---

### How Web Workers Improve Performance

* **Eliminates UI Blocking (Fixes Poor INP & TBT):** Offloading heavy computation prevents the main thread from stalling, keeping inputs, scrolling, and button clicks responsive.
* **True Multithreading & Multi-core CPU Utilization:** Modern devices have 4–16 CPU cores. Single-threaded JS only utilizes one core, while Web Workers leverage hardware concurrency across multiple background cores.
* **Non-blocking Data Ingestion & Parsing:** Processing massive datasets (large JSON payloads, CSV parsing, SQLite in-browser queries via WASM) happens in the background without UI stutter.
* **Background Asset & Media Processing:** Tasks like client-side image compression (`OffscreenCanvas`), audio synthesis, PDF generation, or video transcoding run smoothly in isolation.

---

### Basic Implementation Example

Communication between the main thread and a Web Worker happens via **message passing** (`postMessage` and `onmessage`).

#### 1. Worker Script (`worker.js`)

```javascript
// worker.js - Runs in a separate background thread
self.onmessage = function (event) {
  const { numbers } = event.data;

  // CPU-heavy calculation (e.g. sorting or heavy math)
  const result = numbers.map((n) => Math.sqrt(n) * Math.sin(n));

  // Send the processed result back to the main thread
  self.postMessage({ result });
};

```

#### 2. Main Thread Script (`main.js`)

```javascript
// main.js - Runs on the Main UI Thread
const worker = new Worker('worker.js');

// 1. Send data to worker
const largeDataset = Array.from({ length: 1_000_000 }, (_, i) => i);
worker.postMessage({ numbers: largeDataset });

// 2. Receive processed data without blocking the UI
worker.onmessage = function (event) {
  console.log('Calculation complete:', event.data.result);
};

worker.onerror = function (error) {
  console.error('Worker error:', error);
};

// Terminate worker when no longer needed to free memory
// worker.terminate();

```

---

### Advanced Optimization: Transferable Objects

By default, data sent via `postMessage` is serialized using the **Structured Clone Algorithm** (making a deep copy in memory). For large `ArrayBuffer`s, `TypedArray`s, or `ImageBitmap`s, this copying overhead can cause latency.

Using **Transferable Objects** transfers ownership of the underlying memory block instantly ($O(1)$ zero-copy transfer) to the worker:

```javascript
const buffer = new ArrayBuffer(1024 * 1024 * 64); // 64MB buffer

// Pass buffer in the transfer list (2nd argument)
worker.postMessage({ buffer }, [buffer]);

// `buffer.byteLength` is now 0 on the main thread (neutered)

```

---

### Limitations & Rules of Web Workers

1. **No Direct DOM Access:** Workers run in a `WorkerGlobalScope`, not `window`. They cannot access `document.querySelector`, `window.localStorage`, or `alert()`.
2. **Supported APIs:** Workers have access to `fetch()`, `WebSockets`, `IndexedDB`, `OffscreenCanvas`, `crypto`, `createImageBitmap()`, and `WebAssembly`.
3. **Same-Origin Policy:** The worker script must be served from the same origin (protocol, domain, port) as the parent page (unless using blob URLs or modern bundlers).

---

### Types of Web Workers

| Type                  | Scope / Lifetime                                       | Primary Use Case                                                          |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Dedicated Workers** | Single tab / parent script                             | Heavy calculations, background compression, parsing                       |
| **Shared Workers**    | Shared across multiple tabs/windows of the same origin | Cross-tab synchronization, shared WebSocket connections                   |
| **Service Workers**   | Persistent proxy between browser and network           | PWA offline caching, background push notifications, intercepting requests |

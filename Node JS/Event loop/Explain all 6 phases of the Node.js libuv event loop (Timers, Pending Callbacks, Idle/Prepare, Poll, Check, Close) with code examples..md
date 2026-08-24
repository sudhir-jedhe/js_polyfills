The Node.js event loop is powered by **libuv**, a multi-platform C library that handles asynchronous non-blocking I/O.

Unlike the browser event loop (which maintains a single general task queue), libuv structures execution into **6 distinct phases** that execute sequentially in a tick. Between every phase and individual callback execution, Node.js checks and drains the **`nextTickQueue`** and the **Microtask Queue** (Promises).

---

### The Complete Event Loop Lifecycle

```
   ┌───────────────────────────────────┐
┌─►│ 1. Timers Phase                   │◄── setTimeout(), setInterval()
│  └─────────────────┬─────────────────┘
│                    │ ◄─── (Drains nextTickQueue & Microtask Queue)
│  ┌─────────────────▼─────────────────┐
│  │ 2. Pending (I/O) Callbacks Phase  │◄── Deferred OS errors (ECONNREFUSED, etc.)
│  └─────────────────┬─────────────────┘
│                    │ ◄─── (Drains nextTickQueue & Microtask Queue)
│  ┌─────────────────▼─────────────────┐
│  │ 3. Idle, Prepare Phase            │◄── Internal libuv operations only
│  └─────────────────┬─────────────────┘
│                    │ ◄─── (Drains nextTickQueue & Microtask Queue)
│  ┌─────────────────▼─────────────────┐
│  │ 4. Poll Phase (Heart of I/O)      │◄── Incoming network, FS reads, blocks if idle
│  └─────────────────┬─────────────────┘
│                    │ ◄─── (Drains nextTickQueue & Microtask Queue)
│  ┌─────────────────▼─────────────────┐
│  │ 5. Check Phase                    │◄── setImmediate()
│  └─────────────────┬─────────────────┘
│                    │ ◄─── (Drains nextTickQueue & Microtask Queue)
│  ┌─────────────────▼─────────────────┐
│  │ 6. Close Callbacks Phase          │◄── socket.on('close'), handle cleanup
│  └─────────────────┬─────────────────┘
└────────────────────┘

```

---

### 1. Timers Phase

Executes callbacks scheduled by `setTimeout()` and `setInterval()`.

* **Internal Mechanism:** libuv maintains an internal min-heap of timers ordered by threshold timestamp. The event loop checks the current time against the smallest timer in the heap; if expired, its callback is pushed to the call stack.
* **Guarantee:** Timers define the *minimum* threshold after which a callback can execute, not the exact millisecond time.

```javascript
// Timers Phase Example
const start = Date.now();

setTimeout(() => {
  console.log(`[Phase 1: Timers] Executed after ${Date.now() - start}ms`);
}, 50);

```

---

### 2. Pending Callbacks (I/O Callbacks) Phase

Executes I/O callbacks deferred from the previous loop iteration, particularly low-level OS errors.

* **Internal Mechanism:** If a network socket receives an OS error (like `ECONNREFUSED` on TCP connect) while processing in the Poll phase, some Unix systems report the error immediately. Libuv defers reporting the error to this phase instead of interrupting the active poll cycle.

```javascript
// Pending Callbacks Phase Example
import net from 'node:net';

const client = net.connect({ port: 9999, host: '127.0.0.1' });

client.on('error', (err) => {
  // If port 9999 is closed, the OS connection failure callback
  // executes here in the Pending Callbacks phase
  console.log('[Phase 2: Pending Callbacks] Connection error:', err.code);
});

```

---

### 3. Idle / Prepare Phase

An internal phase used exclusively by libuv for housekeeping and preparing engine subsystems before polling starts.

* **Internal Mechanism:** No user JavaScript executes here. Libuv uses this phase to reset handles, update internal loop timestamps, and prepare event demultiplexers (`epoll`, `kqueue`, or `IOCP`).

---

### 4. Poll Phase (The Engine's Heart)

Retrieves new I/O events (incoming network connections, disk data, HTTP requests) and executes their callbacks.

* **Two Core Responsibilities:**

1. Calculate how long to block and wait for I/O.
2. Process all ready events in the poll queue.

```javascript
// Poll Phase Example
import fs from 'node:fs';

fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) throw err;
  // When OS file I/O finishes, this callback is processed in the Poll phase
  console.log('[Phase 4: Poll Phase] File read completed');
});

```

#### The Blocking Behavior of the Poll Phase

If the poll queue is empty, the event loop does **not** spin at 100% CPU. Instead:

* If callbacks were scheduled with **`setImmediate()`**, the loop leaves the Poll phase and advances to the **Check phase**.
* If **timers** are pending, it blocks/sleeps for the duration of the shortest timer threshold, then wraps around to the Timers phase.
* If no timers or `setImmediate` exist, it sleeps indefinitely waiting for incoming network/disk events.

---

### 5. Check Phase (`setImmediate`)

Executes callbacks scheduled via **`setImmediate()`**.

* **Internal Mechanism:** Allows scripts to run code immediately after the Poll phase completes, without waiting for timers to expire.

```javascript
// Check Phase Example
setImmediate(() => {
  console.log('[Phase 5: Check Phase] setImmediate executed');
});

```

#### Classic Interview Question: `setTimeout(..., 0)` vs `setImmediate()`

Inside an **I/O cycle**, `setImmediate` is **always guaranteed to run before `setTimeout**`:

```javascript
import fs from 'node:fs';

fs.readFile('package.json', () => {
  // We are now inside the Poll Phase
  setTimeout(() => console.log('1. setTimeout (Phase 1 next tick)'), 0);
  setImmediate(() => console.log('2. setImmediate (Phase 5 current tick)'));
});

// Output ALWAYS:
// 2. setImmediate (Phase 5 current tick)
// 1. setTimeout (Phase 1 next tick)

```

---

### 6. Close Callbacks Phase

Executes callbacks when handles or sockets are closed abruptly or via `.destroy()` / `.close()`.

* **Internal Mechanism:** If an emitter or stream emits `'close'`, its final teardown callback is dispatched in this phase to guarantee proper resource deallocation.

```javascript
// Close Callbacks Phase Example
import net from 'node:net';

const server = net.createServer((socket) => {
  socket.on('close', (hadError) => {
    console.log('[Phase 6: Close Callbacks] Socket closed cleanly');
  });

  socket.destroy(); // Triggers close event
}).listen(8080);

```

---

### Summary Comparison Table

| Phase                    | Handled By                                      | Typical APIs & Events                                          |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------------- |
| **1. Timers**            | libuv min-heap                                  | `setTimeout()`, `setInterval()`                                |
| **2. Pending Callbacks** | libuv I/O queue                                 | OS errors (`ECONNREFUSED`), deferred I/O status                |
| **3. Idle, Prepare**     | libuv internal                                  | Node.js internal loop management                               |
| **4. Poll**              | OS Event Notification (`epoll`/`kqueue`/`IOCP`) | Incoming HTTP requests, `fs.readFile`, TCP data chunks         |
| **5. Check**             | libuv check handle                              | `setImmediate()`                                               |
| **6. Close Callbacks**   | libuv handle close                              | `socket.on('close')`, `stream.on('close')`, handle destruction |

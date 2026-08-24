While Node.js is often described as "single-threaded," that only applies to the **V8 JavaScript main thread** and the **event loop**.

Under the hood, asynchronous operations that cannot be handled via non-blocking OS kernel primitives are offloaded to **libuv's internal C-level Worker Thread Pool**.

---

### Operating System Non-Blocking I/O vs. Thread Pool

Node.js splits asynchronous operations into two completely distinct categories:

```
                          ┌───────────────────────────┐
                          │   Node.js (Main Thread)   │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
  [ Category 1: OS Kernel APIs ]             [ Category 2: libuv Thread Pool ]
  • Network I/O (HTTP, TCP, UDP)             • File System (`fs.*`)
  • Non-blocking via OS notification         • Cryptography (`crypto.pbkdf2`, `hash`)
    (epoll on Linux, kqueue on macOS,        • Compression (`zlib.*`)
     IOCP on Windows)                        • DNS Lookups (`dns.lookup`)
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        ▼
                          [ Returns to Event Loop ]

```

1. **Network I/O:** Modern operating systems support true non-blocking sockets. A single main thread can manage thousands of open TCP connections using system notification mechanisms (`epoll`, `kqueue`, `IOCP`) **without using any worker threads**.
2. **File System, Cryptography & Compression:** Most operating systems do not provide universal, reliable non-blocking asynchronous file system APIs. Cryptographic hashing and compression are CPU-bound. For these, libuv dispatches the work to its **C-level worker thread pool**.

---

### Which APIs Use the libuv Thread Pool?

* **File System (`fs` module):** All asynchronous file operations (`fs.readFile`, `fs.writeFile`, `fs.stat`, etc.).
* **Cryptography (`crypto` module):** Asynchronous hashing, encryption, and key derivation (`crypto.pbkdf2`, `crypto.scrypt`, `crypto.randomBytes`, `crypto.generateKeyPair`).
* **Compression (`zlib` module):** Asynchronous compression algorithms (`zlib.gzip`, `zlib.brotliCompress`, `zlib.deflate`).
* **DNS Resolution (`dns` module):** Specifically `dns.lookup()`, which uses the synchronous system C library function `getaddrinfo(3)`. *(Note: `dns.resolve*()` uses `c-ares` and bypasses the thread pool).*

---

### Step-by-Step Execution Lifecycle

1. **Main Thread Dispatches Async Task:**
User code calls an asynchronous thread-pool-backed function (e.g., `crypto.pbkdf2(...)`).

2. **libuv Enqueues Task to Thread Pool:**
Libuv wraps the call into a C struct (`uv_work_t`) and pushes it onto an internal work queue.

3. **Available Worker Thread Executes Work:**
One of the idle background worker threads in the pool picks up the job, executes the synchronous C++ logic, and computes the result.

4. **Notification Sent Back to Event Loop:**
When the worker thread finishes, it uses an internal `uv_async_t` handle to signal the main event loop thread via an inter-thread notification channel.

5. **Callback Executed in Poll Phase:**
The main thread picks up the completed task from the I/O / Poll phase and pushes the JavaScript callback onto the Call Stack.

---

### Thread Pool Saturation & `UV_THREADPOOL_SIZE`

By default, libuv's thread pool contains **4 worker threads**.

If you dispatch more concurrent tasks than available threads, excess tasks will sit idle in the work queue waiting for an available thread, causing noticeable queue latency.

```javascript
// Demonstration: Saturating the default 4 threads
import crypto from 'node:crypto';

const start = performance.now();

for (let i = 1; i <= 8; i++) {
  crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', () => {
    console.log(`Task ${i} done: ${(performance.now() - start).toFixed(0)}ms`);
  });
}

```

#### Output with default 4 threads

```text
Task 1 done: ~210ms   <-- First batch of 4 completes simultaneously
Task 2 done: ~215ms
Task 3 done: ~218ms
Task 4 done: ~220ms
Task 5 done: ~420ms   <-- Second batch waited in the queue before starting
Task 6 done: ~422ms
Task 7 done: ~425ms
Task 8 done: ~430ms

```

---

### How to Tune `UV_THREADPOOL_SIZE`

You can configure the thread pool size up to a maximum of **1024** threads by setting the environment variable **before the Node.js process starts**.

#### 1. Via Terminal / CLI

```bash
# Set thread pool to match 8 CPU cores
UV_THREADPOOL_SIZE=8 node server.js

```

#### 2. In Windows PowerShell

```powershell
$env:UV_THREADPOOL_SIZE = 8; node server.js

```

#### 3. Why `process.env.UV_THREADPOOL_SIZE = 8` in JavaScript Does NOT Work

```javascript
// ❌ FAILS: By the time your JS runs, libuv has already initialized its thread pool!
process.env.UV_THREADPOOL_SIZE = 8;

```

Setting `process.env.UV_THREADPOOL_SIZE` inside your JS script is ignored because libuv initializes its internal pool the moment the Node.js process boots up, before executing any user JavaScript.

---

### Libuv Thread Pool vs. Node.js Worker Threads (`worker_threads`)

| Dimension            | libuv Thread Pool                                      | `worker_threads` Module                                               |
| -------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| **Layer**            | Low-level C/C++ background threads                     | High-level JavaScript threads                                         |
| **Runs JS Code?**    | **No** (runs compiled C++ libraries like OpenSSL/zlib) | **Yes** (spawns new V8 isolates and JS event loops)                   |
| **Managed By**       | libuv runtime internally                               | Developer application code                                            |
| **Config API**       | `UV_THREADPOOL_SIZE` environment variable              | `new Worker('./worker.js')`                                           |
| **Primary Use Case** | Built-in Node.js async operations (`fs`, `crypto`)     | Custom CPU-intensive JS calculations (image processing, data parsing) |

*** copy Node.js process.nextTick vs Promise microtasks.md ***

In Node.js, both `process.nextTick()` and `Promise` callbacks execute asynchronously outside the libuv I/O phases. However, they live in **separate internal queues**, and **`process.nextTick` always has higher priority than Promise microtasks**.

---

### The Internal Queue Architecture

Node.js manages microtasks using two distinct FIFO queues:

```
[ Call Stack (Synchronous Code) ]
               │
               ▼ (Stack empties)
┌─────────────────────────────────────────────────────────────┐
│ 1. nextTickQueue (`process.nextTick`)                       │
│    └─► HIGHEST PRIORITY: Drains completely to 0 first       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (nextTickQueue is empty)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Other Microtasks (Promise .then/catch/finally,           │
│    `queueMicrotask`, `async/await`)                         │
│    └─► Drains completely to 0 second                        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (All microtasks drained)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Libuv Event Loop Phases (Timers ➔ Poll ➔ Check ➔ Close)  │
└─────────────────────────────────────────────────────────────┘

```

---

### Code Execution Proof

```javascript
console.log('1. Synchronous Start');

setTimeout(() => console.log('6. Macrotask (Timer Phase)'), 0);

Promise.resolve().then(() => console.log('4. Promise Microtask 1'));

process.nextTick(() => {
  console.log('3. process.nextTick');
  process.nextTick(() => console.log('3b. Nested nextTick'));
});

queueMicrotask(() => console.log('5. queueMicrotask'));

console.log('2. Synchronous End');

```

#### Output

```text
1. Synchronous Start
2. Synchronous End
3. process.nextTick
3b. Nested nextTick
4. Promise Microtask 1
5. queueMicrotask
6. Macrotask (Timer Phase)

```

#### Execution Breakdown

1. Synchronous code logs `1` and `2`.
2. `process.nextTick` pushes its callback to the **`nextTickQueue`**.
3. `Promise.resolve().then()` and `queueMicrotask()` push callbacks to the **standard microtask queue**.
4. The synchronous stack clears. Node.js processes the `nextTickQueue` first $\rightarrow$ logs `3`.
5. The nested `nextTick` is added to the current `nextTickQueue` and runs immediately $\rightarrow$ logs `3b`.
6. Once the `nextTickQueue` is completely empty, the engine moves to the standard microtask queue $\rightarrow$ logs `4` and `5`.
7. Finally, libuv proceeds to the **Timers phase** of the event loop $\rightarrow$ logs `6`.

---

### Comparison Matrix

| Feature             | `process.nextTick()`                                  | Promise Microtasks (`Promise`, `queueMicrotask`)          |
| ------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| **Origin**          | Node.js runtime API (C++ binding)                     | ECMAScript standard specification                         |
| **Priority**        | **Highest async priority**                            | Lower priority than `nextTick`                            |
| **Cross-Platform**  | Node.js / Bun only (not standard in browsers)         | Universal (Browsers, Node.js, Deno, Workers)              |
| **Starvation Risk** | **Extreme** (recursive calls starve I/O and promises) | High (recursive calls starve I/O, but run after nextTick) |
| **Execution Point** | Immediately after the current phase / call stack      | Immediately after `nextTickQueue` drains                  |

---

### Why Does `process.nextTick` Exist? (Core Use Cases)

**1. Allowing Callers to Attach Handlers Before Emitting Events**
In Node.js event emitters, constructors execute synchronously. Emitting an event synchronously inside a constructor fails because the consumer hasn't attached a listener yet:

```javascript
import { EventEmitter } from 'node:events';

class StreamEmitter extends EventEmitter {
  constructor() {
    super();
    // Emit after constructor returns, but BEFORE the event loop continues
    process.nextTick(() => {
      this.emit('ready', { status: 'initialized' });
    });
  }
}

const stream = new StreamEmitter();
// Listener attaches synchronously right after instantiation:
stream.on('ready', (data) => console.log(data)); // ✅ Works!

```

**2. Consistent Asynchrony (Preventing the "Zalgo" Anti-Pattern)**
If an API performs async operations under some conditions and returns synchronously under others, `process.nextTick` guarantees that errors or callbacks are always delivered on the next turn:

```javascript
function maybeAsyncOperation(cacheHit, callback) {
  if (cacheHit) {
    // Guarantees callback is always called asynchronously
    process.nextTick(callback);
    return;
  }
  fs.readFile('/path', callback);
}

```

---

### Modern Best Practice

* **Default to standard Promises / `queueMicrotask()**` for cross-runtime portability and standard async control flow.
* **Reserve `process.nextTick()**` exclusively for Node.js-specific low-level library/package development where you must execute a callback *before* the event loop continues or before any promises run.

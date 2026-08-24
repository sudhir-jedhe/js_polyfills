The JavaScript runtime coordinates synchronous and asynchronous execution using a single main-thread **Call Stack**, an **Event Loop**, and two distinct FIFO priority queues: the **Microtask Queue** and the **Task (Macrotask) Queue**.

---

### Core Runtime Architecture

```
                                  ┌───────────────────────────┐
                                  │        CALL STACK         │
                                  │ [ Function Exec Context ] │
                                  │ [  Global Exec Context  ] │
                                  └─────────────┬─────────────┘
                                                │ (When Stack is Empty)
                                                ▼
                                    ┌───────────────────────┐
                                    │      EVENT LOOP       │
                                    └───────────┬───────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
    ┌───────────────────────────┐                                 ┌───────────────────────────┐
    │     MICROTASK QUEUE       │                                 │    TASK (MACROTASK) QUEUE │
    │ (High Priority / Drains)  │                                 │    (One per Event Loop)   │
    ├───────────────────────────┤                                 ├───────────────────────────┤
    │ • Promises (.then/catch)  │                                 │ • setTimeout / setInterval│
    │ • queueMicrotask()        │                                 │ • setImmediate (Node.js)  │
    │ • MutationObserver        │                                 │ • UI Events (click/input) │
    │ • process.nextTick (Node) │                                 │ • I/O operations & fetch  │
    └───────────────────────────┘                                 └───────────────────────────┘

```

---

### The Event Loop Turn: Step-by-Step Coordination

The Event Loop constantly evaluates whether to yield to rendering, process pending tasks, or flush microtasks. Each tick follows this strict sequence:

1. **Synchronous Call Stack Drain:**
Execute synchronous code. Every function call creates a new **Function Execution Context** pushed onto the Call Stack. The stack executes until completely empty.

2. **Complete Microtask Queue Drain (Drain to Exhaustion):**
Once the Call Stack is clear, the Event Loop checks the **Microtask Queue**.

* It pops microtasks one by one, pushes them onto the Call Stack, and runs them.
* **Crucial Behavior:** If a running microtask schedules *another* microtask, the new one is added to the **current queue** and processed in the *same cycle*. The engine does not proceed until the microtask queue is completely empty ($0$ items).

1. **Render Pipeline Check (Browser Only):**
The browser checks if a frame render is due (typically every $16.6\text{ ms}$ for 60Hz displays). If due:

* Runs `requestAnimationFrame` callbacks.
* Performs Style, Layout, and Paint passes.

1. **Pick Exactly ONE Macrotask:**
The Event Loop picks the oldest task from the **Task Queue** (e.g., a resolved `setTimeout` callback).

* Pushes that task's callback onto the Call Stack as a new Execution Context.
* Runs the task to completion.

1. **Repeat Loop:**
Immediately after that single task finishes, loop back to **Step 2 (Drain Microtasks)** before picking the next macrotask.

---

### Code Execution Trace Example

```javascript
console.log('1. Synchronous Start');

setTimeout(() => {
  console.log('2. Timeout Callback (Macrotask 1)');
  
  Promise.resolve().then(() => {
    console.log('3. Microtask inside Macrotask 1');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('4. Promise Microtask 1');
    queueMicrotask(() => console.log('5. Nested Microtask'));
  })
  .then(() => {
    console.log('6. Promise Microtask 2');
  });

console.log('7. Synchronous End');

```

#### Execution Breakdown

1. **Synchronous Pass:**

* Logs `1. Synchronous Start`.
* Enqueues `setTimeout` callback into the **Task (Macrotask) Queue**.
* Enqueues Promise callback (`4`) into the **Microtask Queue**.
* Logs `7. Synchronous End`.
* *Call Stack is now empty.*

1. **Drain Microtask Queue:**

* Runs `4. Promise Microtask 1`.
* Enqueues `5. Nested Microtask` into the active microtask queue.
* Runs `6. Promise Microtask 2` and `5. Nested Microtask`.
* *Microtask Queue is now empty.*

1. **Run 1 Macrotask:**

* Picks `setTimeout` callback. Logs `2. Timeout Callback (Macrotask 1)`.
* Enqueues `3. Microtask inside Macrotask 1`.

1. **Drain Microtask Queue again:**

* Runs `3. Microtask inside Macrotask 1`.

#### Output

```text
1. Synchronous Start
7. Synchronous End
4. Promise Microtask 1
6. Promise Microtask 2
5. Nested Microtask
2. Timeout Callback (Macrotask 1)
3. Microtask inside Macrotask 1

```

---

### Macrotasks vs. Microtasks Comparison

| Dimension             | Microtasks                                                                                                              | Tasks (Macrotasks)                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Typical APIs**      | `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`, `process.nextTick`                                  | `setTimeout`, `setInterval`, `setImmediate`, UI click/input events, network I/O                      |
| **Execution Cadence** | **All pending microtasks** are executed to completion before anything else.                                             | **Only 1 task** is executed per turn of the event loop.                                              |
| **Starvation Risk**   | **High:** An infinite recursive microtask loop (`queueMicrotask(fn)`) blocks the UI and freezes the browser completely. | **Low:** Macrotasks yield control back to the event loop, microtasks, and rendering after each task. |
| **UI Rendering**      | Runs **before** DOM re-rendering and layout passes.                                                                     | UI renders can happen **between** individual macrotasks.                                             |

---

### Practical Implications for App Architecture

* **State Batching in React:** React uses microtasks and transitions to batch multiple state updates together into a single reconciliation pass before rendering occurs.
* **Deferring Long Computations:** If a background task is freezing the UI, splitting it with `queueMicrotask()` will **not** fix the freeze (since microtasks block rendering). Instead, chunk it using `setTimeout(fn, 0)`, `scheduler.yield()`, or `requestIdleCallback()`.

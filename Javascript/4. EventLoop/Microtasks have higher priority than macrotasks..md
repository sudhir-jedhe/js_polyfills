**Microtasks have higher priority than macrotasks.**

Whenever the synchronous Call Stack finishes running, the Event Loop will **always drain the entire Microtask Queue first** before it even touches a single task from the Macrotask (Task) Queue.

---

### Priority Execution Order

The Event Loop follows this strict sequence on every turn:

$$\text{Synchronous Code} \longrightarrow \text{ALL Microtasks (Drain to 0)} \longrightarrow \text{UI Render (if due)} \longrightarrow \text{ONE Macrotask}$$

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Synchronous Code (Call Stack)                           │
│    └─► Runs to completion first.                            │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Stack is now empty)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Microtask Queue (HIGHEST ASYNC PRIORITY)                 │
│    └─► Promise.then/catch/finally, queueMicrotask,          │
│        MutationObserver, process.nextTick (Node.js)         │
│    └─► ALL pending microtasks run until queue is EMPTY (0). │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Microtasks completely drained)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Macrotask Queue (LOWER ASYNC PRIORITY)                   │
│    └─► setTimeout, setInterval, setImmediate, I/O, UI events│
│    └─► Picks and runs EXACTLY ONE macrotask.                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               └─► Loops back to check Microtasks!

```

---

### Code Execution Proof

```javascript
console.log('1. Sync Start');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise)');
});

console.log('2. Sync End');

```

#### Step-by-Step Execution Trace

1. **`1. Sync Start`** logs immediately (Synchronous).
2. `setTimeout` registers its callback in the **Macrotask Queue**.
3. `Promise.then` registers its callback in the **Microtask Queue**.
4. **`2. Sync End`** logs immediately (Synchronous).
5. The Call Stack is now empty. The Event Loop checks the **Microtask Queue first** $\rightarrow$ logs **`3. Microtask (Promise)`**.
6. Microtask Queue is empty. The Event Loop picks 1 item from the **Macrotask Queue** $\rightarrow$ logs **`4. Macrotask (setTimeout)`**.

#### Output

```text
1. Sync Start
2. Sync End
3. Microtask (Promise)
4. Macrotask (setTimeout)

```

---

### Key Behavioral Differences

| Feature             | Microtask Queue                                                     | Macrotask (Task) Queue                                           |
| ------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Priority**        | **Higher**                                                          | **Lower**                                                        |
| **Batch Size**      | **All items** in the queue are executed in one go until empty.      | **Only 1 task** is executed per turn of the event loop.          |
| **Starvation Risk** | **High** (Adding endless microtasks will freeze the UI completely). | **Low** (Yields control back to the event loop after each task). |
| **Common APIs**     | `Promise.then()`, `queueMicrotask()`, `MutationObserver`            | `setTimeout()`, `setInterval()`, `setImmediate()`, DOM events    |

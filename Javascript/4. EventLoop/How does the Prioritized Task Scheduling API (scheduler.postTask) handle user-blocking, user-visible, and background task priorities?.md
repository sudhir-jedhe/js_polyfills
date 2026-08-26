*** copy How does the Prioritized Task Scheduling API (scheduler.postTask) handle user-blocking, user-visible, and background task priorities?.md ***

The **Prioritized Task Scheduling API** (`scheduler.postTask()`) provides a native browser mechanism to schedule tasks with explicit priority levels, dynamic cancellation, and priority reassignment via `TaskController`.

---

### The Three Priority Levels

`scheduler.postTask(callback, options)` maps work into one of three distinct priority buckets managed by the browser's internal task queues:

| Priority Level                   | Description                                                                        | Typical Use Case                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **`'user-blocking'`**            | Highest task priority. Halts other non-critical browser tasks to run immediately.  | Urgent UI updates, critical input feedback, rendering a modal opening.           |
| **`'user-visible'`** *(Default)* | Standard task priority. Runs with normal priority without blocking critical input. | Rendering below-the-fold content, loading secondary UI data, standard app logic. |
| **`'background'`**               | Lowest task priority. Runs only when the main thread has spare idle capacity.      | Analytics beacons, logging, prefetching, offline cache warming, data cleanup.    |

---

### Priority Execution Order Demonstration

```javascript
console.log('1. Synchronous execution');

// Schedules a background task
scheduler.postTask(() => console.log('5. Background Task'), {
  priority: 'background',
});

// Schedules a default user-visible task
scheduler.postTask(() => console.log('4. User-Visible Task'), {
  priority: 'user-visible', // (Optional, this is default)
});

// Schedules an urgent user-blocking task
scheduler.postTask(() => console.log('3. User-Blocking Task'), {
  priority: 'user-blocking',
});

// Microtask runs before all postTask macrotasks
queueMicrotask(() => console.log('2. Microtask'));

```

#### Output

```text
1. Synchronous execution
2. Microtask
3. User-Blocking Task
4. User-Visible Task
5. Background Task

```

---

### Dynamic Control with `TaskController` & `TaskSignal`

`TaskController` extends standard `AbortController`, allowing you to both **cancel pending tasks** and **dynamically change priority on the fly**:

```javascript
const controller = new TaskController({ priority: 'background' });

// 1. Schedule initial background work
const taskPromise = scheduler.postTask(
  ({ signal }) => {
    if (signal.aborted) return;
    performHeavyDataSync();
  },
  { signal: controller.signal }
);

// 2. User suddenly clicks a button -> Escalate priority to 'user-blocking'
button.addEventListener('click', () => {
  controller.setPriority('user-blocking');
});

// 3. User navigates away -> Abort the task completely
navigation.addEventListener('navigate', () => {
  controller.abort();
});

```

---

### Passing Delays and Parameters

Like `setTimeout`, `postTask` supports a `delay` option, but it combines the timer with priority queuing once the timer expires:

```javascript
scheduler.postTask(
  () => fetchAnalytics(),
  {
    priority: 'background',
    delay: 2000, // Waits 2 seconds, then enters the background task queue
  }
);

```

---

### `postTask()` vs. Legacy Scheduling APIs

| API                        | Priority Control                                        | Supports Cancellation         | Async/Promise Based      |
| -------------------------- | ------------------------------------------------------- | ----------------------------- | ------------------------ |
| **`scheduler.postTask()`** | **Yes (`user-blocking`, `user-visible`, `background`)** | **Yes (`TaskController`)**    | **Yes (Native Promise)** |
| `setTimeout(fn, 0)`        | No (Standard task queue only)                           | Manual (`clearTimeout`)       | No (Callback-based)      |
| `requestIdleCallback()`    | Idle only (Unreliable on Safari)                        | Manual (`cancelIdleCallback`) | No (Callback-based)      |
| `queueMicrotask()`         | Microtask only (Blocks rendering)                       | No                            | No (Callback-based)      |

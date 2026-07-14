# Implement an Engine That Processes Async Callbacks

### JavaScript System Design + Complete Implementation

This is a common **Frontend System Design / JavaScript Interview** question.

Interviewers may phrase it as:

```txt
Implement a task scheduler
Implement async queue
Implement callback processor
Implement job engine
Implement async worker pool
Implement promise queue
```

---

# Problem

Suppose we have async callbacks:

```js
[() => fetchUser(), () => fetchOrders(), () => fetchProducts()];
```

We want an engine that:

✅ Executes tasks

✅ Handles async callbacks

✅ Controls concurrency

✅ Handles errors

✅ Supports retries

✅ Maintains task order

---

# Real World Examples

### File Upload Engine

```txt
Upload 100 files
Only process 5 at a time
```

---

### API Request Queue

```txt
100 requests
Concurrency = 3
```

---

### Notification System

```txt
Send notifications sequentially
```

---

# System Design

```txt
Task Queue
      │
      ▼
Scheduler
      │
      ▼
Worker Pool
      │
      ▼
Execute Async Callback
      │
      ▼
Success/Error
```

---

# Version 1: Sequential Execution

Execute one task at a time.

---

## Engine

```js
class AsyncEngine {
  constructor() {
    this.queue = [];
  }

  add(task) {
    this.queue.push(task);
  }

  async run() {
    const results = [];

    for (const task of this.queue) {
      try {
        const result = await task();

        results.push({
          status: "fulfilled",
          value: result,
        });
      } catch (error) {
        results.push({
          status: "rejected",
          reason: error.message,
        });
      }
    }

    return results;
  }
}
```

---

## Usage

```js
const engine = new AsyncEngine();

engine.add(() => Promise.resolve("Task 1"));

engine.add(() => Promise.resolve("Task 2"));

engine.add(() => Promise.resolve("Task 3"));

engine.run().then(console.log);
```

Output:

```js
[
  { status: "fulfilled", value: "Task 1" },
  { status: "fulfilled", value: "Task 2" },
  { status: "fulfilled", value: "Task 3" },
];
```

---

# Complexity

```txt
Tasks = n

Time = O(n)

Concurrency = 1
```

---

# Version 2: Concurrent Engine

Interviewers often ask:

> Execute maximum 3 callbacks simultaneously.

---

# Design

```txt
Queue
 │
 ▼
Worker 1
Worker 2
Worker 3
```

---

# Implementation

```js
class AsyncEngine {
  constructor(concurrency = 3) {
    this.concurrency = concurrency;
    this.queue = [];
  }

  add(task) {
    this.queue.push(task);
  }

  async run() {
    const results = [];
    let index = 0;

    async function worker() {
      while (index < this.queue.length) {
        const current = index++;

        try {
          const result = await this.queue[current]();

          results[current] = {
            status: "fulfilled",
            value: result,
          };
        } catch (error) {
          results[current] = {
            status: "rejected",
            reason: error.message,
          };
        }
      }
    }

    const workers = Array(this.concurrency)
      .fill(null)
      .map(() => worker.call(this));

    await Promise.all(workers);

    return results;
  }
}
```

---

# Usage

```js
const engine = new AsyncEngine(2);

engine.add(async () => {
  await delay(1000);
  return "A";
});

engine.add(async () => {
  await delay(500);
  return "B";
});

engine.add(async () => {
  await delay(300);
  return "C";
});

const result = await engine.run();

console.log(result);
```

---

# Execution

```txt
Time 0

Worker1 -> A
Worker2 -> B

B finished

Worker2 -> C

All complete
```

---

# Version 3: Retry Engine

Production systems require retries.

---

# Retry Utility

```js
async function retry(task, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }
  }
}
```

---

# Integrate Retry

```js
const result = await retry(task, 3);
```

---

# Exponential Backoff Retry

```txt
Attempt 1 -> 1s
Attempt 2 -> 2s
Attempt 3 -> 4s
```

---

```js
async function retryWithBackoff(task, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

---

# Version 4: Priority Queue Engine

Important interview extension.

---

## Tasks

```txt
High Priority → 1
Medium → 2
Low → 3
```

---

```js
engine.add(taskA, 3);
engine.add(taskB, 1);
engine.add(taskC, 2);
```

---

Before execution:

```js
queue.sort((a, b) => a.priority - b.priority);
```

Execution order:

```txt
taskB
taskC
taskA
```

---

# Version 5: Cancellation Support

Senior-level discussion.

---

## Add AbortController

```js
class Job {
  constructor(callback) {
    this.callback = callback;

    this.controller = new AbortController();
  }

  abort() {
    this.controller.abort();
  }
}
```

---

Usage:

```js
job.abort();
```

Useful for:

```txt
Search autocomplete
File uploads
API requests
```

---

# Version 6: Event Driven Engine

Exposes lifecycle hooks.

```js
engine.on("start");

engine.on("success");

engine.on("error");

engine.on("complete");
```

---

Implementation

```js
class AsyncEngine {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    this.listeners[event] ??= [];

    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    this.listeners[event]?.forEach((fn) => fn(payload));
  }
}
```

---

# Full Production Architecture

```txt
                Queue
                  │
                  ▼
            Scheduler
                  │
         ┌────────┴───────┐
         ▼                ▼

      Worker1         Worker2
         ▼                ▼

     Execute         Execute
       Task             Task

         ▼                ▼

     Retry Logic     Retry Logic

         ▼                ▼

      Success        Failure

         ▼                ▼

           Event System
```

---

# React Example

```jsx
useEffect(() => {
  const engine = new AsyncEngine(3);

  engine.add(() => fetchUser());

  engine.add(() => fetchOrders());

  engine.add(() => fetchProducts());

  engine.run();
}, []);
```

---

# Common Interview Follow-Ups

### Q1. Difference between Promise.all and Engine?

```txt
Promise.all
↓
All tasks start immediately

Async Engine
↓
Controls concurrency
```

---

### Q2. Why use a queue?

```txt
Prevent server overload
Control execution order
Limit concurrency
Add retries
```

---

### Q3. Time Complexity

```txt
n = number of tasks
```

Queue processing:

```txt
O(n)
```

Space:

```txt
O(n)
```

---

# Senior-Level Interview Answer

> An async callback processing engine is essentially a task scheduler that manages asynchronous jobs through a queue. Tasks are registered as callbacks that return promises. The engine can process them sequentially or with controlled concurrency using a worker pool. Production-ready implementations include retry mechanisms, exponential backoff, priority-based scheduling, cancellation via AbortController, and lifecycle events. This pattern is commonly used for API batching, file uploads, notification processing, background jobs, and frontend request orchestration.

# Async Engine with Retries, Concurrency Control & Cancellation

This is a common **Senior Frontend / JavaScript System Design** interview problem.

---

# 1. Real-World Scenario

Suppose you need to process:

```txt
100 File Uploads
50 API Calls
200 Email Notifications
```

Requirements:

✅ Process asynchronously

✅ Limit concurrency (e.g. 3 at a time)

✅ Retry failures

✅ Cancel running jobs

✅ Track progress

---

# 2. Architecture

```txt
                Task Queue
                     │
                     ▼
              Async Engine
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼

      Worker1     Worker2     Worker3
         │           │           │
         ▼           ▼           ▼

       Task A      Task B      Task C

         ▼           ▼           ▼

      Retry if failure

         ▼

      Success/Failed
```

---

# 3. Engine with Retry + Concurrency + Cancellation

```js
class AsyncEngine {
  constructor({ concurrency = 3, retries = 3 } = {}) {
    this.concurrency = concurrency;
    this.retries = retries;

    this.queue = [];
    this.controllers = new Map();
  }

  add(task) {
    this.queue.push(task);
  }

  cancel(taskId) {
    const controller = this.controllers.get(taskId);

    if (controller) {
      controller.abort();
    }
  }

  async retry(task, signal) {
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        return await task(signal);
      } catch (error) {
        if (signal.aborted) {
          throw error;
        }

        if (attempt === this.retries) {
          throw error;
        }

        const delay = 1000 * Math.pow(2, attempt);

        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async run() {
    const results = [];
    let currentIndex = 0;

    const worker = async () => {
      while (currentIndex < this.queue.length) {
        const taskIndex = currentIndex++;

        const task = this.queue[taskIndex];

        const controller = new AbortController();

        this.controllers.set(task.id, controller);

        try {
          const result = await this.retry(task.callback, controller.signal);

          results[taskIndex] = {
            status: "fulfilled",
            value: result,
          };
        } catch (error) {
          results[taskIndex] = {
            status: "rejected",
            reason: error.message,
          };
        } finally {
          this.controllers.delete(task.id);
        }
      }
    };

    const workers = Array(this.concurrency)
      .fill(null)
      .map(() => worker());

    await Promise.all(workers);

    return results;
  }
}
```

---

# 4. Example Usage with Retries

Create helper:

```js
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

Create engine:

```js
const engine = new AsyncEngine({
  concurrency: 2,
  retries: 3,
});
```

---

Add tasks:

```js
engine.add({
  id: "user-api",

  callback: async () => {
    await sleep(1000);

    console.log("User API Done");

    return "Users";
  },
});

engine.add({
  id: "order-api",

  callback: async () => {
    await sleep(500);

    throw new Error("Server Error");
  },
});

engine.add({
  id: "product-api",

  callback: async () => {
    await sleep(300);

    return "Products";
  },
});
```

---

Run:

```js
const result = await engine.run();

console.log(result);
```

Output:

```txt
User API Done

Retry attempt 1
Retry attempt 2
Retry attempt 3

[
  {
    status: "fulfilled",
    value: "Users"
  },
  {
    status: "rejected",
    reason: "Server Error"
  },
  {
    status: "fulfilled",
    value: "Products"
  }
]
```

---

# 5. Understanding Concurrency Control

Most important interview topic.

---

## Without Concurrency Control

```js
Promise.all(tasks);
```

Suppose:

```txt
1000 API Calls
```

All start immediately.

```txt
1000 Requests
 ↓
Server Overload
 ↓
429 Errors
```

---

## With Concurrency = 3

```js
new AsyncEngine({
  concurrency: 3,
});
```

Execution:

```txt
Queue

A
B
C
D
E
F
G
```

Workers:

```txt
Worker1 -> A
Worker2 -> B
Worker3 -> C
```

When B finishes:

```txt
Worker2 -> D
```

When C finishes:

```txt
Worker3 -> E
```

Only 3 tasks run at a time.

---

## Visual

```txt
Time 0

W1 -> A
W2 -> B
W3 -> C

----------------

B Finished

W2 -> D

----------------

C Finished

W3 -> E
```

---

# Why Needed?

Used for:

```txt
File uploads
Email sending
Background jobs
Data Migration
API batching
```

---

# 6. Add Cancellation Support

Another senior-level interview topic.

---

## Why?

User starts:

```txt
50 File Uploads
```

Then clicks:

```txt
Cancel Upload
```

Need to stop processing.

---

# AbortController Version

Task receives:

```js
signal;
```

---

Task:

```js
engine.add({
  id: "upload-1",

  callback: async (signal) => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        resolve("Upload Complete");
      }, 5000);

      signal.addEventListener("abort", () => {
        clearTimeout(timeout);

        reject(new Error("Upload Cancelled"));
      });
    });
  },
});
```

---

Cancel:

```js
engine.cancel("upload-1");
```

Output:

```txt
Upload Cancelled
```

---

# React Example

```jsx
useEffect(() => {
  const engine = new AsyncEngine({
    concurrency: 3,
    retries: 2,
  });

  engine.add({
    id: "users",

    callback: async () => fetchUsers(),
  });

  engine.add({
    id: "orders",

    callback: async () => fetchOrders(),
  });

  engine.run();

  return () => {
    engine.cancel("users");

    engine.cancel("orders");
  };
}, []);
```

---

# Interview Questions

### Why not use `Promise.all()`?

```txt
Promise.all
↓
Unlimited concurrency
```

Engine:

```txt
Controlled concurrency
Retries
Cancellation
Priority
Monitoring
```

---

### Why use AbortController?

```txt
Cancel in-flight requests
Prevent memory leaks
Avoid unnecessary work
```

---

### Time Complexity

Let:

```txt
n = tasks
```

Every task executes once:

```txt
O(n)
```

---

### Space Complexity

Store queue + results:

```txt
O(n)
```

---

# Senior-Level Interview Answer

> An async processing engine is a task scheduler that executes asynchronous callbacks from a queue. It supports controlled concurrency through worker pools, ensuring that only a fixed number of tasks run simultaneously. Failed tasks can be retried using exponential backoff, while cancellation is implemented with AbortController to stop running operations cleanly. This pattern is widely used for file uploads, API orchestration, background processing, notification delivery, and batch job execution in large-scale frontend and backend systems.

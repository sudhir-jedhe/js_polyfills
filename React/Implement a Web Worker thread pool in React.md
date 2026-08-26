*** copy Implement a Web Worker thread pool in React.md ***

Building a **Web Worker Thread Pool** in React allows you to run multiple heavy tasks in parallel across CPU cores using `navigator.hardwareConcurrency`, while queuing tasks when all workers are saturated.

---

### Core Architecture

```
[ React Component (dispatch tasks) ]
                │
                ▼
      ┌──────────────────┐
      │ Task Queue (FIFO)│
      └─────────┬────────┘
                │ Dispatches to available workers
       ┌────────┴────────┬────────────────┐
       ▼                 ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Worker 1     │  │ Worker 2     │  │ Worker N     │
│ (Core 1)     │  │ (Core 2)     │  │ (Core N)     │
└──────────────┘  └──────────────┘  └──────────────┘

```

---

### Step 1: The Generic Worker Script (`compute.worker.js`)

A standard message-driven worker that executes jobs and returns results paired with a correlation `id`:

```javascript
// compute.worker.js
self.onmessage = async (e) => {
  const { id, type, payload } = e.data;

  try {
    let result;

    switch (type) {
      case 'HEAVY_MATH':
        // Example: CPU-bound operation (e.g. prime calculation or hash)
        result = runExpensiveCalculation(payload);
        break;
      case 'IMAGE_FILTER':
        result = applyFilter(payload);
        break;
      default:
        throw new Error(`Unknown job type: ${type}`);
    }

    self.postMessage({ id, status: 'SUCCESS', result });
  } catch (error) {
    self.postMessage({ id, status: 'ERROR', error: error.message });
  }
};

function runExpensiveCalculation(num) {
  let count = 0;
  for (let i = 2; i <= num; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
}

```

---

### Step 2: The Reusable `WorkerPool` Class (`WorkerPool.js`)

This class manages worker threads, task queues, and dynamic dispatching:

```javascript
// WorkerPool.js
export class WorkerPool {
  constructor(workerUrl, poolSize = navigator.hardwareConcurrency || 4) {
    this.workerUrl = workerUrl;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.activeTasks = new Map(); // workerIndex -> { id, resolve, reject }

    this._init();
  }

  _init() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerUrl, { type: 'module' });
      
      worker.onmessage = (e) => this._onMessage(i, e.data);
      worker.onerror = (err) => this._onError(i, err);

      this.workers.push({
        instance: worker,
        busy: false,
      });
    }
  }

  exec(type, payload) {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const task = { id, type, payload, resolve, reject };

      const availableWorkerIndex = this.workers.findIndex((w) => !w.busy);

      if (availableWorkerIndex !== -1) {
        this._runTask(availableWorkerIndex, task);
      } else {
        this.queue.push(task);
      }
    });
  }

  _runTask(workerIndex, task) {
    const workerWrapper = this.workers[workerIndex];
    workerWrapper.busy = true;
    this.activeTasks.set(workerIndex, task);

    workerWrapper.instance.postMessage({
      id: task.id,
      type: task.type,
      payload: task.payload,
    });
  }

  _onMessage(workerIndex, data) {
    const task = this.activeTasks.get(workerIndex);
    if (!task) return;

    if (data.status === 'SUCCESS') {
      task.resolve(data.result);
    } else {
      task.reject(new Error(data.error));
    }

    this._freeWorker(workerIndex);
  }

  _onError(workerIndex, error) {
    const task = this.activeTasks.get(workerIndex);
    if (task) {
      task.reject(error);
    }
    this._freeWorker(workerIndex);
  }

  _freeWorker(workerIndex) {
    this.activeTasks.delete(workerIndex);
    const workerWrapper = this.workers[workerIndex];
    workerWrapper.busy = false;

    // Drain next queued task
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift();
      this._runTask(workerIndex, nextTask);
    }
  }

  terminate() {
    for (const w of this.workers) {
      w.instance.terminate();
    }
    this.workers = [];
    this.queue = [];
    this.activeTasks.clear();
  }
}

```

---

### Step 3: Custom React Hook (`useWorkerPool.js`)

Manage pool initialization and lifecycle cleanup safely inside React:

```javascript
// useWorkerPool.js
import { useEffect, useRef, useCallback, useState } from 'react';
import { WorkerPool } from './WorkerPool';

export function useWorkerPool(workerScriptUrl, poolSize) {
  const poolRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize pool on mount
    const pool = new WorkerPool(workerScriptUrl, poolSize);
    poolRef.current = pool;
    setIsReady(true);

    return () => {
      // Terminate all workers when component unmounts
      pool.terminate();
      poolRef.current = null;
      setIsReady(false);
    };
  }, [workerScriptUrl, poolSize]);

  const runTask = useCallback((type, payload) => {
    if (!poolRef.current) {
      return Promise.reject(new Error('Worker pool is not initialized'));
    }
    return poolRef.current.exec(type, payload);
  }, []);

  return { runTask, isReady };
}

```

---

### Step 4: Batch Processing in a Component

Execute dozens of batch tasks across the pool in parallel:

```jsx
// BatchProcessingDashboard.jsx
import { useState } from 'react';
import { useWorkerPool } from './useWorkerPool';

const WORKER_URL = new URL('./compute.worker.js', import.meta.url);

export function BatchProcessingDashboard() {
  const { runTask, isReady } = useWorkerPool(WORKER_URL, 4);
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const handleRunBatch = async () => {
    setRunning(true);
    setResults([]);
    
    // Create a batch of 20 CPU-heavy calculations
    const jobs = Array.from({ length: 20 }, (_, idx) => 500000 + idx * 25000);
    setProgress({ completed: 0, total: jobs.length });

    let completedCount = 0;

    // Dispatch all tasks in parallel; WorkerPool automatically queues and throttles
    const taskPromises = jobs.map(async (num, index) => {
      const result = await runTask('HEAVY_MATH', num);
      
      completedCount++;
      setProgress((prev) => ({ ...prev, completed: completedCount }));
      
      return { index: index + 1, input: num, result };
    });

    const finalResults = await Promise.all(taskPromises);
    setResults(finalResults);
    setRunning(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h2>Parallel Thread Pool Dashboard</h2>
      
      <button 
        onClick={handleRunBatch} 
        disabled={!isReady || running}
        className="btn-primary"
      >
        {running ? `Processing (${progress.completed}/${progress.total})...` : 'Run 20 Batch Jobs'}
      </button>

      {running && (
        <progress value={progress.completed} max={progress.total} style={{ width: '100%' }} />
      )}

      <ul>
        {results.map((item) => (
          <li key={item.index}>
            Job #{item.index} (Input: {item.input}) $\rightarrow$ Primes: {item.result}
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Key Operational Guidelines

* **Sizing the Pool:** Cap `poolSize` to `navigator.hardwareConcurrency || 4`. Creating more workers than physical CPU threads adds OS context switching overhead rather than speed.
* **Avoid Payload Overhead on Small Tasks:** For small computations ($< 5\text{ ms}$), thread communication overhead (`postMessage` serialization) exceeds the cost of running directly on the main thread. Reserve thread pools for tasks $> 20\text{ ms}$.
* **Transferable Objects for Zero-Copy:** If passing large `ArrayBuffer` instances or `ImageData`, pass them in the transfer list of `postMessage` to transfer ownership without cloning memory.

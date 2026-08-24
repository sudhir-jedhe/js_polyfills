How do you combine ES6 Async Generators with cooperative time-slicing to track real-time progress in the UI?

Combining **ES6 Async Generators (`async function*`)** with cooperative time-slicing separates computational work from UI updates. The generator executes work within a frame budget, yields to the main thread when the budget expires, and emits progress metrics (percentage, processed count) so the UI can re-render smoothly.

---

### Step 1: Resilient `yieldToMain` Helper

```javascript
const yieldToMain = () => {
  if ('scheduler' in window && 'yield' in window.scheduler) {
    return window.scheduler.yield();
  }
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(null);
  });
};

```

---

### Step 2: Time-Sliced Async Generator

The generator processes items in batches within a given millisecond budget (default: 5ms). At each budget boundary, it **yields progress to the caller** and **yields control back to the browser**.

```javascript
/**
 * Async generator that processes an array in cooperative time slices
 * and yields progress metadata back to the consumer.
 *
 * @param {Array} items - The source array of data
 * @param {(item: any, index: number) => any} transformFn - Synchronous worker per item
 * @param {Object} options
 * @param {number} [options.budgetMs=5] - Execution slice budget in ms
 * @param {AbortSignal} [options.signal] - Optional cancellation signal
 * @yields {{ progress: number, processed: number, total: number, latestResult: any }}
 */
async function* timeSlicedProgressGenerator(
  items,
  transformFn,
  { budgetMs = 5, signal } = {}
) {
  const total = items.length;
  let lastYieldTime = performance.now();

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      throw new DOMException('Task was aborted', 'AbortError');
    }

    const result = transformFn(items[i], i);

    // Yield when elapsed time exceeds the allocated frame budget or on final item
    const isLast = i === total - 1;
    if (performance.now() - lastYieldTime >= budgetMs || isLast) {
      // 1. Yield progress and latest chunk result to consumer
      yield {
        progress: Math.round(((i + 1) / total) * 100),
        processed: i + 1,
        total,
        latestResult: result,
      };

      // 2. Yield control back to browser to process paints/inputs
      await yieldToMain();
      lastYieldTime = performance.now();
    }
  }
}

```

---

### Step 3: Integration with a React UI

Use `for await...of` inside a component to consume progress events as they arrive, keeping the progress bar and UI responsive.

```jsx
import React, { useState, useRef } from 'react';

export function HeavyTaskRunner() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const abortControllerRef = useRef(null);

  const startTask = async () => {
    setIsRunning(true);
    setProgress(0);
    setStatusText('Processing...');

    abortControllerRef.current = new AbortController();

    // 100,000 heavy items
    const dataset = Array.from({ length: 100_000 }, (_, i) => i);

    try {
      const generator = timeSlicedProgressGenerator(
        dataset,
        (num) => Math.sqrt(num) * Math.sin(num), // CPU-bound calculation
        { budgetMs: 6, signal: abortControllerRef.current.signal }
      );

      // Consume generator progress snapshots
      for await (const update of generator) {
        setProgress(update.progress);
        setStatusText(`Processed ${update.processed.toLocaleString()} / ${update.total.toLocaleString()}`);
      }

      setStatusText('Complete!');
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatusText('Task cancelled.');
      } else {
        setStatusText(`Error: ${err.message}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const cancelTask = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <div style={{ maxWidth: 450, padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Cooperative Task with Progress</h3>
      
      {/* Progress Bar */}
      <div style={{ background: '#eee', height: 20, borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            width: `${progress}%`,
            background: '#2563eb',
            height: '100%',
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>

      <p style={{ margin: '10px 0' }}>
        <strong>Status:</strong> {statusText} ({progress}%)
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={startTask} disabled={isRunning}>
          Start 100k Items
        </button>
        <button onClick={cancelTask} disabled={!isRunning}>
          Cancel
        </button>
      </div>
    </div>
  );
}

```

---

### Why Async Generators Fit This Pattern

* **Pull-Based Flow Control:** The consumer controls iteration with `for await...of`. If the UI is unmounted or paused, iteration halts without orphan background execution.
* **Separation of Concerns:** The generator contains zero UI logic or state setters; it acts purely as a stream of progress ticks.
* **Non-Blocking Renders:** React receives state updates in small, batched intervals coinciding with browser paint cycles rather than thousands of immediate setter calls.

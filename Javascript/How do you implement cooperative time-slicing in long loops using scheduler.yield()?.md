***  How do you implement cooperative time-slicing in long loops using scheduler.yield()?.md ***

**Cooperative time-slicing** splits a long-running JavaScript loop into execution blocks bounded by a millisecond budget (typically 5ms–8ms). Instead of yielding on every iteration—which adds unnecessary microtask/macrotask overhead—it yields only when the elapsed time exceeds the allocated frame budget.

---

### Step 1: Resilient `yieldToMain` Helper

Use native `scheduler.yield()` when available, with a fast fallback using `MessageChannel`:

```javascript
const yieldToMain = () => {
  // 1. Native W3C Task Scheduling Yield
  if ('scheduler' in window && 'yield' in window.scheduler) {
    return window.scheduler.yield();
  }

  // 2. Fast Macrotask Fallback (avoids setTimeout 4ms clamping)
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(null);
  });
};

```

---

### Step 2: Time-Sliced Loop Implementation

Maintain a running timestamp. When `performance.now() - lastYieldTime` exceeds the budget, await `yieldToMain()` and reset the timer.

```javascript
/**
 * Processes an array cooperatively without locking the main UI thread.
 * @param {Array} items - Array of items to process
 * @param {(item: any, index: number) => void} processor - Sync worker callback
 * @param {Object} options
 * @param {number} [options.budgetMs=5] - Execution slice budget in ms (recommended: 5ms)
 * @param {AbortSignal} [options.signal] - Optional cancellation signal
 */
async function timeSlicedForEach(items, processor, { budgetMs = 5, signal } = {}) {
  let lastYieldTime = performance.now();

  for (let i = 0; i < items.length; i++) {
    // Check for cancellation
    if (signal?.aborted) {
      throw new DOMException('Time-sliced task was aborted', 'AbortError');
    }

    // Execute current item
    processor(items[i], i);

    // Yield control only when the active budget runs out
    if (performance.now() - lastYieldTime >= budgetMs) {
      await yieldToMain();
      lastYieldTime = performance.now(); // Reset timer after yielding
    }
  }
}

```

---

### Execution Example

```javascript
// Processing a heavy dataset of 500,000 items
const bigList = Array.from({ length: 500_000 }, (_, i) => i);
let processedCount = 0;

const abortController = new AbortController();

async function runHeavyTask() {
  console.log('Task started - UI remains responsive...');

  await timeSlicedForEach(
    bigList,
    (item) => {
      // Simulate CPU-bound work per item
      processedCount += Math.sqrt(item);
    },
    { budgetMs: 6, signal: abortController.signal }
  );

  console.log('Task finished successfully! Total:', processedCount);
}

runHeavyTask();

// If user navigates away:
// abortController.abort();

```

---

### Why the 5ms–8ms Budget Works

```text
60 FPS Frame Budget (~16.6ms Total)
┌───────────────────┬───────────────────┬──────────────────┐
│  JS Slice (5ms)   │  Browser Render   │  User Input (0ms)│ ──► [Smooth 60 FPS]
│  (our function)   │  & Paint (4-6ms)  │  (No Input Delay)│
└───────────────────┴───────────────────┴──────────────────┘

```

* **Prevents Yield Overhead:** Invoking `scheduler.yield()` on every single element in a $100{,}000$-item array introduces context-switch overhead that multiplies total execution time.
* **Avoids INP (Interaction to Next Paint) Spikes:** By yielding every 5ms, the browser can process queued user events (taps, clicks, keystrokes) and trigger frame paints with sub-16ms latency.

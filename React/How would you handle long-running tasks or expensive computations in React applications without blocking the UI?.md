**How would you handle long-running tasks or expensive computations in React applications without blocking the UI?**

To avoid blocking the UI, use Web Workers, setTimeout, or requestIdleCallback for offloading heavy computations. Alternatively, break tasks into smaller parts and use React's Suspense or useMemo to only recompute when necessary.

Example using setTimeout for deferring computation:

```js
const [data, setData] = useState(null);

useEffect(() => {
  setTimeout(() => {
    const result = computeExpensiveData();
    setData(result);
  }, 0);
}, []);
```

Handling long-running tasks or expensive computations in React without blocking the UI requires moving heavy workloads off the main thread or breaking them down so the browser remains responsive.

Here are the most effective strategies to prevent UI freezing:

---

### 1. Web Workers (Offloading to a Background Thread)

JavaScript is single-threaded, meaning heavy data processing, cryptography, massive JSON parsing, or complex mathematical algorithms running in the main component body will freeze the browser.

- **How it works:** **Web Workers** run scripts in a completely separate background thread. The worker handles the heavy lifting and communicates back to your React component via asynchronous message passing (`postMessage`).
- **Best for:** Heavy data crunching, image processing, sorting or filtering hundreds of thousands of records, or heavy client-side computation.

```javascript
// worker.js (Background thread)
self.onmessage = function (e) {
  const result = runHeavyAlgorithm(e.data);
  self.postMessage(result);
};

// React Component
function MyComponent() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.postMessage(largeDataSet);
    worker.onmessage = (e) => setResult(e.data);

    return () => worker.terminate(); // Cleanup
  }, []);

  return <div>{result ? result : "Processing in background..."}</div>;
}
```

---

### 2. React Concurrent Features (`useTransition`)

If the expensive computation involves rendering a large UI tree (like filtering a massive component list based on a text input), use React's concurrent features instead of Web Workers.

- **How it works:** Wrapping the state update in `useTransition` tells React that this calculation is low-priority. React will render it concurrently, allowing the browser to interrupt the render to handle urgent user inputs (like keystrokes) smoothly.

```jsx
import { useState, useTransition } from "react";

function SearchComponent({ allItems }) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Urgent: update the input text instantly

    startTransition(() => {
      // Non-urgent: heavy filtering calculation runs in the background
      setFilteredItems(allItems.filter((item) => item.includes(value)));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Updating results...</p>}
      <ul>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 3. Time-Slicing via `setTimeout` or `requestIdleCallback`

If you are iterating through a massive array synchronously, you can break the work down into smaller chunks and yield control back to the browser's event loop between chunks.

- **How it works:** Using `setTimeout(..., 0)` or `requestIdleCallback()` lets the browser paint frames, handle clicks, and process user scrolls in between processing batches of your data.

```jsx
function processLargeArrayInChunks(data, processChunk, onComplete) {
  let index = 0;
  const chunkSize = 1000;

  function chunk() {
    const end = Math.min(index + chunkSize, data.length);
    for (let i = index; i < end; i++) {
      processChunk(data[i]);
    }
    index = end;

    if (index < data.length) {
      setTimeout(chunk, 0); // Yield to the browser main thread
    } else {
      onComplete();
    }
  }

  chunk();
}
```

---

### 4. Memoization (`useMemo`)

If the expensive computation is purely mathematical or relational based on specific props/state inputs and doesn't need to run on _every single render_, cache it using `useMemo`.

- **Note:** This prevents redundant recalculations when unrelated state updates trigger a re-render, though it does not solve the initial blocking calculation.

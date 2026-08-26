*** copy Interview 14.md ***

Frontend system design interviews evaluate how you manage complexity, concurrency, network constraints, and client-side performance. Senior interview loops frequently expect working implementations of these patterns rather than high-level diagrams alone.

---

### 1. Concurrency Control: Request Deduplication & Task Queuing

When multiple components independently request identical data, executing redundant network calls wastes bandwidth and triggers race conditions. A deduplication layer shares in-flight promises across callers.

```javascript
class RequestDeduplicator {
  constructor() {
    this.inFlight = new Map();
  }

  async execute(key, fetcher) {
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const promise = fetcher()
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }
}

```

#### Task Pool with Dynamic Priority & Concurrency Limits

```javascript
class PriorityTaskQueue {
  constructor(concurrency = 4) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = []; // Array of { task, priority, resolve, reject }
  }

  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority); // Higher priority runs first
      this._next();
    });
  }

  async _next() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;

    this.running++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.running--;
      this._next();
    }
  }
}

```

---

### 2. State Management: Fine-Grained Reactivity (Signals Pattern)

Modern UI engines (Solid, Preact, Vue, Angular) rely on explicit dependency tracking rather than tree reconciliation (Virtual DOM diffing).

```javascript
let activeEffect = null;

class Signal {
  constructor(value) {
    this._value = value;
    this.subscribers = new Set();
  }

  get value() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
    return this._value;
  }

  set value(newValue) {
    if (!Object.is(this._value, newValue)) {
      this._value = newValue;
      // Copy to prevent infinite loops if effects re-trigger subscription
      const batch = new Set(this.subscribers);
      batch.forEach(effect => effect());
    }
  }
}

function createSignal(initialValue) {
  const signal = new Signal(initialValue);
  return [
    () => signal.value,
    (val) => { signal.value = val; }
  ];
}

function createEffect(callback) {
  const execute = () => {
    activeEffect = execute;
    try {
      callback();
    } finally {
      activeEffect = null;
    }
  };
  execute();
}

```

---

### 3. Resilient Networking: Exponential Backoff with Jitter

Network calls over mobile networks fail transiently. Exponential backoff with randomized jitter prevents the **thundering herd problem** when backend services recover.

```javascript
async function fetchWithRetry(url, options = {}, { maxRetries = 3, baseDelay = 300, maxDelay = 3000 } = {}) {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;

      // Full Jitter Formula: Math.random() * min(maxDelay, baseDelay * 2^attempt)
      const calculatedDelay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt));
      const jitterDelay = Math.random() * calculatedDelay;

      await new Promise(res => setTimeout(res, jitterDelay));
    }
  }
}

```

---

### 4. Telemetry: Batched Event Pipeline with Beacon Fallback

Frontend tracking pipelines must buffer events, flush on interval/batch size, and guarantee delivery upon tab closure without blocking main thread interactions.

```javascript
class TelemetryPipeline {
  constructor({ endpoint, batchSize = 10, flushInterval = 5000 }) {
    this.endpoint = endpoint;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.buffer = [];
    this.timer = null;

    this._startTimer();
    this._attachUnloadHandler();
  }

  track(eventName, payload = {}) {
    this.buffer.push({
      event: eventName,
      payload,
      timestamp: Date.now()
    });

    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;

    const payload = JSON.stringify(this.buffer);
    this.buffer = [];

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.endpoint, payload);
    } else {
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(console.error);
    }
  }

  _startTimer() {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }

  _attachUnloadHandler() {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }
}

```

---

### 5. Architectural Comparison for System Design Rounds

| Architecture Pattern                    | Best Used For                                   | Trade-offs                                                |
| --------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| **Micro-Frontends (Module Federation)** | Large, multi-team decoupled codebases           | Runtime complexity, shared dependency overhead            |
| **Virtualization / Infinite Scroll**    | Large lists (> 1,000 DOM nodes)                 | Complex keyboard navigation, variable height calculations |
| **Normalized Cache (Normalized Store)** | Deeply relational backend models                | High client-side mapping overhead, manual cleanup         |
| **Optimistic UI with Rollback**         | High-latency user mutations (likes, comments)   | Requires transactional rollback queues on server failure  |
| **Web Workers + OffscreenCanvas**       | Heavy parsing (CSV, crypto) or canvas rendering | Serialization overhead across `postMessage` boundaries    |

Dynamic virtual lists with variable row heights require three core mechanisms:

1. **Dynamic Size Cache & Binary Search:** Measuring real DOM heights via `ResizeObserver`, caching exact offsets, and locating the visible slice in $O(\log n)$ time.
2. **Scroll Anchoring:** Preserving the user's relative viewport position when items above the fold resize or load asynchronously.
3. **DOM Pooling & Buffer Management:** Reusing DOM elements and padding top/bottom with absolute transforms or spacer elements to prevent scrollbar collapse.

---

### Core Implementation

```javascript
class DynamicVirtualList {
  constructor({
    container,
    itemCount,
    estimatedItemHeight = 50,
    buffer = 3,
    renderItem
  }) {
    this.container = container;
    this.itemCount = itemCount;
    this.estimatedItemHeight = estimatedItemHeight;
    this.buffer = buffer;
    this.renderItem = renderItem;

    // Measurement & position cache
    this.measuredPositions = new Map(); // index -> { height, top, bottom }
    this.lastMeasuredIndex = -1;

    // Anchor tracking
    this.anchorIndex = 0;
    this.anchorOffsetTop = 0;

    this._setupDOM();
    this._initResizeObserver();
    this._attachEvents();
    this.render();
  }

  _setupDOM() {
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'auto';

    // Total scroll space stretcher
    this.phantom = document.createElement('div');
    this.phantom.style.cssText = 'position:absolute;left:0;top:0;right:0;z-index:-1;visibility:hidden;';

    // Visible items viewport wrapper
    this.content = document.createElement('div');
    this.content.style.cssText = 'position:absolute;left:0;top:0;right:0;';

    this.container.appendChild(this.phantom);
    this.container.appendChild(this.content);
  }

  _initResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      let sizeChangedAboveAnchor = 0;
      let needsRerender = false;

      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        const newHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
        const oldHeight = this._getItemHeight(index);

        if (Math.abs(newHeight - oldHeight) > 0.5) {
          const delta = newHeight - oldHeight;
          this._updateItemSize(index, newHeight);
          needsRerender = true;

          // Track height shift above current viewport anchor
          if (index < this.anchorIndex) {
            sizeChangedAboveAnchor += delta;
          }
        }
      }

      // Scroll Anchoring: Compensate scroll position to prevent jumps
      if (sizeChangedAboveAnchor !== 0) {
        this.container.scrollTop += sizeChangedAboveAnchor;
      }

      if (needsRerender) {
        this._updatePhantomHeight();
      }
    });
  }

  _getItemHeight(index) {
    return this.measuredPositions.get(index)?.height ?? this.estimatedItemHeight;
  }

  _updateItemSize(index, height) {
    const prev = this.measuredPositions.get(index);
    const top = index === 0 ? 0 : this._getItemBottom(index - 1);
    this.measuredPositions.set(index, {
      height,
      top,
      bottom: top + height
    });

    // Invalidate subsequent item positions
    if (index < this.lastMeasuredIndex) {
      this.lastMeasuredIndex = index;
    }
  }

  _getItemBottom(index) {
    if (this.measuredPositions.has(index)) {
      return this.measuredPositions.get(index).bottom;
    }
    // Estimated cumulative position
    return (index + 1) * this.estimatedItemHeight;
  }

  _recomputePositions(targetIndex) {
    let currentTop = 0;
    if (this.lastMeasuredIndex >= 0) {
      currentTop = this.measuredPositions.get(this.lastMeasuredIndex).bottom;
    }

    for (let i = this.lastMeasuredIndex + 1; i <= targetIndex && i < this.itemCount; i++) {
      const height = this.measuredPositions.get(i)?.height ?? this.estimatedItemHeight;
      this.measuredPositions.set(i, {
        height,
        top: currentTop,
        bottom: currentTop + height
      });
      currentTop += height;
      this.lastMeasuredIndex = i;
    }
  }

  _findStartIndex(scrollTop) {
    // Binary search over measured positions
    let low = 0;
    let high = this.itemCount - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this._recomputePositions(mid);

      const midBottom = this.measuredPositions.get(mid).bottom;
      if (midBottom === scrollTop) {
        return mid + 1;
      } else if (midBottom < scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.min(low, this.itemCount - 1);
  }

  _updatePhantomHeight() {
    this._recomputePositions(this.itemCount - 1);
    const totalHeight = this.itemCount === 0
      ? 0
      : this.measuredPositions.get(this.itemCount - 1)?.bottom ?? (this.itemCount * this.estimatedItemHeight);
    this.phantom.style.height = `${totalHeight}px`;
  }

  _attachEvents() {
    this.container.addEventListener('scroll', () => {
      this._updateAnchor();
      this.render();
    }, { passive: true });
  }

  _updateAnchor() {
    const scrollTop = this.container.scrollTop;
    this.anchorIndex = this._findStartIndex(scrollTop);
    const anchorData = this.measuredPositions.get(this.anchorIndex);
    this.anchorOffsetTop = anchorData ? scrollTop - anchorData.top : 0;
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;

    const rawStartIndex = this._findStartIndex(scrollTop);
    const startIndex = Math.max(0, rawStartIndex - this.buffer);

    let endIndex = startIndex;
    while (endIndex < this.itemCount) {
      this._recomputePositions(endIndex);
      if (this.measuredPositions.get(endIndex).top > scrollTop + viewportHeight) {
        break;
      }
      endIndex++;
    }
    endIndex = Math.min(this.itemCount - 1, endIndex + this.buffer);

    // Unobserve previous DOM nodes
    this.resizeObserver.disconnect();
    this.content.innerHTML = '';

    // Offset the rendered range with transform
    this._recomputePositions(startIndex);
    const offsetY = this.measuredPositions.get(startIndex)?.top ?? (startIndex * this.estimatedItemHeight);
    this.content.style.transform = `translateY(${offsetY}px)`;

    // Render slice
    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i <= endIndex; i++) {
      const itemEl = document.createElement('div');
      itemEl.dataset.index = String(i);
      itemEl.appendChild(this.renderItem(i));

      this.resizeObserver.observe(itemEl);
      fragment.appendChild(itemEl);
    }

    this.content.appendChild(fragment);
    this._updatePhantomHeight();
  }

  scrollToIndex(index) {
    if (index < 0 || index >= this.itemCount) return;
    this._recomputePositions(index);
    const targetTop = this.measuredPositions.get(index).top;
    this.container.scrollTop = targetTop;
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.container.innerHTML = '';
  }
}

```

---

### Usage Example

```javascript
const container = document.getElementById('scroll-container');

const virtualList = new DynamicVirtualList({
  container,
  itemCount: 10000,
  estimatedItemHeight: 60,
  buffer: 4,
  renderItem: (index) => {
    const card = document.createElement('div');
    card.style.padding = '12px';
    card.style.borderBottom = '1px solid #e2e8f0';

    // Variable multi-line text to induce dynamic heights
    const isExpanded = index % 5 === 0;
    card.innerHTML = `
      <strong>Row #${index}</strong>
      <p style="margin: 4px 0 0 0;">
        ${isExpanded 
          ? 'Dynamic height content with expanded descriptive text across several lines simulating real-world cards.' 
          : 'Standard compact row content.'}
      </p>
    `;
    return card;
  }
});

```

---

### Performance Characteristics

| Mechanism                | Technique                                                 | Advantage                                                                |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Visible Index Lookup** | Binary search on prefix-sum bottoms                       | $O(\log n)$ range calculation instead of $O(n)$ linear scan              |
| **DOM Measurement**      | Native `ResizeObserver` batching                          | Eliminates forced synchronous layout thrashing (`offsetHeight` reads)    |
| **Jitter Elimination**   | Delta offset compensation on items $< \text{anchorIndex}$ | Eliminates scroll jumping as off-screen items expand or collapse         |
| **Render Offset**        | GPU-accelerated `translateY` on viewport container        | Single compositor layer shift vs individual absolute positioning updates |

Show how to add bidirectional infinite loading (top and bottom prepending) to this dynamic virtual list.

Bidirectional infinite loading introduces two architectural challenges beyond unidirectional virtualization:

1. **Index Stability:** Prepending items shifts absolute indices ($[0 \dots N-1] \to [K \dots N+K-1]$). Absolute index keys must map to stable item IDs, or the internal position cache must be shifted by the prepended delta.
2. **Top-Edge Scroll Anchoring:** Prepending new content at the top will push the viewport down or snap to the new `scrollTop = 0` unless the scroll position is adjusted by the exact height of the newly prepended items in the same frame.

---

### Implementation: Bidirectional Virtual List

```javascript
class BidirectionalVirtualList {
  constructor({
    container,
    initialItems = [],
    estimatedItemHeight = 50,
    buffer = 4,
    threshold = 200, // Pixels from boundary to trigger loading
    onLoadTop,       // async () => newItems[]
    onLoadBottom,    // async () => newItems[]
    renderItem
  }) {
    this.container = container;
    this.items = [...initialItems];
    this.estimatedItemHeight = estimatedItemHeight;
    this.buffer = buffer;
    this.threshold = threshold;
    this.onLoadTop = onLoadTop;
    this.onLoadBottom = onLoadBottom;
    this.renderItem = renderItem;

    // Loading lock flags to prevent duplicate network calls
    this.isLoadingTop = false;
    this.isLoadingBottom = false;

    // Position metadata: index -> { height, top, bottom }
    this.measuredPositions = new Map();
    this.lastMeasuredIndex = -1;

    // Anchor tracking for resize stability
    this.anchorIndex = 0;
    this.anchorOffsetTop = 0;

    this._setupDOM();
    this._initResizeObserver();
    this._attachEvents();
    this.render();
  }

  _setupDOM() {
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'auto';

    this.phantom = document.createElement('div');
    this.phantom.style.cssText = 'position:absolute;left:0;top:0;right:0;z-index:-1;visibility:hidden;';

    this.content = document.createElement('div');
    this.content.style.cssText = 'position:absolute;left:0;top:0;right:0;';

    this.container.appendChild(this.phantom);
    this.container.appendChild(this.content);
  }

  _initResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      let sizeChangedAboveAnchor = 0;
      let needsRerender = false;

      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        const newHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
        const oldHeight = this.measuredPositions.get(index)?.height ?? this.estimatedItemHeight;

        if (Math.abs(newHeight - oldHeight) > 0.5) {
          const delta = newHeight - oldHeight;
          this._updateItemSize(index, newHeight);
          needsRerender = true;

          if (index < this.anchorIndex) {
            sizeChangedAboveAnchor += delta;
          }
        }
      }

      if (sizeChangedAboveAnchor !== 0) {
        this.container.scrollTop += sizeChangedAboveAnchor;
      }

      if (needsRerender) {
        this._updatePhantomHeight();
      }
    });
  }

  _updateItemSize(index, height) {
    const top = index === 0 ? 0 : this._getItemBottom(index - 1);
    this.measuredPositions.set(index, {
      height,
      top,
      bottom: top + height
    });

    if (index < this.lastMeasuredIndex) {
      this.lastMeasuredIndex = index;
    }
  }

  _getItemBottom(index) {
    return this.measuredPositions.get(index)?.bottom ?? (index + 1) * this.estimatedItemHeight;
  }

  _recomputePositions(targetIndex) {
    let currentTop = 0;
    if (this.lastMeasuredIndex >= 0) {
      currentTop = this.measuredPositions.get(this.lastMeasuredIndex).bottom;
    }

    for (let i = this.lastMeasuredIndex + 1; i <= targetIndex && i < this.items.length; i++) {
      const height = this.measuredPositions.get(i)?.height ?? this.estimatedItemHeight;
      this.measuredPositions.set(i, {
        height,
        top: currentTop,
        bottom: currentTop + height
      });
      currentTop += height;
      this.lastMeasuredIndex = i;
    }
  }

  _findStartIndex(scrollTop) {
    let low = 0;
    let high = this.items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this._recomputePositions(mid);

      const midBottom = this.measuredPositions.get(mid).bottom;
      if (midBottom === scrollTop) {
        return mid + 1;
      } else if (midBottom < scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.min(low, Math.max(0, this.items.length - 1));
  }

  _updatePhantomHeight() {
    if (this.items.length === 0) {
      this.phantom.style.height = '0px';
      return;
    }
    this._recomputePositions(this.items.length - 1);
    const totalHeight = this.measuredPositions.get(this.items.length - 1)?.bottom ?? (this.items.length * this.estimatedItemHeight);
    this.phantom.style.height = `${totalHeight}px`;
  }

  _attachEvents() {
    this.container.addEventListener('scroll', () => {
      this._updateAnchor();
      this._checkBoundaries();
      this.render();
    }, { passive: true });
  }

  _updateAnchor() {
    const scrollTop = this.container.scrollTop;
    this.anchorIndex = this._findStartIndex(scrollTop);
    const anchorData = this.measuredPositions.get(this.anchorIndex);
    this.anchorOffsetTop = anchorData ? scrollTop - anchorData.top : 0;
  }

  async _checkBoundaries() {
    const { scrollTop, scrollHeight, clientHeight } = this.container;

    // 1. Top edge threshold trigger
    if (scrollTop <= this.threshold && !this.isLoadingTop && this.onLoadTop) {
      this.isLoadingTop = true;
      try {
        const newItems = await this.onLoadTop();
        if (newItems && newItems.length > 0) {
          this.prependItems(newItems);
        }
      } finally {
        this.isLoadingTop = false;
      }
    }

    // 2. Bottom edge threshold trigger
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceToBottom <= this.threshold && !this.isLoadingBottom && this.onLoadBottom) {
      this.isLoadingBottom = true;
      try {
        const newItems = await this.onLoadBottom();
        if (newItems && newItems.length > 0) {
          this.appendItems(newItems);
        }
      } finally {
        this.isLoadingBottom = false;
      }
    }
  }

  // Prepend items and anchor the viewport height seamlessly
  prependItems(newItems) {
    const count = newItems.length;
    if (count === 0) return;

    // Estimate prepended block height to shift the cache
    const estimatedPrependHeight = count * this.estimatedItemHeight;

    // Shift cached measurements up by the new offset count
    const shiftedPositions = new Map();
    for (const [index, data] of this.measuredPositions.entries()) {
      shiftedPositions.set(index + count, {
        height: data.height,
        top: data.top + estimatedPrependHeight,
        bottom: data.bottom + estimatedPrependHeight
      });
    }

    this.items = [...newItems, ...this.items];
    this.measuredPositions = shiftedPositions;
    this.lastMeasuredIndex = this.lastMeasuredIndex >= 0 ? this.lastMeasuredIndex + count : -1;
    this.anchorIndex += count;

    // Update phantom and compensate scroll in the same synchronous task
    this._updatePhantomHeight();
    this.container.scrollTop += estimatedPrependHeight;

    this.render();
  }

  // Append items to bottom
  appendItems(newItems) {
    if (newItems.length === 0) return;
    this.items.push(...newItems);
    this._updatePhantomHeight();
    this.render();
  }

  render() {
    if (this.items.length === 0) {
      this.content.innerHTML = '';
      this._updatePhantomHeight();
      return;
    }

    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;

    const rawStartIndex = this._findStartIndex(scrollTop);
    const startIndex = Math.max(0, rawStartIndex - this.buffer);

    let endIndex = startIndex;
    while (endIndex < this.items.length) {
      this._recomputePositions(endIndex);
      if (this.measuredPositions.get(endIndex).top > scrollTop + viewportHeight) {
        break;
      }
      endIndex++;
    }
    endIndex = Math.min(this.items.length - 1, endIndex + this.buffer);

    this.resizeObserver.disconnect();
    this.content.innerHTML = '';

    this._recomputePositions(startIndex);
    const offsetY = this.measuredPositions.get(startIndex)?.top ?? (startIndex * this.estimatedItemHeight);
    this.content.style.transform = `translateY(${offsetY}px)`;

    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i <= endIndex; i++) {
      const itemEl = document.createElement('div');
      itemEl.dataset.index = String(i);
      itemEl.appendChild(this.renderItem(this.items[i], i));

      this.resizeObserver.observe(itemEl);
      fragment.appendChild(itemEl);
    }

    this.content.appendChild(fragment);
    this._updatePhantomHeight();
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.container.innerHTML = '';
  }
}

```

---

### Usage: Chat / Timeline Stream

```javascript
const container = document.getElementById('chat-container');

let topIdCursor = 0;
let bottomIdCursor = 100;

// Generate mock items
const generateMessages = (startId, count, isPrepend) => {
  return Array.from({ length: count }, (_, i) => {
    const id = isPrepend ? startId - count + i : startId + i;
    return {
      id,
      author: id % 2 === 0 ? 'User' : 'Support Agent',
      text: (id % 3 === 0)
        ? `Message #${id}: Long message spanning multiple lines to test dynamic height rendering.`
        : `Message #${id}: Short reply.`
    };
  });
};

const list = new BidirectionalVirtualList({
  container,
  initialItems: generateMessages(topIdCursor, 30, false),
  estimatedItemHeight: 65,
  buffer: 5,
  threshold: 150,

  onLoadTop: async () => {
    // Simulate fetch previous messages
    await new Promise((res) => setTimeout(res, 400));
    topIdCursor -= 20;
    return generateMessages(topIdCursor + 20, 20, true);
  },

  onLoadBottom: async () => {
    // Simulate fetch newer messages
    await new Promise((res) => setTimeout(res, 400));
    const newItems = generateMessages(bottomIdCursor, 20, false);
    bottomIdCursor += 20;
    return newItems;
  },

  renderItem: (item) => {
    const el = document.createElement('div');
    el.style.cssText = 'padding: 10px; border-bottom: 1px solid #e5e7eb; box-sizing: border-box;';
    el.innerHTML = `<strong>${item.author}</strong> (ID: ${item.id})<p style="margin:4px 0 0 0">${item.text}</p>`;
    return el;
  }
});

```

---

### Edge Cases Handled

| Scenario                        | Resolution Mechanism                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Top Boundary Overshoot**      | `isLoadingTop` gate stops duplicate async calls during fast inertia scrolls.                                          |
| **Initial Top Jump**            | Prepend shifts the `measuredPositions` Map indices and synchronously adds estimated height to `scrollTop`.            |
| **Asynchronous Prepend Resize** | `ResizeObserver` monitors item dimensions; deltas above `anchorIndex` adjust `container.scrollTop` before paint.      |
| **Sparse Index Mapping**        | Binary search automatically calculates the closest rendered starting slice on unmeasured positions using prefix sums. |

Implement a 2D dynamic grid virtualizer in JavaScript with variable row and column sizes.
A 2D grid virtualizer requires independent tracking of both horizontal (X) and vertical (Y) axes. Instead of rendering $R \times C$ total cells, it slices the 2D matrix into only the active bounding box $[rowIndex_{\text{start}} \dots rowIndex_{\text{end}}] \times [colIndex_{\text{start}} \dots colIndex_{\text{end}}]$ with dynamic measurement caching for rows and columns.

---

### Core Implementation: 2D Dynamic Grid Virtualizer

```javascript
class Dynamic2DGridVirtualizer {
  constructor({
    container,
    rowCount,
    colCount,
    estimatedRowHeight = 40,
    estimatedColWidth = 100,
    rowBuffer = 2,
    colBuffer = 2,
    renderCell
  }) {
    this.container = container;
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.estimatedRowHeight = estimatedRowHeight;
    this.estimatedColWidth = estimatedColWidth;
    this.rowBuffer = rowBuffer;
    this.colBuffer = colBuffer;
    this.renderCell = renderCell;

    // Axis Measurement Caches: index -> { size, start, end }
    this.rowPositions = new Map();
    this.colPositions = new Map();
    this.lastMeasuredRow = -1;
    this.lastMeasuredCol = -1;

    this._setupDOM();
    this._initResizeObserver();
    this._attachEvents();
    this.render();
  }

  _setupDOM() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';

    // 2D Scroll Stretcher
    this.phantom = document.createElement('div');
    this.phantom.style.cssText = 'position:absolute;left:0;top:0;z-index:-1;visibility:hidden;pointer-events:none;';

    // Matrix Viewport Layer
    this.content = document.createElement('div');
    this.content.style.cssText = 'position:absolute;left:0;top:0;contain:layout paint;';

    this.container.appendChild(this.phantom);
    this.container.appendChild(this.content);
  }

  _initResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsRerender = false;

      for (const entry of entries) {
        const { row, col } = entry.target.dataset;
        if (row === undefined || col === undefined) continue;

        const rIdx = Number(row);
        const cIdx = Number(col);

        const rect = entry.borderBoxSize?.[0]
          ? { width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize }
          : entry.target.getBoundingClientRect();

        const oldHeight = this.rowPositions.get(rIdx)?.size ?? this.estimatedRowHeight;
        const oldWidth = this.colPositions.get(cIdx)?.size ?? this.estimatedColWidth;

        if (Math.abs(rect.height - oldHeight) > 0.5) {
          this._updateAxisMeasurement(this.rowPositions, rIdx, rect.height);
          if (rIdx < this.lastMeasuredRow) this.lastMeasuredRow = rIdx;
          needsRerender = true;
        }

        if (Math.abs(rect.width - oldWidth) > 0.5) {
          this._updateAxisMeasurement(this.colPositions, cIdx, rect.width);
          if (cIdx < this.lastMeasuredCol) this.lastMeasuredCol = cIdx;
          needsRerender = true;
        }
      }

      if (needsRerender) {
        this._updatePhantomSize();
      }
    });
  }

  _updateAxisMeasurement(map, index, size) {
    const start = index === 0 ? 0 : (map.get(index - 1)?.end ?? index * size);
    map.set(index, { size, start, end: start + size });
  }

  _recomputeAxis(map, targetIndex, totalCount, defaultSize, lastMeasuredTracker) {
    let currentStart = 0;
    const lastMeasured = this[lastMeasuredTracker];

    if (lastMeasured >= 0 && map.has(lastMeasured)) {
      currentStart = map.get(lastMeasured).end;
    }

    for (let i = lastMeasured + 1; i <= targetIndex && i < totalCount; i++) {
      const size = map.get(i)?.size ?? defaultSize;
      map.set(i, {
        size,
        start: currentStart,
        end: currentStart + size
      });
      currentStart += size;
      this[lastMeasuredTracker] = i;
    }
  }

  _binarySearchIndex(map, totalCount, defaultSize, tracker, scrollOffset) {
    let low = 0;
    let high = totalCount - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this._recomputeAxis(map, mid, totalCount, defaultSize, tracker);

      const endOffset = map.get(mid).end;
      if (endOffset === scrollOffset) {
        return mid + 1;
      } else if (endOffset < scrollOffset) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.min(low, Math.max(0, totalCount - 1));
  }

  _getAxisRange(scrollOffset, viewportSize, totalCount, defaultSize, map, tracker, buffer) {
    if (totalCount === 0) return { start: 0, end: 0 };

    const rawStart = this._binarySearchIndex(map, totalCount, defaultSize, tracker, scrollOffset);
    const start = Math.max(0, rawStart - buffer);

    let end = start;
    while (end < totalCount) {
      this._recomputeAxis(map, end, totalCount, defaultSize, tracker);
      if (map.get(end).start > scrollOffset + viewportSize) {
        break;
      }
      end++;
    }
    end = Math.min(totalCount - 1, end + buffer);

    return { start, end };
  }

  _updatePhantomSize() {
    this._recomputeAxis(this.rowPositions, this.rowCount - 1, this.rowCount, this.estimatedRowHeight, 'lastMeasuredRow');
    this._recomputeAxis(this.colPositions, this.colCount - 1, this.colCount, this.estimatedColWidth, 'lastMeasuredCol');

    const totalHeight = this.rowCount === 0 ? 0 : this.rowPositions.get(this.rowCount - 1)?.end ?? (this.rowCount * this.estimatedRowHeight);
    const totalWidth = this.colCount === 0 ? 0 : this.colPositions.get(this.colCount - 1)?.end ?? (this.colCount * this.estimatedColWidth);

    this.phantom.style.height = `${totalHeight}px`;
    this.phantom.style.width = `${totalWidth}px`;
  }

  _attachEvents() {
    this.container.addEventListener('scroll', () => this.render(), { passive: true });
  }

  render() {
    const { scrollTop, scrollLeft, clientHeight, clientWidth } = this.container;

    const rowRange = this._getAxisRange(
      scrollTop,
      clientHeight,
      this.rowCount,
      this.estimatedRowHeight,
      this.rowPositions,
      'lastMeasuredRow',
      this.rowBuffer
    );

    const colRange = this._getAxisRange(
      scrollLeft,
      clientWidth,
      this.colCount,
      this.estimatedColWidth,
      this.colPositions,
      'lastMeasuredCol',
      this.colBuffer
    );

    this.resizeObserver.disconnect();
    this.content.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let r = rowRange.start; r <= rowRange.end; r++) {
      const rowPos = this.rowPositions.get(r);
      const rowTop = rowPos ? rowPos.start : r * this.estimatedRowHeight;
      const rowHeight = rowPos ? rowPos.size : this.estimatedRowHeight;

      for (let c = colRange.start; c <= colRange.end; c++) {
        const colPos = this.colPositions.get(c);
        const colLeft = colPos ? colPos.start : c * this.estimatedColWidth;
        const colWidth = colPos ? colPos.size : this.estimatedColWidth;

        const cell = document.createElement('div');
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.style.cssText = `
          position: absolute;
          top: ${rowTop}px;
          left: ${colLeft}px;
          width: ${colWidth}px;
          min-height: ${rowHeight}px;
          box-sizing: border-box;
        `;

        cell.appendChild(this.renderCell(r, c));
        this.resizeObserver.observe(cell);
        fragment.appendChild(cell);
      }
    }

    this.content.appendChild(fragment);
    this._updatePhantomSize();
  }

  scrollToCell(row, col) {
    this._recomputeAxis(this.rowPositions, row, this.rowCount, this.estimatedRowHeight, 'lastMeasuredRow');
    this._recomputeAxis(this.colPositions, col, this.colCount, this.estimatedColWidth, 'lastMeasuredCol');

    const top = this.rowPositions.get(row)?.start ?? row * this.estimatedRowHeight;
    const left = this.colPositions.get(col)?.start ?? col * this.estimatedColWidth;

    this.container.scrollTo({ top, left, behavior: 'auto' });
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.container.innerHTML = '';
  }
}

```

---

### Usage: Virtualized Spreadsheet / Matrix

```javascript
const gridContainer = document.getElementById('grid-container');
gridContainer.style.width = '800px';
gridContainer.style.height = '500px';

const grid = new Dynamic2DGridVirtualizer({
  container: gridContainer,
  rowCount: 10000,
  colCount: 500,
  estimatedRowHeight: 36,
  estimatedColWidth: 120,
  rowBuffer: 3,
  colBuffer: 2,
  renderCell: (row, col) => {
    const el = document.createElement('div');
    el.style.cssText = `
      padding: 6px 10px;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      background: ${row % 2 === 0 ? '#fafafa' : '#ffffff'};
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    el.textContent = `R${row}:C${col}`;
    return el;
  }
});

```

---

### Complexity & Design Highlights

* **Dual Binary Search:** Both the $X$ and $Y$ dimensions locate starting slices in $O(\log R) + O(\log C)$ rather than scanning the full coordinate plane.
* **Bounded Active DOM Nodes:** For a 10,000 $\times$ 500 grid ($5,000,000$ cells), only around $20 \times 8 = 160$ nodes exist in the DOM at any given frame.
* **Layout Containment:** `contain: layout paint` on the content container isolates inner cell modifications from triggering full-page reflows.

Show how to add sticky column headers, sticky row headers, and frozen columns to this 2D grid virtualizer.

To add sticky headers and frozen panes to a 2D virtualizer without layout jitter, divide the viewport into **4 decoupled layers** rendered inside a synchronized viewport:

1. **Top-Left Corner (`z-index: 4`):** Fixed intersection of sticky rows and sticky columns (e.g., cell `(0, 0)`).
2. **Top Row Header (`z-index: 3`):** Moves only on the X-axis (`scrollLeft`), anchored to `Y = 0`.
3. **Left Column Header (`z-index: 2`):** Moves only on the Y-axis (`scrollTop`), anchored to `X = 0`.
4. **Virtual Content Body (`z-index: 1`):** Scrolls freely in 2D space.

---

### Implementation: 2D Grid with Sticky/Frozen Panes

```javascript
class Sticky2DGridVirtualizer {
  constructor({
    container,
    rowCount,
    colCount,
    stickyRows = 1,     // Number of frozen top rows
    stickyCols = 1,     // Number of frozen left columns
    estimatedRowHeight = 40,
    estimatedColWidth = 100,
    rowBuffer = 2,
    colBuffer = 2,
    renderCell
  }) {
    this.container = container;
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.stickyRows = Math.min(stickyRows, rowCount);
    this.stickyCols = Math.min(stickyCols, colCount);
    this.estimatedRowHeight = estimatedRowHeight;
    this.estimatedColWidth = estimatedColWidth;
    this.rowBuffer = rowBuffer;
    this.colBuffer = colBuffer;
    this.renderCell = renderCell;

    // Measurement caches: index -> { size, start, end }
    this.rowPositions = new Map();
    this.colPositions = new Map();
    this.lastMeasuredRow = -1;
    this.lastMeasuredCol = -1;

    this._setupDOM();
    this._initResizeObserver();
    this._attachEvents();
    this.render();
  }

  _setupDOM() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';

    // 2D Scroll Stretcher
    this.phantom = document.createElement('div');
    this.phantom.style.cssText = 'position:absolute;left:0;top:0;z-index:-1;visibility:hidden;pointer-events:none;';

    // 1. Top-Left Corner (Fixed on both axes)
    this.cornerLayer = document.createElement('div');
    this.cornerLayer.style.cssText = 'position:sticky;top:0;left:0;z-index:4;pointer-events:none;';

    // 2. Top Sticky Row Header (Synchronized on X, fixed on Y)
    this.topHeaderLayer = document.createElement('div');
    this.topHeaderLayer.style.cssText = 'position:sticky;top:0;left:0;z-index:3;pointer-events:none;';

    // 3. Left Sticky Column Header (Synchronized on Y, fixed on X)
    this.leftHeaderLayer = document.createElement('div');
    this.leftHeaderLayer.style.cssText = 'position:sticky;top:0;left:0;z-index:2;pointer-events:none;';

    // 4. Main Scrollable Body
    this.bodyLayer = document.createElement('div');
    this.bodyLayer.style.cssText = 'position:absolute;left:0;top:0;z-index:1;contain:layout paint;';

    this.container.append(
      this.phantom,
      this.cornerLayer,
      this.topHeaderLayer,
      this.leftHeaderLayer,
      this.bodyLayer
    );
  }

  _initResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsRerender = false;

      for (const entry of entries) {
        const { row, col } = entry.target.dataset;
        if (row === undefined || col === undefined) continue;

        const rIdx = Number(row);
        const cIdx = Number(col);

        const rect = entry.borderBoxSize?.[0]
          ? { width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize }
          : entry.target.getBoundingClientRect();

        const oldHeight = this.rowPositions.get(rIdx)?.size ?? this.estimatedRowHeight;
        const oldWidth = this.colPositions.get(cIdx)?.size ?? this.estimatedColWidth;

        if (Math.abs(rect.height - oldHeight) > 0.5) {
          this._updateAxisMeasurement(this.rowPositions, rIdx, rect.height);
          if (rIdx < this.lastMeasuredRow) this.lastMeasuredRow = rIdx;
          needsRerender = true;
        }

        if (Math.abs(rect.width - oldWidth) > 0.5) {
          this._updateAxisMeasurement(this.colPositions, cIdx, rect.width);
          if (cIdx < this.lastMeasuredCol) this.lastMeasuredCol = cIdx;
          needsRerender = true;
        }
      }

      if (needsRerender) {
        this._updatePhantomSize();
      }
    });
  }

  _updateAxisMeasurement(map, index, size) {
    const start = index === 0 ? 0 : (map.get(index - 1)?.end ?? index * size);
    map.set(index, { size, start, end: start + size });
  }

  _recomputeAxis(map, targetIndex, totalCount, defaultSize, lastMeasuredTracker) {
    let currentStart = 0;
    const lastMeasured = this[lastMeasuredTracker];

    if (lastMeasured >= 0 && map.has(lastMeasured)) {
      currentStart = map.get(lastMeasured).end;
    }

    for (let i = lastMeasured + 1; i <= targetIndex && i < totalCount; i++) {
      const size = map.get(i)?.size ?? defaultSize;
      map.set(i, {
        size,
        start: currentStart,
        end: currentStart + size
      });
      currentStart += size;
      this[lastMeasuredTracker] = i;
    }
  }

  _binarySearchIndex(map, totalCount, defaultSize, tracker, scrollOffset, minIndex = 0) {
    let low = minIndex;
    let high = totalCount - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this._recomputeAxis(map, mid, totalCount, defaultSize, tracker);

      const endOffset = map.get(mid).end;
      if (endOffset === scrollOffset) {
        return mid + 1;
      } else if (endOffset < scrollOffset) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.min(low, Math.max(minIndex, totalCount - 1));
  }

  _getAxisRange(scrollOffset, viewportSize, totalCount, defaultSize, map, tracker, buffer, minIndex = 0) {
    if (totalCount <= minIndex) return { start: minIndex, end: minIndex - 1 };

    const rawStart = this._binarySearchIndex(map, totalCount, defaultSize, tracker, scrollOffset, minIndex);
    const start = Math.max(minIndex, rawStart - buffer);

    let end = start;
    while (end < totalCount) {
      this._recomputeAxis(map, end, totalCount, defaultSize, tracker);
      if (map.get(end).start > scrollOffset + viewportSize) {
        break;
      }
      end++;
    }
    end = Math.min(totalCount - 1, end + buffer);

    return { start, end };
  }

  _updatePhantomSize() {
    this._recomputeAxis(this.rowPositions, this.rowCount - 1, this.rowCount, this.estimatedRowHeight, 'lastMeasuredRow');
    this._recomputeAxis(this.colPositions, this.colCount - 1, this.colCount, this.estimatedColWidth, 'lastMeasuredCol');

    const totalHeight = this.rowCount === 0 ? 0 : this.rowPositions.get(this.rowCount - 1)?.end ?? (this.rowCount * this.estimatedRowHeight);
    const totalWidth = this.colCount === 0 ? 0 : this.colPositions.get(this.colCount - 1)?.end ?? (this.colCount * this.estimatedColWidth);

    this.phantom.style.height = `${totalHeight}px`;
    this.phantom.style.width = `${totalWidth}px`;
  }

  _attachEvents() {
    this.container.addEventListener('scroll', () => this.render(), { passive: true });
  }

  _createCellElement(r, c, top, left, width, height, isSticky = false) {
    const cell = document.createElement('div');
    cell.dataset.row = String(r);
    cell.dataset.col = String(c);
    cell.style.cssText = `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      min-height: ${height}px;
      box-sizing: border-box;
      pointer-events: auto;
    `;

    cell.appendChild(this.renderCell(r, c, isSticky));
    this.resizeObserver.observe(cell);
    return cell;
  }

  render() {
    const { scrollTop, scrollLeft, clientHeight, clientWidth } = this.container;

    // 1. Calculate active unpinned slices
    const rowRange = this._getAxisRange(
      scrollTop,
      clientHeight,
      this.rowCount,
      this.estimatedRowHeight,
      this.rowPositions,
      'lastMeasuredRow',
      this.rowBuffer,
      this.stickyRows
    );

    const colRange = this._getAxisRange(
      scrollLeft,
      clientWidth,
      this.colCount,
      this.estimatedColWidth,
      this.colPositions,
      'lastMeasuredCol',
      this.colBuffer,
      this.stickyCols
    );

    this.resizeObserver.disconnect();
    this.cornerLayer.innerHTML = '';
    this.topHeaderLayer.innerHTML = '';
    this.leftHeaderLayer.innerHTML = '';
    this.bodyLayer.innerHTML = '';

    // A. Render Corner (Top-Left Intersection)
    const cornerFrag = document.createDocumentFragment();
    for (let r = 0; r < this.stickyRows; r++) {
      const rPos = this.rowPositions.get(r);
      const top = rPos ? rPos.start : r * this.estimatedRowHeight;
      const height = rPos ? rPos.size : this.estimatedRowHeight;

      for (let c = 0; c < this.stickyCols; c++) {
        const cPos = this.colPositions.get(c);
        const left = cPos ? cPos.start : c * this.estimatedColWidth;
        const width = cPos ? cPos.size : this.estimatedColWidth;

        cornerFrag.appendChild(this._createCellElement(r, c, top, left, width, height, true));
      }
    }
    this.cornerLayer.appendChild(cornerFrag);

    // B. Render Top Sticky Headers (Follows scrollLeft)
    const topFrag = document.createDocumentFragment();
    for (let r = 0; r < this.stickyRows; r++) {
      const rPos = this.rowPositions.get(r);
      const top = rPos ? rPos.start : r * this.estimatedRowHeight;
      const height = rPos ? rPos.size : this.estimatedRowHeight;

      for (let c = colRange.start; c <= colRange.end; c++) {
        const cPos = this.colPositions.get(c);
        // Position relative to current scrollLeft viewport
        const left = (cPos ? cPos.start : c * this.estimatedColWidth) - scrollLeft;
        const width = cPos ? cPos.size : this.estimatedColWidth;

        topFrag.appendChild(this._createCellElement(r, c, top, left, width, height, true));
      }
    }
    this.topHeaderLayer.appendChild(topFrag);

    // C. Render Left Frozen Columns (Follows scrollTop)
    const leftFrag = document.createDocumentFragment();
    for (let r = rowRange.start; r <= rowRange.end; r++) {
      const rPos = this.rowPositions.get(r);
      // Position relative to current scrollTop viewport
      const top = (rPos ? rPos.start : r * this.estimatedRowHeight) - scrollTop;
      const height = rPos ? rPos.size : this.estimatedRowHeight;

      for (let c = 0; c < this.stickyCols; c++) {
        const cPos = this.colPositions.get(c);
        const left = cPos ? cPos.start : c * this.estimatedColWidth;
        const width = cPos ? cPos.size : this.estimatedColWidth;

        leftFrag.appendChild(this._createCellElement(r, c, top, left, width, height, true));
      }
    }
    this.leftHeaderLayer.appendChild(leftFrag);

    // D. Render Main Body Grid
    const bodyFrag = document.createDocumentFragment();
    for (let r = rowRange.start; r <= rowRange.end; r++) {
      const rPos = this.rowPositions.get(r);
      const top = rPos ? rPos.start : r * this.estimatedRowHeight;
      const height = rPos ? rPos.size : this.estimatedRowHeight;

      for (let c = colRange.start; c <= colRange.end; c++) {
        const cPos = this.colPositions.get(c);
        const left = cPos ? cPos.start : c * this.estimatedColWidth;
        const width = cPos ? cPos.size : this.estimatedColWidth;

        bodyFrag.appendChild(this._createCellElement(r, c, top, left, width, height, false));
      }
    }
    this.bodyLayer.appendChild(bodyFrag);

    this._updatePhantomSize();
  }
}

```

---

### Usage Example

```javascript
const gridContainer = document.getElementById('grid-container');
gridContainer.style.width = '800px';
gridContainer.style.height = '500px';

const grid = new Sticky2DGridVirtualizer({
  container: gridContainer,
  rowCount: 5000,
  colCount: 200,
  stickyRows: 1,  // Freeze row 0 as header
  stickyCols: 1,  // Freeze column 0 as row-ID
  estimatedRowHeight: 38,
  estimatedColWidth: 120,
  renderCell: (row, col, isSticky) => {
    const el = document.createElement('div');
    const isCorner = row === 0 && col === 0;

    el.style.cssText = `
      padding: 8px 12px;
      border-right: 1px solid #d1d5db;
      border-bottom: 1px solid #d1d5db;
      background: ${isCorner ? '#1e293b' : isSticky ? '#f1f5f9' : '#ffffff'};
      color: ${isCorner ? '#ffffff' : '#1e293b'};
      font-weight: ${isSticky ? '600' : '400'};
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;

    if (isCorner) {
      el.textContent = 'Index';
    } else if (row === 0) {
      el.textContent = `Column ${col}`;
    } else if (col === 0) {
      el.textContent = `Row ${row}`;
    } else {
      el.textContent = `${row},${col}`;
    }

    return el;
  }
});

```

---

### Layer Architecture Summary

| Layer                  | Positioning Strategy                | Coordinate Transforms               | Stacking Context       |
| ---------------------- | ----------------------------------- | ----------------------------------- | ---------------------- |
| **Top-Left Corner**    | `position: sticky; top: 0; left: 0` | Fixed to `(0, 0)` origin            | `z-index: 4` (highest) |
| **Top Row Header**     | `position: sticky; top: 0`          | `left = colStart - scrollLeft`      | `z-index: 3`           |
| **Left Column Header** | `position: sticky; left: 0`         | `top = rowStart - scrollTop`        | `z-index: 2`           |
| **Body Grid**          | `position: absolute`                | `top = rowStart`, `left = colStart` | `z-index: 1`           |

Beyond network requests, JavaScript performance bottlenecks primarily occur across four core areas: **Main-Thread Blocking**, **Memory & Garbage Collection**, **DOM & Rendering Churn**, and **Inefficient Data Operations**.

---

### 1. Main-Thread Execution Bottlenecks

Because JavaScript execution shares a single thread with the browser's style calculations, layout, and rendering loops, blocking the main thread directly degrades responsiveness (causing poor **Interaction to Next Paint / INP** and high **Total Blocking Time / TBT**).

* **Long Tasks (>50ms):** Heavy CPU-bound loops, cryptographic hashing, or large array transformations running synchronously freeze user inputs and animations.
* *Fix:* Offload heavy work to **Web Workers** or slice tasks using `scheduler.yield()` / `requestIdleCallback()`.

* **Microtask Queue Starvation:** Recursively resolving promises or queuing excessive `queueMicrotask()` callbacks starves the browser's rendering phase and event loop.
* **Over-Serialization & JSON Parsing:** Calling `JSON.parse()` or `JSON.stringify()` on multi-megabyte payloads synchronously halts the main thread during execution.

---

### 2. DOM Manipulation & Layout Thrashing

Interacting with the DOM is significantly more expensive than running pure JavaScript in V8/SpiderMonkey.

* **Forced Synchronous Layout (Layout Thrashing):** Alternating between writing to the DOM and reading layout geometry forces the browser to recalculate styles and geometry immediately instead of batching them:

```javascript
// ❌ Bottleneck: Forces a reflow on every iteration
elements.forEach((el) => {
  const width = el.offsetWidth; // Read (invalidates layout)
  el.style.width = width + 10 + 'px'; // Write
});

// ✅ Fix: Batch all reads first, then batch all writes
const widths = elements.map((el) => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});

```

* **Excessive DOM Node Count:** Rendering un-virtualized lists with thousands of DOM nodes causes high memory consumption and slow style recalculations.
* *Fix:* Use **virtualization** (`react-window`, `@tanstack/virtual`) to render only visible viewport items.

* **Unthrottled High-Frequency Event Handlers:** Attaching un-debounced or un-throttled callbacks to `scroll`, `resize`, or `mousemove` events floods the event loop.
* *Fix:* Use `requestAnimationFrame` or `debounce`/`throttle` patterns.

---

### 3. Memory Leaks & Garbage Collection Thrashing

* **GC Pressure & Stop-the-World Pauses:** Creating short-lived large objects or arrays inside tight animation frames (60/120 FPS loops) forces the V8 Garbage Collector (Minor GC / Scavenger) to run continuously, causing micro-stutters and frame drops.
* *Fix:* Reuse object pools, typed arrays (`Float32Array`), or static allocations inside animation loops.

* **Detached DOM Nodes & Forgotten Listeners:** Elements removed from the document tree remain in memory if closures, timers, or global Maps hold strong references.
* *Fix:* Use `WeakMap`/`WeakSet` for element caching and clean up event listeners via `AbortController`.

---

### 4. Framework-Specific Re-Render Cascades

In declarative frameworks (React, Vue, Solid), improper component boundary design wastes CPU cycles recalculating untouched components.

* **Unstable Object/Callback References:** Passing new inline object literals (`style={{ margin: 0 }}`) or inline arrow functions into memoized children breaks shallow reference equality (`Object.is`) and forces unnecessary re-renders.
* **Context Over-Broadcasting:** Storing high-frequency state updates inside a single monolithic Context re-renders every subscriber, regardless of which state slice actually changed.
* *Fix:* Split contexts or adopt atomic stores/signals (e.g., Zustand, Jotai).

---

### 5. Inefficient Data Structures & Algorithms

* **$O(N^2)$ Lookups in Hot Paths:** Using `Array.prototype.find()` or `Array.prototype.includes()` inside an outer `.map()` loop instead of indexing items into a `Set` or `Map` ($O(1)$ lookups).
* **Deep Object Cloning:** Repeatedly cloning large trees with `structuredClone()` or lodash `cloneDeep` on every state update instead of using shallow copies (`{ ...prev }`) or structural sharing.

---

### Diagnostic Summary

| Bottleneck Category      | Primary Symptom               | Best Chrome DevTools Panel                        |
| ------------------------ | ----------------------------- | ------------------------------------------------- |
| **Long CPU Tasks**       | Unresponsive clicks, high INP | **Performance** (Main thread flame chart)         |
| **Layout Thrashing**     | Stuttery scrolling/animations | **Performance** (Red "Forced Reflow" markers)     |
| **GC / Detached Nodes**  | Memory creeps up over time    | **Memory** (Heap Snapshots / Allocation Timeline) |
| **Component Re-renders** | Input lag during typing       | **React Profiler** ("Why did this render?")       |

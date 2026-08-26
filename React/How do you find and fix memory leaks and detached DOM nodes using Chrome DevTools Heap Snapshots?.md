Finding and fixing memory leaks—especially **detached DOM nodes**—is one of the most impactful performance optimizations for single-page applications (SPAs).

A **detached DOM node** occurs when an HTML element is removed from the visible DOM tree, but a JavaScript variable, event listener, timer, or closure still retains a reference to it. Because the garbage collector (GC) sees a reachable reference, it cannot free the node—nor can it free any of the node's children or attached data.

---

### Key Concepts in Heap Snapshots

* **Shallow Size:** The memory held directly by the object itself (e.g., primitive properties, internal overhead).
* **Retained Size:** The total memory freed once the object is garbage-collected (includes all dependent objects only reachable through it).
* **Distance:** The shortest path length from a GC Root (e.g., `window`, active execution context) to the object.
* **Retainer Tree:** The chain of references holding the object alive in memory.

---

### Step-by-Step: Diagnosing Memory Leaks

#### 1. The 3-Snapshot Technique

To reliably catch leaks caused by user interactions (e.g., opening and closing a modal, navigating to a route and back):

1. Open Chrome DevTools $\rightarrow$ **Memory** panel $\rightarrow$ Select **Heap snapshot**.
2. Click the trash can icon (**Collect garbage**) to clean up unreachable objects.
3. Take **Snapshot 1** (Baseline).
4. Perform the action (e.g., open a modal, mount a complex component, or navigate to a page).
5. Take **Snapshot 2** (Active state).
6. Undo the action (e.g., close the modal, unmount the component, navigate back).
7. Force garbage collection again (trash can icon) and take **Snapshot 3** (Final state).

---

#### 2. Comparing Snapshots

1. Select **Snapshot 3** in the left sidebar.
2. In the top dropdown, change **Summary** to **Comparison** and select **Snapshot 1** as the reference.
3. Sort by **# Delta** (Allocated count minus Deleted count) or **Size Delta**.
4. If objects created in Step 4 are still alive in Snapshot 3, their `# Delta` will be positive ($>0$).

```
[Snapshot 1 (Base)] ──▶ Open Modal ──▶ [Snapshot 2] ──▶ Close Modal + GC ──▶ [Snapshot 3]
                                                                                   │
                                                  (Compare Snapshot 3 to 1) ◀──────┘
                                                  • Positive # Delta = Leaked Objects

```

---

#### 3. Identifying Detached DOM Nodes

1. In the filter box at the top, type `Detached`.
2. Chrome DevTools highlights detached elements in yellow or red:

* **Yellow highlight:** Direct JavaScript reference (e.g., variable `const el = ...`).
* **Red highlight:** A detached node that is indirect or has a parent in the detached tree.

1. Expand `Detached HTMLDivElement` (or relevant element) and click a specific node instance.
2. Look at the **Retainers** panel at the bottom:

* Find the reference path leading to a `GC root` or `window`.
* Trace upwards to see which closure, global array, event handler, or cache map is preventing garbage collection.

---

### Common Memory Leak Patterns & Code Fixes

#### Pattern 1: Forgotten Event Listeners on `window` / `document`

**The Bug:** Adding listeners to global objects inside a component without cleaning them up when unmounted keeps the entire component scope and its DOM nodes in memory.

```javascript
// ❌ LEAK: Retains 'onScroll' closure and any DOM elements referenced inside
function setupModal() {
  const modalEl = document.getElementById('modal');
  
  function onScroll() {
    console.log(modalEl.getBoundingClientRect());
  }
  
  window.addEventListener('scroll', onScroll);
}

```

**The Fix:** Always remove listeners during cleanup / unmount, or use an `AbortController`.

```javascript
// ✅ FIXED (React useEffect or Vanilla JS)
useEffect(() => {
  const controller = new AbortController();

  window.addEventListener('scroll', handleScroll, { signal: controller.signal });

  return () => {
    // Automatically tears down listener and releases closure
    controller.abort();
  };
}, []);

```

---

#### Pattern 2: Global Caches / Event Emitters / Subscriptions

**The Bug:** Storing DOM nodes or component instances in global arrays or Maps without eviction.

```javascript
// ❌ LEAK: Global Map prevents GC on removed DOM elements
const elementCache = new Map();

function trackElement(el) {
  elementCache.set(el.id, el); // Strong reference
}

```

**The Fix:** Use `WeakMap` or `WeakSet` so DOM nodes can be garbage collected when removed from the document tree.

```javascript
// ✅ FIXED: WeakMap does not prevent garbage collection
const elementCache = new WeakMap();

function trackElement(el) {
  elementCache.set(el, { lastObserved: Date.now() });
}

```

---

#### Pattern 3: Dangling `setInterval` / `setTimeout`

**The Bug:** Active timers hold their enclosing function scope alive until cleared.

```javascript
// ❌ LEAK: The timer runs forever, holding reference to 'largeData' and 'container'
function startPolling(container) {
  const largeData = new Array(100000).fill('leak');
  
  setInterval(() => {
    container.textContent = `Updated: ${Date.now()}`;
  }, 1000);
}

```

**The Fix:** Always clear timer IDs when destroying components or views.

```javascript
// ✅ FIXED
function startPolling(container) {
  const timerId = setInterval(() => {
    container.textContent = `Updated: ${Date.now()}`;
  }, 1000);

  return () => clearInterval(timerId); // Call on teardown
}

```

---

#### Pattern 4: Closures Retaining Outer Scope References

**The Bug:** If one closure in an execution context is retained (e.g., globally attached), all other variables in that lexical environment can also be retained by the JavaScript engine.

```javascript
// ❌ LEAK: 'leakClosure' is globally stored, holding the entire closure scope
let retainedFunction;

function runScope() {
  const heavyData = new Uint8Array(1024 * 1024 * 50); // 50MB
  const smallText = 'hello';

  retainedFunction = function() {
    console.log(smallText); // Holds the lexical environment
  };
}

```

**The Fix:** Clear out references explicitly if functions must outlive their scope, or isolate heavy allocations into independent scopes.

```javascript
// ✅ FIXED: Isolate memory intensive tasks
function runScope() {
  {
    const heavyData = new Uint8Array(1024 * 1024 * 50);
    processHeavy(heavyData);
  } // heavyData is immediately eligible for GC

  retainedFunction = function() {
    console.log('hello');
  };
}

```

---

### Diagnostic Checklist

* **Take snapshots in Incognito Mode** without browser extensions to avoid false positives.
* **Filter by `Detached**` to quickly isolate unlinked DOM nodes.
* **Check the Distance column:** A small distance means the object is directly referenced by a top-level context (e.g., `window` or a global array).
* **Use the Retainers panel** to follow the yellow/red path all the way back to the root variable holding the reference.

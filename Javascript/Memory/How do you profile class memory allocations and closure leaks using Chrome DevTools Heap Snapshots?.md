Profiling memory leaks in Chrome DevTools relies on taking and comparing **V8 Heap Snapshots** across state transitions.

By analyzing the difference between **Shallow Size** and **Retained Size**, inspecting the **Retainers Tree**, and using the **3-Snapshot Technique**, you can isolate whether an object is leaked by an uncleared event listener, a captured closure, or an expanding collection.

---

### Key Concepts: Shallow Size vs. Retained Size

When inspecting heap snapshots, understand the two memory metrics for every constructor:

* **Shallow Size:** The physical memory allocated directly to hold the object itself (its own property table and internal slots, typically $32$ to $64\text{ bytes}$).
* **Retained Size:** The total amount of memory that would be **freed if this object were garbage collected** (the object's shallow size plus the memory of all objects reachable *only* through it).

```
   ┌────────────────────────────────┐
   │ Closure / Class Instance       │ ──► Shallow Size: 32 bytes
   └───────────────┬────────────────┘
                   │ retains
   ┌───────────────▼────────────────┐
   │ Large Array / 10MB Buffer      │ ──► Retained Size: 10,000,032 bytes
   └────────────────────────────────┘

```

> **Target high Retained Size:** A small object or closure with a huge retained size is almost always the root holder of a memory leak.

---

### The 3-Snapshot Technique (Detecting Leaks)

The most reliable way to prove a memory leak is to compare baseline memory against a completed user interaction:

1. **Take Snapshot 1 (Baseline):**
Open Chrome DevTools $\rightarrow$ **Memory** tab $\rightarrow$ Select **Heap snapshot** $\rightarrow$ Click **Collect garbage** (trash can icon) $\rightarrow$ Click **Take snapshot**.

2. **Trigger Action and Clean Up:**
Perform the action in your app that should create and then destroy objects (e.g., open a modal, mount/unmount a component, or run a batch task) and tear it down.

3. **Take Snapshot 2 (Post-Action):**
Click **Collect garbage** again, then take Snapshot 2.

4. **Repeat Action and Take Snapshot 3:**
Perform the exact same action and teardown once more, collect garbage, and take Snapshot 3.

---

### 1. Profiling Class Memory Allocations

To see which class instances were created and never released:

1. Select **Snapshot 3** in the left sidebar.
2. In the perspective dropdown (top toolbar, default is *Summary*), select **Comparison**.
3. Choose **Snapshot 1** in the *Compare to* dropdown.
4. Filter by your class name in the **Class filter** input (e.g., `UserProfile`, `ButtonHandler`).

```
┌─────────────────┬──────────┬──────────┬──────────────┬───────────────┐
│ Constructor     │ # Alloc  │ # Freed  │ # Delta      │ Size Delta    │
├─────────────────┼──────────┼──────────┼──────────────┼───────────────┤
│ UserProfile     │ 500      │ 0        │ +500 (LEAK!) │ +1.2 MB       │
└─────────────────┴──────────┴──────────┴──────────────┴───────────────┘

```

* If **`# Delta`** is positive across identical mount/unmount cycles, your class instances are staying alive in memory.

---

### 2. Identifying Closure Leaks

A closure leak occurs when an inner function unintentionally holds a reference to a parent lexical environment containing large objects.

#### Classic Closure Leak Pattern

```javascript
let leakyHolder;

function createLeak() {
  const largeData = new Array(1_000_000).fill('leak'); // 8MB

  // Closure 1: Uses `largeData`
  function unused() {
    console.log(largeData);
  }

  // Closure 2: Shared lexical scope keeps `largeData` alive even if unused!
  leakyHolder = function exportedFn() {
    console.log('Running');
  };
}

createLeak();

```

#### How to Find Closures in DevTools

1. In Snapshot **Summary** view, filter by **`(closure)`** or **`system / Context`**.
2. Sort the table by **Retained Size** (descending).
3. Expand the top `(closure)` entries.
4. Click on a closure to view its **Retainers Tree** at the bottom of the panel.

```
Retainers Panel:
▼ exportedFn() in createLeak()
  ▼ context in createLeak()  <-- Context object retained on Heap
    • largeData: Array(1000000)
    ▼ leakyHolder in Global / window

```

---

### 3. Reading the Retainers Path to Fix the Root Cause

The **Retainers view** at the bottom displays the reference chain preventing the garbage collector from reclaiming the object:

```
[GC Root (Window / Global Scope / Active DOM Tree)]
                        │
                        ▼ (retains)
                [Event Listener]
                        │
                        ▼ (retains)
             [Closure: onClickHandler]
                        │
                        ▼ (retains)
        [Class Instance: ComponentView]

```

#### Common Culprits and Their Visual Signatures

* **Detached DOM Elements:** Look for nodes colored in **yellow** (e.g., `Detached HTMLDivElement`). This means a DOM node was removed from the page via `.removeChild()` or component unmount, but a JavaScript class instance or event listener still holds a reference to it.
* **Uncleared Timers / Intervals:** A `setInterval` callback retains its surrounding closure and any `this` references until `clearInterval` is explicitly invoked.
* **Global Event Bus / Observers:** Instances that subscribed to `EventEmitter.on()` or `window.addEventListener('resize', ...)` without calling `off()` / `removeEventListener()`.

---

### Quick Diagnostic Checklist

| Symptom in Heap Snapshot                  | Root Cause                                                     | Fix                                                   |
| ----------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| Positive `# Delta` for Class Constructors | Forgotten event listener or cache collection holding instances | Remove listeners in `dispose()` / unmount lifecycle   |
| High retained size under `(closure)`      | Unused variable captured by a co-scoped inner function         | Set large temporary variables to `null` after use     |
| `Detached HTMLElement` in yellow          | DOM node removed from tree but stored in a variable            | Clear element references (`this.el = null`)           |
| Rapid heap spikes during allocations      | Using arrow field properties inside loops                      | Move methods to prototype or hoist reusable callbacks |

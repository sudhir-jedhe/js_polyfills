*** copy Compare key resetting vs useLayoutEffect for zero-flicker state sync  Explain what happens to DOM nodes during key change vs prop update.md ***

**Render Phase vs. Commit Phase in React Fiber**

React Fiber splits the work of updating the UI into two distinct phases to enable concurrent rendering without blocking the main browser thread.

```
[Trigger Update] ──▶ ┌────────────────────────────────────────┐
                     │              RENDER PHASE              │
                     │  • Asynchronous & interruptible        │
                     │  • Traverses Fiber tree (beginWork)    │
                     │  • Computes diffs, flags side effects  │
                     └───────────────────┬────────────────────┘
                                         │ (WorkInProgress Tree ready)
                                         ▼
                     ┌────────────────────────────────────────┐
                     │              COMMIT PHASE              │
                     │  • Synchronous & non-interruptible     │
                     │  • Applies DOM mutations               │
                     │  • Runs useLayoutEffect -> Paints      │
                     │  • Runs useEffect asynchronously       │
                     └────────────────────────────────────────┘

```

| Characteristic   | Render Phase                                                                                                                  | Commit Phase                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Execution**    | **Asynchronous & Interruptible** (Can pause, yield, restart, or discard work).                                                | **Synchronous & Non-Interruptible** (Runs to completion in a single tick).         |
| **Primary Task** | Computes the `workInProgress` tree, evaluates component functions, and marks effect tags (`Placement`, `Update`, `Deletion`). | Mutates the host DOM, attaches/detaches refs, and invokes lifecycle hooks/effects. |
| **Side Effects** | **Forbidden** (Must be pure; components may execute multiple times before committing).                                        | **Allowed** (Executes `useLayoutEffect`, paints DOM, schedules `useEffect`).       |

---

**Lane-Based Scheduling & Update Prioritization**

React Fiber models priorities using **Lanes**—a 31-bit binary bitmask representation where each bit (or group of bits) represents a specific task priority.

```
Bitmask Priority (31-bit integers):
0b0000000000000000000000000000001 (SyncLane - discrete clicks, keydowns)
0b0000000000000000000000000000010 (InputContinuousLane - scrolling, dragging)
0b0000000000000000000000000010000 (DefaultLane - standard setState / fetches)
0b0000000000000000000001000000000 (TransitionLane - startTransition, low priority)

```

* **Bitwise Operations:** React performs fast bitwise calculations (e.g., `lanes & -lanes` to extract the highest priority lane) to determine which slice of work to process next.
* **Preemption & Time-Slicing:** If a low-priority transition (`TransitionLane`) is rendering and the user types into an input (`SyncLane`), React Fiber aborts the transition's render phase immediately, processes the input update, commits it to the DOM, and then restarts or resumes the lower-priority render.
* **Starvation Prevention:** Every lane tracks an expiration timestamp. If high-priority updates continuously block a low-priority update, that lane eventually expires and is elevated to `SyncLane`, forcing it to complete immediately.

---

**Key Resetting vs. `useLayoutEffect` for Zero-Flicker State Sync**

When a child component must update its local state based on changing parent props without causing a visual flash:

| Criterion                       | `key={id}` Resetting                                                                                   | `useLayoutEffect` State Sync                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Mechanism**                   | Destroys the existing Fiber node and DOM elements; mounts a fresh instance initialized with new props. | Retains the Fiber node and DOM; intercepts the commit phase before browser paint to trigger an immediate, synchronous re-render. |
| **Render Cycles**               | **1 Render Cycle** (Pure mount).                                                                       | **2 Render Cycles** (Initial render with stale state $\to$ synchronous second render with new state).                            |
| **Layout Flicker**              | **Zero Flicker** (Fresh DOM tree is painted immediately).                                              | **Zero Flicker** (Browser paint is blocked until the second synchronous render finishes).                                        |
| **Preservation of Other State** | **Wipes all local state** in that component tree.                                                      | **Preserves unrelated local state** (e.g., accordion expansion, scroll offsets).                                                 |
| **Recommended Use Case**        | When switching entities completely (e.g., changing from `user/1` to `user/2`).                         | When only a single piece of derived state needs updating while preserving the rest of the instance.                              |

---

**DOM Node Behavior: Key Change vs. Prop Update**

* **When `props` Update (Same Key, Same Type):**
* **Fiber Tree:** React reuses the exact same `FiberNode`.
* **DOM Nodes:** The existing real DOM nodes **remain in the DOM**. React mutates only the specific changed attributes, text nodes, or inline styles via DOM APIs (e.g., `node.setAttribute()`, `node.textContent = '...'`).
* **State & Focus:** All input focus, selection states, and local hooks remain intact.

* **When `key` Changes:**
* **Fiber Tree:** The old `FiberNode` is marked with a `Deletion` flag; a new `FiberNode` is allocated with a `Placement` flag.
* **DOM Nodes:** React calls `parentNode.removeChild()` to **completely remove the old DOM node and all its descendants**, then calls `parentNode.insertBefore()` to insert newly created DOM nodes (`document.createElement()`).
* **State & Focus:** All internal state, transient animations, input focus, and event listeners on the old DOM node are torn down.

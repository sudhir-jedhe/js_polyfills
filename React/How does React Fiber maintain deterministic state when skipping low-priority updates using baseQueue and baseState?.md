***  How does React Fiber maintain deterministic state when skipping low-priority updates using baseQueue and baseState?.md ***

To keep state deterministic when a high-priority update interrupts or skips a lower-priority update, React must guarantee that **the final state reflects all actions in the exact chronological order they were dispatched**.

Skipping an update cannot simply mean dropping it and applying only future updates on top of the old state—that would lead to corrupted intermediate states. React solves this by **re-basing** using two dedicated fields on each hook: `baseState` and `baseQueue`.

---

**1. The Role of `baseState` and `baseQueue**`

* **`baseState`**: The snapshot of state **immediately before the first skipped update** in a given render pass.
* **`baseQueue`**: A persistent linked list holding the first skipped update and **every single update dispatched after it**, regardless of whether those later updates were already applied in an earlier high-priority render.
* **`memoizedState`**: The temporary, speculative state computed for the *current* render's active `renderLanes`.

---

**2. Why Later Updates Must Be Cloned into `baseQueue**`

Consider an updater function like `setCount(c => c + 1)`. If update $A$ is skipped (e.g. low-priority data fetch result) and update $B$ is processed immediately (e.g. urgent user click), $B$'s computation in that high-priority render did not include $A$.

When React later runs the low-priority render to process $A$, it cannot just compute $A$ in isolation. It must recalculate:

$$\text{Final State} = \text{baseState} \xrightarrow{A} \text{Intermediate State} \xrightarrow{B} \text{Final State}$$

Therefore, the moment an update is skipped, **all subsequent updates must be retained in `baseQueue` to be re-executed in the next pass**.

---

**3. Step-by-Step Walkthrough**

Let initial state `count = 0`. Three updates are queued:

* **$U_1$ (Low Priority, `DefaultLane`):** `count => count + 1`
* **$U_2$ (High Priority, `SyncLane`):** `count => count * 10`
* **$U_3$ (Low Priority, `DefaultLane`):** `count => count + 5`

```
Initial State: baseState = 0, memoizedState = 0
Queue: [ U1 (Low: +1) ] ──► [ U2 (High: *10) ] ──► [ U3 (Low: +5) ]

```

---

### Phase 1: High-Priority Render (`renderLanes = SyncLane`)

React enters `updateReducer()` and processes the queue sequentially:

```
Step 1: Check U1 (Low Priority)
  - Does not match SyncLane -> SKIPPED.
  - React captures the current state as baseState:
    newBaseState = 0
  - U1 is saved to newBaseQueue:
    newBaseQueue = [ U1 (+1) ]

Step 2: Check U2 (High Priority)
  - Matches SyncLane -> APPLIED to current computation.
  - newState = 0 * 10 = 0.
  - Because U1 was already skipped, U2 is ALSO appended to newBaseQueue:
    newBaseQueue = [ U1 (+1) ] ──► [ U2 (*10) ]

Step 3: Check U3 (Low Priority)
  - Does not match SyncLane -> SKIPPED.
  - U3 is appended to newBaseQueue:
    newBaseQueue = [ U1 (+1) ] ──► [ U2 (*10) ] ──► [ U3 (+5) ]

```

**End of High-Priority Render:**

* **`memoizedState`** (shown on screen): **`0`**
* **`baseState`** (saved for next pass): **`0`**
* **`baseQueue`** (saved for next pass): `[ U1 (+1) ] -> [ U2 (*10) ] -> [ U3 (+5) ]`

---

### Phase 2: Low-Priority Render (`renderLanes = DefaultLane`)

The browser completes the high-priority paint. The Scheduler triggers the remaining work for `DefaultLane`.

React starts calculating from **`baseState = 0`** and replays the entire `baseQueue`:

```
Replay Queue: [ U1 (+1) ] ──► [ U2 (*10) ] ──► [ U3 (+5) ]

1. Process U1 (+1):
   state = 0 + 1 = 1

2. Process U2 (*10): (Re-computed to preserve correct sequence order!)
   state = 1 * 10 = 10

3. Process U3 (+5):
   state = 10 + 5 = 15

```

**End of Low-Priority Render:**

* No updates were skipped in this pass.
* **`baseState`** becomes **`15`**.
* **`baseQueue`** becomes **`null`**.
* **`memoizedState`** becomes **`15`**.

---

**4. Under-the-Hood Fiber Code Logic**

In `react-reconciler`, the loop inside `updateReducer` runs the following algorithm:

```typescript
let first = baseQueue !== null ? baseQueue.next : null;
let update = first;
let newState = baseState;

let newBaseState = null;
let newBaseQueueFirst = null;
let newBaseQueueLast = null;

do {
  const updateLane = update.lane;
  
  if (!isSubsetOfLanes(renderLanes, updateLane)) {
    // Priority too low: SKIP this update
    const clone: Update<S, A> = {
      lane: updateLane,
      action: update.action,
      hasEagerState: update.hasEagerState,
      eagerState: update.eagerState,
      next: null,
    };
    
    if (newBaseQueueLast === null) {
      newBaseQueueFirst = newBaseQueueLast = clone;
      newBaseState = newState; // Lock in baseState at the FIRST skipped update
    } else {
      newBaseQueueLast = newBaseQueueLast.next = clone;
    }
  } else {
    // Priority MATCHES: Process the update
    if (newBaseQueueLast !== null) {
      // A prior update was already skipped!
      // Must clone this update into newBaseQueue regardless of priority.
      const clone: Update<S, A> = {
        lane: NoLane, // Clear lane so it's guaranteed to process next time
        action: update.action,
        hasEagerState: update.hasEagerState,
        eagerState: update.eagerState,
        next: null,
      };
      newBaseQueueLast = newBaseQueueLast.next = clone;
    }

    // Apply reducer
    const action = update.action;
    newState = typeof action === 'function' ? action(newState) : action;
  }
  
  update = update.next;
} while (update !== null && update !== first);

// If no updates were skipped, update baseState to the final computed state
if (newBaseQueueLast === null) {
  newBaseState = newState;
}

hook.memoizedState = newState;
hook.baseState = newBaseState;
hook.baseQueue = newBaseQueueLast;

```

---

**Summary of Guarantees**

| Scenario                             | State on Screen (`memoizedState`)                                           | Saved Base (`baseState` / `baseQueue`)                                  | Result                                                      |
| ------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Normal Render (No Skips)**         | Evaluates all updates in order                                              | `baseState = newState`, `baseQueue = null`                              | Immediate consistency                                       |
| **Interrupted Render (Skips $U_1$)** | Applies only high-priority updates ($U_2$)                                  | `baseState` freezes before $U_1$; $U_1$ and $U_2$ staged in `baseQueue` | Temporary speculative state shown; no data loss             |
| **Re-base Render (Catch-up)**        | Replays full chain ($U_1 \rightarrow U_2 \rightarrow U_3$) from `baseState` | `baseState = 15`, `baseQueue = null`                                    | Final state is deterministic as if no interruption occurred |

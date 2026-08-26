*** copy How does React queue microtasks for discrete events and synchronous batched updates using queueMicrotask?.md ***

While low-priority and concurrent updates yield via **macrotasks** (`MessageChannel`), React processes **discrete events** (clicks, keypresses, focus changes) and **synchronous batching** using **microtasks** (`queueMicrotask` / `Promise.resolve()`).

Microtasks run **immediately at the end of the current JavaScript call stack**, before the browser yields to layout, styling, or paint. This ensures the DOM updates synchronously relative to the user's interaction frame, preventing visual tearing and input lag.

---

**1. The Microtask Batching Loop (`scheduleMicrotask`)**

Whenever a synchronous or discrete state update is triggered (e.g. inside a click handler, `fetch.then()`, or `setTimeout`), React invokes `ensureRootIsScheduled()`.

Instead of running reconciliation immediately on every single `setState()`, React deduplicates update requests into a single microtask:

```
[ setState 1 ] ──► marks SyncLane ──► scheduleMicrotask(flushSyncCallbacks) ──┐
[ setState 2 ] ──► marks SyncLane ──► already scheduled? NOOP               ├── (Batched into 1 Microtask)
[ setState 3 ] ──► marks SyncLane ──► already scheduled? NOOP               ──┘
       │
       ▼ (Current JS call stack ends)
[ Browser drains Microtask Queue ] ──► executes flushSyncCallbacks() ──► Renders ONCE

```

### Under the Hood: `scheduleMicrotask` & `flushSyncCallbacks`

React maintains a queue of synchronous callbacks in `react-reconciler`:

```typescript
let syncQueue: Array<() => void> | null = null;
let isFlushingSyncQueue = false;
let isMicrotaskScheduled = false;

export function scheduleSyncCallback(callback: () => void) {
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}

export function scheduleMicrotask(callback: () => void) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback);
  } else {
    // Fallback for older environments
    Promise.resolve().then(callback);
  }
}

export function ensureRootIsScheduled(root: FiberRoot) {
  const nextLanes = getHighestPriorityLane(root.pendingLanes);

  if (includesSyncLane(nextLanes)) {
    // 1. Add root render work to the sync callback queue
    scheduleSyncCallback(() => performSyncWorkOnRoot(root));

    // 2. Schedule a microtask if one isn't already queued
    if (!isMicrotaskScheduled) {
      isMicrotaskScheduled = true;
      scheduleMicrotask(flushSyncCallbacks);
    }
  } else {
    // Low priority work routes to Scheduler (MessageChannel macrotask)
    ensureConcurrentWorkIsScheduled(root);
  }
}

```

---

**2. How Automatic Batching (React 18+) Relies on Microtasks**

In React 17 and earlier, batching was tied strictly to React's synthetic event handler wrapper. State updates inside asynchronous callbacks (`setTimeout`, Promises, native event listeners) ran outside the wrapper and were not batched:

```javascript
// React 17 behavior:
fetchData().then(() => {
  setA(1); // Render 1 (Sync DOM update)
  setB(2); // Render 2 (Sync DOM update)
});

```

In React 18+, **Automatic Batching** is universal because all updates route through `scheduleMicrotask`:

```javascript
// React 18+ behavior:
fetchData().then(() => {
  setA(1); // Enqueues update, schedules microtask flush
  setB(2); // Enqueues update, microtask already scheduled (NOOP)
});
// ---> Call stack empties
// ---> Microtask runs: setA and setB are reconciled and committed in a SINGLE pass.

```

---

**3. Discrete Events vs. Continuous Events: Microtask vs Macrotask**

React categorizes user input into different priority lanes, which dictates whether work is scheduled via a **Microtask** or a **Macrotask**:

```
                       [ DOM Event Dispatched ]
                                  │
                  Is event type Discrete or Continuous?
                   /                                \
           [ Discrete Event ]                [ Continuous Event ]
         (click, keydown, input)            (mousemove, wheel, scroll)
                   │                                     │
             SyncLane (1)                     InputContinuousLane (4)
                   │                                     │
          [ queueMicrotask ]                    [ MessageChannel ]
      (Runs before paint, 0ms)                 (Yields to paint, ~5ms)

```

| Event Type      | Examples                                 | Assigned Lane         | Queue Used                       | Timing                                                                |
| --------------- | ---------------------------------------- | --------------------- | -------------------------------- | --------------------------------------------------------------------- |
| **Discrete**    | `click`, `keydown`, `submit`, `focusin`  | `SyncLane`            | **Microtask** (`queueMicrotask`) | Flushes immediately before the browser renders the next frame.        |
| **Continuous**  | `pointermove`, `scroll`, `drag`, `wheel` | `InputContinuousLane` | **Macrotask** (`MessageChannel`) | Can be time-sliced and interrupted so fluid scrolling is not dropped. |
| **Transitions** | `startTransition`, `useDeferredValue`    | `TransitionLanes`     | **Macrotask** (`MessageChannel`) | Interruptible background tasks with 5ms frame budgets.                |

---

**4. Bypassing the Microtask: `flushSync()**`

If an operation requires immediate DOM measurement before the current call stack even finishes (for example, reading a DOM rect right after an update), `flushSync` forces React to bypass the microtask queue and run reconciliation **synchronously in-line**:

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setIsOpen(true);
  });
  // The DOM is already updated and committed here!
  const height = dialogRef.current.getBoundingClientRect().height;
}

```

Under the hood, `flushSync()`:

1. Temporarily elevates execution priority to `SyncLane`.
2. Sets `isFlushingSyncQueue = true`.
3. Directly invokes `flushSyncCallbacks()` **synchronously** inside the calling function, executing `performSyncWorkOnRoot()` without waiting for the microtask checkpoint.

---

**Summary of Event Loop Execution Order in React**

1. **Synchronous JavaScript:** Component functions, event listeners, and `setState()` calls execute.
2. **Microtasks (`queueMicrotask`):** Discrete events, `flushSyncCallbacks`, and batched `SyncLane` reconciliations execute and commit to the Real DOM.
3. **Browser Frame Pipeline:** Style recalculations, layout, and visual painting occur.
4. **Macrotasks (`MessageChannel`):** React Scheduler resumes concurrent time-sliced work (`TransitionLanes`, `DefaultLane`) for the next frame.

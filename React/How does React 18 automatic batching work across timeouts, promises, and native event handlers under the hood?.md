**Automatic Batching** groups multiple state updates (`setState`) into a single re-render cycle for optimal performance.

While React 17 only batched updates triggered directly inside React Synthetic Event handlers, **React 18 batches state updates everywhere by default**—including native event listeners, `setTimeout`, Promises, and fetch callbacks.

---

### React 17 vs. React 18: What Changed?

* **React 17:** Batching was coupled directly to the execution context of Synthetic Event plugins. Once execution fell out of the synchronous call stack (e.g., inside an `await` or `setTimeout`), the batching flag was lost, causing each `setState` to trigger an immediate, synchronous re-render.
* **React 18:** Batching was decoupled from event handlers and moved into the core Fiber reconciler using the **Lanes Priority Model** and **Microtask Scheduling**.

```javascript
// React 17: 2 re-renders | React 18: 1 re-render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);

// React 17: 2 re-renders | React 18: 1 re-render
fetch('/api/user').then(() => {
  setUser(userData);
  setIsLoading(false);
});

```

---

### Under the Hood: How React 18 Implements Universal Batching

```
setState() Called (Inside Promise / Timeout / Native Event)
       │
       ▼
1. Create Update Object & Assign Lane Priority (e.g., SyncLane / DefaultLane)
       │
       ▼
2. Enqueue Update onto Fiber Node's Update Queue
       │
       ▼
3. Call `ensureRootIsScheduled(root)`
       │
       ├──────────────────────────────────────────────────────┐
       ▼                                                      ▼
Is Root already scheduled for this Lane?            First Update for this Lane?
       │                                                      │
       ▼                                                      ▼
  [ Do Nothing ]                                Schedule Microtask via `queueMicrotask`
(Piggybacks on pending flush)                          (or Scheduler MessageChannel)
                                                              │
                                                              ▼
                                            Microtask Executes at Call-Stack Exhaustion
                                                              │
                                                              ▼
                                            4. Drain Update Queue (All pending setStates)
                                                              │
                                                              ▼
                                            5. Single Fiber Tree Re-render Pass

```

---

### The 4 Core Mechanics Behind the Pipeline

#### 1. Decoupling from the Call Stack via Lanes

When `setState` is called, React does not render immediately. Instead:

* It calculates the update's priority using a 31-bit bitmask system called **Lanes** (e.g., `SyncLane`, `InputContinuousLane`, `DefaultLane`).
* It appends the update to the target Fiber's circular update queue (`fiber.updateQueue`).

#### 2. Deduplicating Render Requests (`ensureRootIsScheduled`)

Every `setState` triggers an internal call to `ensureRootIsScheduled(root)`:

* React checks if an execution callback is already scheduled on the host environment for that priority lane (`root.callbackPriority === newCallbackPriority`).
* If one is already queued, `ensureRootIsScheduled` **exits immediately**.
* Subsequent `setState` calls simply append their work to the queue without requesting new renders.

#### 3. Microtask-Level Deferred Flushing

Instead of running synchronously during the function execution, React schedules the work at the end of the current JavaScript turn using a **Microtask** (`queueMicrotask` or a Promise resolution):

* The JavaScript engine finishes executing the entire callback (including all sequential `setState` lines in your Promise or `setTimeout`).
* The call stack clears.
* The browser reaches the **microtask checkpoint**, invoking React's scheduled callback to process all queued updates in a single render pass.

#### 4. Opting Out of Batching (`flushSync`)

When an immediate DOM read is required right after an update (e.g., measuring an element's dimensions after state change), you can opt out of automatic batching using `flushSync`:

```jsx
import { flushSync } from 'react-dom';

function handleClick() {
  // Flushes immediately to the DOM
  flushSync(() => {
    setCount(c => c + 1);
  });
  // DOM is updated here
  console.log(buttonRef.current.textContent);

  // Batched normally
  setFlag(f => !f);
}

```

> **Performance Note:** Use `flushSync` sparingly; forcing synchronous flushes breaks concurrent scheduling and hurts rendering performance.

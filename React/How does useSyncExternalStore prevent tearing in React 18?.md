***  How does useSyncExternalStore prevent tearing in React 18?.md ***

**UI Tearing** is a visual glitch where two different components on the screen display conflicting, out-of-sync values for the exact same piece of external state during a single render pass.

`useSyncExternalStore` was introduced in React 18 specifically to prevent tearing when reading from non-React stores (Redux, Zustand, browser APIs) during concurrent rendering.

---

**What Causes Tearing in React 18 Concurrent Mode?**

In React 18, the **Render Phase** is asynchronous and interruptible:

```
[Start Render] ──▶ Component A reads Store (v1)
                         │
                   [INTERRUPT: External mutation updates Store to v2]
                         │
[Resume Render]──▶ Component B reads Store (v2)
                         │
[Commit to DOM]──▶ Component A displays "v1", Component B displays "v2"  <-- TEARING!

```

1. React starts rendering a component tree. **Component A** reads `value = 1` from the external store.
2. React yields the main thread to handle higher-priority browser events.
3. An external event (e.g., WebSocket message, timer, or external click handler) mutates the store to `value = 2`.
4. React resumes rendering and reaches **Component B**, which reads `value = 2`.
5. Both components commit to the DOM in the same frame, displaying inconsistent data to the user.

---

**How `useSyncExternalStore` Fixes This**

`useSyncExternalStore` uses a three-part mechanism to guarantee snapshot consistency across concurrent render passes:

```
[Start Concurrent Render] ──▶ Read getSnapshot()
                                      │
[Store Mutates Mid-Render] ──▶ getSnapshot() produces a new reference
                                      │
[Fiber Consistency Check] ──▶ React detects Snapshot mismatch:
                               1. Discards the in-flight concurrent work
                               2. Immediately re-renders the whole tree SYNCHRONOUSLY
                                      │
[Commit to DOM]            ──▶ All components render identical snapshot (Zero Tearing)

```

* **1. Synchronous Snapshot Verification (`getSnapshot`)**
React calls `getSnapshot()` during the render phase and caches the returned value for each subscribed Fiber. It requires `getSnapshot` to return an immutable primitive or a cached reference.
* **2. Mismatch Detection & In-Flight Invalidation**
Before committing a concurrent render tree to the host DOM, React re-evaluates `getSnapshot()` across all subscribed components to verify that the store remained unchanged while rendering.
* If any snapshot value changed between the start of the render phase and the commit phase, React marks the in-flight render tree as **stale and invalid**.

* **3. Fallback to Synchronous Rendering**
When a snapshot mismatch is detected, React immediately throws away the inconsistent work-in-progress tree and **re-starts the render synchronously on the main thread**. Because synchronous renders cannot be interrupted by microtasks or macrotasks, the store cannot mutate mid-render, ensuring 100% snapshot consistency.

---

**Why Traditional Hooks (`useEffect` + `useState`) Fail**

Before `useSyncExternalStore`, libraries subscribed to external stores inside `useEffect`:

```javascript
// ❌ Old React 16/17 Pattern (Prone to tearing in Concurrent React 18)
function useExternalData(store) {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    // Subscriptions only register AFTER the commit phase finishes
    const unsubscribe = store.subscribe(() => setState(store.getState()));
    return unsubscribe;
  }, [store]);

  return state;
}

```

* **Passive Subscriptions:** `useEffect` runs asynchronously *after* the browser paints. Any store mutations occurring between the start of rendering and the execution of `useEffect` are missed, guaranteeing tearing during concurrent interruptions.
* **Passive Updates:** React cannot know when an external store changed unless notified by `setState`, which queues a delayed re-render rather than checking snapshot consistency at commit time.

---

**Summary of Guarantees**

| Feature                     | `useEffect` + `useState`                 | `useSyncExternalStore`                                                     |
| --------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| **Concurrent Safe**         | No (Tearing occurs during time-slicing). | **Yes** (Zero tearing guaranteed).                                         |
| **Store Mutation Handling** | Queues extra re-render after paint.      | Detects mid-render changes and forces a clean sync re-render before paint. |
| **SSR Hydration**           | Prone to hydration mismatch warnings.    | Built-in `getServerSnapshot` guarantees hydration parity.                  |

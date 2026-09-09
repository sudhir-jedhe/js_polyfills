***  How does automatic batching work in React 18+?  Compare useState functional updates vs useReducer.md ***

**How Automatic Batching Works in React 18+**

**Batching** is React grouping multiple state updates into a single re-render cycle to prevent redundant render and commit phases.

```
React 17 and earlier (Partial Batching):
[Native Event Handler] ──▶ setState ──▶ setState ──▶ (1 batched re-render)
[setTimeout / Promise] ──▶ setState (re-render) ──▶ setState (re-render)  <-- Unbatched

React 18+ (Automatic Batching via createRoot):
[Any Context: Events, Promises, setTimeout] ──▶ setState ──▶ setState ──▶ (1 batched re-render)

```

* **The Mechanism:**
* In React 17 and earlier, batching was implemented directly inside React’s synthetic event system. Once execution escaped into native microtasks/macrotasks (e.g., `fetch().then()`, `setTimeout`, native `addEventListener`), React lost execution context and triggered a synchronous re-render per `setState`.
* In React 18+, React switches from synthetic event batching to **Fiber lane scheduling** powered by `ReactDOM.createRoot`. When `setState` is called anywhere, React queues the update onto an internal update queue for that Fiber's assigned priority lane and schedules a microtask via `ensureRootIsScheduled()`.
* All synchronous code within the current JavaScript event loop tick executes, queuing updates into that same lane. React then processes the entire queue in **one single render pass**.

* **Opting Out of Automatic Batching:**
If you need immediate DOM updates between state changes (e.g., reading layout dimensions or coordinating urgent imperative animations), you can use `ReactDOM.flushSync()`:

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setLoading(true); // React renders and commits this to the DOM immediately
  });
  // DOM is guaranteed to be updated here
  flushSync(() => {
    setData(fetchedData); // Triggers a separate commit
  });
}

```

---

**`useState` Functional Updates vs. `useReducer**`

Both patterns prevent stale closure bugs by deriving the next state from the previous state, but they serve different architectural complexities.

| Dimension                   | `useState` Functional Updates                                                                              | `useReducer`                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Logic Location**          | Inline within event handlers and components (`setState(prev => ...)`).                                     | Extracted out of the component in a pure, standalone reducer function.                                        |
| **State Shape**             | Best for independent, simple primitives or single collections.                                             | Best for complex nested objects, state machines, or interdependent values.                                    |
| **Dependent State Updates** | Clunky when updating multiple related state variables simultaneously (requires multiple `useState` calls). | Atomic — one action can cleanly transition multiple related state variables at once.                          |
| **Testability**             | Harder to test state transitions in isolation without mounting components.                                 | Trivial to unit-test — the reducer is a pure function: `(state, action) => newState`.                         |
| **Performance with Props**  | Passing `setState` or handlers down requires `useCallback` to avoid child re-renders.                      | The `dispatch` function identity is **guaranteed to be stable** across renders, avoiding prop drilling churn. |

---

**When to Transition from `useState` to `useReducer**`

* **Interdependent State:** When changing state `A` depends on or must always update state `B` (e.g., setting `status: 'loading'` requires clearing `error: null` and setting `data: null`).
* **Complex Transition Logic:** When the next state depends on complex conditions, validation, or action types (modeling a state machine like `IDLE` $\to$ `SUBMITTING` $\to$ `SUCCESS` / `ERROR`).
* **Deep Component Hierarchies:** When deeply nested children need to trigger state mutations. Instead of passing multiple callback functions through intermediate layers, pass a single `dispatch` via React Context.

```javascript
// ✅ useReducer: Atomic, centralized transition logic
function formReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT_START':
      return { ...state, status: 'loading', error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'success', data: action.payload, error: null };
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', error: action.payload };
    default:
      return state;
  }
}

```

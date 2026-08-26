*** copy How does startTransition integrate with React 18 automatic batching?  Compare useReducer with Context API vs external state libraries.md ***

**How `startTransition` Integrates with Automatic Batching**

`startTransition` works directly with React 18's Fiber lane scheduler to separate **urgent updates** (e.g., typing, clicking) from **non-urgent transitions** (e.g., filtering a large list, switching tabs).

```
User Action (e.g., typing in a search bar)
  ├── setInputValue(text)          ──▶ [SyncLane / Urgent]       ──▶ Processed immediately
  └── startTransition(() => {
        setFilteredList(results)   ──▶ [TransitionLane / Low-Pri]──▶ Yields to user input
      })

```

* **Lane Segregation Overrides Single Batching:**
Under standard automatic batching, multiple `setState` calls inside the same tick are grouped into a single batch at the highest priority lane. `startTransition` explicitly tells the scheduler to split them:
* Updates outside `startTransition` are assigned to `SyncLane` or `InputContinuousLane`.
* Updates inside `startTransition` are tagged with `TransitionLane`.

* **Two Distinct Render Passes:**
Instead of forcing everything into one delayed batch, React executes **two distinct render passes**:

1. **Immediate Urgent Commit:** React flushes the urgent state update immediately so the UI (like input text) stays responsive.
2. **Interruptible Background Pass:** React computes the transition update in the background. If a new urgent event arrives while this background work is computing, React discards or pauses the in-progress transition, renders the urgent event first, and restarts the transition with fresh data.

* **Pending State Tracking:**
Pairing it with `useTransition` (`const [isPending, startTransition] = useTransition()`) automatically sets `isPending` to `true` during the background render and flips it to `false` once the transition commits.

---

**`useReducer` + Context API vs. External State Libraries**

Combining `useReducer` with React Context provides built-in state management, while external libraries (e.g., **Zustand**, **Redux Toolkit**, **Jotai**) rely on external stores with fine-grained subscriptions.

| Feature / Metric          | `useReducer` + Context API                                                                                                                                | External Libraries (e.g., Zustand, RTK)                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Re-render Granularity** | **Coarse (Tree-wide):** Any change to the context value forces *all* consumers of that context to re-render, even if they only use an unmutated property. | **Fine-Grained (Selector-based):** Components re-render *only* when the specific selected slice of state changes (`useStore(state => state.count)`). |
| **Setup & Dependencies**  | Zero external dependencies; 100% native React primitives.                                                                                                 | Requires third-party packages (~1–3 kB for Zustand, larger for Redux Toolkit).                                                                       |
| **Boilerplate**           | Moderate-to-high: Requires writing custom Context wrappers, Providers, custom hooks, and splitting contexts to avoid re-renders.                          | Minimal: Create a store in a single file with built-in actions and state mutators.                                                                   |
| **Concurrent Features**   | Native integration with Fiber, Suspense, and `startTransition`.                                                                                           | Handled via `useSyncExternalStore` to avoid UI tearing during concurrent rendering.                                                                  |
| **Access Outside React**  | **Impossible:** Cannot read or dispatch state outside the React component tree (e.g., inside utility functions or API interceptors).                      | **Supported:** Direct store access anywhere (`useStore.getState()`, `useStore.setState()`).                                                          |
| **Middleware & DevTools** | Manual implementation required for persistence, logging, or debugging.                                                                                    | Built-in support for Redux DevTools, persistence (`localStorage`), immer, and logging.                                                               |

---

**Architectural Recommendations**

* **Use `useReducer` + Context when:**
* The state is localized to a specific subtree (e.g., a complex multistep checkout modal or a theme/auth session provider).
* State update frequency is low (e.g., user settings, active theme, locale).
* You want zero external dependencies.

* **Use an External Store (e.g., Zustand / Redux Toolkit) when:**
* State updates are high-frequency (e.g., animations, canvas data, live chat feeds, form builders with 50+ fields).
* Multiple unrelated components scattered across the app need small slices of shared state without triggering full-tree re-renders.
* You need action logging, Redux DevTools time-travel debugging, or offline persistence.

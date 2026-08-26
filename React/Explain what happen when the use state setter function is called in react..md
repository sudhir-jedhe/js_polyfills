When you invoke a `useState` setter function (e.g., `setCount(prev => prev + 1)` or `setCount(5)`), React does not immediately mutate the current variable in place. Instead, it schedules an update and initiates a multi-phase lifecycle.

---

### Step-by-Step Lifecycle of a State Update

```
[Setter Called: setCount(x)]
            │
            ▼
1. Eager State Calculation & Object.is Bailout ──(Same value?)──▶ [No re-render]
            │ (Value changed)
            ▼
2. Update Queued on Fiber Node (Hook queue)
            │
            ▼
3. Render Phase Scheduled (Automatic Batching)
            │
            ▼
4. Component Function Re-executes (Hooks re-run, JSX recalculated)
            │
            ▼
5. Reconciliation & Virtual DOM Diffing
            │
            ▼
6. Commit Phase (DOM Mutation) & Layout Effects
            │
            ▼
7. Passive Effects (useEffect triggers asynchronously)

```

---

### 1. Eager State Computation & Bailout Check

React calculates the candidate next state right away. It compares the candidate value to the current state using **`Object.is()`** equality:

* **Primitive values:** If the value hasn't changed (e.g., `setCount(0)` when `count` is already `0`), React **bails out** early. It skips the render phase and does not re-render the component or its children.
* **Mutated Objects/Arrays:** If you mutate an existing object in-place (e.g., `state.count = 5; setState(state)`), `Object.is(state, state)` evaluates to `true`. React will bail out and **fail to update the UI**. This is why immutable updates (`setState({ ...state, count: 5 })`) are required.

---

### 2. Update Queued on the Component Fiber

Each component instance is represented internally by a **Fiber Node**. Each `useState` hook on that Fiber possesses an **update queue** (a circular linked list of updates).

* If you pass a direct value (`setCount(5)`), React appends `{ action: 5 }` to the queue.
* If you pass an updater function (`setCount(prev => prev + 1)`), React appends `{ action: fn }` to the queue.

---

### 3. Scheduling & Automatic Batching

React groups multiple state updates together into a single re-render to avoid unnecessary repaints:

* **Automatic Batching:** Whether the setter is called inside an event handler, a `setTimeout`, a `Promise.then()`, or an async/await block, React batches them together.
* **Priority Assignment:** The update is assigned a priority lane (e.g., *Discrete/Immediate* for clicks vs. *Transition* for `startTransition`).

```javascript
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  setText('done');
  // React batches all three into a SINGLE re-render pass
}

```

---

### 4. Render Phase (Component Function Re-execution)

During the render phase, React calls your component function again:

1. React traverses the Fiber's hook list.
2. It processes the update queue by applying all pending direct values or running updater functions in order:

$$\text{State}_{\text{next}} = \text{reducer}(\text{State}_{\text{prev}}, \text{action})$$

1. `useState()` returns the newly computed state.
2. The component evaluates its JSX and returns a new React element tree.

> **Note:** The render phase is pure and has no DOM side effects. In Strict Mode in development, React invokes the component function twice to ensure render purity.

---

### 5. Reconciliation (Virtual DOM Diffing)

React compares the newly returned React Element tree against the previous Fiber tree:

* Identifies which specific DOM nodes need insertion, deletion, text content changes, or attribute updates.
* Marks the Fiber with specific **mutation effect flags** (e.g., `Placement`, `Update`, `ChildDeletion`).

---

### 6. Commit Phase (DOM Updates)

The commit phase is synchronous:

1. **DOM Mutation:** React applies the calculated diffs directly to the real browser DOM.
2. **`useLayoutEffect`:** Any `useLayoutEffect` hooks fire synchronously *before* the browser paints pixels to the screen.
3. **Browser Paint:** The browser paints the updated DOM tree to the screen.

---

### 7. Passive Effects Execution (`useEffect`)

After the browser completes its paint:

1. React flushes the **cleanup functions** of any previous `useEffect` hooks whose dependency arrays changed.
2. React executes the new **`useEffect` callbacks** asynchronously so network requests or subscriptions don't block visual responsiveness.

---

### Summary Table

| Phase           | What Happens                                                             | Synchronous / Asynchronous   |
| --------------- | ------------------------------------------------------------------------ | ---------------------------- |
| **Invocation**  | Computes candidate value; checks `Object.is()`; enqueues update on Fiber | Synchronous                  |
| **Render**      | Component function re-executes; update queue processed; diff computed    | Asynchronous / Interruptible |
| **Commit**      | Host DOM nodes updated; `useLayoutEffect` executed                       | Synchronous                  |
| **Post-Commit** | Browser paints; `useEffect` cleanups and callbacks run                   | Asynchronous                 |

Here is a breakdown of the core React hooks, what they do, and when to use each.

---

### 1. `useRef`

**What it is:** Returns a mutable ref object whose `.current` property persists across renders without causing a component re-render when mutated.

* **Primary Uses:**
* Referencing and manipulating real DOM elements (focus, scroll position, measurement).
* Storing mutable values (timer IDs, previous state values, render counts) that do not affect the UI output.

* **When to use:**
* When you need to focus an `<input>`, measure a DOM node's dimensions, or integrate with non-React imperative DOM libraries (e.g., D3, Chart.js).
* When you need a persistent variable (like `setInterval` IDs) that shouldn't trigger a re-render when it updates.

---

### 2. `useEffect`

**What it is:** Synchronizes a component with an **external system** (APIs, timers, event listeners, websockets) by running side-effect logic after the DOM has been painted.

* **Primary Uses:**
* Fetching data from an external API.
* Setting up subscriptions or global DOM event listeners (`window.addEventListener`).
* Starting and cleaning up intervals/timers.

* **When to use:**
* Any time your component needs to communicate with anything outside of React's state/DOM lifecycle.
* *When NOT to use:* Do not use it to calculate derived state (calculate during render instead) or to sync state changes between parent and child components.

---

### 3. `useCallback`

**What it is:** Caches a **function definition** between renders until its specified dependencies change.

* **Primary Uses:**
* Preserving the reference identity of a callback function passed down to optimized child components.

* **When to use:**
* When passing a callback to a child component wrapped in `React.memo` to prevent unnecessary child re-renders.
* When passing a function into the dependency array of another hook (like `useEffect`).
* *Note:* Wrapping every function in `useCallback` is an anti-pattern; only use it when referential equality matters.

---

### 4. `useMemo`

**What it is:** Caches the **result of a calculation** between renders until its dependencies change.

* **Primary Uses:**
* Avoiding expensive CPU-heavy computations on every re-render (e.g., sorting/filtering thousands of array elements).
* Preserving referential equality of an object or array passed as a prop or dependency.

* **When to use:**
* When a calculation is measurably slow/expensive.
* When providing objects/arrays to a Context Provider or as dependencies to child components wrapped in `React.memo`.

---

### 5. `useReducer`

**What it is:** An alternative to `useState` that manages complex state transitions via a centralized **reducer function** (`(state, action) => newState`) and a `dispatch` method.

* **Primary Uses:**
* Managing state with multiple sub-values, complex nested structures, or interrelated fields.
* Organizing state transitions as explicit action types (state machine pattern).

* **When to use:**
* When the next state depends closely on multiple previous state values.
* When you find yourself chaining multiple `useState` setters together in single event handlers.
* When building complex forms, wizards, or passing state updates deeply down a component tree via Context (since `dispatch` has a stable identity).

---

### 6. `useId`

**What it is:** Generates a unique, stable string ID that is consistent across both server-side rendering (SSR) and client-side hydration.

* **Primary Uses:**
* Generating unique IDs for accessibility attributes (linking `<label htmlFor="...">` and `<input id="...">`).
* Generating IDs for `aria-describedby`, `aria-labelledby`, and compound component fields.

* **When to use:**
* Any time you need unique DOM element IDs inside reusable components to avoid duplicate ID clashes.
* *When NOT to use:* Do **not** use `useId` to generate keys for lists (`key={id}`). Keys must come from your data model.

---

### Quick Comparison Matrix

| Hook              | Core Purpose                            | Triggers Re-render on Update?    | Primary Scenario                              |
| ----------------- | --------------------------------------- | -------------------------------- | --------------------------------------------- |
| **`useRef`**      | Persistent mutable storage / DOM refs   | **No**                           | DOM node focus, tracking timers               |
| **`useEffect`**   | Side-effect execution & synchronization | **No** (runs post-paint)         | API calls, global subscriptions               |
| **`useCallback`** | Function reference memoization          | **No** (returns cached function) | Props passed to `React.memo` children         |
| **`useMemo`**     | Computed value memoization              | **No** (returns cached value)    | Heavy filtering/sorting, Context values       |
| **`useReducer`**  | Reducer-based complex state management  | **Yes** (when state changes)     | Multi-field state, finite state machines      |
| **`useId`**       | SSR-safe unique identifier generation   | **No** (static across lifecycle) | Form accessibility (`htmlFor`/`id`, `aria-*`) |

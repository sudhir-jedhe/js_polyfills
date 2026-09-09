***  What is mean by rendering in react.md ***

**Rendering** in React is the process where React calls your component functions to determine what the user interface (UI) should look like based on current props and state.

It is purely a **calculation step**—rendering does **not** mean updating the real DOM or drawing pixels on the screen directly.

---

**The Three Steps of a UI Update**

React processes UI updates through a continuous three-phase lifecycle:

```
1. Triggering a Render ──▶ 2. Rendering the Component ──▶ 3. Committing to DOM
  (Initial load or state/     (React calls functions &       (React updates DOM nodes
       prop change)              computes JSX/Virtual DOM)       ONLY if changes exist)

```

1. **Triggering a Render**

* **Initial Render:** The application mounts for the first time via `createRoot.render()`.
* **Re-render:** A state setter (`useState`, `useReducer`), parent component re-render, or context consumer change queues an update.

1. **Rendering (The Pure Calculation)**

* React calls the root component and traverses down the component tree.
* For each component, React executes the function, evaluates JSX, and produces a lightweight tree of React Elements (Virtual DOM).
* **Diffing:** On re-renders, React compares the newly returned Virtual DOM tree with the previous one to calculate the exact differences (diffs).

1. **Committing to the DOM**

* React applies the calculated differences to the actual browser DOM (inserting, updating, or deleting real DOM nodes).
* If the render phase produced no changes (the output is identical to the previous render), React skips the commit phase entirely.
* Once the DOM is updated, the browser repaints the screen (painting).

---

**Initial Render vs. Re-render**

* **Initial Render:** React creates real DOM nodes for every element in the tree from scratch using native APIs like `document.createElement()`.
* **Re-render:** React only calls components whose state changed (or their children). It calculates the minimal set of DOM property modifications rather than re-creating DOM nodes from scratch.

---

**Key Characteristics of Rendering in React**

* **Rendering Must Be Pure:** A component function should behave like a pure math function: given the same inputs (props and state), it must always return the same JSX. It should never mutate existing variables or perform side effects (like API calls or DOM mutations) during the render step.
* **Rendering $\neq$ DOM Paint:** A component can re-render many times without touching the real DOM if the calculated JSX tree produces the exact same structural output.

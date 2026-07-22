The **component lifecycle** refers to the stages a React class component goes through from birth (mounting) to updates (re-rendering) and finally death (unmounting). React provides built-in lifecycle methods that allow you to run code at specific points during these phases.

---

### The Three Phases of a Component Lifecycle

```
[ Mounting ] ---> [ Updating ] ---> [ Unmounting ]

```

---

## 1. Mounting (The Birth Phase)

This phase occurs when a component is being created and inserted into the DOM for the first time. The methods run in this exact order:

1. **`constructor(props)`**

- **Purpose:** Used for initializing local state and binding event handlers.
- _Note:_ Avoid side effects (like data fetching) here.

2. **`static getDerivedStateFromProps(props, state)`**

- **Purpose:** A rare lifecycle method used when state depends directly on changes in props over time. It returns an object to update the state, or `null` to update nothing.

3. **`render()`**

- **Purpose:** **Required.** Examines `this.props` and `this.state` and returns the JSX markup to display. It must be a pure function.

4. **`componentDidMount()`**

- **Purpose:** Runs immediately _after_ the component is inserted into the DOM.
- **When to use:** Ideal for making network requests (API calls), setting up subscriptions, or initializing DOM measurements.

---

## 2. Updating (The Growth Phase)

This phase occurs when a component's props or state change, triggering a re-render. The methods run in this order:

1. **`static getDerivedStateFromProps(props, state)`** _(Also runs here before every render when new props are received)._
2. **`shouldComponentUpdate(nextProps, nextState)`**

- **Purpose:** Gives you explicit control over performance. By returning `true` or `false`, you tell React whether the component needs to re-render when props or state change. (Usually handled automatically by `React.PureComponent`).

3. **`render()`**

- **Purpose:** Re-runs to generate the new Virtual DOM tree.

4. **`getSnapshotBeforeUpdate(prevProps, prevState)`**

- **Purpose:** Runs right _before_ the changes from the virtual DOM are actually committed to the real DOM. It allows your component to capture some information from the DOM (like scroll position) before it changes. Whatever value this returns is passed as an argument to `componentDidUpdate`.

5. **`componentDidUpdate(prevProps, prevState, snapshot)`**

- **Purpose:** Runs immediately after updates are flushed to the DOM.
- **When to use:** Perfect for performing DOM operations based on updated state/props, or making network requests (provided you guard them with a condition comparing `prevProps` to avoid infinite loops).

---

## 3. Unmounting (The Death Phase)

This phase occurs when a component is being removed from the DOM.

1. **`componentWillUnmount()`**

- **Purpose:** Runs immediately before a component is unmounted and destroyed.
- **When to use:** Essential for cleanup tasks—such as invalidating timers, canceling active network requests, or cleaning up event listeners and subscriptions to prevent memory leaks.

---

### Quick Summary Reference Table

| Lifecycle Method            | Phase               | Runs Every Render?         | Common Use Case                                    |
| --------------------------- | ------------------- | -------------------------- | -------------------------------------------------- |
| **`constructor`**           | Mounting            | Once                       | Initialize state, bind methods.                    |
| **`render`**                | Mounting & Updating | Yes                        | Return JSX markup.                                 |
| **`componentDidMount`**     | Mounting            | Once                       | Fetch data, set up subscriptions.                  |
| **`shouldComponentUpdate`** | Updating            | Yes (on prop/state change) | Performance optimization (prevent re-renders).     |
| **`componentDidUpdate`**    | Updating            | Yes (after re-render)      | Post-update DOM manipulation, conditional fetch.   |
| **`componentWillUnmount`**  | Unmounting          | Once                       | Cleanup timers, cancel requests, remove listeners. |

Here is a complete, working example of a React class component that demonstrates the entire lifecycle—from mounting and updating to unmounting—complete with console logs so you can see when each method fires.

---

### Lifecycle Demo Component

```jsx
import React, { Component } from "react";

class LifecycleDemo extends Component {
  // 1. MOUNTING: Constructor
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("1. constructor(): Component is being initialized.");
  }

  // 2. MOUNTING & UPDATING: getDerivedStateFromProps
  static getDerivedStateFromProps(props, state) {
    console.log("-> getDerivedStateFromProps(): Synchronizing props to state.");
    return null; // Return null if no state changes from props are needed
  }

  // 3. MOUNTING: componentDidMount
  componentDidMount() {
    console.log(
      "3. componentDidMount(): Component has mounted to the DOM. Perfect for API calls.",
    );

    // Simulating a timer setup
    this.timer = setInterval(() => {
      console.log("⏱️ Timer tick...");
    }, 5000);
  }

  // --- UPDATING PHASE ---

  // 4. UPDATING: shouldComponentUpdate
  shouldComponentUpdate(nextProps, nextState) {
    console.log("4. shouldComponentUpdate(): Deciding whether to re-render.");
    // Return true to allow re-rendering, false to block it
    return true;
  }

  // 5. UPDATING: getSnapshotBeforeUpdate
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log(
      "5. getSnapshotBeforeUpdate(): Capturing DOM state right before commit.",
    );
    return null;
  }

  // 6. UPDATING: componentDidUpdate
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(
      `6. componentDidUpdate(): Component updated! Previous count was ${prevState.count}.`,
    );
  }

  // --- UNMOUNTING PHASE ---

  // 7. UNMOUNTING: componentWillUnmount
  componentWillUnmount() {
    console.log(
      "7. componentWillUnmount(): Cleaning up timers, subscriptions, or listeners.",
    );
    clearInterval(this.timer); // Clear interval to prevent memory leaks
  }

  // --- RENDER METHOD (Required for Mounting & Updating) ---
  render() {
    console.log("2/3. render(): Generating Virtual DOM markup.");

    return (
      <div
        style={{ padding: "20px", border: "2px solid #ccc", margin: "10px" }}
      >
        <h3>Class Component Lifecycle Demo</h3>
        <p>Current Count: {this.state.count}</p>

        {/* Button to trigger the Updating phase */}
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment Count
        </button>
      </div>
    );
  }
}

// Parent component to control mounting and unmounting
export default class AppContainer extends Component {
  state = { showComponent: true };

  render() {
    return (
      <div>
        {/* Button to trigger Mounting and Unmounting */}
        <button
          onClick={() =>
            this.setState({ showComponent: !this.state.showComponent })
          }
        >
          {this.state.showComponent ? "Unmount Component" : "Mount Component"}
        </button>

        {this.state.showComponent && <LifecycleDemo />}
      </div>
    );
  }
}
```

---

### What to Watch for in Your Console:

1. **When the component first loads (Mounting):**

- `constructor()` runs.
- `getDerivedStateFromProps()` runs.
- `render()` runs.
- `componentDidMount()` runs.

2. **When you click "Increment Count" (Updating):**

- `getDerivedStateFromProps()` runs.
- `shouldComponentUpdate()` runs (returns `true`).
- `render()` runs.
- `getSnapshotBeforeUpdate()` runs.
- `componentDidUpdate()` runs.

3. **When you click "Unmount Component" (Unmounting):**

- `componentWillUnmount()` runs immediately to clean up the timer and clear the component from the DOM.

Another common real-world use case for React lifecycle management (or functional equivalents using `useEffect`) is **auto-saving drafts or form synchronization**.

---

### Scenario: Auto-Saving a User's Draft

Imagine building a long form, a blog post editor, or a settings page where users type continuously. You want to automatically save their progress to a backend server or `localStorage` every few seconds without forcing them to manually click a "Save" button.

#### How the Lifecycle Applies:

1. **Mounting (`componentDidMount` / `useEffect` with `[]`):**

- When the editor opens, you fetch any previously saved draft from an API or local storage to populate the initial state.
- You can also set up a background interval (`setInterval`) or debounced auto-save trigger.

2. **Updating (`componentDidUpdate` / `useEffect` with dependency tracking):**

- Every time the user updates the input text, the component re-renders.
- By tracking the content state, you can trigger a background save operation whenever changes accumulate.

3. **Unmounting (`componentWillUnmount` / `useEffect` cleanup return):**

- When the user navigates away from the page, the cleanup function fires.
- This is vital to clear out timers or pending auto-save intervals, and optionally push one final "flush" save to ensure no last-second keystrokes are lost.

---

[React Class Component Lifecycle Methods: A Deep Dive](https://www.youtube.com/watch?v=w6m9J64xh80)

This video provides a deep dive into React class component lifecycles and practical handling of side effects across different phases.

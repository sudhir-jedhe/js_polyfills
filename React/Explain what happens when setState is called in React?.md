When you call a state setter function (like `setCount` or `this.setState`), React initiates a multi-step update cycle to update your component and synchronize it with the UI.

Here is the step-by-step breakdown of what happens under the hood:

---

### 1. The Queue and Schedule Phase

When you invoke the state setter:

- **Queuing:** React doesn't update the state immediately in-place. Instead, it places your new state value (or updater function) into an **update queue** associated with that specific component instance.
- **Scheduling a Re-render:** React marks the component as "dirty" (needing an update) and schedules a re-render task.

### 2. Batching (Performance Optimization)

If you call `setState` multiple times within the same event handler, asynchronous callback, or timeout, React does **not** re-render the component after every single call.

- Instead, React **batches** all those updates together into a single update cycle.
- This prevents redundant, performance-heavy re-renders and ensures your component only recalculates once after all changes are queued.

### 3. Execution (The Render Phase)

Once the batching window closes, React executes the re-render phase:

- React calls your component function again from top to bottom.
- During this run, if you call `useState`, React looks at the updated queue, computes the final consolidated state value, and returns it to your component.
- The component returns a fresh tree of React elements (the **new Virtual DOM**).

### 4. Reconciliation (Diffing)

React compares the new Virtual DOM tree against the previous Virtual DOM tree to identify precisely what changed (e.g., did a text node change, an attribute update, or a component add/remove?).

### 5. The Commit Phase (DOM Mutation)

Finally, React enters the commit phase:

- If differences were found during reconciliation, React applies **only the minimal required updates** to the real browser DOM.
- If no visual differences were found, React skips touching the browser DOM entirely.
- Once the DOM is updated, React runs any pending layout effects (`useLayoutEffect`) synchronously, paints the screen, and then runs standard effects (`useEffect`).

**When setState is called in React:**

State update: It updates the component's state, triggering a re-render of the component
Batching: React may batch multiple setState calls into a single update for performance optimization
Re-render: React re-renders the component (and its child components if needed) with the new state
Asynchronous: State updates may be asynchronous, meaning React doesn't immediately apply the state change; it schedules it for later to optimize performance
Example:

```js
function Counter() {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setCount(count + 1); // Calls setState to update state
  };

  return <button onClick={increment}>Count: {count}</button>;
}
```

In this example, calling setState (via setCount) triggers a re-render with the updated count.

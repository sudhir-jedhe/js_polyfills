In React, state must **never be modified directly** (e.g., `state.count = 5` or `todos.push(newItem)`). Instead, you must always use the state-updating functions provided by React (like `setState` or the setter function from `useState`).

Directly mutating state breaks core architectural mechanics of the library.

---

### 1. The UI Will Not Re-render

React relies on the referential equality of state objects to know when a change has occurred.

- When you call a state setter function, React compares the new state reference to the old one. If they are different, it triggers a re-render to update the DOM.
- When you mutate state directly, the underlying reference to the object or array remains exactly the same in memory. Because React doesn't detect a change in reference, **it will not re-render the UI**, leaving your screen out of sync with your data.

---

### 2. State Updates Become Unpredictable

React frequently batches multiple state updates together for performance optimization.

- If you mutate state directly, you bypass React's internal queuing and scheduling mechanisms.
- This can lead to race conditions, stale closures, and silent bugs where component states conflict or fail to update consecutively.

---

### 3. It Breaks Time-Travel Debugging and Predictability

Immutability (creating a brand-new copy of an object or array with the updated values instead of changing the original) is a foundational pillar of modern frontend development.

- **Predictable History:** Without mutation, every state change yields a distinct snapshot in time. This powers developer tooling like Redux DevTools, allowing you to trace actions, inspect previous states, and implement reliable "undo/redo" features.
- **Debugging Clarity:** When state is immutable, you can easily track _where_ and _why_ a piece of data changed. Direct mutations hide changes across your application, making bugs notoriously difficult to trace.

---

### Summary: Mutation vs. Immutability

```javascript
// ❌ WRONG: Direct Mutation
// The array reference remains identical, React ignores the change, UI doesn't update.
const addItem = () => {
  items.push("New Item");
  setItems(items);
};

// ✅ CORRECT: Immutable Update
// Creates a brand-new array reference, triggering a clean re-render.
const addItem = () => {
  setItems([...items, "New Item"]);
};
```

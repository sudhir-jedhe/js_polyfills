***  What are all the triggers and reasons that cause a React component to re-render?.md ***

A React component re-renders whenever its output needs to be recalculated. In React, there are **four primary triggers** that cause a component to re-render, along with a few edge-case mechanisms.

---

### 1. State Updates (`useState` / `useReducer`)

Whenever a state updater function (`setCount` or `dispatch`) is called and passes a value that is **referentially different** from the previous state (checked via `Object.is`), React schedules a re-render for that component.

* **Bailing Out:** If you call `setState` with the exact same primitive value or object reference (`Object.is(prev, next) === true`), React skips rendering the component and its children.

---

### 2. Parent Component Re-rendering (Default Behavior)

By default in React, **when a parent component re-renders, all of its child components re-render recursively**, regardless of whether their props have changed.

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* Child will re-render every time Parent re-renders */}
      <Child /> 
    </div>
  );
}

```

* *Exception:* A child will skip re-rendering only if it is wrapped in `React.memo` and all its props remain shallowly equal to the previous render, or if it is passed via the `children` prop from a stable ancestor.

---

### 3. Context Changes (`useContext`)

When the `value` passed to a `<MyContext.Provider value="{...}">` changes (by `Object.is` reference equality), **every single component consuming that context via `useContext(MyContext)` re-renders immediately**.

* This re-render occurs even if the consumer is wrapped in `React.memo` or if intermediate parent components skipped rendering.

---

### 4. Custom Hook State Changes

Custom hooks do not possess isolated state; they share the state of the component calling them. If any built-in hook inside a custom hook (`useState`, `useReducer`, `useSyncExternalStore`) triggers an update, the host component consuming that custom hook re-renders.

---

### Secondary & Edge-Case Triggers

* **Key Prop Changes:** If the `key` prop on a component instance changes, React unmounts the previous component instance and mounts a fresh instance from scratch (a complete re-mount rather than a standard re-render).
* **Forced Updates (`useForceUpdate` / Class `this.forceUpdate()`):** Forcing a re-render directly bypassing state comparisons. In functional components, this is typically simulated via `const [, forceUpdate] = useReducer(x => x + 1, 0)`.
* **External Store Subscriptions (`useSyncExternalStore`):** When an external store (like Zustand, Redux, or a custom event emitter) notifies React that its snapshot has changed, the subscribed component re-renders.

---

### Summary: What Triggers a Re-render vs. What Doesn't

| Action                                          | Triggers Re-render?                                |
| ----------------------------------------------- | -------------------------------------------------- |
| `setState(newVal)` (where `newVal !== oldVal`)  | **Yes**                                            |
| `setState(oldVal)` (same primitive / reference) | **No** (Bailed out)                                |
| Parent component renders                        | **Yes** (unless child is memoized)                 |
| Props change                                    | **Yes** (a consequence of the parent re-rendering) |
| Context `value` reference changes               | **Yes** (all consumers of that context)            |
| Mutating `useRef().current`                     | **No**                                             |
| Mutating a plain JavaScript variable            | **No**                                             |

In React, a **Pure Component** is a component that renders the exact same output given the same props and state.

In a standard React component, if a parent component re-renders, all of its children will automatically re-render too—even if their props or state haven't changed at all. Pure components optimize this behavior by preventing unnecessary re-renders.

---

### How They Work Under the Hood

- **For Class Components (`React.PureComponent`):** Instead of extending the standard `React.Component`, you extend `React.PureComponent`. It comes with a built-in `shouldComponentUpdate()` method that automatically performs a **shallow comparison** of the component's current props/state versus its next props/state. If nothing has changed, React skips rendering that branch entirely.
- **For Function Components (`React.memo`):** Because function components don't have built-in class lifecycle methods, you achieve the exact same "pure" optimization behavior by wrapping the component in **`React.memo()`**.

---

### Understanding Shallow Comparison

A **shallow comparison** checks top-level primitive values (strings, numbers, booleans) directly by value, and checks references for objects and arrays.

- **The Caveat:** If you pass a newly created object or inline array as a prop on every render (e.g., `style={{ margin: 0 }}` or `items={[]}`), its reference changes every time. A shallow comparison will see a _new_ reference, think the prop changed, and force a re-render anyway, defeating the purpose of purity.

For a detailed walkthrough of how class-based pure components operate, check out this [ReactJS Tutorial on Pure Components](https://www.youtube.com/watch?v=YCRuTT31qR0).

Pure Components in React are components that only re-render when their props or state change. They use shallow comparison to check if the props or state have changed, preventing unnecessary re-renders and improving performance.

Class components can extend React.PureComponent to become pure
Functional components can use React.memo for the same effect

```js
const PureFunctionalExample = React.memo(function ({ value }) {
  return <div>{value}</div>;
});
```

With the React Compiler, manual memoization with React.memo, useMemo, and useCallback is rarely needed; the compiler inserts equivalent memoization automatically.

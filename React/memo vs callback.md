In React, both `React.memo` and `React.useCallback` are used for optimization, but they serve different purposes. Let's break them down:

### 1. **`React.memo`**:
`React.memo` is a higher-order component (HOC) that is used to optimize functional components by memoizing their result and preventing unnecessary re-renders.

- **Purpose**: It is used to **memoize a component** and ensure that a component re-renders only when its props change.
- **When to Use**: Use `React.memo` when you have a **functional component** that depends on props and the component re-renders unnecessarily even if the props haven’t changed.
  
#### How It Works:
When a component wrapped in `React.memo` receives new props, React compares the new props with the previous ones. If the props haven’t changed, React will **skip the re-render** of that component and reuse the previous rendered output.

#### Example:
```jsx
const ChildComponent = React.memo(function Child({ name }) {
  console.log("Child component rendered");
  return <div>{name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ChildComponent name="John" />
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  );
}
```

In this case, even if the `Parent` component re-renders when `count` changes, the `ChildComponent` will **not re-render** because its `props` haven't changed.

- **Advantages**:
  - It improves performance by preventing unnecessary re-renders of child components that do not depend on changing props.
  - Can be especially useful when the child components are expensive to render.

- **Limitations**:
  - `React.memo` does a shallow comparison of props, so it might not prevent re-renders if the props are complex objects (arrays, objects, functions, etc.) unless the objects themselves are memoized.

---

### 2. **`React.useCallback`**:
`React.useCallback` is a **hook** that returns a **memoized version** of a callback function. It is used to **optimize function references** passed as props to child components, preventing unnecessary re-creations of the same function on every render.

- **Purpose**: It is used to **memoize functions** so that the same instance of the function is passed to child components, avoiding unnecessary re-renders of those components when the parent re-renders.
- **When to Use**: Use `useCallback` when you are passing a function as a prop to a child component and want to avoid the function being recreated on each render.

#### How It Works:
`useCallback` returns a memoized version of the callback function that only changes if one of its dependencies has changed (similar to `useEffect`). This helps in preventing unnecessary renders of child components that rely on that function as a prop.

#### Example:
```jsx
function Parent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <ChildComponent increment={increment} />
      <button onClick={increment}>Increment Count</button>
    </div>
  );
}

function ChildComponent({ increment }) {
  console.log("Child component rendered");
  return <button onClick={increment}>Increment from Child</button>;
}
```

In this example:
- If `useCallback` is not used, the `increment` function would be recreated on every render of `Parent`, which would trigger unnecessary re-renders of `ChildComponent`.
- Using `useCallback` ensures that `increment` function is only recreated when the `count` changes, so the `ChildComponent` won't re-render unnecessarily.

- **Advantages**:
  - It ensures that function references passed to child components stay the same between renders, preventing unnecessary re-renders.
  - It's useful when the child component relies on `React.memo` or `PureComponent`, which only re-render when props change.

- **Limitations**:
  - Overuse of `useCallback` can lead to unnecessary complexity and even hurt performance, especially when the function itself doesn’t need to be memoized.

---

### Key Differences

| Feature                    | `React.memo`                                         | `React.useCallback`                                 |
|----------------------------|-----------------------------------------------------|---------------------------------------------------|
| **Purpose**                 | Memoizes entire component to prevent unnecessary re-renders | Memoizes a function to prevent its re-creation on every render |
| **Usage**                   | Used for **functional components** to avoid re-rendering when props don't change | Used for **functions** (or event handlers) to avoid re-creating them on each render |
| **Effect**                  | Skips re-rendering of a child component when props don't change | Avoids re-creating the same function unless dependencies change |
| **Main Focus**              | Optimizing re-renders of the component | Optimizing function references passed as props |

---

### When to Use

- **Use `React.memo`** when you want to optimize functional components and avoid unnecessary re-renders based on unchanged props.
  
- **Use `useCallback`** when you need to optimize function references being passed down as props to child components or other hooks, and you want to avoid recreating functions on each render.

In many cases, both `React.memo` and `useCallback` can be used together to optimize child components and avoid unnecessary re-renders.
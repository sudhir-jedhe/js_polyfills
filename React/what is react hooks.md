**Hooks** are special JavaScript functions introduced in React 16.8 that allow you to "hook into" React features—such as state, lifecycle methods, context, and refs—from inside **function components**, without needing to write class components.

---

### What are the Benefits of Using Hooks?

Hooks completely revolutionized React development by solving several major pain points of the older class-component architecture:

1. **Reusing Stateful Logic is Easy (Custom Hooks):** In class components, sharing logic between components required complex patterns like Higher-Order Components (HOCs) or render props, which cluttered the component tree ("wrapper hell"). With hooks, you can extract stateful logic into reusable **Custom Hooks** clean and simple.
2. **No More `this` Keyword Confusion:** Class components required you to constantly bind event handlers or deal with how the `this` keyword behaves in JavaScript. Function components and hooks eliminate `this` entirely.
3. **Better Code Organization (Breaking Apart `useEffect`):** In class components, related setup and cleanup logic had to be awkwardly split across different lifecycle methods (e.g., `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`). Hooks like `useEffect` let you group related code together logically.
4. **Cleaner, Simpler Code:** Function components with hooks are drastically shorter, more readable, and easier to test than equivalent class components.

---

### What are the Rules of React Hooks?

To ensure React can reliably preserve state between multiple hook calls on every render, you must strictly follow two core rules:

#### 1. Only Call Hooks at the Top Level

- **Never** call hooks inside loops, conditional `if` statements, or nested functions.
- **Why?** React relies on the exact **order** in which hooks are called on every render to map state variables correctly to their corresponding `useState` or `useEffect` calls. If a hook call is skipped inside a conditional statement, it shifts the order of subsequent hooks, causing severe bugs and state mismatches.

#### 2. Only Call Hooks from React Functions

- Only call hooks from **React function components** or **custom hooks** (functions whose names start with `use`).
- **Never** call hooks from regular vanilla JavaScript functions, class components, or asynchronous callbacks.

---

### Quick Example: State and Lifecycle Hook

```jsx
import { useState, useEffect } from "react";

export default function Counter() {
  // 1. Using State Hook at the top level
  const [count, setCount] = useState(0);

  // 2. Using Effect Hook at the top level
  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]); // Runs only when 'count' changes

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
}
```

React provides a rich set of **built-in hooks** designed to handle everything from local state and side effects to performance optimization and context management.

Here is a comprehensive breakdown of the core built-in hooks grouped by their primary purpose.

---

## 1. State Hooks

These hooks manage component memory and local data that changes over time.

- **`useState`**: Declares a state variable and a setter function to update it. Triggers a re-render when the state changes.

```jsx
const [count, setCount] = useState(0);
```

- **`useReducer`**: An alternative to `useState` for complex state logic involving multiple sub-values or state transitions driven by specific actions (similar to Redux).

```jsx
const [state, dispatch] = reducer(reducerFunction, initialState);
```

---

## 2. Context Hooks

These hooks allow you to read and subscribe to React Context without wrapping your components in nested consumer components.

- **`useContext`**: Accepts a context object (created by `React.createContext`) and returns the current context value, enabling seamless prop-drilling bypass.

```jsx
const theme = useContext(ThemeContext);
```

---

## 3. Ref Hooks

Ref hooks let you hold onto values that don't trigger a re-render when changed, or give you direct access to DOM nodes.

- **`useRef`**: Returns a mutable object with a `.current` property. Commonly used to access DOM elements directly or store mutable instance variables.

```jsx
const inputRef = useRef(null);
// Usage: inputRef.current.focus();
```

- **`useImperativeHandle`**: Customizes the instance value exposed to parent components when using `forwardRef`.

---

## 4. Effect & Lifecycle Hooks

These hooks handle side effects (like data fetching, manual DOM manipulation, subscriptions, or timers).

- **`useEffect`**: Runs a side-effect after the component renders. You can control _when_ it runs using the dependency array.

```jsx
useEffect(() => {
  // Effect logic here
  return () => {
    /* Cleanup function */
  };
}, [dependency]);
```

- **`useLayoutEffect`**: Identical to `useEffect`, but fires **synchronously** immediately after all DOM mutations. Used for reading layout from the DOM and synchronously re-rendering to prevent visual flickering.
- **`useInsertionEffect`**: Allows CSS-in-JS libraries to inject styles into the DOM before layout reads happen. (Primarily for library authors).

---

## 5. Performance Optimization Hooks

These hooks help optimize performance by caching values or skipping unnecessary re-renders.

- **`useMemo`**: Caches the **result** of an expensive calculation between re-renders.

```jsx
const cachedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- **`useCallback`**: Caches a **function definition** between re-renders, preventing child components from re-rendering unnecessarily when passed down as props.

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- **`useDeferredValue`**: Lets you defer updating a non-urgent part of the UI to keep critical typing/animations smooth.
- **`useTransition`**: Lets you update state without blocking the UI, marking updates as non-urgent transitions.

```jsx
const [isPending, startTransition] = useTransition();
```

---

## 6. Other Specialized Hooks

- **`useId`**: Generates unique IDs that are stable across server and client rendering, useful for accessible form labels and input pairing.
- **`useSyncExternalStore`**: Allows external data sources (like Redux, Zustand, or browser APIs) to read from stores safely during concurrent rendering.
- **`useActionState`** _(introduced in React 19)_: Manages state updates resulting from form actions, seamlessly handling pending states and errors.
- **`useFormStatus`** _(introduced in React 19)_: Provides status information of the parent form's submission without needing prop drilling.
- **`useOptimistic`** _(introduced in React 19)_: Lets you optimistically update the UI before an asynchronous network request finishes.

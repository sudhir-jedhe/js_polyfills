In React class components, `this.setState()` accepts an optional **second argument**, which is a callback function.

---

### 1. The Purpose of the `setState` Callback

Because `this.setState()` is asynchronous (React batches state updates and DOM re-renders for performance), any code written _immediately after_ a `this.setState()` call cannot reliably read the newly updated state value.

The purpose of the callback function is to guarantee that your code **only executes after the state has been successfully updated and the component has finished re-rendering**.

```javascript
this.setState({ count: this.state.count + 1 }, () => {
  // This code runs GUARANTEED after the state update and re-render are complete
  console.log("The new count is:", this.state.count);
});
```

---

### 2. When Should It Be Used?

You should use the `setState` callback when you need to trigger a dependent side-effect _immediately_ following a state change, and that side-effect requires reading the absolute latest state value. Common scenarios include:

- **Triggering Network/API Requests:** When a user action changes a state variable (e.g., changing a filter or search query) and you immediately need to fetch fresh data using that updated value.
- **Post-State Analytics or Logging:** When you need to log telemetry data or record an event immediately upon state commitment.
- **Imperative DOM Operations:** When you need to read or adjust DOM elements (like scrolling a container or measuring a layout) that depend directly on the newly rendered state.

---

### ⚠️ Important Caveats & Modern Alternative

1. **Prefer Lifecycle Methods for General Side Effects:** The React team historically recommended handling broader side effects inside lifecycle methods like `componentDidUpdate` rather than relying heavily on `setState` callbacks.
2. **Not Available in Function Components:** Function components and the `useState` hook **do not support a callback argument** in their state setters. In modern functional React, if you need to run code after a state update, you achieve this by wrapping that logic inside a `useEffect` hook with the state variable added to its dependency array.

[React setState with Object, Function, Callback Function as Argument](https://www.youtube.com/watch?v=nwZtVLu96ko)

Watch this video to see a code demonstration of how state objects, updater functions, and callback arguments behave in class components.

The callback (or updater function) form of setState — both this.setState(prev => ...) in classes and setX(prev => ...) with useState — guarantees that each update is computed from the latest queued state rather than the value captured in your closure. Use it whenever the next state depends on the previous state, especially when you call the setter more than once in the same event handler or when the update may run after an await/timeout/promise.

```js
// Modern hooks form (preferred)
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount((c) => c + 1);
  setCount((c) => c + 1); // Both run; final count is +2.
};

// Legacy class form
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment,
}));
```

Purpose of the updater function form of setState
What it is
React's state setters — this.setState in class components and the setX returned by useState in function components — accept either a new value or an updater function. The updater receives the latest queued state (and, for class components, the latest props) and returns the next state.

The community calls this the updater function form (sometimes "functional updater"). Recognising that name is helpful in interviews.

Why it exists: state updates are batched and asynchronous
State setters do not change state immediately. React queues the update and applies it later, then re-renders. Since React 18, this batching is automatic and applies everywhere — event handlers, promises, setTimeout, native event handlers — not only inside React event handlers as in earlier versions.

That means by the time the queued update actually runs, the variable you captured from the previous render may be stale.

The motivating bug — reading state directly between successive calls
The classic mistake is calling the setter more than once based on the current state value:

```js
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // BUG: each call uses the same closed-over `count` (still 0 on this render).
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // After re-render, count is 1 — not 3.
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

count is captured by the closure when the component rendered. All three calls compute 0 + 1, so React queues 1, 1, 1 and the final state is 1.

The same bug exists in classes — reading this.state.counter between setState calls returns the value from the last render, not the in-flight queued value.

The fix — pass an updater function

```js
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    // Final count is 3 — each updater receives the result of the previous one.
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

Each updater receives a snapshot of the latest queued state, not the value from your render closure.
**When to use it**
The next state depends on the previous state (counters, toggles, append-to-array, increment-a-map-entry).
You call the setter more than once in the same handler.
The update happens after an await, setTimeout, promise resolution, or subscription callback — by then the closed-over value is almost certainly stale.
Inside useEffect or useCallback where omitting the state from deps would otherwise cause stale-closure bugs — using the updater lets you drop the value from the dependency array.

**When you do not need it**
If the new value does not depend on the previous state — setName('Alice'), setUser(response.data) — passing the value directly is fine and slightly more readable.

**Class component equivalent**
The same idea applies in class components, where the updater also receives props:

```js
class Counter extends React.Component {
  state = { counter: 0 };

  incrementCounter = () => {
    this.setState((prevState, props) => ({
      counter: prevState.counter + props.increment,
    }));
  };

  render() {
    return (
      <div>
        <p>Counter: {this.state.counter}</p>
        <button onClick={this.incrementCounter}>Increment</button>
      </div>
    );
  }
}
```

The **`useCallback`** hook is a built-in React hook that caches (memoizes) a **function definition** between re-renders.

---

### 1. How It Works

In JavaScript, functions are reference types. Every time a component re-renders, any function declared inside it is recreated from scratch in memory, meaning its reference changes (`function A !== function A` in terms of memory address).

`useCallback` tells React: _"Remember this function definition. Do not recreate a new instance of it on every re-render unless one of its dependencies changes."_

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]); // Only recreates the function if 'a' or 'b' changes
```

---

### 2. When Should It Be Used?

Contrary to popular belief, **you do not need `useCallback` for every function in your app.** Wrapping every function in `useCallback` adds unnecessary overhead because React has to run dependency checks on every render.

You should use `useCallback` in two primary scenarios:

#### A. Passing Functions to Optimized Child Components (`React.memo`)

If you pass a callback function down as a prop to a child component that is wrapped in `React.memo`, a fresh function reference on every parent re-render will trick the child into thinking its props changed, forcing an unnecessary re-render. `useCallback` keeps the function reference stable, allowing `React.memo` to successfully skip re-renders.

```jsx
const ChildComponent = React.memo(({ onClick }) => {
  console.log("Child rendered!");
  return <button onClick={onClick}>Click Me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback, this function gets a new reference on every click,
  // causing ChildComponent to re-render even though its props "look" the same.
  const handleClick = useCallback(() => {
    console.log("Button clicked");
  }, []); // Empty deps mean this function is cached forever

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment Parent</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

#### B. When the Function is a Dependency in Another Hook

If your function needs to be included in the dependency array of a `useEffect` or `useMemo` hook, wrapping it in `useCallback` prevents the effect from running on _every single render_ due to a constantly changing function reference.

```jsx
const fetchUserData = useCallback(() => {
  api.getUser(userId);
}, [userId]); // Only recreated if userId changes

useEffect(() => {
  fetchUserData();
}, [fetchUserData]); // Safe to include here without triggering infinite loops
```

The **`useMemo`** hook is a built-in React hook that caches (memoizes) the **result of an expensive calculation** between re-renders.

---

### 1. How It Works

Normally, whenever a component re-renders, any JavaScript code inside the component body runs again from top to bottom. If your component performs a heavy mathematical operation, data filtering, or array transformation, running it on every single render can cause performance lag.

`useMemo` tells React: _"Calculate this value once, cache the result, and return the cached value on subsequent re-renders **unless** one of the dependencies in your array has changed."_

```javascript
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]); // Only recomputes if 'a' or 'b' changes
```

---

### 2. When Should It Be Used?

Just like `useCallback`, **you should not use `useMemo` everywhere**. Calculating values on the fly in JavaScript is usually extremely fast. Wrapping every minor calculation in `useMemo` adds unnecessary memory overhead and dependency-checking costs.

You should use `useMemo` in two main scenarios:

#### A. Preventing Heavy, Expensive Calculations on Every Render

If you have a massive data set (e.g., sorting thousands of rows in a table or running complex mathematical algorithms) that only needs to re-run when specific inputs change, `useMemo` keeps the UI responsive.

```jsx
import { useState, useMemo } from "react";

function ProductList({ products, filter }) {
  // Only re-filters the massive list if 'products' or 'filter' changes
  const filteredProducts = useMemo(() => {
    console.log("Running expensive filter calculation...");
    return products.filter((product) => product.category === filter);
  }, [products, filter]);

  return (
    <ul>
      {filteredProducts.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

#### B. Preserving Object/Array Reference Equality for Child Components

If you pass an object or an array down as a prop to a child component wrapped in `React.memo`, creating that object inline on every render (`style={{ color: 'red' }}` or `options={[...]}``) will break memoization because a new object reference is generated every time. `useMemo` keeps the object reference stable.

```jsx
// Caching an object reference so it doesn't trigger child re-renders
const themeStyles = useMemo(() => {
  return {
    backgroundColor: isDark ? "black" : "white",
    color: isDark ? "white" : "black",
  };
}, [isDark]);

return <ChildComponent style={themeStyles} />;
```

**What is the useMemo hook in React and when should it be used?**
What is useMemo?
The useMemo hook is a built-in React hook that allows you to memoize the result of a function. This means that the function will only be re-executed when one of its dependencies changes. The primary purpose of useMemo is to optimize performance by preventing unnecessary recalculations.

Syntax
The syntax for useMemo is as follows:

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
The first argument is a function that returns the value you want to memoize.
The second argument is an array of dependencies. The memoized value will only be recomputed when one of these dependencies changes.
**When should it be used?**
Expensive calculations
If you have a function that performs a computationally expensive calculation, you can use useMemo to ensure that this calculation is only performed when necessary. Genuinely expensive work means things like filtering or sorting a large list, parsing a big payload, or running a heavy synchronous algorithm — not trivial arithmetic.

```js
const filterAndSortLargeList = (items, query) => {
  // Genuinely expensive: scans every item and sorts the result.
  return items
    .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    .toSorted((a, b) => a.name.localeCompare(b.name));
};

const MyComponent = ({ items, query }) => {
  const visibleItems = useMemo(
    () => filterAndSortLargeList(items, query),
    [items, query],
  );

  return <List items={visibleItems} />;
};
```

Preserving referential equality for memoized children
This is the most common practical reason to reach for useMemo. Every render produces a new object/array literal, which breaks React.memo (or useEffect dependency) bailouts on a child. Memoizing the value keeps its reference stable across renders.

```js
const Parent = ({ items }) => {
  // Without useMemo, `sortedItems` would be a new array on every render,
  // and `MemoChild` would re-render even when `items` is unchanged.
  const sortedItems = useMemo(() => [...items].sort((a, b) => a - b), [items]);

  return <MemoChild sortedItems={sortedItems} />;
};

const MemoChild = React.memo(function MemoChild({ sortedItems }) {
  return <ul>{/_ ... _/}</ul>;
});
```

Note that useMemo on a value alone does not prevent the child from re-rendering — the child must also be wrapped in React.memo (or otherwise short-circuit). Also, [...items].sort(...) (or items.toSorted(...)) is used here because Array.prototype.sort mutates in place; mutating a prop is a bug waiting to happen.

Caveats
Overuse: Overusing useMemo can lead to more complex code without significant performance benefits. It should be used judiciously.
Dependencies: Make sure to correctly specify all dependencies. Missing dependencies can lead to stale values, while extra dependencies can lead to unnecessary recalculations.
It is only a hint: useMemo is a performance hint, not a guarantee. React is allowed to throw away the cached value and r

### **`useMemo` vs `useCallback` in React**

Both `useMemo` and `useCallback` are hooks provided by React to optimize performance by **memoizing** values or functions, but they serve different purposes. Here's a breakdown of the differences between them, their use cases, and examples:

---

### **1. `useMemo`**

#### **Purpose**:
`useMemo` is used to **memoize** a **computed value**. It helps avoid unnecessary recalculations of the value, especially when the computation is expensive or resource-heavy. It only recalculates the value if one of its dependencies has changed.

#### **How It Works**:
`useMemo` will **memorize** the result of the function you pass it, and only recompute the value when one of the dependencies in the dependency array changes.

#### **Syntax**:

```javascript
const memoizedValue = useMemo(() => {
  // Compute something expensive
  return computedValue;
}, [dependency1, dependency2, ...]);
```

- The **callback function** inside `useMemo` will only run if one of the values in the dependency array changes.
- It **returns the memoized result** of the function.

#### **Use Case**:
- To **optimize expensive calculations** that don’t need to run on every render.
- Use when you need to **memoize an object**, **array**, or **value** that’s derived from props or state.

#### **Example**:

```javascript
import React, { useMemo } from 'react';

const ExpensiveComponent = ({ num }) => {
  // Expensive calculation
  const expensiveCalculation = (n) => {
    console.log("Calculating...");
    return n * 1000;
  };

  // useMemo memoizes the result to avoid recalculation on every render
  const memoizedValue = useMemo(() => expensiveCalculation(num), [num]);

  return <div>Memoized Value: {memoizedValue}</div>;
};

export default ExpensiveComponent;
```

In this example:
- `expensiveCalculation` will only be recalculated if `num` changes. Otherwise, the **memoized result** from the previous render will be returned, improving performance.

---

### **2. `useCallback`**

#### **Purpose**:
`useCallback` is used to **memoize a function** itself. It returns a memoized version of the function that only changes if one of its dependencies has changed. This is useful when passing functions as props to child components, particularly when the function is used in dependencies of other hooks (like `useEffect` or `useMemo`).

#### **How It Works**:
`useCallback` will **memoize** the **function** you pass it, and only recreate the function if one of its dependencies has changed. This prevents unnecessary re-renders in child components that might receive the function as a prop.

#### **Syntax**:

```javascript
const memoizedFunction = useCallback(() => {
  // Function logic
}, [dependency1, dependency2, ...]);
```

- **Function** passed inside `useCallback` will be recreated only when any of the dependencies change.

#### **Use Case**:
- To prevent unnecessary re-renders in child components that depend on a **function prop**.
- Useful when a function is passed down as a prop to **avoid the function being redefined** on each render.

#### **Example**:

```javascript
import React, { useState, useCallback } from 'react';

const ChildComponent = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click Me</button>;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  // useCallback memoizes the function
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};

export default ParentComponent;
```

In this example:
- The `handleClick` function is **memoized** using `useCallback`, so the child component `ChildComponent` will not re-render unless the `count` value changes.
- Without `useCallback`, every render of `ParentComponent` would result in a new instance of the `handleClick` function, causing `ChildComponent` to re-render unnecessarily.

---

### **Key Differences Between `useMemo` and `useCallback`**

| **Aspect**            | **`useMemo`**                             | **`useCallback`**                              |
|-----------------------|-------------------------------------------|------------------------------------------------|
| **Purpose**           | Memoizes **values** or **results** of computations | Memoizes **functions**                         |
| **Use Case**          | Optimizing **expensive calculations** that return a value (e.g., derived data) | Preventing re-creation of a **function** on each render |
| **Return Value**      | A **memoized value** (e.g., an object, array, or any computed value) | A **memoized function**                        |
| **Common Use**        | Memoizing the result of expensive operations like calculations or filtering | Memoizing callback functions to avoid unnecessary re-renders of child components |
| **Internal Mechanism**| Stores the computed result, re-calculates only when dependencies change | Stores the function reference, re-creates the function only when dependencies change |

---

### **When to Use `useMemo` vs `useCallback`?**

- **`useMemo`**:
  - Use it when you have an **expensive computation** that only needs to be re-executed when the input (dependencies) change.
  - Common use cases include **calculating derived data** or **filtering large arrays**.
  - Example: Memoizing complex calculations that are used in rendering, like a list of filtered items based on user input.

- **`useCallback`**:
  - Use it when you have a **function** that is passed down as a prop to child components and that function is being recreated on every render. 
  - It helps to avoid unnecessary re-renders of child components that might receive that function as a prop.
  - Example: Memoizing a function that handles an event (e.g., `onClick` or `onSubmit`) to ensure it doesn't cause unnecessary re-renders of child components.

---

### **Real-World Examples**

1. **Example of `useMemo` for Expensive Calculations**:

```javascript
import React, { useState, useMemo } from 'react';

const ExpensiveCalculationComponent = ({ num }) => {
  const calculateSquare = (n) => {
    console.log("Calculating...");
    return n * n;
  };

  // Memoize the result to prevent recalculating on every render
  const square = useMemo(() => calculateSquare(num), [num]);

  return <div>The square of {num} is {square}</div>;
};
```

2. **Example of `useCallback` to Prevent Re-renders**:

```javascript
import React, { useState, useCallback } from 'react';

const Button = React.memo(({ onClick }) => {
  console.log("Button rendered");
  return <button onClick={onClick}>Click me</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <Button onClick={handleClick} />
    </div>
  );
};
```

---

### **Conclusion**

- **`useMemo`**: Use it to **memoize values** (e.g., the result of expensive computations) to prevent unnecessary recalculations.
- **`useCallback`**: Use it to **memoize functions** to avoid recreating the function on every render, especially when passing functions as props to child components.

Both hooks are optimization tools that help improve performance by **avoiding unnecessary recalculations or re-creations** during re-renders.
In React, **`props`** and **`state`** are both used to manage data, but they serve different purposes and work in distinct ways. Understanding the difference between them is crucial for working with React components effectively.

### **1. Props:**

**Props** (short for "properties") are used to **pass data** from a parent component to a child component. Props are **read-only** and **immutable**, meaning the child component cannot modify the props it receives. The main purpose of props is to **customize** a child component’s behavior or appearance based on data passed from the parent component.

#### **Key Characteristics of Props:**
- **Immutable**: Props cannot be changed within the component. A component only receives them from its parent.
- **Passed from Parent to Child**: Props allow you to pass data down the component tree from parent components to child components.
- **Read-only**: The child component can **access** the props but cannot modify them.
- **Use case**: Props are used for rendering dynamic content, like setting initial values, defining event handlers, or customizing behavior for child components.

#### **Example of Using Props:**

```javascript
import React from 'react';

// Parent component
function Parent() {
  const message = "Hello from Parent";
  return <Child greeting={message} />;
}

// Child component
function Child(props) {
  return <h1>{props.greeting}</h1>;
}

export default Parent;
```

#### **Explanation**:
- In the `Parent` component, we pass a `message` as a prop to the `Child` component.
- In the `Child` component, we access the `greeting` prop and display its value.
- **Props are passed from Parent to Child, and the Child can only read but cannot modify them**.

### **2. State:**

**State** is used to store data that is **local** to a component and can **change** over time. Unlike props, **state is mutable**, meaning a component can change its own state using `setState` (in class components) or `useState` (in functional components). When the state of a component changes, React automatically re-renders the component to reflect the updated data.

#### **Key Characteristics of State:**
- **Mutable**: State can be changed by the component itself, usually in response to user actions or events.
- **Local to the Component**: State is encapsulated within the component and is not shared with other components unless explicitly passed via props.
- **Triggers Re-rendering**: When state is updated, the component automatically re-renders to reflect the changes.
- **Use case**: State is used for dynamic data that can change during the component's lifecycle, such as user input, form values, or toggling visibility.

#### **Example of Using State in a Functional Component:**

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // Initial state is 0

  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

#### **Explanation**:
- The `Counter` component has a state variable `count` that tracks the number of clicks.
- The `useState(0)` initializes the state with a value of 0.
- When the button is clicked, the `setCount` function updates the `count` state, causing the component to re-render with the new value.
- **State is local to the `Counter` component, and the component can change its own state.**

### **Props vs State: A Quick Comparison**

| Feature                | **Props**                                | **State**                            |
|------------------------|------------------------------------------|--------------------------------------|
| **Purpose**            | Pass data from parent to child component | Manage and track local component data |
| **Mutability**         | Immutable (cannot be changed by the child) | Mutable (can be changed within the component) |
| **Scope**              | Data is passed from parent to child       | Data is local to the component itself |
| **Used by**            | Parent component to customize child component | Component itself to track internal data |
| **Trigger re-renders** | No (unless passed data changes)          | Yes (when state changes, the component re-renders) |
| **Default Initialization** | Set by the parent component           | Initialized within the component using `useState` or `this.state` |
| **Example Usage**      | Dynamic rendering, passing data or callbacks to child components | User interactions, form inputs, visibility toggles |

### **When to Use Props vs State**

- **Use props** when:
  - You want to pass data from a parent component to a child component.
  - The data should not be changed by the child (read-only).
  - The data is shared between components, like configuration settings, user details, etc.

- **Use state** when:
  - You need to store data that changes over time within the component.
  - The data is **local** to the component and needs to trigger a re-render when updated (e.g., form input values, toggle states, counters).
  - The data should be mutable, and the component can modify it internally.

### **Example Combining Props and State:**

Let’s look at a more complex example where we use both props and state.

```javascript
import React, { useState } from 'react';

// Parent component
function Parent() {
  const [userName, setUserName] = useState("John");

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <Child name={userName} changeName={setUserName} />
    </div>
  );
}

// Child component
function Child(props) {
  const handleChange = () => {
    const newName = prompt("Enter a new name:");
    props.changeName(newName);  // Update the name in Parent
  };

  return (
    <div>
      <p>Current name from Parent: {props.name}</p>
      <button onClick={handleChange}>Change Name</button>
    </div>
  );
}

export default Parent;
```

#### **Explanation**:
- The `Parent` component holds the state `userName` and passes it to the `Child` component as a prop.
- The `Child` component receives the `name` prop and displays it.
- The `Child` component also has access to a `changeName` function (passed via props) that allows it to modify the `userName` in the parent component's state when the button is clicked.

Here, the **state** (`userName`) is managed by the **parent**, and the **prop** (`name`) is passed to the **child**. The child can trigger a state update in the parent by calling the `changeName` function.

---

### **Summary**:

- **Props**:
  - Passed **from parent to child**.
  - **Immutable**: Cannot be changed by the child component.
  - Used to customize or configure the child component based on external data.
  
- **State**:
  - Managed **within the component**.
  - **Mutable**: Can be changed by the component itself.
  - Used to track and update data that affects the component's behavior or rendering.

By using **props** and **state** effectively, React enables a clear separation of concerns between components and allows data to flow through your app in a predictable way.
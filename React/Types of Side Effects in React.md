In React, **side effects** are operations that occur as a result of rendering, which may affect the outside world or change the internal state in ways that are not directly related to the component's render process. Side effects are actions that can modify the state of the application, interact with external systems, or cause other changes outside the scope of the current function component.

### **Types of Side Effects in React**

1. **Data Fetching**
2. **Subscriptions**
3. **Manual DOM Manipulations**
4. **Timers and Intervals**
5. **Logging**
6. **State Synchronization**
7. **Event Listeners**
8. **Error Handling**

Let's break these down with examples for each:

---

### 1. **Data Fetching**

Fetching data from a server (e.g., API calls) is a common side effect in React. It happens asynchronously, and React needs to handle these operations without blocking the render cycle.

#### Example:
```jsx
import React, { useState, useEffect } from 'react';

function DataFetchingComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []); // Empty array means this effect runs once when the component mounts

  return (
    <div>
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

- **Effect**: Fetching data from the API when the component mounts.
- **Side Effect Type**: **Asynchronous operation**.

---

### 2. **Subscriptions**

Side effects also include subscribing to data streams (e.g., WebSockets or event listeners) and unsubscribing when the component unmounts.

#### Example:
```jsx
import React, { useEffect } from 'react';

function WebSocketComponent() {
  useEffect(() => {
    const socket = new WebSocket('wss://example.com/socket');

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    return () => {
      socket.close(); // Cleanup the subscription
    };
  }, []); // Empty array means this effect runs once on mount and unmount

  return <div>WebSocket Example</div>;
}
```

- **Effect**: Subscribing to a WebSocket connection and receiving messages.
- **Side Effect Type**: **Subscription** to external resources.

---

### 3. **Manual DOM Manipulations**

React controls the DOM for you, but sometimes you need to manually interact with the DOM. This could involve updating styles, focusing elements, or triggering animations.

#### Example:
```jsx
import React, { useEffect, useRef } from 'react';

function FocusInputComponent() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // Manually focusing the input field
  }, []); // Empty array means this effect runs once on mount

  return <input ref={inputRef} />;
}
```

- **Effect**: Focusing an input element after the component mounts.
- **Side Effect Type**: **Manual DOM manipulation**.

---

### 4. **Timers and Intervals**

Setting up timers (using `setTimeout` or `setInterval`) is a classic side effect that requires cleanup when the component is unmounted.

#### Example:
```jsx
import React, { useState, useEffect } from 'react';

function TimerComponent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Runs once when the component mounts

  return <div>Time: {seconds} seconds</div>;
}
```

- **Effect**: Updating the timer every second.
- **Side Effect Type**: **Timer or interval** setup and cleanup.

---

### 5. **Logging**

Logging or debugging is a side effect that is usually used for development purposes. While not always necessary in production code, it can be useful for tracing and understanding component behavior.

#### Example:
```jsx
import React, { useEffect } from 'react';

function LoggingComponent() {
  useEffect(() => {
    console.log('Component has mounted');
    return () => {
      console.log('Component will unmount');
    };
  }, []); // Runs once on mount and unmount

  return <div>Logging Example</div>;
}
```

- **Effect**: Logging to the console when the component mounts and unmounts.
- **Side Effect Type**: **Logging or Debugging**.

---

### 6. **State Synchronization**

Sometimes you may need to synchronize state across components or make sure one state change triggers another. This often involves side effects to keep data consistent.

#### Example:
```jsx
import React, { useState, useEffect } from 'react';

function SynchronizeStateComponent() {
  const [value, setValue] = useState(0);
  const [doubleValue, setDoubleValue] = useState(0);

  useEffect(() => {
    setDoubleValue(value * 2); // Sync doubleValue when value changes
  }, [value]); // Effect depends on value state

  return (
    <div>
      <p>Value: {value}</p>
      <p>Double Value: {doubleValue}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
}
```

- **Effect**: Synchronizing the `doubleValue` based on the `value` state.
- **Side Effect Type**: **State synchronization**.

---

### 7. **Event Listeners**

Adding and removing event listeners (e.g., `resize`, `scroll`, etc.) is a common side effect that requires cleanup to avoid memory leaks.

#### Example:
```jsx
import React, { useEffect } from 'react';

function ResizeListenerComponent() {
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized:', window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup
    };
  }, []); // Runs once when the component mounts

  return <div>Resize the window and check the console</div>;
}
```

- **Effect**: Adding a `resize` event listener to the window and cleaning it up on unmount.
- **Side Effect Type**: **Event listener management**.

---

### 8. **Error Handling**

Sometimes components may need to handle errors, either globally (using `Error Boundaries`) or locally (using `try/catch` blocks). This is considered a side effect.

#### Example:
```jsx
import React, { useState, useEffect } from 'react';

function ErrorHandlingComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      throw new Error('Something went wrong!');
    } catch (error) {
      console.error(error.message);
      setData('Failed to load data');
    }
  }, []);

  return <div>{data}</div>;
}
```

- **Effect**: Handling errors during data fetching or component lifecycle.
- **Side Effect Type**: **Error handling**.

---

### **When to Use Side Effects in React**

In React, side effects are generally managed using the `useEffect` hook (for function components) or lifecycle methods (for class components). Side effects should typically be used for operations that occur outside the scope of the render method and could affect the outside world or state, such as:

- Fetching data from an API.
- Modifying the DOM (e.g., focusing elements, updating document title).
- Adding event listeners or subscribing to external events.
- Running timers or intervals.
- Handling global state or synchronization.

You should avoid side effects directly in the render process, as it can lead to unexpected behavior and performance issues.

### **Cleanup of Side Effects**

Many side effects require cleanup when a component unmounts or before the effect runs again (for example, removing event listeners or clearing timers). This can be done inside the **cleanup function** returned by the `useEffect` hook.

Example with cleanup:
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    console.log("Timer executed");
  }, 1000);

  // Cleanup function
  return () => clearTimeout(timer); // This will run when the component unmounts or before the effect reruns
}, []);
```

### **Conclusion**

Side effects in React can cover a variety of scenarios such as fetching data, managing subscriptions, manipulating the DOM, and managing timers. React provides hooks like `useEffect` to handle side effects in functional components, while class components use lifecycle methods like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.
The **`useRef`** hook is a built-in React hook that returns a mutable object with a single property called **`.current`**.

Unlike state (`useState`), updating a ref **does not trigger a re-render**. The value you store inside a ref persists for the entire lifecycle of the component, surviving through multiple re-renders.

---

### Key Characteristics of `useRef`

1. **Mutable:** You can freely read and mutate `ref.current` at any time.
2. **Does Not Trigger Re-renders:** Changing `ref.current` happens silently in the background without telling React to repaint the UI.
3. **Stable Reference:** The ref object remains the exact same reference across every render of the component.

---

### When Should You Use `useRef`? (Primary Use Cases)

#### 1. Accessing and Manipulating DOM Elements

This is the most common use case. By passing a ref to a JSX element's `ref` attribute, React automatically assigns the underlying DOM node to `ref.current`. This allows you to imperatively focus inputs, scroll containers, play/pause media, or measure dimensions.

```jsx
import { useRef } from "react";

export default function TextInputWithFocusButton() {
  // 1. Declare the ref
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // 3. Access the DOM node directly to call focus()
    inputEl.current.focus();
  };

  return (
    <div>
      {/* 2. Attach the ref to the input element */}
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  );
}
```

#### 2. Storing Mutable Values Without Triggering Re-renders

If you need to keep track of a value that changes frequently (like a timer ID, a toggle flag, or counting how many times a component rendered), but you **don't** want those changes to force the UI to re-render, use a ref.

```jsx
import { useState, useRef } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  // Store the timer ID in a ref so mutating it doesn't cause re-renders
  const timerId = useRef(null);

  const startTimer = () => {
    if (timerId.current !== null) return;

    timerId.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
    timerId.current = null; // Reset ref
  };

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

---

### Summary: State vs. Ref

| Feature                 | `useState`                                        | `useRef`                                                             |
| ----------------------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| **Triggers Re-render?** | Yes, calling the setter re-renders the component. | No, mutating `.current` is silent.                                   |
| **Purpose**             | To store data that affects the visual UI.         | To store DOM elements or values that shouldn't affect the visual UI. |
| **Mutability**          | Immutable (must use setter function).             | Fully mutable (`ref.current = newValue`).                            |

The useRef hook in React is used to create a mutable object that persists across renders. It can be used to access and manipulate DOM elements directly, store mutable values that do not cause re-renders when updated, and keep a reference to a value without triggering a re-render. For example, you can use useRef to focus an input element:

```js
import React, { useRef, useEffect } from "react";

function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  return <input ref={inputEl} type="text" />;
}
```

What is the useRef hook in React and when should it be used?
Introduction to useRef
The useRef hook in React is a function that returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component. Updating ref.current does not trigger a re-render.

A few important rules:

Do not read or write ref.current during rendering. React only guarantees the ref's value is settled after commit; mutating it during render makes components impure and is disallowed.
It is fine (and expected) to read or write ref.current inside event handlers, effects, or callbacks.
Key use cases for useRef
Accessing and manipulating DOM elements
One of the primary use cases for useRef is to directly access and manipulate DOM elements. This is particularly useful when you need to interact with the DOM in ways that are not easily achievable through React's declarative approach.

Example:

```js
import React, { useRef, useEffect } from "react";

function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  return <input ref={inputEl} type="text" />;
}
```

In this example, the useRef hook is used to create a reference to the input element, and the useEffect hook is used to focus the input element when the component mounts. The optional chaining (?.) guards against the rare case where the element is not yet attached, which is a good habit under React 19's stricter dev-mode checks.

Storing mutable values across renders
useRef can also be used to store any mutable value that should persist across renders without causing one. Common examples are interval/timeout IDs, the previous value of a prop or state, an instance of a non-React object (e.g. a chart or map controller), or a counter used inside event handlers.

```js
import React, { useRef, useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(undefined);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <h1>Now: {count}</h1>
      <h2>Before: {prevCountRef.current}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

Here prevCountRef holds the previous value of count across renders, but updating it does not itself cause a re-render.

Refs in Re

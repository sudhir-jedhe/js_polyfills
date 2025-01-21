The `useRef` hook in React is used to persist values across renders without causing re-renders itself. It's typically used for accessing DOM elements directly or keeping track of mutable state that doesn’t need to trigger re-renders when changed.

### Key Use Cases for `useRef`:
Here are some of the most common scenarios where `useRef` is used, particularly in relation to `forwardRef`:

### 1. **Accessing DOM Elements**
   When you need to interact with a DOM element (e.g., for focus, measuring, or animations), `useRef` provides a reference to that element. `forwardRef` is often used to pass a ref down to a child component so the parent can directly interact with the child's DOM element.

   **Example:**
   ```jsx
   import React, { useRef } from 'react';

   function InputComponent(props, ref) {
     return <input ref={ref} />;
   }

   // Using forwardRef to forward the ref to the input
   const ForwardedInput = React.forwardRef(InputComponent);

   function ParentComponent() {
     const inputRef = useRef(null);

     const focusInput = () => {
       inputRef.current.focus(); // Focus on the input field
     };

     return (
       <>
         <ForwardedInput ref={inputRef} />
         <button onClick={focusInput}>Focus the input</button>
       </>
     );
   }

   export default ParentComponent;
   ```

   In this example, the `ref` is forwarded from the parent (`ParentComponent`) to the `InputComponent` using `forwardRef`. This allows the parent component to access the DOM node of the input field and call `focus()` on it.

### 2. **Handling Imperative Code in Functional Components**
   Functional components don't have instance methods like class components, but sometimes you need to invoke imperative methods (e.g., focusing an input, scrolling to an element, etc.). `useRef` can be used to hold references to methods that can be called imperatively.

   **Example:**
   ```jsx
   import React, { useRef } from 'react';

   function TimerComponent(props, ref) {
     const timerId = useRef(null);

     const startTimer = () => {
       timerId.current = setInterval(() => {
         console.log('Timer running');
       }, 1000);
     };

     const stopTimer = () => {
       clearInterval(timerId.current);
     };

     React.useImperativeHandle(ref, () => ({
       startTimer,
       stopTimer,
     }));

     return (
       <div>
         <h2>Timer</h2>
       </div>
     );
   }

   const ForwardedTimer = React.forwardRef(TimerComponent);

   function ParentComponent() {
     const timerRef = useRef();

     return (
       <>
         <ForwardedTimer ref={timerRef} />
         <button onClick={() => timerRef.current.startTimer()}>Start Timer</button>
         <button onClick={() => timerRef.current.stopTimer()}>Stop Timer</button>
       </>
     );
   }

   export default ParentComponent;
   ```

   Here, `useImperativeHandle` allows the parent to invoke methods like `startTimer` and `stopTimer` on the child component using `ref`.

### 3. **Persisting Values Across Renders Without Re-triggering Re-renders**
   `useRef` is useful when you need to persist values (e.g., previous state, counters) across renders without causing a re-render when those values change.

   **Example:**
   ```jsx
   import React, { useRef, useState } from 'react';

   function CounterComponent() {
     const [count, setCount] = useState(0);
     const prevCountRef = useRef();

     // Store the previous count value
     React.useEffect(() => {
       prevCountRef.current = count;
     }, [count]);

     return (
       <div>
         <h1>Current count: {count}</h1>
         <h2>Previous count: {prevCountRef.current}</h2>
         <button onClick={() => setCount(count + 1)}>Increment</button>
       </div>
     );
   }

   export default CounterComponent;
   ```

   In this case, `prevCountRef` holds the previous value of `count`, but changing `prevCountRef` doesn’t trigger a re-render, allowing us to track state changes without causing unnecessary updates.

### 4. **Forwarding Ref for Custom Components**
   `forwardRef` allows you to pass refs from parent components to child components. This is especially useful when you want to expose a DOM element or instance method in a custom component to its parent.

   **Example:**
   ```jsx
   import React from 'react';

   const CustomButton = React.forwardRef((props, ref) => {
     return <button ref={ref} {...props}>{props.children}</button>;
   });

   function ParentComponent() {
     const buttonRef = useRef();

     const handleClick = () => {
       console.log(buttonRef.current);  // Access the DOM element
     };

     return (
       <div>
         <CustomButton ref={buttonRef} onClick={handleClick}>Click Me</CustomButton>
       </div>
     );
   }

   export default ParentComponent;
   ```

   Here, the `ref` is forwarded to the `button` element inside `CustomButton`, so the parent component can interact with the button directly.

### Why Use `forwardRef`?
`forwardRef` is useful when:
- **Exposing a DOM element**: If a parent component needs to access a DOM element or method in a child component, `forwardRef` helps pass down the reference.
- **Custom Components**: If you're creating a custom component (like a button, input, or modal) and you want to allow parents to interact with its underlying DOM, you need `forwardRef`.
- **Imperative Code**: When you need to expose imperative methods (e.g., `focus`, `scrollTo`) to parents, `forwardRef` is a key part of making that possible in functional components.

In summary, `useRef` allows you to persist values across renders without re-renders, and `forwardRef` allows you to pass refs to child components for direct interaction with their DOM elements or methods.
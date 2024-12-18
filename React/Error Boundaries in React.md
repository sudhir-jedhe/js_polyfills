### **Error Boundaries in React**

In React, an **Error Boundary** is a component that allows you to handle JavaScript errors anywhere in a component tree, log those errors, and display a fallback UI instead of crashing the entire application. This feature helps prevent your entire React app from breaking when an error occurs, improving the user experience by providing graceful error handling.

#### **Key Points about Error Boundaries:**

- **Error Boundaries** catch runtime JavaScript errors in their **child components**.
- They can **log the error** to an external service (e.g., Sentry, LogRocket) for further debugging.
- They can **display a fallback UI** to the user while the error is being handled.
- Error Boundaries only catch errors in **render**, **lifecycle methods**, and **constructor**. They do not catch errors inside **event handlers**, **asynchronous code (e.g., `setTimeout` or `fetch`)**, or **server-side rendering** (SSR).

---

### **How Error Boundaries Work**

To implement an error boundary, you create a class component that implements the following lifecycle methods:

1. **`static getDerivedStateFromError(error)`**: This method allows you to update the state based on the error, so you can display an error UI.
2. **`componentDidCatch(error, info)`**: This method is called after an error is thrown. It allows you to log error details or report the error to an external service.

Here's an example of how to create an **Error Boundary** component:

---

### **Creating an Error Boundary in React**

#### **Step 1: Create the Error Boundary Component**

```js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  // This lifecycle method is called when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true, error };
  }

  // This lifecycle method is called with the error and the error info
  componentDidCatch(error, info) {
    // Log error information or send it to an external service
    console.error("Error caught by ErrorBoundary: ", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error ? this.state.error.toString() : null}</p>
        </div>
      );
    }

    // Render the children components if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### **Explanation:**

- **`getDerivedStateFromError`**: This method updates the state to indicate an error has occurred. It returns an object that contains `hasError: true`, which can be used to conditionally render the fallback UI.
  
- **`componentDidCatch`**: This method is called after an error is caught. It receives two arguments: `error` (the error thrown) and `info` (an object with the component stack trace). You can use this to log the error, send it to an external service, or perform other actions.

---

### **Step 2: Using the Error Boundary in Your Application**

To use the error boundary, you can wrap your components with it:

```js
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import MyComponent from './MyComponent';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

export default App;
```

In this example:
- If any error occurs in the `MyComponent` component (or any of its children), it will be caught by the `ErrorBoundary`, and the fallback UI will be displayed.

---

### **Handling Errors in Specific Parts of the App**

If you want to handle errors in specific parts of the app (instead of wrapping the entire app in a single error boundary), you can wrap individual components or sections:

```js
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

function App() {
  return (
    <div>
      <ErrorBoundary>
        <ComponentA />
      </ErrorBoundary>
      <ErrorBoundary>
        <ComponentB />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

Here:
- Errors in `ComponentA` will be caught by its own error boundary, while errors in `ComponentB` will be handled by a separate error boundary.

---

### **Best Practices for Using Error Boundaries**

1. **Use Multiple Boundaries**: It’s a good practice to place error boundaries at different levels of your component tree. For example, you can wrap small sections or isolated features of the app with individual error boundaries to prevent errors in one part of the app from affecting the entire app.

2. **Display Meaningful Fallback UI**: The fallback UI should inform the user that something went wrong while providing a way to recover or try again. For example, you could include a button that reloads the component or allows the user to navigate to a safe area of the app.

3. **Log Errors**: Use `componentDidCatch` to log errors to an external service like Sentry, LogRocket, or even a custom logging system. This is helpful for tracking errors in production and getting detailed error reports.

4. **Don’t Overuse Error Boundaries**: Error boundaries should be used for catching exceptions that occur during rendering or lifecycle methods. They aren’t a replacement for handling errors in asynchronous code (like promises or API calls). For asynchronous error handling, use `try-catch` in combination with promises or async functions.

5. **Graceful Degradation**: When an error is caught, consider showing users a fallback UI that doesn’t break their experience. For example, show a generic error message with an option to retry or go back to the previous page.

---

### **Common Use Cases for Error Boundaries**

1. **Third-party components**: If you’re using third-party components that may throw errors, wrap them in error boundaries to prevent them from crashing your entire app.
  
2. **Complex parts of your app**: For example, if you have a complex component that performs a lot of logic (like a dynamic form or dashboard), wrap it in an error boundary to ensure other parts of your app continue to work even if this part fails.

3. **External APIs**: When interacting with external APIs, network requests may fail. Though error boundaries don't catch errors from `fetch` or async functions directly, you can handle errors locally within those components and wrap them in error boundaries.

---

### **Limitations of Error Boundaries**

- **Does not catch errors in event handlers**: Error boundaries do not catch errors thrown inside event handlers. For example, if an error occurs inside a button click handler, you will need to use a `try-catch` block to handle it.
  
  Example:
  ```js
  const handleClick = () => {
    try {
      // Some code that might throw an error
    } catch (error) {
      console.error('Error during click handler:', error);
    }
  };
  ```

- **Does not catch errors in asynchronous code**: Error boundaries also do not catch errors thrown in asynchronous code like `setTimeout`, `fetch`, or promises. You must handle such errors manually with `try-catch` or `.catch` in promises.

- **Does not catch errors during server-side rendering (SSR)**: Error boundaries do not catch errors that occur during SSR (e.g., in Next.js or Gatsby). You will need to implement a different error handling strategy for SSR.

---

### **Conclusion**

Error boundaries are a powerful feature in React for catching errors in your app’s component tree and preventing the entire app from crashing. They provide a way to show fallback UI and log errors to an external service for better error tracking and debugging.

To use error boundaries:
- Create a class component with `getDerivedStateFromError` and `componentDidCatch` methods.
- Wrap components or sections of your app with the error boundary to gracefully handle errors.

By using error boundaries effectively, you can ensure your React app is more resilient and user-friendly, even when errors occur.


Here’s a table summarizing the key differences between **`React.memo()`**, **`useMemo()`**, and **`useCallback()`** in React:

| Feature                | `React.memo()`                                | `useMemo()`                                    | `useCallback()`                                 |
|------------------------|-----------------------------------------------|------------------------------------------------|------------------------------------------------|
| **Type of Component**   | Works with **function components**            | Works inside **function components**           | Works inside **function components**           |
| **Purpose**             | Memoizes a function component to avoid unnecessary re-renders | Memoizes the result of an expensive computation | Memoizes a callback function to avoid unnecessary re-creations |
| **Use Case**            | Prevents re-rendering of function components when props don’t change | Optimizes expensive computations by recalculating them only when dependencies change | Prevents the re-creation of a function on each render, useful when passing functions as props |
| **When to Use**         | When you want to prevent unnecessary re-renders of a component | When performing an expensive computation or transformation | When passing a function as a prop to memoized child components or handling callbacks that depend on specific state/props |
| **How It Works**        | Memoizes the component’s rendered output | Memoizes a computed value (e.g., calculation or transformation) | Memoizes a function itself to ensure it isn’t re-created unless dependencies change |
| **Dependencies**        | No direct dependency tracking, based on props change | Requires dependencies array to track changes and re-compute value | Requires dependencies array to track changes in state or props used in the function |
| **Recalculation Trigger** | Re-renders only if props change | Recalculates only if dependencies change | Recreates the function only if dependencies change |
| **Example**             | `const MemoizedComponent = React.memo(MyComponent);` | `const expensiveValue = useMemo(() => calculateExpensiveValue(), [dependency]);` | `const memoizedCallback = useCallback(() => { /* logic */ }, [dependency]);` |

---

### Key Points:
- **`React.memo()`**: Primarily used for optimizing re-renders of function components based on props.
- **`useMemo()`**: Memoizes a **value** (or result of a computation), useful for expensive operations.
- **`useCallback()`**: Memoizes a **function**, especially useful when passing functions as props to child components or in cases where the function’s identity matters.
In modern React (especially with React 19 and the introduction of hooks, Server Components, and the React Compiler), **you should almost never write new class components**. Function components are the universal standard.

However, from a practical standpoint, there are only two scenarios where you might still encounter or need to use a class component:

1. **Legacy Codebases:** If you are maintaining a large, older React application written years ago, migrating thousands of lines of class components to function components is often too expensive or risky, so they are left as-is.
2. **Rare Lifecycle Edge Cases:** There are two legacy lifecycle methods—`componentDidCatch` and `getDerivedStateFromError`—that **do not yet have direct hook equivalents**. If you need to build a global **Error Boundary** from scratch without using a third-party library (like `react-error-boundary`), you must use a class component because only class components can act as error boundaries.

### Summary

Outside of maintaining legacy codebases or building low-level custom Error Boundaries, **always use function components and hooks**. Every feature—state, lifecycle effects, context, refs, and performance memoization—is fully supported in function components.

The only modern, practical scenario where you are forced to use a class component is when building a custom **Error Boundary** from scratch.

Because React does not yet have a hook equivalent for catching rendering errors (such as `componentDidCatch` or `getDerivedStateFromError`), you must write an Error Boundary as a class component.

---

### Example: Custom Error Boundary Class Component

```jsx
import React from "react";

// 1. Must be a class component because hooks cannot catch render errors yet
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Updates state so the fallback UI renders on the next pass
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Logs the error details (e.g., to an error-tracking service like Sentry)
  componentDidCatch(error, errorInfo) {
    console.error("Logged Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div className="error-box">⚠️ This widget crashed. Please refresh.</div>
      );
    }

    // Otherwise, render normal child components
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### How You Use It in Function Components

You wrap your normal function components inside this class-based boundary just like any other wrapper component:

```jsx
export default function App() {
  return (
    <div>
      <h1>My App</h1>
      <ErrorBoundary>
        {/* If this component throws an error during render, 
            the class component catches it and prevents a white screen crash */}
        <BuggyWidget />
      </ErrorBoundary>
    </div>
  );
}
```

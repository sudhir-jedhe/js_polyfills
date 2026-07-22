**Error boundaries** are React components designed to catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application.

---

### What Problem Do They Solve?

In React, if a JavaScript error occurs deep inside a component (during rendering, in lifecycle methods, or inside constructors), the default behavior of React 16+ is to **unmount the entire component tree**, resulting in a completely blank screen or a catastrophic app crash for the user.

An error boundary acts like a safety net (similar to a `catch {}` block, but for component rendering), ensuring that a localized bug in one part of your app doesn't break the entire user experience.

---

### Key Characteristics of Error Boundaries

1. **Catch Rendering Errors:** They catch errors thrown during rendering, in lifecycle methods, and in constructors of the whole tree below them.
2. **Graceful Fallbacks:** They allow you to show a friendly error message, a "Something went wrong" screen, or a retry button instead of a white screen of death.
3. **Class Component Requirement:** Historically, error boundaries **must be class components** because they rely on specific lifecycle methods (`static getDerivedStateFromError()` and `componentDidCatch()`). Even in a modern functional React app, your error boundary wrapper must be written as a class component (or imported from a trusted third-party library like `react-error-boundary`).

---

### What Error Boundaries Do NOT Catch

Error boundaries intentionally do **not** catch errors in:

- **Event handlers** (e.g., inside an `onClick` button click. React doesn't need boundaries here because event handler errors don't prevent rendering; use regular `try/catch` blocks instead).
- **Asynchronous code** (e.g., `setTimeout` or `fetch` request promises).
- **Server-side rendering (SSR)**.
- **Errors thrown in the error boundary component itself** (only in its children).

---

### Example: Creating an Error Boundary

```jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 1. Update state so the next render shows the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 2. Log error details for tracking/reporting
  componentDidCatch(error, errorInfo) {
    console.error("Error logged by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 3. Render any custom fallback UI
      return <h2>⚠️ Oops! Something went wrong in this section.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Usage in an App

You wrap potentially unstable or distinct sections of your app (like a widget, a sidebar, or a complex table) in the boundary:

```jsx
function App() {
  return (
    <div>
      <h1>My App</h1>
      <ErrorBoundary>
        <FragileWidget />
      </ErrorBoundary>
    </div>
  );
}
```

**Error boundaries** in React are components that catch JavaScript errors thrown during rendering, in lifecycle methods, and in constructors of their child component tree, then display a fallback UI instead of crashing the whole application. They are implemented as class components using static getDerivedStateFromError (to render a fallback) and optionally componentDidCatch (for logging). Since React 16, an uncaught error unmounts the entire React tree, which makes error boundaries effectively required for production apps. Error boundaries do not catch errors inside event handlers, asynchronous code, or server-side rendering. As of React 19, there is still no hooks-based API for error boundaries — most teams use the react-error-boundary library, or rely on the new root-level onUncaughtError, onCaughtError, and onRecoverableError options on createRoot/hydrateRoot.

**What are error boundaries in React for?**
Introduction
Error boundaries are a feature in React that help manage and handle errors in a more graceful way. They allow developers to catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application.

Specifically, an error boundary catches errors thrown during:

Rendering of its descendants
Lifecycle methods of its descendants
Constructors of its descendants
Since React 16, if an error is not caught by any boundary, React unmounts the entire component tree from the root. This behavior makes wrapping at least the top of your app in an error boundary effectively mandatory for production.

**How to implement error boundaries**
As of React 19, error boundaries must still be class components — there is no hooks-based equivalent. To create one, define a class component that implements at least one of the following methods:

**static getDerivedStateFromError(error):** Updates state so the next render shows the fallback UI. This alone is sufficient to render a fallback.
**componentDidCatch(error, info):** Used to log error information to an error reporting service. It is optional and not required to render a fallback.
Here is an example of an error boundary component:

```js
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

Usage
To use the error boundary, wrap it around any component that you want to monitor for errors:

```js
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Limitations**
Error boundaries have some limitations:

They do not catch errors inside event handlers. For event handlers, you need to use regular JavaScript try/catch blocks.
They do not catch errors in asynchronous code (e.g., setTimeout or requestAnimationFrame callbacks).
They do not catch errors during server-side rendering.
They do not catch errors thrown in the error boundary itself — those propagate up to the next error boundary above it in the tree (or unmount the whole root if none exists).

**Root-level error handlers (React 19)**
React 19 added options on createRoot and hydrateRoot to handle errors that bubble all the way to the root, useful for global logging and analytics

```js
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"), {
  onUncaughtError: (error, errorInfo) => {
    // Errors not caught by any error boundary
    console.error("Uncaught error:", error, errorInfo.componentStack);
  },
  onCaughtError: (error, errorInfo) => {
    // Errors caught by an error boundary
    console.error("Caught error:", error, errorInfo.componentStack);
  },
  onRecoverableError: (error, errorInfo) => {
    // Errors React recovered from automatically (e.g. hydration mismatches)
    console.error("Recoverable error:", error, errorInfo.componentStack);
  },
});
```

These complement error boundaries — they do not replace them.

The react-error-boundary library
Because error boundaries must be class components and the API is fairly verbose, most teams use the react-error-boundary library. It exposes an <ErrorBoundary> component plus a useErrorBoundary hook for imperatively triggering a boundary from function components, which covers common cases like rethrowing errors caught in event handlers or async code.

Best practices
Use error boundaries to wrap high-level components such as route handlers or major sections of your application.
Log errors to an error reporting service to keep track of issues in production.
Provide a user-friendly fallback UI to improve the user experience when an error occurs

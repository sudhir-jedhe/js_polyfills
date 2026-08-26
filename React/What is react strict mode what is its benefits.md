**React Strict Mode** is a development-only helper tool (`<React.StrictMode>`) that highlights potential problems, side-effect bugs, and deprecated patterns in an application.

It does not render any visible UI or alter production behavior—it only activates extra checks, runtime warnings, and intentional double-invocations in development.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

### Key Benefits & Behaviors

* **Detects Impure Rendering via Double Invocation:**
In development, React renders components **twice** upon mounting and state updates to ensure component bodies, `useState` initializers, and reducers are pure functions. If a component mutates an external variable or produces side effects during render, the double render surfaces the bug immediately.
* **Finds Missing Cleanup in Effects (Mount ➔ Unmount ➔ Remount):**
React mounts the component, immediately unmounts it (running the cleanup function), and remounts it again. This catches memory leaks, dangling WebSocket/event subscriptions, and unhandled race conditions caused by missing `useEffect` cleanup returns.
* **Warns About Deprecated APIs:**
Surfaces console warnings for outdated or unsafe React patterns, such as:
* Legacy string refs (`this.refs.myRef`)
* Deprecated lifecycle methods (`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`)
* Legacy Context API (`contextTypes` / `getChildContext`)
* `findDOMNode` usage

* **Prepares Code for Concurrent Features:**
Ensures components are safe for concurrent rendering, selective hydration, and offscreen/transition states where React may pause, abort, or restart rendering a component tree.

---

### Behavior in Development vs. Production

| Feature                          | Development Mode (`<StrictMode>`) | Production Build               |
| -------------------------------- | --------------------------------- | ------------------------------ |
| **Component Renders**            | Invoked **twice** per update      | Invoked **once**               |
| **`useEffect` Lifecycle**        | Mount ➔ Cleanup ➔ Remount         | Standard Mount only            |
| **Console Deprecation Warnings** | Active                            | Disabled                       |
| **Performance / Bundle Impact**  | Slight dev overhead               | **Zero impact** (stripped out) |

---

### Common Example Caught by Strict Mode

```jsx
// ❌ BUG: Mutating an external array during render
let globalItems = [];

function ItemList({ newItem }) {
  globalItems.push(newItem); // Mutating external state in render body!
  return <div>Count: {globalItems.length}</div>;
}

```

* **Without Strict Mode:** Renders count as `1` (hiding the impure mutation).
* **With Strict Mode:** Runs twice, rendering count as `2`, immediately exposing the impure side effect.

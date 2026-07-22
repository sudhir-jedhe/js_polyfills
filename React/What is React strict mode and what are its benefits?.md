**React Strict Mode** (`<StrictMode>`) is a built-in development tool designed to help you catch potential bugs, unsafe practices, and deprecated features early in your React application before they reach production.

It is enabled by wrapping your root component or a section of your app:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

### Key Benefits of React Strict Mode

Strict Mode is entirely **inert in production**—it has zero performance impact and does not render any visible UI. However, in **development mode**, it acts as an automated code auditor with several core benefits:

#### 1. Proactive Double-Invoking for Pure Functions

React requires component render functions and state reducers to be **pure** (meaning running them multiple times with the same inputs yields the exact same output without side effects).

- In Strict Mode, React **intentionally runs your render functions, initializers, and reducers twice** during development.
- **Benefit:** If your code contains accidental side effects (like modifying a global variable or mutating data directly during render), running it twice makes those bugs immediately obvious, forcing you to write cleaner, predictable code.

#### 2. Double-Invoking Effects (Preparing for Concurrent Features)

Modern React uses advanced concurrent rendering features that allow it to pause, resume, or discard rendering work.

- Strict Mode simulates component unmounting and remounting immediately in development (mounting $\rightarrow$ unmounting $\rightarrow$ remounting) for every new component.
- **Benefit:** This forces you to properly implement **cleanup functions** in your `useEffect` hooks. If a subscription or timer isn't cleaned up properly on unmount, Strict Mode exposes it instantly.

#### 3. Warning About Deprecated or Unsafe APIs

React evolves over time, and older patterns (such as legacy string refs or unsafe lifecycle methods like `componentWillMount`) are phased out.

- **Benefit:** Strict Mode scans your codebase and logs console warnings if you are using outdated APIs or patterns that could break in future versions of React.

#### 4. Identifying Legacy or Risky Code Patterns

Strict Mode checks for patterns that prevent modern features from working smoothly, such as legacy context APIs or unexpected side effects during state initialization.

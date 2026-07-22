Stateless components in React are components that do not manage or hold any internal state. They simply receive data via props and render UI based on that data. These components are often functional components and are used for presentational purposes.

Key points:
Do not use this.state
Render UI based on props
Focused on displaying information, not managing behavior

```js
function StatelessComponent({ message }) {
  return <div>{message}</div>;
}
```

Stateless components are simpler, easier to test, and often more reusable. With the introduction of hooks, React components are mostly written using functions and can contain state via the useState hook.

A **stateless component** is a component that does **not** manage any internal state of its own. It relies entirely on the props passed down to it from a parent component to determine what to render.

Because they have no memory (no state) and produce the same output every time given the same inputs, they are often referred to as **purely presentational** or **dumb** components.

---

### Key Characteristics of Stateless Components

1. **No `useState` or `useReducer`:** They do not use hooks or internal state mechanisms to track changing data.
2. **Predictable & Reusable:** Because they only take props and return JSX, they are easy to test, reuse across different parts of an application, and reason about.
3. **Written as Function Components:** In modern React, stateless components are simply standard JavaScript function components.

---

### Example

Here is a classic example of a stateless component. It doesn't know _why_ the button is clicked or _how_ the count changes; it simply receives data and callbacks via props:

```jsx
// Stateless Component (Presentational)
function Button({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn">
      {label}
    </button>
  );
}
```

### Stateful vs. Stateless Architecture

In a well-structured React application, components are typically split into two categories:

- **Stateful Components (Smart):** Handle data fetching, manage state (using `useState`), and orchestrate business logic.
- **Stateless Components (Dumb):** Receive that state as props from the smart component and focus purely on the visual markup and layout.

A **stateful component** is a component that manages its own internal data using state (such as the `useState` or `useReducer` hooks, or `this.state` in class components).

Because they hold data that changes over time, stateful components handle user interactions, data fetching, business logic, and orchestrate how the UI updates in response. They are often referred to as **"smart"** or **"container"** components.

---

### Key Characteristics of Stateful Components

1. **Internal Memory:** They use state hooks to remember data across renders (e.g., whether a modal is open, form input values, or fetched user data).
2. **Triggers Re-renders:** When a stateful component updates its state via a setter function, React automatically re-renders that component (and its children) to reflect the new data.
3. **Delegates Presentation:** They often fetch and manage the heavy data logic, then pass that data down to **stateless (presentational) components** via props for rendering.

---

### Example

Here is a classic stateful component that manages its own counter state and passes data down:

```jsx
import { useState } from "react";
import StatelessButton from "./StatelessButton"; // A stateless child component

export default function CounterContainer() {
  // Stateful logic managed internally
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <p>Current Count: {count}</p>
      {/* Passing state and callbacks down to a stateless component */}
      <StatelessButton label="Increment" onClick={handleIncrement} />
    </div>
  );
}
```

The recommended ways for type checking React component props depend entirely on whether your project is written in TypeScript or JavaScript.

---

### 1. TypeScript (The Industry Standard)

For modern React applications, **TypeScript** is the absolute gold standard and recommended approach for type checking. It performs **static type checking at compile-time**, catching errors in your code editor before the app ever runs.

- **How it works:** You define an `interface` or `type` for your component props, and TypeScript enforces them instantly.
- **Example:**

```tsx
interface UserCardProps {
  username: string;
  age?: number; // Optional prop
  isActive: boolean;
}

export default function UserCard({
  username,
  age = 18,
  isActive,
}: UserCardProps) {
  return (
    <div>
      <h2>
        {username} ({age})
      </h2>
      <p>Status: {isActive ? "Active" : "Offline"}</p>
    </div>
  );
}
```

---

### 2. PropTypes (The Legacy JavaScript Approach)

If you are working in a pure JavaScript (`.jsx`) codebase where TypeScript is not used, the recommended approach is the official **`prop-types`** library. It validates types at **runtime** in the browser during development.

- **How it works:** You attach a `propTypes` object to your component to specify expected types and requirements.
- **Example:**

```jsx
import PropTypes from "prop-types";

export default function UserCard({ username, age, isActive }) {
  return (
    <div>
      <h2>
        {username} ({age})
      </h2>
      <p>Status: {isActive ? "Active" : "Offline"}</p>
    </div>
  );
}

UserCard.propTypes = {
  username: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool.isRequired,
};
```

---

### Summary: Which should you choose?

- **Use TypeScript (`.tsx`)** for all new projects. It provides superior autocompletion, refactoring support, and catches bugs before compilation.
- **Use `prop-types` (`.jsx`)** only if you are maintaining an older JavaScript codebase that cannot use TypeScript.

The older alternative was PropTypes, a runtime checker that warned in dev mode when prop types didn't match. It is deprecated as of React 19 and no longer ships from the react package. If you're maintaining a codebase that still uses prop-types, migrate to TypeScript.

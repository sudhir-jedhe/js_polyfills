**PropTypes** is a runtime type-checking mechanism in React. Its primary role is to verify that the props passed down to a component match the expected data types (such as strings, numbers, arrays, or custom shapes) and to warn developers during development if incorrect data is supplied.

---

### Key Roles of PropTypes

1. **Catching Bugs Early:** If a component expects a number but receives a string or `undefined`, PropTypes flags it immediately in the console during development, helping you trace data flow errors.
2. **Component Documentation:** By looking at a component's `propTypes` definition, another developer can instantly see what inputs the component requires and what data types they should be.
3. **Enforcing Required Props:** You can mark specific props as mandatory (`.isRequired`), causing React to throw a warning if the parent component fails to provide them.

---

### Example Usage

In modern React, `PropTypes` is imported from the separate `prop-types` package:

```jsx
import PropTypes from "prop-types";

function UserProfile({ username, age, isActive }) {
  return (
    <div>
      <h2>{username}</h2>
      <p>Age: {age}</p>
      <p>Status: {isActive ? "Online" : "Offline"}</p>
    </div>
  );
}

// Defining expected prop types
UserProfile.propTypes = {
  username: PropTypes.string.isRequired, // Must be a string and is mandatory
  age: PropTypes.number, // Must be a number if provided
  isActive: PropTypes.bool.isRequired, // Must be a boolean and is mandatory
};

export default UserProfile;
```

---

### PropTypes vs. TypeScript

While `PropTypes` performs runtime checks (evaluating types while the application is running in the browser during development), modern React development has largely shifted toward **TypeScript**.

TypeScript performs **static type checking** at compile-time (before the code even runs in the browser), catching type errors in your editor instantly. However, `PropTypes` remains useful in pure JavaScript projects where TypeScript is not configured.

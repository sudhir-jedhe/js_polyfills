**Synthetic Events** are React's cross-browser wrapper around the browser's native event system. They ensure that events work identically across all different browsers, providing a consistent API for handling user interactions like clicks, typing, and form submissions.

---

### Why Does React Use Synthetic Events?

1. **Cross-Browser Consistency:** Different browsers (Chrome, Safari, Firefox, older Internet Explorer) handle DOM events slightly differently, with varying property names or object structures. React's synthetic event wraps the native event to guarantee that properties like `target`, `key`, and `preventDefault()` behave exactly the same way everywhere.
2. **Performance (Event Delegation):** Instead of attaching a direct event listener to every individual DOM node (e.g., thousands of table rows or list items), React implements an efficient optimization called **event delegation**.

- React attaches a single, top-level native event listener to the root container (or document) for each event type (like `click` or `change`).
- When a user interacts with an element, the native event bubbles up to the root, where React intercepts it, creates the corresponding Synthetic Event object, and dispatches it down to your component's handler.

---

### Key Features of Synthetic Events

- **Same Interface:** They have the same interface as browser native events (including `stopPropagation()` and `preventDefault()`), so you don't have to learn a new syntax.
- **W3C Compliant:** They fully comply with the W3C and DOM Level 3 specifications.
- **Automatic Pooling (Historical Note):** In older versions of React (React 16 and prior), synthetic events were "pooled" for memory reuse (meaning event properties were wiped out asynchronously). As of **React 17+**, event pooling has been completely removed, meaning you can safely access synthetic event properties inside asynchronous callbacks (like `setTimeout`) without issues.

---

### Example: Using a Synthetic Event

```jsx
export default function Form() {
  function handleSubmit(event) {
    // 'event' here is a React SyntheticEvent wrapping the native submit event
    event.preventDefault(); // Prevents the browser's default page reload

    console.log("Form submitted successfully!");
  }

  function handleInputChange(event) {
    // Accessing properties safely
    console.log("Current input value:", event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Accessing the Native Event

If you ever need to access the underlying browser-specific native event (for example, to use a proprietary property or method not covered by React), you can find it directly on the synthetic object via the **`.nativeEvent`** property:

```jsx
function handleClick(event) {
  console.log(event.nativeEvent); // The raw browser DOM event
}
```

Synthetic events in React are a wrapper around native DOM events that ensure consistent behavior across browsers. They normalize the way events are handled, providing a unified API for React applications.

These events are wrapped in the SyntheticEvent object and expose the usual methods like preventDefault() and stopPropagation(). Since React 17, the root event listener is attached to the React root container (not document), which makes nested React trees work correctly together.

```js
function MyComponent() {
  const handleClick = (event) => {
    event.preventDefault();
    console.log("Button clicked");
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

Older sources mention event pooling, where React reused the event object after the handler ran, which made the event unusable in async code. Event pooling was removed in React 17, so you can read or pass the event object asynchronously without calling event.persist().

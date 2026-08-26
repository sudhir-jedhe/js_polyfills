In React, a **Synthetic Event** is a cross-browser wrapper around the browser's native DOM event.

Instead of passing the browser's raw event object directly to your handlers, React wraps it in an instance of `SyntheticEvent`.

---

### Why React Uses Synthetic Events

1. **Cross-Browser Consistency:** Different browsers (Chrome, Safari, Firefox, older Edge) sometimes implement native events with slight differences in property names, bubbling quirks, or behaviors. React normalizes these differences so your code runs identically everywhere.
2. **Unified API:** It implements the standard W3C event specification interface—providing familiar methods like `e.preventDefault()` and `e.stopPropagation()`.
3. **Performance via Delegation:** It integrates directly with React's event delegation system, which listens to native events at the root container rather than attaching individual listeners to every single DOM node.

---

### Key Differences: React Events vs Native DOM Events

| Feature                    | React Synthetic Event                                        | Native DOM Event                                           |
| -------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| **Naming Convention**      | **camelCase** (`onClick`, `onChange`, `onSubmit`)            | **lowercase** (`onclick`, `onchange`, `onsubmit`)          |
| **Handler Type**           | Passed as a **function reference** (`onClick={handleClick}`) | Passed as a **string** in HTML (`onclick="handleClick()"`) |
| **Preventing Defaults**    | Must call **`e.preventDefault()`** explicitly                | Can return `false` inline (`return false;`)                |
| **Event Object**           | Wrapped in `SyntheticEvent`                                  | Raw `Event` or `MouseEvent`/`KeyboardEvent` instance       |
| **Accessing Native Event** | Available via **`e.nativeEvent`**                            | Already the native object                                  |

---

### Code Comparison

**Native HTML / DOM:**

```html
<!-- HTML -->
<button onclick="handleClick(event)">Submit</button>

<script>
  function handleClick(event) {
    // Native MouseEvent
    event.preventDefault();
  }
</script>

```

**React JSX:**

```jsx
function SubmitButton() {
  function handleClick(e) {
    // `e` is a SyntheticEvent
    e.preventDefault();
    
    // Access the underlying native browser event if needed:
    console.log(e.nativeEvent);
  }

  return <button onClick={handleClick}>Submit</button>;
}

```

---

### Key Behavior Note (React 17+)

* **No Event Pooling:** In React 16 and earlier, React reused (pooled) `SyntheticEvent` objects across different events for performance, meaning you could not access `e.target` inside asynchronous code (like `setTimeout`) without calling `e.persist()`.
* **Modern React (17, 18+):** Event pooling was completely removed. You can freely access event properties inside `async/await`, Promises, or timeouts without any special setup.

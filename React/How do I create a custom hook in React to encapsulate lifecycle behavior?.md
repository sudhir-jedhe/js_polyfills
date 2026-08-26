A **custom hook** in React is a standard JavaScript function whose name starts with `use` and can call other React hooks (`useState`, `useEffect`, `useRef`, etc.). It lets you extract and reuse component lifecycle patterns, event listeners, and stateful logic without duplicating code.

---

**Rules for Custom Hooks**

* **Naming Convention:** The function name **must** start with `use` (e.g., `useWindowSize`, `useFetch`) so React's linter can enforce hook rules.
* **Encapsulated State:** Each component calling the hook gets its own isolated state—state is not shared across components.
* **Pure Logic:** Custom hooks return data, functions, or status flags, never JSX.

---

**Step-by-Step Example: `useWindowSize` (Mount, Update, Unmount)**

This custom hook tracks the browser window dimensions by attaching an event listener on mount, updating on resize, and cleaning up on unmount.

```jsx
import { useState, useEffect } from "react";

// 1. Define the custom hook
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Lifecycle: Mount / Setup
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Lifecycle: Cleanup on Unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty deps: setup once on mount, cleanup on unmount

  return size; // Return state to consumer
}

// 2. Consume the hook inside a component
function ResponsiveHeader() {
  const { width } = useWindowSize();

  return (
    <header>
      <h1>My App</h1>
      <p>Current Viewport Width: {width}px</p>
      {width < 768 ? <button>Mobile Menu</button> : <nav>Desktop Nav</nav>}
    </header>
  );
}

```

---

**Common Lifecycle Custom Hook Patterns**

* **`useOnMount(fn)`:** Executes a callback once after the initial render.
* **`useOnUnmount(fn)`:** Executes cleanup logic when the component unmounts.
* **`usePrevious(value)`:** Tracks a prop or state value from the preceding render using `useRef`.
* **`useFetch(url)`:** Handles loading, success, error states, and aborts pending requests on unmount.

---

**Example: `useFetch` with AbortController Cleanup**

```jsx
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    // Cleanup: cancel in-flight request if url changes or component unmounts
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

```

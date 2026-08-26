*** copy useLongPress1.md ***

A complete, production-ready solution includes full **touch support**, **keyboard accessibility** (Enter/Space hold), **initial hold delay**, and **automatic cleanup** to prevent memory leaks.

---

**`useLongPress.js` (Custom Hook)**

```jsx
import { useRef, useCallback, useEffect } from "react";

export const useLongPress = (callback, intervalSpeed = 80, initialDelay = 350) => {
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const isHoldingRef = useRef(false);

  // Keep latest callback reference to avoid stale closures
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(
    (e) => {
      // Allow only primary mouse click (left-click) or touch/keyboard
      if (e.type === "mousedown" && e.button !== 0) return;

      isHoldingRef.current = true;
      savedCallback.current(); // Trigger immediate action on initial press

      // Wait for initial threshold before rapid-firing
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          savedCallback.current();
        }, intervalSpeed);
      }, initialDelay);
    },
    [intervalSpeed, initialDelay]
  );

  const stop = useCallback(() => {
    isHoldingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Keyboard accessibility handler (Space / Enter hold)
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.key === "Enter" || e.key === " ") && !isHoldingRef.current) {
        e.preventDefault();
        start(e);
      }
    },
    [start]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        stop();
      }
    },
    [stop]
  );

  // Clean up all running timers if component unmounts while pressing
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchCancel: stop,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  };
};

```

---

**`Counter.jsx` (Component)**

```jsx
import React, { useState } from "react";
import { useLongPress } from "./useLongPress";

export default function Counter() {
  const [count, setCount] = useState(0);

  // Functional state updates prevent stale state during fast intervals
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  const incrementHandlers = useLongPress(increment, 70, 300);
  const decrementHandlers = useLongPress(decrement, 70, 300);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Long-Press Counter</h2>

      <div style={styles.counterBox}>
        <button
          {...decrementHandlers}
          style={styles.button}
          aria-label="Decrease counter"
        >
          −
        </button>

        <span style={styles.display}>{count}</span>

        <button
          {...incrementHandlers}
          style={styles.button}
          aria-label="Increase counter"
        >
          +
        </button>
      </div>

      <button onClick={reset} style={styles.resetButton}>
        Reset
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "2rem",
  },
  heading: {
    marginBottom: "1rem",
    color: "#333",
  },
  counterBox: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    background: "#f4f4f5",
    padding: "1rem 2rem",
    borderRadius: "12px",
  },
  display: {
    fontSize: "2.5rem",
    fontWeight: "700",
    minWidth: "80px",
    textAlign: "center",
    userSelect: "none",
  },
  button: {
    fontSize: "1.8rem",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    touchAction: "manipulation",
  },
  resetButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
  },
};

```

---

**Key Highlights of this Implementation:**

* **Stale Closure Safety:** Uses `useRef(callback)` inside the hook and functional state updates `setCount(prev => prev + 1)`.
* **Full Event Coverage:** Handles Desktop (`mousedown`, `mouseup`, `mouseleave`), Mobile (`touchstart`, `touchend`, `touchcancel`), and Keyboard (`keydown`, `keyup` for Enter/Space).
* **Smooth UX:** Triggers 1 count instantly on tap/click, waits `300ms`, then continues at rapid speed (`70ms`).
* **Memory Safe:** All active timers are cleared on unmount via the `useEffect` cleanup return.

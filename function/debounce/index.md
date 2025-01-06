// Debouncing is a technique used to control how many times we allow a function
// to be executed over time. When a JavaScript function is debounced
// with a wait time of X milliseconds, it must wait until after X
// milliseconds have elapsed since the debounced function was last called.
// You almost certainly have encountered debouncing in your daily lives
//  before — when entering an elevator. Only after X duration of not
// pressing the "Door open" button (the debounced function not being called)
// will the elevator door actually close (the callback function is executed).

// Implement a debounce function which accepts a callback function
//  and a wait duration. Calling debounce() returns a function
// which has debounced invocations of the callback function following the behavior described above.


Implement a debounce function which accepts a callback function and a wait duration. Calling debounce() returns a function which has debounced invocations of the callback function following the behavior described above.

Here’s a comprehensive implementation of `debounce` and `throttle`, including the examples and the requested `cancel()` and `flush()` methods for `debounce`.

---

### **Debounce Implementation**

```javascript
function debounce(callback, wait) {
  let timeout;

  function debounced(...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback.apply(context, args);
    }, wait);
  }

  // Cancel method: Clears any pending invocation
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  // Flush method: Immediately invokes the function if there's a pending invocation
  debounced.flush = function () {
    if (timeout) {
      clearTimeout(timeout);
      callback();
      timeout = null;
    }
  };

  return debounced;
}

// Example usage:
let i = 0;
function increment() {
  i++;
  console.log("i:", i);
}

const debouncedIncrement = debounce(increment, 100);

// Test Cases
debouncedIncrement(); // i = 0
setTimeout(() => debouncedIncrement(), 50); // i = 0
setTimeout(() => debouncedIncrement(), 150); // i = 1 after 150ms
```

---

### **Throttle Implementation**

Throttle ensures that the callback function is invoked at most once in a specified time window.

```javascript
function throttle(callback, wait) {
  let lastExecution = 0;
  let timeout;

  function throttled(...args) {
    const context = this;
    const now = Date.now();

    if (now - lastExecution >= wait) {
      // Execute immediately if enough time has passed
      lastExecution = now;
      callback.apply(context, args);
    } else if (!timeout) {
      // Schedule for later
      const remainingTime = wait - (now - lastExecution);
      timeout = setTimeout(() => {
        lastExecution = Date.now();
        timeout = null;
        callback.apply(context, args);
      }, remainingTime);
    }
  }

  // Cancel method: Clears any scheduled execution
  throttled.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return throttled;
}

// Example usage:
let j = 0;
function log() {
  j++;
  console.log("j:", j);
}

const throttledLog = throttle(log, 100);

// Test Cases
throttledLog(); // j = 1 immediately
setTimeout(() => throttledLog(), 50); // j = 1 (too soon)
setTimeout(() => throttledLog(), 150); // j = 2 (after 100ms)
```

---

### **Differences Between Debounce and Throttle**

| Feature            | Debounce                                         | Throttle                                |
|--------------------|-------------------------------------------------|----------------------------------------|
| Behavior           | Delays execution until after a specified delay since the last invocation. | Ensures execution at most once in a specified interval. |
| Best for           | Reducing excessive API calls for rapid actions like resizing or keypress. | Regular updates like scrolling, dragging, or resizing. |
| Examples           | Search bar suggestions, form validation, window resize. | Infinite scroll, rate-limited API calls. |

---

### **Follow-Up with Debounce Methods**

- **`cancel()`**: Stops any scheduled invocation.
- **`flush()`**: Executes the callback immediately if a delayed invocation is pending.

These additions make `debounce` more flexible and powerful, particularly useful for edge cases like canceling or forcing execution in real-time.

Let me know if you need further clarification!
# Implement `clearAllTimeout()` in JavaScript

This is a popular **JavaScript interview question**.

JavaScript provides:

```js
setTimeout();
clearTimeout();
```

But there is **no built-in**:

```js
clearAllTimeout();
```

The goal is:

```txt
Register multiple timeouts
        ↓
Call clearAllTimeout()
        ↓
Cancel all pending timeouts
```

---

# Approach 1: Override setTimeout (Interview Favourite)

## Step 1: Store All Timeout IDs

```js
const timeoutIds = [];
```

---

## Step 2: Wrap setTimeout

```js
const originalSetTimeout = window.setTimeout;

window.setTimeout = function (...args) {
  const id = originalSetTimeout(...args);

  timeoutIds.push(id);

  return id;
};
```

Whenever:

```js
setTimeout(...)
```

runs, its ID is saved.

---

## Step 3: Implement clearAllTimeout

```js
function clearAllTimeout() {
  while (timeoutIds.length) {
    clearTimeout(timeoutIds.pop());
  }
}
```

---

# Complete Example

```js
const timeoutIds = [];

const originalSetTimeout = window.setTimeout;

window.setTimeout = function (...args) {
  const id = originalSetTimeout(...args);

  timeoutIds.push(id);

  return id;
};

function clearAllTimeout() {
  while (timeoutIds.length) {
    clearTimeout(timeoutIds.pop());
  }
}
```

---

## Test

```js
setTimeout(() => {
  console.log("1");
}, 1000);

setTimeout(() => {
  console.log("2");
}, 2000);

setTimeout(() => {
  console.log("3");
}, 3000);

clearAllTimeout();
```

Output:

```txt
Nothing prints
```

All timeouts are cancelled.

---

# Approach 2: Track IDs Without Overriding setTimeout

A cleaner production approach.

```js
const activeTimeouts = new Set();
```

---

## Custom Wrapper

```js
function createTimeout(callback, delay) {
  const id = setTimeout(() => {
    activeTimeouts.delete(id);

    callback();
  }, delay);

  activeTimeouts.add(id);

  return id;
}
```

---

## clearAllTimeout

```js
function clearAllTimeout() {
  activeTimeouts.forEach((id) => {
    clearTimeout(id);
  });

  activeTimeouts.clear();
}
```

---

## Example

```js
createTimeout(() => {
  console.log("A");
}, 1000);

createTimeout(() => {
  console.log("B");
}, 2000);

clearAllTimeout();
```

Output:

```txt
Nothing
```

---

# Approach 3: Browser Hack (Not Recommended)

Older interview trick.

```js
function clearAllTimeout() {
  const highestId = setTimeout(() => {}, 0);

  for (let i = 0; i <= highestId; i++) {
    clearTimeout(i);
  }
}
```

---

## Why It Works?

Timeout IDs increase:

```txt
1
2
3
4
5
```

Get latest ID:

```js
const highestId = setTimeout(() => {}, 0);
```

Then:

```js
for (let i = 0; i <= highestId; i++) {
  clearTimeout(i);
}
```

Cancels everything.

---

## Why Not Recommended?

Problems:

```txt
❌ Not reliable everywhere
❌ Assumes sequential IDs
❌ May affect third-party code
❌ Not scalable
```

---

# React Example

Suppose you have multiple timers in a component.

```jsx
import { useEffect } from "react";

const timeouts = new Set();

export default function App() {
  useEffect(() => {
    const id1 = setTimeout(() => {
      console.log("API 1");
    }, 1000);

    const id2 = setTimeout(() => {
      console.log("API 2");
    }, 2000);

    timeouts.add(id1);
    timeouts.add(id2);

    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  return <div>Demo</div>;
}
```

---

# Interview Follow-Up Questions

## Q1. Why use Set instead of Array?

Array:

```js
[1, 2, 3, 3, 4];
```

Duplicates possible.

Set:

```js
Set(1, 2, 3, 4);
```

Unique entries.

---

## Q2. Time Complexity?

Let:

```txt
n = number of active timers
```

```js
activeTimeouts.forEach(...)
```

Time Complexity:

```txt
O(n)
```

Space:

```txt
O(n)
```

---

## Q3. What About setInterval?

Create:

```js
const intervals = new Set();
```

Then:

```js
function clearAllIntervals() {
  intervals.forEach(clearInterval);
  intervals.clear();
}
```

---

# Senior Interview Answer

```js
const activeTimeouts = new Set();

function createTimeout(callback, delay) {
  const id = setTimeout(() => {
    activeTimeouts.delete(id);
    callback();
  }, delay);

  activeTimeouts.add(id);

  return id;
}

function clearAllTimeout() {
  activeTimeouts.forEach((id) => {
    clearTimeout(id);
  });

  activeTimeouts.clear();
}
```

### Explanation

> Since JavaScript does not provide a native `clearAllTimeout()`, I keep track of all timeout IDs in a `Set`. Whenever a timeout is created, its ID is stored. `clearAllTimeout()` iterates through the set, clears each timeout, and then clears the collection. This solution is deterministic, avoids relying on browser-specific timer IDs, and runs in **O(n)** time where **n** is the number of active timers.

# 1. React Example: Using `clearAllTimeout()`

Imagine you're building a React dashboard that starts multiple timers:

```jsx
import { useEffect } from "react";

const activeTimeouts = new Set();

function createTimeout(callback, delay) {
  const id = setTimeout(() => {
    activeTimeouts.delete(id);
    callback();
  }, delay);

  activeTimeouts.add(id);

  return id;
}

function clearAllTimeout() {
  activeTimeouts.forEach((id) => {
    clearTimeout(id);
  });

  activeTimeouts.clear();
}

export default function Dashboard() {
  useEffect(() => {
    createTimeout(() => {
      console.log("API Refresh");
    }, 3000);

    createTimeout(() => {
      console.log("Notification");
    }, 5000);

    createTimeout(() => {
      console.log("Analytics");
    }, 8000);

    return () => {
      clearAllTimeout();
    };
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={clearAllTimeout}>Stop All Timers</button>
    </div>
  );
}
```

---

# Execution Flow

```txt
Component Mounted
       │
       ▼
3 Timeouts Created
       │
       ▼
activeTimeouts

{
  id1,
  id2,
  id3
}

       │
       ▼
Click Stop All Timers
       │
       ▼
clearAllTimeout()
       │
       ▼
clearTimeout(id1)
clearTimeout(id2)
clearTimeout(id3)
```

Nothing executes afterwards.

---

# Custom Hook Version (Production Ready)

A more React-friendly approach:

## useTimeoutManager.js

```jsx
import { useRef } from "react";

export function useTimeoutManager() {
  const timeouts = useRef(new Set());

  const createTimeout = (callback, delay) => {
    const id = setTimeout(() => {
      timeouts.current.delete(id);
      callback();
    }, delay);

    timeouts.current.add(id);

    return id;
  };

  const clearAllTimeout = () => {
    timeouts.current.forEach((id) => {
      clearTimeout(id);
    });

    timeouts.current.clear();
  };

  return {
    createTimeout,
    clearAllTimeout,
  };
}
```

---

## Usage

```jsx
function App() {
  const { createTimeout, clearAllTimeout } = useTimeoutManager();

  return (
    <>
      <button
        onClick={() => {
          createTimeout(() => alert("Hello"), 3000);
        }}
      >
        Create Timer
      </button>

      <button onClick={clearAllTimeout}>Clear All</button>
    </>
  );
}
```

---

# 2. Difference Between Approaches

## Approach 1: Override `setTimeout`

```js
window.setTimeout = function () {
  ...
}
```

### Pros

✅ All timeouts automatically tracked

✅ Easy interview solution

---

### Cons

❌ Modifies global behaviour

❌ Can break third-party libraries

❌ Hard to debug

❌ Not recommended in production

---

### Diagram

```txt
setTimeout()
      │
      ▼
Overridden Function
      │
      ▼
Store ID
      │
      ▼
Execute Timer
```

---

# Approach 2: Wrapper Function

```js
createTimeout();
```

### Pros

✅ Explicit

✅ Safe

✅ Easy to maintain

✅ No global changes

✅ Production-friendly

---

### Cons

❌ Only tracks timers created through wrapper

---

### Diagram

```txt
createTimeout()
       │
       ▼
Store Timeout ID
       │
       ▼
SetTimeout
       │
       ▼
Clear Later
```

---

# Approach 3: Browser Hack

```js
const highestId = setTimeout(() => {}, 0);

for (let i = 0; i <= highestId; i++) {
  clearTimeout(i);
}
```

---

### Pros

✅ Very short

✅ Common interview discussion

---

### Cons

❌ Assumes sequential IDs

❌ Not deterministic

❌ May clear unrelated timers

❌ Not production safe

---

# Comparison Table

| Approach            | Production | Safe | Interview |
| ------------------- | ---------- | ---- | --------- |
| Override setTimeout | ❌         | ❌   | ✅        |
| Wrapper + Set       | ✅         | ✅   | ✅        |
| Browser Hack        | ❌         | ❌   | ✅        |

---

# Recommended Answer

For senior interviews:

> "I would implement a wrapper around setTimeout and maintain active timer IDs in a Set. This avoids modifying global browser behaviour, is deterministic, and allows efficient cleanup during component unmounting."

---

# 3. Implement `clearAllInterval()`

Exactly the same concept.

---

## Utility

```js
const activeIntervals = new Set();

function createInterval(callback, delay) {
  const id = setInterval(callback, delay);

  activeIntervals.add(id);

  return id;
}

function clearAllInterval() {
  activeIntervals.forEach((id) => {
    clearInterval(id);
  });

  activeIntervals.clear();
}
```

---

# Example

```js
createInterval(() => {
  console.log("Heartbeat");
}, 1000);

createInterval(() => {
  console.log("Polling");
}, 2000);

setTimeout(() => {
  clearAllInterval();
}, 5000);
```

---

### Output

```txt
Heartbeat
Polling
Heartbeat
Heartbeat
Polling
...
```

After 5 seconds:

```txt
All intervals stopped
```

---

# Combined Timer Manager (Interview Favourite)

```js
class TimerManager {
  constructor() {
    this.timeouts = new Set();
    this.intervals = new Set();
  }

  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      this.timeouts.delete(id);
      callback();
    }, delay);

    this.timeouts.add(id);

    return id;
  }

  setInterval(callback, delay) {
    const id = setInterval(callback, delay);

    this.intervals.add(id);

    return id;
  }

  clearAllTimeout() {
    this.timeouts.forEach((id) => clearTimeout(id));

    this.timeouts.clear();
  }

  clearAllInterval() {
    this.intervals.forEach((id) => clearInterval(id));

    this.intervals.clear();
  }

  clearAll() {
    this.clearAllTimeout();
    this.clearAllInterval();
  }
}
```

---

# Interview Answer

> JavaScript does not provide native `clearAllTimeout()` or `clearAllInterval()` APIs. The cleanest approach is to maintain timeout and interval IDs in `Set` collections and expose utility methods that iterate through the IDs and clear them. This gives **O(n)** cleanup time, avoids global overrides, prevents memory leaks, and works well with React cleanup (`useEffect` return functions) and component unmount scenarios.

# `clearAllTimeout()` vs `clearAllInterval()`

Although the implementation pattern is very similar, their **purpose, behaviour, and use cases are different**.

---

# Quick Comparison

| Feature             | clearAllTimeout           | clearAllInterval              |
| ------------------- | ------------------------- | ----------------------------- |
| Clears              | One-time timers           | Repeating timers              |
| Used with           | `setTimeout()`            | `setInterval()`               |
| Executes            | Only once                 | Repeatedly                    |
| Common Use Case     | Delayed actions           | Polling, heartbeats           |
| Cleanup Needed      | Before execution          | Always                        |
| Risk if not cleared | Delayed unexpected action | Memory leak / CPU consumption |

---

# 1. Understanding `setTimeout`

A timeout runs **one time only**.

```js
setTimeout(() => {
  console.log("Hello");
}, 3000);
```

Timeline:

```txt
0 sec
 │
 │
 ▼
3 sec
 │
 ▼
Hello
```

After execution:

```txt
Timer automatically removed
```

---

## Why clearAllTimeout?

Suppose:

```js
createTimeout(() => {
  console.log("API Call");
}, 5000);

createTimeout(() => {
  console.log("Send Email");
}, 8000);

createTimeout(() => {
  console.log("Show Popup");
}, 10000);
```

User leaves page.

You don't want:

```txt
API Call
Send Email
Show Popup
```

to execute.

---

```js
clearAllTimeout();
```

removes all pending timeouts.

---

# 2. Understanding `setInterval`

An interval runs forever until cleared.

```js
setInterval(() => {
  console.log("Polling");
}, 1000);
```

Timeline:

```txt
1s -> Polling
2s -> Polling
3s -> Polling
4s -> Polling
5s -> Polling
...
```

Never stops.

---

## Why clearAllInterval?

Suppose:

```js
createInterval(fetchNotifications, 5000);

createInterval(fetchMessages, 3000);

createInterval(fetchDashboard, 10000);
```

User logs out.

Without cleanup:

```txt
API Calls Continue Forever
```

Bad because:

```txt
Network waste
CPU usage
Memory leak
Unexpected updates
```

---

```js
clearAllInterval();
```

stops them immediately.

---

# Real React Example

## Dashboard Polling

```jsx
useEffect(() => {
  createInterval(() => {
    fetchNotifications();
  }, 5000);

  createInterval(() => {
    fetchMessages();
  }, 10000);

  return () => {
    clearAllInterval();
  };
}, []);
```

When component unmounts:

```txt
All polling stops
```

---

# React Example Using Timeouts

Suppose:

```jsx
useEffect(() => {
  createTimeout(() => {
    showSuccessToast();
  }, 2000);

  createTimeout(() => {
    redirectUser();
  }, 4000);

  return () => {
    clearAllTimeout();
  };
}, []);
```

If component unmounts:

```txt
Toast never appears
Redirect never happens
```

---

# Visual Difference

## Timeout

```txt
Create Timer
      │
      ▼
Wait
      │
      ▼
Execute Once
      │
      ▼
Destroyed
```

---

## Interval

```txt
Create Interval
      │
      ▼
Execute
      │
      ▼
Execute
      │
      ▼
Execute
      │
      ▼
Execute
      │
      ▼
Forever
```

Until:

```js
clearInterval(id);
```

---

# Interview Question

## Which one is more dangerous if not cleaned up?

Answer:

```txt
setInterval()
```

Because:

```txt
Timeout
↓
Runs once
↓
Ends
```

But:

```txt
Interval
↓
Runs forever
↓
Consumes resources indefinitely
```

---

# Combined Implementation

```js
class TimerManager {
  constructor() {
    this.timeouts = new Set();
    this.intervals = new Set();
  }

  createTimeout(callback, delay) {
    const id = setTimeout(() => {
      this.timeouts.delete(id);
      callback();
    }, delay);

    this.timeouts.add(id);

    return id;
  }

  createInterval(callback, delay) {
    const id = setInterval(callback, delay);

    this.intervals.add(id);

    return id;
  }

  clearAllTimeout() {
    this.timeouts.forEach((id) => clearTimeout(id));

    this.timeouts.clear();
  }

  clearAllInterval() {
    this.intervals.forEach((id) => clearInterval(id));

    this.intervals.clear();
  }

  clearAll() {
    this.clearAllTimeout();
    this.clearAllInterval();
  }
}
```

---

# Interview Answer (Best)

> **`clearAllTimeout()`** is used to cancel all pending one-time tasks scheduled through `setTimeout()`, whereas **`clearAllInterval()`** is used to stop all repeating tasks scheduled through `setInterval()`. Timeouts automatically disappear after execution, while intervals continue running until explicitly cleared. In React applications, intervals are generally more critical to clean up because they can cause memory leaks, unnecessary API calls, and performance issues after a component unmounts. A common production approach is to maintain timeout and interval IDs in separate `Set` collections and provide utility functions to clear them during cleanup.

**1. Synchronous vs Asynchronous Functions**

* **Synchronous:** Code executes line-by-line in sequential order. The next line is blocked until the current operation finishes (Blocking execution).
* **Asynchronous:** Time-consuming operations (such as API calls, File I/O) run in the background. This keeps the main thread unblocked and allows subsequent code to execute immediately (Non-blocking execution).

---

**2. Callback Functions in Asynchronous Operations**

* **What is a Callback:** A function passed into another function as an argument, intended to be executed after a specific operation is completed.
* **Usage:** Used in asynchronous operations like `setTimeout` or event listeners to process the result once the background task finishes.

---

**3. Promises vs Callbacks (Pros & Cons)**

| Approach     | Pros                             | Cons |
| ------------ | -------------------------------- | ---- |
| **Promises** | • Eliminates "Callback Hell"<br> |

<br>• Improves code readability via `.then()` chaining<br>

<br>• Centralized error handling (`.catch()`) | • Steeper conceptual learning curve<br>

<br>• Requires polyfills for legacy browsers |
| **Callbacks** | • Lightweight and straightforward<br>

<br>• Simple solution for basic event handling | • Deep nesting leads to the "Pyramid of Doom"<br>

<br>• Complex, decentralized error handling across multiple steps |

---

**4. Promise States**

* **Pending:** Initial state (operation is ongoing).
* **Fulfilled (Resolved):** Operation completed successfully with a resolved value.
* **Rejected:** Operation failed with an error or reason.

---

**5. Async/Await & Code Simplification**

* **Async/Await:** Syntactic sugar built directly on top of Promises.
* **Simplification:** Allows asynchronous code to be read and written like synchronous code. Replaces nested `.then()` chaining with direct `await` expressions and standardizes error handling using `try...catch` blocks.

---

**6. Promise.all vs Promise.allSettled**

* **`Promise.all`:** Waits for all input promises to fulfill. If **any single promise rejects**, the entire collection immediately rejects (Fail-fast behavior). Best used when all concurrent operations are mandatory for success.
* **`Promise.allSettled`:** Waits for all promises to settle (whether fulfilled or rejected) and returns an array of objects reflecting the outcome (`{status: 'fulfilled'/'rejected', value/reason}`) for each promise.

---

**7. Microtask Queue**

* The JavaScript Event Loop schedules tasks across two primary queues: the **Macrotask Queue** (e.g., `setTimeout`, `setInterval`) and the **Microtask Queue** (e.g., `Promise.then/catch`, `queueMicrotask`, `MutationObserver`).
* **Priority:** As soon as the call stack empties, the Event Loop drains all pending **Microtasks** before processing any Macrotask.

---

**8. Debouncing vs Throttling**

* **Debouncing:** Delays function execution until a specified period of inactivity has elapsed. If triggered again before the timer expires, the timer resets (e.g., search autocomplete inputs).
* **Throttling:** Limits the execution of a function to at most once per specified time interval, regardless of trigger frequency (e.g., window resizing, infinite scroll listeners).

---

**9. Error Handling in Asynchronous Operations**

* **With Promises:** Appending a `.catch(error => ...)` block at the end of the chain.
* **With Async/Await:** Wrapping asynchronous statements inside a standard `try { ... } catch (error) { ... }` block.

---

**10. Handling Async Data Loading in React**

* **Native Hooks (`useEffect`):** Managing loading, error, and data states with `useState` inside a `useEffect` hook:

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchData()
    .then(res => setData(res))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);

```

* **Modern Data-Fetching Libraries:** Production applications typically rely on dedicated server-state libraries like **TanStack Query (React Query)** or **SWR** for automated caching, background updates, and request deduplication.

---

**11. Testing Asynchronous Code**

* **Testing Libraries (Jest / Vitest):**
* Using `async/await` directly in test suites:

```javascript
test('fetches data correctly', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

```

* Mocking asynchronous calls via `jest.mock()`, `jest.spyOn()`, or API mocking tools like MSW (Mock Service Worker).

### Callback Functions in JavaScript

A **callback function** is a function passed as an argument to another function, and it is typically invoked within the outer function to complete an action. Callbacks are fundamental in JavaScript, particularly when working with asynchronous operations like I/O tasks, API calls, and timers.

---

### Simple Example of Callback Function

```javascript
function callbackFunction(name) {
  console.log("Hello " + name);
}

function outerFunction(callback) {
  let name = prompt("Please enter your name.");
  callback(name);
}

outerFunction(callbackFunction);
```

- **Explanation**:  
  - `callbackFunction(name)` is passed as an argument to `outerFunction`.
  - Inside `outerFunction`, the callback is invoked with the `name` entered by the user.

---

### Why Do We Need Callbacks?

In JavaScript, **callbacks** are used to manage asynchronous behavior. JavaScript is event-driven and non-blocking, which means it can continue executing while waiting for other tasks (like API responses, timers, or user inputs) to complete.

**Example**: Simulating an API call with `setTimeout`.

```javascript
function firstFunction() {
  setTimeout(function () {
    console.log("First function called");
  }, 1000);
}

function secondFunction() {
  console.log("Second function called");
}

firstFunction(); // Call first function
secondFunction(); // Call second function
```

**Output**:
```
Second function called
First function called
```

- **Explanation**:  
  - The `firstFunction` does not block the execution of the second function because it is asynchronous (handled by `setTimeout`).
  - JavaScript continues executing `secondFunction` immediately after calling `firstFunction` without waiting for the `setTimeout` to finish.

---

### Callback Hell (Pyramid of Doom)

When you have multiple callbacks nested within each other, the code becomes difficult to read, maintain, and debug. This is known as **Callback Hell**.

**Example** of Callback Hell:

```javascript
async1(function () {
  async2(function () {
    async3(function () {
      async4(function () {
        console.log("Task completed");
      });
    });
  });
});
```

- **Explanation**:  
  - This kind of nested structure quickly becomes hard to maintain, especially when you have many asynchronous operations.
  - In this case, each asynchronous function calls another function, leading to a pyramid-like structure, which makes the code difficult to follow.

---

### Callback in Callback

Sometimes, you might need to execute actions in sequence, which means calling one callback inside another. This is common when dealing with multiple asynchronous tasks that depend on each other.

**Example**: Loading scripts sequentially with nested callbacks.

```javascript
loadScript("/script1.js", function (script) {
  console.log("First script is loaded");

  loadScript("/script2.js", function (script) {
    console.log("Second script is loaded");

    loadScript("/script3.js", function (script) {
      console.log("Third script is loaded");
      // After all scripts are loaded
    });
  });
});
```

- **Explanation**:  
  - Here, each script is loaded sequentially, one after the other.
  - The next script is loaded only after the previous one has finished, making sure each script executes in order.

---

### Solutions to Callback Hell

- **Promises**: Promises provide a cleaner, more readable way to handle asynchronous tasks.
- **Async/Await**: The `async`/`await` syntax makes asynchronous code look synchronous, which improves readability and reduces nested callbacks.

By understanding and using callbacks effectively, you can handle asynchronous operations in JavaScript. However, for more complex asynchronous workflows, consider using **Promises** or **Async/Await** to avoid callback hell.
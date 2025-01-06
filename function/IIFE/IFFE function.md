Here are examples of IIFEs (Immediately Invoked Function Expressions) with explanations:

---

### 1. **Basic IIFE**
```javascript
(function () {
  console.log("IIFE runs immediately!");
})();
```
**Output:** `IIFE runs immediately!`  
The function executes as soon as it is defined.

---

### 2. **Returning a Value**
```javascript
const result = (function () {
  return 5 + 10;
})();
console.log(result); // Output: 15
```
The IIFE calculates and returns a value directly.

---

### 3. **Passing Arguments**
```javascript
(function (name) {
  console.log(`Hello, ${name}!`);
})("John");
```
**Output:** `Hello, John!`  
Arguments can be passed to the IIFE like any regular function.

---

### 4. **Using IIFE for Data Privacy**
```javascript
const counter = (function () {
  let count = 0; // Private variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
})();

console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
console.log(counter.decrement()); // 0
```
Here, the `count` variable is private and can only be accessed through the returned methods.

---

### 5. **Avoid Polluting Global Scope**
```javascript
(function () {
  const temp = "Temporary variable";
  console.log(temp); // Temporary variable
})();

console.log(typeof temp); // undefined
```
The variable `temp` is not accessible outside the IIFE, avoiding global scope pollution.

---

### 6. **IIFE with Arrow Functions**
```javascript
(() => {
  console.log("Arrow function IIFE");
})();
```
**Output:** `Arrow function IIFE`  
Modern syntax using arrow functions.

---

### 7. **Modules with IIFE**
```javascript
const MathModule = (function () {
  const pi = 3.14159; // Private variable
  return {
    areaOfCircle: (radius) => pi * radius * radius,
    circumference: (radius) => 2 * pi * radius
  };
})();

console.log(MathModule.areaOfCircle(5)); // 78.53975
console.log(MathModule.circumference(5)); // 31.4159
```
This creates a simple module pattern using an IIFE.

---

### 8. **Conditional Execution**
```javascript
(function (env) {
  if (env === "production") {
    console.log("Production mode");
  } else {
    console.log("Development mode");
  }
})("production");
```
**Output:** `Production mode`  
IIFE executes different logic based on the input.

---

### 9. **IIFE with Event Listeners**
```javascript
document.addEventListener("DOMContentLoaded", (function () {
  return function () {
    console.log("DOM fully loaded and parsed");
  };
})());
```
The IIFE returns a function to handle the event.

---

### 10. **Loop Closure with IIFE**
```javascript
for (var i = 0; i < 5; i++) {
  (function (index) {
    setTimeout(() => {
      console.log(`Index: ${index}`);
    }, 1000);
  })(i);
}
```
**Output (after 1 second):**
```
Index: 0
Index: 1
Index: 2
Index: 3
Index: 4
```
The IIFE captures the current value of `i` in each iteration, avoiding closure issues.

---

### 11. **Asynchronous Initialization**
```javascript
(async function () {
  const data = await Promise.resolve("IIFE with async/await");
  console.log(data);
})();
```
**Output:** `IIFE with async/await`  
You can use `async/await` with IIFEs for asynchronous tasks.

---

### 12. **Complex Logic Encapsulation**
```javascript
(function () {
  const start = Date.now();
  for (let i = 0; i < 1e6; i++); // Simulate work
  console.log(`Work completed in ${Date.now() - start}ms`);
})();
```
**Output:** Shows the time taken to complete the loop, encapsulated in an IIFE.

---

### 13. **Chaining IIFE with Method Calls**
```javascript
const chainable = (function () {
  return {
    method1: () => {
      console.log("Method 1");
      return chainable;
    },
    method2: () => {
      console.log("Method 2");
      return chainable;
    }
  };
})();

chainable.method1().method2();
```
**Output:**
```
Method 1
Method 2
```
An IIFE initializes and provides a chainable interface.

---

### Advantages of IIFE
1. **Data Privacy:** Variables inside the IIFE are not accessible outside.
2. **Immediate Execution:** Runs as soon as defined.
3. **Avoids Global Scope Pollution:** Keeps code clean and avoids conflicts.
4. **Encapsulation:** Groups logic for better modularity.


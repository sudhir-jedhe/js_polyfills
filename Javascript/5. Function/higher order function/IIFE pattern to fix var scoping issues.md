The **IIFE (Immediately Invoked Function Expression)** pattern was the standard pre-ES6 technique to fix `var` scoping issues by exploiting the fact that `var` is **function-scoped**, even though it ignores block scope (`if`, `for`, `{}`).

Wrapping code in a function creates an isolated execution context and captures variable values by value across iterations and blocks.

---

### 1. Fixing the Classic Asynchronous Loop Trap

#### The Problem: Shared Mutable Variable

Because `var` ignores the `for` loop block, all asynchronous callbacks share the exact same variable `i` in memory, logging the final incremented value.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // Logs: 3, 3, 3
  }, 100);
}

```

#### The IIFE Fix: Per-Iteration Scope

Wrapping the inside of the loop in an IIFE and passing `i` as an argument creates a fresh function scope with an independent parameter `j` for each iteration.

```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    // `j` is local to this specific function execution context
    setTimeout(function () {
      console.log(j); // Logs: 0, 1, 2
    }, 100);
  })(i); // Pass current `i` by value
}

```

---

### 2. Preventing Global Scope Pollution & Leaks

#### The Problem: `var` Leaks Out of Blocks

In vanilla scripts, declaring `var` inside conditional blocks leaks variables directly to the global object (`window` / `globalThis`), risking accidental collisions.

```javascript
// Global scope
if (true) {
  var userRole = 'admin'; // Pollutes the global namespace
}

console.log(window.userRole); // 'admin'

```

#### The IIFE Fix: Data Encapsulation

An IIFE forms an impenetrable boundary around variables, keeping helper variables private and exposing only what is needed.

```javascript
(function () {
  var userRole = 'admin'; // Contained within the IIFE
  console.log('Inside IIFE:', userRole); // 'admin'
})();

console.log(typeof userRole); // 'undefined' (Global remains clean)

```

---

### 3. Syntax Variations

```javascript
// 1. Standard Parentheses Wrapper
(function () {
  /* code */
})();

// 2. Trailing Invocation inside Wrapper
(function () {
  /* code */
}());

// 3. Unary Operator Shortcut (often used by minifiers)
!(function () {
  /* code */
})();
+(function () {
  /* code */
})();

```

---

### Modern Replacement: ES6 Block Scoping

In modern JavaScript (ES6+), `let` and `const` provide native block scoping, eliminating the need for IIFEs in loops and blocks:

```javascript
// Modern standard: `let` creates a distinct binding per loop iteration automatically
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs: 0, 1, 2
}

```

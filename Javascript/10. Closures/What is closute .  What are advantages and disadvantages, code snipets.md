*** copy What is closute .  What are advantages and disadvantages, code snipets.md ***

A **closure** is the combination of a function bundled together with references to its surrounding state (lexical environment). In JavaScript, a closure gives an inner function access to an outer function's scope even after the outer function has finished executing and returned.

---

**Advantages & Disadvantages**

* **Advantages:**
* **Data Privacy / Encapsulation:** Emulates private variables and methods without exposing them to the global scope.
* **State Preservation:** Retains state across multiple function invocations without polluting global state.
* **Functional Programming Patterns:** Enables currying, partial application, and function factories.

* **Disadvantages:**
* **Memory Consumption:** Variables referenced in a closure cannot be garbage collected as long as the inner function is reachable.
* **Memory Leaks:** Careless retention of closures (e.g., in event listeners or timers) can hold onto large DOM nodes or objects.
* **Debugging Complexity:** Deeply nested scopes can make stack traces and variable inspection harder to trace.

---

**Code Examples**

**1. Data Encapsulation (Private State)**

```javascript
function createCounter() {
  let count = 0; // Private variable, not accessible directly outside

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.count);       // undefined (encapsulated)
console.log(counter.getCount());  // 2

```

**2. Function Factory (Currying)**

```javascript
function createMultiplier(multiplier) {
  // `multiplier` is retained in the closure
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

```

**3. Classic Pitfall (Stale State / Loop Scope)**

```javascript
// ❌ Issue with `var` (no block scope, single shared variable):
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(`var: ${i}`), 100);
}
// Output: 4, 4, 4

// ✅ Solution with `let` (creates a new lexical scope per iteration):
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(`let: ${i}`), 100);
}
// Output: 1, 2, 3

```

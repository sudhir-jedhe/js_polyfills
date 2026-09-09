***  Lexical Scope (Static Scope).md ***

**Lexical Scope** (also known as **Static Scope**) means that variable scope is determined by the **physical placement of functions and blocks in the source code at author time**, not where or how they are called at runtime.

In a lexically scoped language like JavaScript, an inner function always has access to the variables declared in its outer (enclosing) parent scopes, based strictly on where the function is defined in the source file.

---

### How It Works: Definition Site vs. Call Site

The engine resolves identifiers by looking at where the function was **written**, completely ignoring the runtime call stack:

```javascript
const x = "Global x";

function printX() {
  // Resolved lexically to the outer (Global) scope where printX was defined
  console.log(x);
}

function caller() {
  const x = "Caller local x";
  printX(); // Invoked here, but still resolves to the definition site
}

caller(); // Logs: "Global x" (NOT "Caller local x")

```

* In **Lexical Scope (JavaScript):** `printX()` prints `"Global x"` because its parent scope at write-time is the Global Scope.
* In a **Dynamic Scope** language (like Bash or early Lisp dialects), `printX()` would print `"Caller local x"` because it would resolve variables using the runtime call stack.

---

### The Scope Chain Lookup

When the JavaScript engine evaluates an identifier inside a scope:

1. It checks the local **Environment Record**.
2. If not found, it traverses the **outer reference pointer** (`[[Scopes]]`) up to the parent lexical scope.
3. It continues ascending up the chain until it reaches the Global Scope.
4. If still not found, it throws a `ReferenceError`.

```
┌────────────────────────────────────────────────────────┐
│ Global Scope (outermost)                               │
│   const appName = "Dashboard";                         │
│                                                        │
│   ┌──────────────────────────────────────────────────┐ │
│   │ outerFunction()                                  │ │
│   │   const user = "Alex";                           │ │
│   │                                                  │ │
│   │   ┌────────────────────────────────────────────┐ │ │
│   │   │ innerFunction()                            │ │ │
│   │   │   const action = "login";                  │ │ │
│   │   │   // Can access: action, user, appName     │ │ │
│   │   └────────────────────────────────────────────┘ │ │
│   │                                                  │ │
│   │   // Can access: user, appName (NOT action)      │ │
│   └──────────────────────────────────────────────────┘ │
│                                                        │
│   // Can access: appName (NOT user, NOT action)        │
└────────────────────────────────────────────────────────┘

```

> **One-Way Visibility:** Outer scopes can never look down into inner scopes, but inner scopes can always look up into enclosing outer scopes.

---

### Why Lexical Scope Makes Closures Possible

Because a function remembers its lexical environment via an internal reference (`[[Scopes]]`), it retains access to those outer variables **even after the outer function has finished executing and was popped off the call stack**:

```javascript
function createMultiplier(factor) {
  // `factor` is preserved in the returned function's lexical scope
  return function (num) {
    return num * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

```

---

### Lexical Scope vs. Dynamic `this`

A common source of confusion in JavaScript is mixing up variable resolution with `this`:

| Mechanism                             | Resolution Rule     | Behavior                                                                                       |
| ------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| **Variables (`let`, `const`, `var`)** | **Lexical Scope**   | Fixed at **author/write time** based on code structure.                                        |
| **Regular Function `this**`           | **Dynamic Context** | Depends on **how/where the function is invoked** at runtime (`obj.fn()`, `call()`, `apply()`). |
| **Arrow Function `this**`             | **Lexical `this**`  | Inherits `this` from the enclosing lexical parent scope.                                       |

```javascript
const person = {
  name: "Sam",
  // Regular function: dynamic this
  regularGreet: function () {
    console.log(this.name);
  },
  // Arrow function: lexical this (inherits enclosing scope, e.g. global/module)
  arrowGreet: () => {
    console.log(this.name);
  },
};

person.regularGreet(); // "Sam"
person.arrowGreet();   // undefined (or window.name)

```

---

### Key Takeaways

* **Static Analysis:** Compilers and JIT engines (like V8) optimize variable access at compile-time into fixed memory offsets because scope chains never change at runtime.
* **Lexical nesting:** An inner block or function always has access to all variables defined in its outer ancestor scopes.
* **Predictability:** You can determine the exact scope and value of any identifier simply by reading the source code structure.

*** copy JavaScript is a dynamically typed language..md ***

**JavaScript is a dynamically typed language.**

In JavaScript, types are associated with **values**, not variables. You do not declare variable types explicitly, and a variable can hold different data types over its lifecycle at runtime.

---

### Key Differences

| Feature                | Dynamic Typing (JavaScript)              | Static Typing (TypeScript, Java, C++)       |
| ---------------------- | ---------------------------------------- | ------------------------------------------- |
| **Type Checking Time** | At runtime (while code runs)             | At compile time (before code runs)          |
| **Variable Binding**   | Variables can change types freely        | Variables are locked to their declared type |
| **Declaration**        | `let x = 10; x = "hello";` (Valid)       | `int x = 10; x = "hello";` (Compile Error)  |
| **Error Detection**    | Type mismatches surface during execution | Caught early during compilation/IDE check   |

---

### Example in JavaScript

```javascript
let data = 42;          // data is a Number
data = "Frontend";      // Reassigned to a String (Valid)
data = { id: 1 };       // Reassigned to an Object (Valid)

```

To add **static typing** to JavaScript projects, developers use **TypeScript**, a typed superset of JavaScript that compiles down to plain JavaScript.

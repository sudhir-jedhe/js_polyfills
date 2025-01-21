The **Temporal Dead Zone (TDZ)** is a concept in JavaScript that occurs with variables declared using `let`, `const`, and `class`. It refers to the period of time between the **beginning of the scope** of a variable and the point where it is **declared and initialized**.

During this period, the variable cannot be accessed and will throw a `ReferenceError` if you attempt to do so.

---

### Example of the Temporal Dead Zone:

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 10;
```

### Why Does This Happen?
When JavaScript executes code, it performs a two-phase process:

1. **Memory Creation Phase (Hoisting):**
   - The engine allocates memory for all variables, functions, and block-scoped declarations (`let`, `const`, `class`) in their respective scopes.
   - Variables declared with `let` and `const` are **hoisted**, but they are not initialized. Instead, they are placed in the **uninitialized state** in the TDZ.

2. **Execution Phase:**
   - Variables and functions are executed line by line.
   - Accessing a variable in the TDZ before initialization leads to a `ReferenceError`.

---

### Key Points About TDZ:
1. **Variables declared with `let` and `const` have a TDZ:**
   - They are not accessible before their declaration.
   - This is done to prevent using variables before they are declared.

2. **Function declarations are not affected by TDZ:**
   - They are hoisted and initialized, so you can call them before their definition.

3. **Block Scope and TDZ:**
   - The TDZ exists within the block scope where the variable is declared.

---

### Example Demonstrating TDZ:
```javascript
{
  // TDZ starts here for 'y' and 'z'
  console.log(y); // ReferenceError
  console.log(z); // ReferenceError
  
  let y = 5;      // TDZ ends here for 'y'
  const z = 10;   // TDZ ends here for 'z'
  
  console.log(y); // 5
  console.log(z); // 10
}
```

---

### TDZ with Function Parameters and Default Values:
The TDZ also applies when using `let` or `const` variables in default parameter initializations:

```javascript
let a = 100;

function example(x = a) {
  let a = 10; // 'a' in this scope is in the TDZ
  return x;   // ReferenceError: Cannot access 'a' before initialization
}

example();
```

Here, the `let a = 10` shadows the outer `a = 100`, but because the inner `a` is not yet initialized, it causes a `ReferenceError`.

---

### Purpose of the TDZ:
- **Helps prevent logical errors:** By disallowing the use of uninitialized variables, TDZ makes the code more predictable and safer.
- **Encourages better coding practices:** Variables and constants must be explicitly initialized before use.

---

Let me know if you'd like further clarifications or examples!
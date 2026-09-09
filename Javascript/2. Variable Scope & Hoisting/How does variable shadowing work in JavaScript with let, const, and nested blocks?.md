***  How does variable shadowing work in JavaScript with let, const, and nested blocks?.md ***

**Variable Shadowing** occurs when a variable declared within an inner scope (such as a block or function) shares the exact same name as a variable declared in an outer scope.

The inner variable **"shadows" (hides)** the outer variable within that block. While executing inside the inner block, the JavaScript engine resolves the identifier to the local variable, leaving the outer variable untouched.

---

### Basic Mechanism with `let` and `const`

Because `let` and `const` are **block-scoped**, each pair of curly braces `{ ... }` creates a distinct lexical environment:

```javascript
const name = "Global Scope";

{
  // Inner block scope shadows the outer `name`
  const name = "Inner Block Scope";
  console.log("Inside block:", name); // "Inside block: Inner Block Scope"
}

console.log("Outside block:", name); // "Outside block: Global Scope"

```

---

### Nested Multi-Level Shadowing

When scopes are nested multiple layers deep, identifier lookup traverses the scope chain from inside out, stopping at the first match it finds:

```javascript
let count = 10; // Outer / Global

if (true) {
  let count = 20; // Shadows global `count`
  console.log("Level 1:", count); // 20

  if (true) {
    let count = 30; // Shadows Level 1 `count`
    console.log("Level 2:", count); // 30
  }

  console.log("Back to Level 1:", count); // 20
}

console.log("Back to Global:", count); // 10

```

---

### Function Parameter Shadowing

Function arguments create their own scope between the outer scope and the function body:

```javascript
const user = "Alice";

function greet(user) {
  // The parameter `user` shadows the outer `user`
  console.log("Hello,", user);
}

greet("Bob"); // "Hello, Bob"
console.log("Current user:", user); // "Current user: Alice"

```

---

### Shadowing vs. Illegal Shadowing

#### 1. Legal Shadowing (Valid)

You can shadow a `var` with a `let`/`const` inside a nested block because the inner block creates a boundary that prevents collision:

```javascript
var status = "active";

if (true) {
  let status = "pending"; // ✅ Legal: Scoped strictly to this block
  console.log(status);   // "pending"
}

console.log(status);     // "active"

```

#### 2. Illegal Shadowing (SyntaxError)

You **cannot** shadow a `let` or `const` using a `var` within the same or nested block if the `var` hoists past the boundary into the same function/global scope:

```javascript
let score = 100;

if (true) {
  // ❌ SyntaxError: Identifier 'score' has already been declared
  var score = 50; 
}

```

* **Why it fails:** `var` ignores the `if` block boundary and attempts to hoist to the enclosing function/global scope where `let score` is already bound in the same lexical environment.

---

### Shadowing and the Temporal Dead Zone (TDZ)

When an inner variable shadows an outer one, the engine binds the identifier to the inner scope immediately during the parsing phase. If you try to access the variable inside the inner block *before* its declaration line, it hits the **TDZ**—it will **not** fall back to the outer variable:

```javascript
const value = "Outer Value";

{
  // ❌ ReferenceError: Cannot access 'value' before initialization
  console.log(value); 

  const value = "Inner Value"; // Declaration hoists locally to top of this block
}

```

---

### Summary Rules

| Feature                      | Behavior                                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Scope Resolution**         | Engine resolves the closest variable in the lexical scope chain.                                            |
| **Outer State Modification** | Outer variables remain unchanged by assignments to the shadowed inner variable.                             |
| **Re-declaration Boundary**  | `let`/`const` can shadow any outer variable across `{ ... }` blocks.                                        |
| **`var` Crossing `let**`     | `var` inside a block cannot shadow a parent `let`/`const` (Throws `SyntaxError`).                           |
| **TDZ Enforcement**          | Inner declaration hoists to the top of its block, shadowing the outer variable throughout the entire block. |

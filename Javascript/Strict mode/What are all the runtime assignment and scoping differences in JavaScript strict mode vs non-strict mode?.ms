JavaScript strict mode (`"use strict";`) fundamentally alters runtime variable lookup, assignment semantics, property mutation, and scope evaluation to eliminate silent errors and optimize engine execution.

---

### Core Assignment & Scoping Differences Matrix

| Operation / Feature | Non-Strict Mode (Sloppy) | Strict Mode (`"use strict";`) |
| --- | --- | --- |
| **Assigning to Undeclared Variable** | Creates implicit global property on `globalThis` | Throws **`ReferenceError`** |
| **Writing to Non-Writable Property** | Silently ignored (fails quietly) | Throws **`TypeError`** |
| **Writing to Getter-Only Property** | Silently ignored (fails quietly) | Throws **`TypeError`** |
| **Adding Props to Non-Extensible Object** | Silently ignored (fails quietly) | Throws **`TypeError`** |
| **Deleting Non-Configurable Properties** | Returns `false` (fails quietly) | Throws **`TypeError`** |
| **Deleting Plain Identifiers (`delete x`)** | Syntax valid (returns `false` for declared vars) | **`SyntaxError`** at parse time |
| **Duplicate Function Parameter Names** | Allowed (last parameter overrides earlier ones) | **`SyntaxError`** at parse time |
| **`this` in Bare Function Invocations** | Coerced/boxed to Global Object (`window`/`global`) | Preserved as **`undefined`** |
| **`eval()` Lexical Scoping** | Injects variables into caller's outer scope | Creates its own isolated private scope |
| **`arguments` Object Aliasing** | Mutating parameter updates `arguments` (and vice-versa) | Arguments and parameters are decoupled |
| **The `with` Statement** | Allowed | **`SyntaxError`** (completely disabled) |
| **Reserved Keywords as Identifiers** | `implements`, `interface`, `let`, `package`, etc. allowed as `var` names | **`SyntaxError`** (strictly reserved) |

---

### 1. Variable Assignment & Global Pollution

In non-strict mode, failing to declare a variable creates an implicit property on the global object. Strict mode enforces explicit declarations.

```javascript
// Non-Strict Mode
function sloppy() {
  leakedVar = 42; // Becomes window.leakedVar / globalThis.leakedVar
}
sloppy();
console.log(globalThis.leakedVar); // 42

// Strict Mode
function strict() {
  "use strict";
  leakedVar = 42; // ❌ ReferenceError: leakedVar is not defined
}

```

---

### 2. Silent Mutation Failures Become Explicit Errors

Strict mode turns operations that fail silently into hard `TypeError` exceptions.

```javascript
"use strict";

// 1. Non-writable property assignment
const obj = {};
Object.defineProperty(obj, "readOnly", { value: 10, writable: false });
// obj.readOnly = 20; // ❌ TypeError: Cannot assign to read only property

// 2. Getter-only assignment
const user = { get name() { return "Alice"; } };
// user.name = "Bob"; // ❌ TypeError: Cannot set property name of #<Object> which has only a getter

// 3. Non-extensible object mutation
const sealed = Object.preventExtensions({});
// sealed.newProp = "test"; // ❌ TypeError: Cannot add property newProp, object is not extensible

// 4. Deleting non-configurable property
const locked = {};
Object.defineProperty(locked, "id", { value: 1, configurable: false });
// delete locked.id; // ❌ TypeError: Cannot delete property 'id' of #<Object>

```

---

### 3. Syntax & Identifier Deletion

In non-strict mode, attempting to delete an unqualified identifier is allowed (though it returns `false` for declared bindings). In strict mode, it is an immediate syntax error.

```javascript
// Non-Strict
var a = 1;
delete a; // returns false

// Strict Mode
"use strict";
var b = 2;
// delete b; // ❌ SyntaxError: Delete of an unqualified identifier in strict mode.

```

---

### 4. `this` Binding in Regular Functions

In non-strict mode, calling a plain function without a caller context (`foo()`) defaults `this` to `window` (or `global` in Node.js). In strict mode, `this` remains `undefined`.

```javascript
// Non-Strict
function getThisSloppy() {
  return this; // returns window / globalThis
}

// Strict Mode
function getThisStrict() {
  "use strict";
  return this; // undefined
}

console.log(getThisStrict()); // undefined

```

---

### 5. `eval()` Scope Isolation

In non-strict mode, `eval()` executes within the caller's execution context, dynamically injecting new variables into the surrounding function or global scope. Strict mode introduces a dedicated local scope for `eval()`.

```javascript
// Non-Strict Mode
function testEvalSloppy() {
  eval("var injected = 'I am here';");
  console.log(injected); // "I am here" (Scope polluted)
}
testEvalSloppy();

// Strict Mode
function testEvalStrict() {
  "use strict";
  eval("var injected = 'I am here';");
  // console.log(injected); // ❌ ReferenceError: injected is not defined
}
testEvalStrict();

```

---

### 6. Arguments Object Decoupling (No Aliasing)

In non-strict mode, the elements of the `arguments` object are two-way linked (aliased) to the named formal parameters. In strict mode, the link is broken.

```javascript
// Non-Strict Mode
function sloppyArgs(a) {
  a = 99;
  console.log(arguments[0]); // 99 (Parameter mutation mutated arguments[0])
}
sloppyArgs(10);

// Strict Mode
function strictArgs(a) {
  "use strict";
  a = 99;
  console.log(arguments[0]); // 10 (Remains the original passed value)
}
strictArgs(10);

```

Furthermore, accessing `arguments.callee` or `arguments.caller` throws a `TypeError` in strict mode to assist engine inlining and optimization.

---

### 7. Parameter Uniqueness

```javascript
// Non-Strict Mode (Allowed: second 'x' shadows the first)
function add(x, x) {
  return x + x; // Uses the second parameter
}

// Strict Mode
function addStrict(x, x) {
  "use strict";
  // ❌ SyntaxError: Duplicate parameter name not allowed in this context
}

```

---

### Automatic Strict Mode in Modern JavaScript

Modern JavaScript environments execute in strict mode by default inside:

1. **ES Modules** (`<script type="module">`, `.mjs`, or `package.json` with `"type": "module"`).
2. **Class Bodies** (both `class` declarations and expressions).
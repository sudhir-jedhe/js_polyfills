***  Property Descriptor.md ***

To verify why `delete globalThis.x` fails, let us inspect the internal property descriptor created when declaring top-level `var` statements:

```javascript
var x = 10;
console.log(globalThis.x); // 10
delete globalThis.x;       // returns false (Fails to delete)
console.log(globalThis.x); // 10 (Still exists)

```

---

### Step-by-Step Breakdown

1. **Top-Level `var` Attaches to the Global Object:**

* In global script scope, declaring `var x = 10` creates an instantiated property on the Global Object (`window` in browsers, `global` in Node.js global scripts, accessible universally via `globalThis`).

1. **The `configurable: false` Property Descriptor:**

* When JavaScript declares a variable using `var` at the top level, the engine creates the property on `globalThis` with its internal attribute **`configurable: false`**.
* We can inspect this with `Object.getOwnPropertyDescriptor`:

```javascript
Object.getOwnPropertyDescriptor(globalThis, 'x');
// {
//   value: 10,
//   writable: true,
//   enumerable: true,
//   configurable: false  <--- Prevents deletion
// }

```

1. **How `delete` Evaluates `configurable: false`:**

* The `delete` operator is designed to only remove properties whose `configurable` descriptor is `true`.
* When attempting `delete globalThis.x`:
* In **non-strict mode**: The operation fails silently and returns **`false`**.
* In **strict mode** (`"use strict";`): The operation throws a **`TypeError: Cannot delete property 'x' of #<Object>`**.

---

### Comparison: Declared Variable vs. Direct Property Assignment

```javascript
// 1. Declared with var (Non-configurable)
var a = 1;
delete globalThis.a; // false
console.log(globalThis.a); // 1

// 2. Assigned directly as a property (Configurable)
globalThis.b = 2;
delete globalThis.b; // true
console.log(globalThis.b); // undefined

// 3. Declared with let / const (Not attached to globalThis at all)
let c = 3;
console.log(globalThis.c); // undefined (Stored in Declarative Environment Record)

```

---

### Environment Context Note

* **Browser Global Scripts:** `var x = 10` attaches to `window` / `globalThis` as a non-configurable property.
* **ES Modules (`<script type="module">` or `.mjs`) / Node.js CommonJS files:** Top-level variables are scoped to the **module itself**, so `var x = 10` does not attach to `globalThis` at all (`globalThis.x` evaluates to `undefined`).

---

Your code snippet, output annotations, and description that the deletion fails are **completely correct**.

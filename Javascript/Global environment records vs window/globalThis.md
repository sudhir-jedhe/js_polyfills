*** copy globalThis.md ***

The difference between the **Global Environment Record** and the **Global Object (`window` / `globalThis`)** comes down to specification architecture:

The **Global Object** is a physical JavaScript object with properties, while the **Global Environment Record** is an internal engine structure that dictates how bare identifier lookups (`x`) are resolved at the top level.

---

### Structural Architecture

In ECMAScript, the **Global Environment Record** is a composite record containing two sub-records:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Global Environment Record                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. [[DeclarativeRecord]] (Script-Level Lexical Scope)                 │
│     • Stores: `let`, `const`, `class`                                  │
│     • Backed by: Internal memory slots (NOT properties on globalThis)  │
│     • Lookup Priority: 1st (Checked before the global object)          │
│                                                                        │
│  2. [[ObjectRecord]] (Global Object Wrapper)                           │
│     • Wraps: `window` / `globalThis` (Physical Object)                 │
│     • Stores: `var`, top-level `function`, built-ins (Math, Array)     │
│     • Lookup Priority: 2nd (Fallback if not in Declarative Record)     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

```

---

### Core Behavioral Differences

#### 1. Visibility on `globalThis` / `window`

* Top-level `var` and `function` declarations mutate properties directly on `globalThis` because they are bound via the `[[ObjectRecord]]`.
* Top-level `let`, `const`, and `class` declarations live purely inside the `[[DeclarativeRecord]]` and are **never** attached to `globalThis`.

```javascript
var a = 1;
let b = 2;
const c = 3;

// Lookups via bare identifiers (searches Global Environment Record):
console.log(a); // 1
console.log(b); // 2
console.log(c); // 3

// Lookups via property access on Global Object:
console.log(globalThis.a); // 1 (Present via Object Record)
console.log(globalThis.b); // undefined (Hidden in Declarative Record)
console.log(globalThis.c); // undefined (Hidden in Declarative Record)

```

---

#### 2. Precedence and Shadowing

When evaluating an identifier (e.g., `value`), the engine searches the `[[DeclarativeRecord]]` **first**. If a match is found, it uses it and never inspects the Global Object.

```javascript
// Built-in property on globalThis:
// globalThis.fetch -> [Function: fetch]

// Declaring a lexical binding with the same name:
const fetch = "custom-fetch-string";

// 1. Bare identifier resolves to Declarative Record (Shadows global property)
console.log(fetch); // "custom-fetch-string"

// 2. Explicit object property lookup still reaches the Global Object
console.log(globalThis.fetch); // [Function: fetch]

```

---

#### 3. TDZ Isolation vs. Property Fallback

If an uninitialized `let` or `const` is in its Temporal Dead Zone (TDZ), accessing the bare identifier throws a **`ReferenceError`** immediately. The engine does **not** fall back to the property on `globalThis`.

```javascript
globalThis.status = "ready";

function check() {
  // Accessing bare identifier 'status'
  console.log(status); // ❌ ReferenceError: Cannot access 'status' before initialization
  
  let status = "loading";
}
check();

```

---

#### 4. Deletability via `delete`

* Properties on `globalThis` created by implicit assignments (`x = 10`) have descriptor `{ configurable: true }` and can be deleted via `delete globalThis.x`.
* Properties created by top-level `var` have `{ configurable: false }` and return `false` on `delete`.
* Bindings in the `[[DeclarativeRecord]]` (`let`, `const`) are not object properties at all; attempting `delete identifier` is a compile-time **`SyntaxError`** in strict mode (or returns `false` in non-strict mode).

---

### Side-by-Side Comparison

| Feature             | Global Environment Record                                                   | `window` / `globalThis` (Global Object)                            |
| ------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Nature**          | Internal spec data structure for scope resolution                           | Physical JavaScript object instance on heap                        |
| **Contains**        | Both Lexical (`let`/`const`) and Object (`var`/built-ins) bindings          | Only `var`, top-level `function`, and direct object properties     |
| **Direct Access**   | Accessible only via bare identifiers (`x`)                                  | Accessible via property syntax (`globalThis.x`) or bare names      |
| **Modules / ESM**   | Top-level module code gets a `ModuleEnvironmentRecord` (no global bindings) | Remains globally shared across all modules                         |
| **Prototype Chain** | No prototype; root environment record                                       | Inherits from `Object.prototype` (in browsers, `Window.prototype`) |

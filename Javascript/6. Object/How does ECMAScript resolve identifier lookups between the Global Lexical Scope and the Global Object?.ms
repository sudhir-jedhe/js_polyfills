In the ECMAScript specification, identifier resolution in the global scope is governed by the **Global Environment Record**.

Unlike function or block environment records, the Global Environment Record is a **composite structure** that wraps two distinct underlying records:

1. **Declarative Environment Record (`[[DeclarativeRecord]]`)**: Holds top-level lexical bindings (`let`, `const`, `class`, `import`).
2. **Object Environment Record (`[[ObjectRecord]]`)**: Wraps the **Global Object** (`window` / `globalThis`) and holds legacy bindings (`var`, top-level `function` declarations, built-ins like `Math`, and implicit globals).

---

### The Global Environment Record Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Global Environment Record                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. [[DeclarativeRecord]] (Checked FIRST)                             │
│     • let a = 10;                                                      │
│     • const b = 20;                                                    │
│     • class MyClass {}                                                 │
│     (Isolated lexical storage — NOT exposed on globalThis)             │
│                                                                        │
│  2. [[ObjectRecord]] (Checked SECOND / Fallback)                       │
│     • Wraps the physical Global Object (`window` / `globalThis`)       │
│     • var c = 30;                                                      │
│     • function fn() {}                                                 │
│     • Built-ins: parseInt, Object, Math                                │
│     • Implicit globals: x = 99;                                        │
│                                                                        │
│  3. [[OuterEnv]]: null (Root of the entire scope chain)               │
└────────────────────────────────────────────────────────────────────────┘

```

---

### Lookup Algorithm: `GetBindingValue(name)`

When code references a bare identifier (e.g., `console.log(foo)`), the engine resolves it via the abstract specification operation **`GlobalEnvRec.GetBindingValue(N, S)`**:

1. **1. Query the Declarative Record First:**
The engine checks `[[DeclarativeRecord]].HasBinding(N)`. If a `let`, `const`, or `class` with that name exists:

* If initialized, it immediately returns the value.
* If still in the **Temporal Dead Zone (TDZ)**, it throws a `ReferenceError`.
* **Search stops here**—it never falls through to the Object Record.


2. **2. Query the Object Record (Global Object):**
If not found in the Declarative Record, the engine falls back to `[[ObjectRecord]].HasBinding(N)`.

* It checks if `name` exists as a property on `globalThis` (including inherited prototype properties on `Object.prototype`).
* If found, it returns the property value.


3. **3. Handle Unresolved Reference:**
If neither record contains the identifier:

* In read operations: Throws `ReferenceError: N is not defined`.
* In non-strict assignment (`N = 1`): Sets `globalThis.N = 1` on the Global Object.


---

### Concrete Scenarios & Shadowing Behavior

#### 1. Lexical Declarations Shadow Global Object Properties

Because the Declarative Record is checked first, a top-level `let` or `const` shadows any property on `globalThis` with the same name:

```javascript
// Built-in on globalThis:
// globalThis.parseInt -> function parseInt() { ... }

let parseInt = "I am a string";

console.log(parseInt);            // "I am a string" (Resolved from Declarative Record)
console.log(globalThis.parseInt); // [Function: parseInt] (Accessed explicitly via object)

```

#### 2. TDZ Prevents Fallback to Global Object

If a lexical binding exists, the engine will **never** fall through to the Global Object, even if the identifier is accessed before initialization:

```javascript
window.count = 42; // Property on the Global Object

function test() {
  console.log(count); // ❌ ReferenceError: Cannot access 'count' before initialization
  let count = 100;    // Exists in Declarative Record (TDZ active above this line)
}
test();

```

The engine finds `count` in the Declarative Record, sees that it is uninitialized (in the TDZ), and throws an immediate error instead of falling back to `window.count`.

#### 3. Global Collision Rules at Parse Time

ECMAScript enforces strict duplicate prevention when mixing `var` and `let`/`const` at the top level:

```javascript
var x = 1;
let x = 2; 
// ❌ SyntaxError: Identifier 'x' has already been declared

```

During script initialization, `CanDeclareGlobalVar` and `CanDeclareGlobalFunction` ensure that a global `var` or `function` cannot be declared if a binding of the same name already exists in the `[[DeclarativeRecord]]`.

---

### Comparison: Declarative vs. Object Record Storage

| Attribute | `[[DeclarativeRecord]]` | `[[ObjectRecord]]` |
| --- | --- | --- |
| **Declaration Keywords** | `let`, `const`, `class`, `import` | `var`, top-level `function`, legacy globals |
| **Backing Storage** | Internal engine heap/stack slots | Properties on `globalThis` / `window` |
| **Reflected on `window`/`globalThis**` | ❌ No (`window.a` is `undefined`) | ✅ Yes (`window.a` equals value) |
| **Lookup Precedence** | **Highest (1st)** | **Fallback (2nd)** |
| **Deletable via `delete**` | ❌ No (SyntaxError in strict mode) | `var` $\rightarrow$ No (`configurable: false`)<br>

<br>Implicit $\rightarrow$ Yes (`configurable: true`) |
*** copy Global property deletion vs declared variable deletion.md ***

The difference comes down to the **`configurable`** attribute in the underlying ECMAScript property descriptor: **`var` declarations create non-configurable properties**, while **implicit assignments create standard configurable properties**.

---

### Inspecting the Property Descriptors

When you inspect the global object (`window` or `globalThis`) using `Object.getOwnPropertyDescriptor()`, the distinction is immediately visible:

```javascript
// 1. Declared global variable
var x = 5;

// 2. Implicit global (assignment without declaration)
y = 5;

console.log(Object.getOwnPropertyDescriptor(globalThis, 'x'));
// { value: 5, writable: true, enumerable: true, configurable: false } ◄── Cannot be deleted

console.log(Object.getOwnPropertyDescriptor(globalThis, 'y'));
// { value: 5, writable: true, enumerable: true, configurable: true }  ◄── Can be deleted

```

---

### How the `delete` Operator Interacts with `configurable`

The `delete` operator calls the object's internal **`[[Delete]](propertyKey)`** method:

```javascript
delete globalThis.x; // returns false (x remains 5)
delete globalThis.y; // returns true  (y is permanently removed)

console.log(globalThis.x); // 5
console.log(globalThis.y); // undefined

```

1. **For `x` (`configurable: false`):** The engine prevents removal, returns `false` in non-strict mode, and throws a `TypeError` in strict mode.
2. **For `y` (`configurable: true`):** The engine removes the property from the object map and returns `true`.

---

### Specification Mechanism: `CreateGlobalVarBinding` vs. `[[Set]]`

```
┌─────────────────────────────────────────────────────────────┐
│ 1. `var x = 5;` (Global Declaration)                        │
│    • Evaluated during Global Environment Record setup       │
│    • Calls `CreateGlobalVarBinding(name, deletable = false)` │
│    • Sets `configurable: false` on the Global Object        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. `y = 5;` (Implicit Assignment)                           │
│    • Evaluated at runtime execution                         │
│    • Scope lookup fails, triggers `[[Set]]( "y", 5 )`        │
│    • Sets `configurable: true` (standard dynamic property)  │
└─────────────────────────────────────────────────────────────┘

```

* **`var` at Global Scope:** During script initialization, the engine registers top-level variables via the abstract operation `CreateGlobalVarBinding(name, deletable)`. For top-level `var` statements, `deletable` is explicitly hardcoded to **`false`**.
* **Implicit Global:** Because there is no declaration, the runtime performs a standard property set (`globalThis['y'] = 5`). Plain property additions default to `{ configurable: true, enumerable: true, writable: true }`.

---

### What About `let` and `const`?

Variables declared with `let` or `const` at the top level are stored in the **Declarative Environment Record**, not as properties on the global object (`globalThis` / `window`):

```javascript
let z = 5;

console.log(globalThis.z); // undefined
delete z;                  // SyntaxError: Delete of an unqualified identifier

```

They cannot be accessed via `globalThis.z` and cannot be deleted because they are lexical bindings rather than object properties.

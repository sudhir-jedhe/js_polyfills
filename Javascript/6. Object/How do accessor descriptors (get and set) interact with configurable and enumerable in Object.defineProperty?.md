*** copy How do accessor descriptors (get and set) interact with configurable and enumerable in Object.defineProperty?.md ***

In JavaScript, a property descriptor must be either a **Data Descriptor** (containing `value` and `writable`) or an **Accessor Descriptor** (containing `get` and `set`). They are mutually exclusive.

`configurable` and `enumerable` are **shared attributes** that apply to both types.

---

### The Accessor Descriptor Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Accessor Property Descriptor             │
├──────────────────┬──────────────────────────────────────────┤
│ get: Function    │ Invoked on property read (returns value) │
├──────────────────┼──────────────────────────────────────────┤
│ set: Function    │ Invoked on assignment (receives value)   │
├──────────────────┼──────────────────────────────────────────┤
│ enumerable: bool │ Governs visibility (Object.keys, loops)  │
├──────────────────┼──────────────────────────────────────────┤
│ configurable: bool│ Governs redefinition & deletion          │
└──────────────────┴──────────────────────────────────────────┘

```

> **Mutual Exclusivity Rule:** An accessor descriptor cannot have `value` or `writable`. Attempting `{ get() {}, value: 1 }` throws a **`TypeError: Invalid property descriptor`**.

---

### 1. How `configurable` Interacts with Accessors

`configurable` controls whether you can **delete** the property or **change/redefine** its getter/setter functions.

#### Case A: `configurable: true` (Can redefine or delete)

```javascript
const user = { _name: "Alice" };

Object.defineProperty(user, 'name', {
  get() { return this._name; },
  set(val) { this._name = val; },
  configurable: true,
});

// 1. Deletion succeeds
delete user.name; // ✅ Returns true
console.log(user.name); // undefined

// 2. Redefining getter/setter succeeds
Object.defineProperty(user, 'name', {
  get() { return "Redefined"; },
  configurable: true,
});
console.log(user.name); // "Redefined"

```

#### Case B: `configurable: false` (Locked in place)

```javascript
const account = { _balance: 1000 };

Object.defineProperty(account, 'balance', {
  get() { return this._balance; },
  set(val) { this._balance = val; },
  configurable: false, // 🔒 Permanently locked
});

// 1. Deletion fails
delete account.balance; // ❌ Returns false (TypeError in 'use strict')

// 2. Redefining get or set fails
Object.defineProperty(account, 'balance', {
  get() { return 0; } // ❌ TypeError: Cannot redefine property: balance
});

// 3. Converting to a data property fails
Object.defineProperty(account, 'balance', {
  value: 500 // ❌ TypeError: Cannot redefine property: balance
});

```

---

### 2. How `enumerable` Interacts with Accessors

`enumerable` governs whether the property is exposed during enumeration. The getter is only executed during enumeration if the consumer actually reads the property value.

```javascript
const metrics = { _cpu: 45, _ram: 80 };

Object.defineProperty(metrics, 'cpu', {
  get() { return `${this._cpu}%`; },
  enumerable: true,
});

Object.defineProperty(metrics, 'ram', {
  get() { return `${this._ram}%`; },
  enumerable: false, // 👁️ Hidden from iteration
});

// 1. Object.keys() only includes enumerable keys:
console.log(Object.keys(metrics)); // ['_cpu', '_ram', 'cpu']

// 2. Spread operator / Object.assign invokes getters of enumerable properties only:
const cloned = { ...metrics };
console.log(cloned); // { _cpu: 45, _ram: 80, cpu: '45%' } (cloned.ram is omitted)

// 3. JSON.stringify includes enumerable accessors by running the getter:
console.log(JSON.stringify(metrics)); // {"_cpu":45,"_ram":80,"cpu":"45%"}

```

---

### 3. Asymmetric Accessors (Read-Only or Write-Only)

You can define read-only or write-only properties by omitting one of the functions. `writable` is not used here—the presence of `set` determines write capability.

```javascript
const sensor = { _temp: 22 };

// Read-only accessor property
Object.defineProperty(sensor, 'temp', {
  get() { return this._temp; },
  set: undefined,      // No setter -> Read-only
  configurable: false,
  enumerable: true,
});

sensor.temp = 30; // Fails silently in non-strict mode; throws TypeError in "use strict"
console.log(sensor.temp); // 22

```

---

### Summary Matrix

| Operation                                                  | `configurable: true`                   | `configurable: false`                  |
| ---------------------------------------------------------- | -------------------------------------- | -------------------------------------- |
| **`delete obj.prop`**                                      | ✅ Allowed                              | ❌ Forbidden (Throws in strict)         |
| **Change `get` / `set` function**                          | ✅ Allowed                              | ❌ Forbidden (`TypeError`)              |
| **Switch from Accessor $\leftrightarrow$ Data Descriptor** | ✅ Allowed                              | ❌ Forbidden (`TypeError`)              |
| **Change `enumerable` flag**                               | ✅ Allowed                              | ❌ Forbidden (`TypeError`)              |
| **Iterate in `for...in` / `Object.keys()**`                | Determined by `enumerable: true/false` | Determined by `enumerable: true/false` |

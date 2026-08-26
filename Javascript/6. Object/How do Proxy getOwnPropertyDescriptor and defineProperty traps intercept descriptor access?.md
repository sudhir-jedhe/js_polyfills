*** copy How do Proxy getOwnPropertyDescriptor and defineProperty traps intercept descriptor access?.md ***

JavaScript `Proxy` objects allow you to intercept and customize low-level engine operations using handler traps. The **`getOwnPropertyDescriptor`** and **`defineProperty`** traps specifically intercept the internal ECMAScript methods `[[GetOwnProperty]]` and `[[DefineOwnProperty]]`.

---

### 1. The `getOwnPropertyDescriptor` Trap

This trap intercepts operations that retrieve a property descriptor from an object.

#### Triggered By

* `Object.getOwnPropertyDescriptor(proxy, prop)`
* `Reflect.getOwnPropertyDescriptor(proxy, prop)`
* `Object.getOwnPropertyDescriptors(proxy)`

#### Signature

```javascript
handler.getOwnPropertyDescriptor(target, prop)

```

* **Return Value:** Must return either a **valid property descriptor object** (`{ value, writable, enumerable, configurable }` or `{ get, set, enumerable, configurable }`) or **`undefined`** if the property does not exist.

#### Example: Virtual Property Descriptor Masking

```javascript
const target = { _secretKey: 'xyz-123', visibleData: 'Public Info' };

const proxy = new Proxy(target, {
  getOwnPropertyDescriptor(target, prop) {
    if (prop.startsWith('_')) {
      // Hide private keys from reflection tools/spread
      return undefined;
    }
    // Forward standard descriptor for other properties
    return Reflect.getOwnPropertyDescriptor(target, prop);
  },
});

console.log(Object.getOwnPropertyDescriptor(proxy, '_secretKey'));
// undefined

console.log(Object.getOwnPropertyDescriptor(proxy, 'visibleData'));
// { value: 'Public Info', writable: true, enumerable: true, configurable: true }

```

---

### 2. The `defineProperty` Trap

This trap intercepts operations that declare or modify properties and their descriptors.

#### Triggered By

* `Object.defineProperty(proxy, prop, descriptor)`
* `Reflect.defineProperty(proxy, prop, descriptor)`
* Direct assignment `proxy.prop = val` *(when no existing setter is present, the engine calls `[[DefineOwnProperty]]` under the hood)*

#### Signature

```javascript
handler.defineProperty(target, prop, descriptor)

```

* **Return Value:** Must return a **boolean** (`true` if defined successfully, `false` otherwise). In strict mode, returning `false` causes a `TypeError`.

#### Example: Enforcing Validation & Read-Only Locks

```javascript
const target = {};

const proxy = new Proxy(target, {
  defineProperty(target, prop, descriptor) {
    // 1. Enforce data validation rules
    if (prop === 'age') {
      if (typeof descriptor.value !== 'number' || descriptor.value < 0) {
        throw new TypeError('Age must be a positive number');
      }
    }

    // 2. Force certain properties to always be non-enumerable
    if (prop.startsWith('meta_')) {
      descriptor.enumerable = false;
    }

    // 3. Delegate definition to the actual target
    return Reflect.defineProperty(target, prop, descriptor);
  },
});

// Valid definition
Object.defineProperty(proxy, 'age', { value: 25, configurable: true });
console.log(proxy.age); // 25

// Invalid definition
// Object.defineProperty(proxy, 'age', { value: -5 });
// ❌ TypeError: Age must be a positive number

```

---

### 3. Critical Invariant Rules (Engine Safeguards)

To maintain JavaScript language integrity, the runtime enforces strict **invariants** on these traps. Violating an invariant will immediately throw a `TypeError`.

| Trap                           | Invariant Rule                                                                                                                        | Violation Example                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **`getOwnPropertyDescriptor`** | Cannot report a property as **non-existent** (`undefined`) if it exists as a **non-configurable** property on the target.             | Returning `undefined` for a property on an `Object.freeze(target)` object.                          |
| **`getOwnPropertyDescriptor`** | Cannot report a property as **non-configurable** unless it actually exists as non-configurable on the target.                         | Synthesizing `{ value: 10, configurable: false }` for a property that doesn't exist on `target`.    |
| **`defineProperty`**           | Cannot add a property if the target is **non-extensible** (`Object.preventExtensions(target)`).                                       | Returning `true` when defining a new prop on a sealed/frozen target.                                |
| **`defineProperty`**           | Cannot define a property as **non-configurable** unless it already exists as non-configurable or is successfully written to `target`. | Returning `true` without calling `Reflect.defineProperty` with `configurable: false` on the target. |

```javascript
const lockedTarget = {};
Object.defineProperty(lockedTarget, 'id', {
  value: 42,
  configurable: false, // Locked
});

const badProxy = new Proxy(lockedTarget, {
  getOwnPropertyDescriptor(t, prop) {
    return undefined; // ❌ Violates invariant: cannot hide non-configurable property
  },
});

// Object.getOwnPropertyDescriptor(badProxy, 'id');
// ❌ TypeError: 'getOwnPropertyDescriptor' on proxy: trap result does not reflect
//              target's non-configurable property

```

---

### Summary of Differences

```
┌──────────────────────────────────────────────────────────────┐
│                    Proxy Reflection Hooks                    │
├──────────────────────────────┬───────────────────────────────┤
│ getOwnPropertyDescriptor     │ defineProperty                │
├──────────────────────────────┼───────────────────────────────┤
│ Reads / intercepts metadata  │ Modifies / enforces metadata  │
│ Returns Descriptor or undef  │ Returns Boolean (success)     │
│ Intercepts Object.getOwn...  │ Intercepts Object.define...   │
└──────────────────────────────┴───────────────────────────────┘

```

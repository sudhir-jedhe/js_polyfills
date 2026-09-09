***  What are Proxy Invariants in ECMAScript and when does a Proxy trap throw a TypeError for violating them?.md ***

In the ECMAScript specification, **Proxy Invariants** are non-negotiable semantic guarantees enforced by the engine. They prevent a `Proxy` from fabricating behaviors that violate fundamental JavaScript object model rules regarding **non-configurable properties** and **non-extensible objects**.

If a trap returns a result that contradicts the actual state of the underlying target object, the engine immediately throws a **`TypeError`**—even if your trap code executed without errors.

---

### Why Invariants Exist

Proxies allow you to intercept almost every internal object method (`[[Get]]`, `[[Set]]`, `[[GetPrototypeOf]]`, etc.). However, without invariants:

* Code could freeze an object (`Object.freeze(target)`), but a Proxy could report that the property value changed anyway.
* Code could mark a property `configurable: false`, but a Proxy could claim it was successfully deleted.

Invariants guarantee that **integrity attributes on the target object are never violated or misrepresented**.

---

### Common Invariant Violations and `TypeError` Triggers

#### 1. The `get` Trap: Mutating Non-Configurable, Non-Writable Properties

* **The Invariant:** If `target.prop` is **non-configurable** and **non-writable**, the `get` trap MUST return the exact value currently on the target.

```javascript
const target = {};
Object.defineProperty(target, 'id', {
  value: 42,
  writable: false,
  configurable: false,
});

const proxy = new Proxy(target, {
  get(t, prop) {
    return 999; // ❌ Attempting to forge a new value
  },
});

proxy.id; 
// ❌ TypeError: 'get' on proxy: property 'id' is a read-only and non-configurable..

```

---

#### 2. The `set` Trap: Overwriting Non-Configurable, Non-Writable Properties

* **The Invariant:** A `set` trap cannot return `true` (indicating success) if the target property is **non-configurable** and **non-writable**.

```javascript
const target = {};
Object.defineProperty(target, 'fixed', {
  value: 'immutable',
  writable: false,
  configurable: false,
});

const proxy = new Proxy(target, {
  set(t, prop, val) {
    return true; // ❌ Claims write succeeded without modifying target
  },
});

proxy.fixed = 'new-value';
// ❌ TypeError: 'set' on proxy: trap returned truish for property 'fixed' which exists in the proxy target as a non-configurable and non-writable property

```

---

#### 3. The `deleteProperty` Trap: Deleting Non-Configurable Properties

* **The Invariant:** The `deleteProperty` trap cannot return `true` if the target property is **non-configurable**.

```javascript
const target = {};
Object.defineProperty(target, 'secret', {
  value: 'pass',
  configurable: false,
});

const proxy = new Proxy(target, {
  deleteProperty(t, prop) {
    return true; // ❌ Pretends the property was deleted
  },
});

delete proxy.secret;
// ❌ TypeError: 'deleteProperty' on proxy: trap returned truish for property 'secret' which is non-configurable in the proxy target

```

---

#### 4. The `has` Trap: Hiding Non-Configurable Keys or Non-Extensible Properties

* **The Invariant:**

1. Cannot return `false` if the target has a **non-configurable** property.
2. Cannot return `false` if the property exists and the target is **non-extensible**.

```javascript
const target = { hidden: true };
Object.preventExtensions(target); // Target is now non-extensible

const proxy = new Proxy(target, {
  has(t, prop) {
    return false; // ❌ Claims 'hidden' doesn't exist
  },
});

'hidden' in proxy;
// ❌ TypeError: 'has' on proxy: trap returned falsish for property 'hidden' but the proxy target is not extensible

```

---

#### 5. The `ownKeys` Trap: Omitting or Fabricating Keys on Non-Extensible Objects

* **The Invariant:**

1. The trap result **must include all non-configurable own property keys** of the target.
2. If the target is **non-extensible**, the result array must contain **every** existing key on the target and **no extra keys**.

```javascript
const target = { a: 1, b: 2 };
Object.preventExtensions(target);

const proxy = new Proxy(target, {
  ownKeys(t) {
    return ['a', 'extraKey']; // ❌ Omitted 'b' and added non-existent 'extraKey'
  },
});

Object.keys(proxy);
// ❌ TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible

```

---

#### 6. The `getPrototypeOf` Trap: Prototype Mismatches on Non-Extensible Targets

* **The Invariant:** If the target is **non-extensible**, the prototype returned by `getPrototypeOf` must be identical to `Object.getPrototypeOf(target)`.

```javascript
const target = {};
Object.preventExtensions(target);

const proxy = new Proxy(target, {
  getPrototypeOf(t) {
    return { customProto: true }; // ❌ Different prototype returned
  },
});

Object.getPrototypeOf(proxy);
// ❌ TypeError: 'getPrototypeOf' on proxy: proxy target is non-extensible but the trap did not return its actual prototype

```

---

### Complete Invariants Matrix

| Proxy Trap                     | Core Enforced Invariants                                                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`get`**                      | Must return exact value for non-configurable, non-writable properties. Must return `undefined` for non-configurable accessor properties without a getter. |
| **`set`**                      | Cannot return `true` if target property is non-configurable and non-writable. Cannot change value if accessor has `set: undefined`.                       |
| **`has`**                      | Cannot return `false` for non-configurable properties or any existing properties on non-extensible targets.                                               |
| **`deleteProperty`**           | Cannot return `true` for non-configurable properties.                                                                                                     |
| **`ownKeys`**                  | Must contain all non-configurable keys. On non-extensible targets, must match the target's exact key list (no additions, no omissions).                   |
| **`getOwnPropertyDescriptor`** | Cannot report non-existent properties as non-configurable. Must report existing non-configurable properties accurately.                                   |
| **`getPrototypeOf`**           | On non-extensible targets, returned prototype must strictly equal the target's actual prototype.                                                          |
| **`isExtensible`**             | Must return the exact boolean returned by `Reflect.isExtensible(target)`.                                                                                 |

---

### Golden Rule to Avoid Invariant Errors

Always use **`Reflect`** methods inside your traps to keep your Proxy's state and return values synchronized with the target's internal state:

```javascript
const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    // Perform custom logic / telemetry here
    return Reflect.get(target, prop, receiver); // ✅ Guarantees invariant compliance
  },
  set(target, prop, value, receiver) {
    // Perform validation here
    return Reflect.set(target, prop, value, receiver); // ✅ Returns correct boolean
  },
});

```

A production-grade custom deep clone must handle primitives, complex object types (`Date`, `RegExp`, `Map`, `Set`), symbol keys, and **circular references** (using a `WeakMap` cache).

---

**Implementation**

```javascript
function deepClone(value, hash = new WeakMap()) {
  // 1. Return primitives and functions directly
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // 2. Handle Circular References
  if (hash.has(value)) {
    return hash.get(value);
  }

  // 3. Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // 4. Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // 5. Handle Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    hash.set(value, clonedMap);
    value.forEach((v, k) => {
      clonedMap.set(deepClone(k, hash), deepClone(v, hash));
    });
    return clonedMap;
  }

  // 6. Handle Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    hash.set(value, clonedSet);
    value.forEach((v) => {
      clonedSet.add(deepClone(v, hash));
    });
    return clonedSet;
  }

  // 7. Handle Arrays and Plain Objects (preserving prototype)
  const clone = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));

  // Store in cache before recursing to resolve circular references
  hash.set(value, clone);

  // 8. Copy both String and Symbol property keys
  const keys = Reflect.ownKeys(value);
  for (const key of keys) {
    clone[key] = deepClone(value[key], hash);
  }

  return clone;
}

```

---

**Verification Test Cases**

```javascript
// Setup complex structure
const symKey = Symbol('id');
const original = {
  num: 42,
  str: 'hello',
  date: new Date('2026-08-23'),
  regex: /test-query/gi,
  tags: new Set(['react', 'javascript']),
  lookup: new Map([['key1', { value: 100 }]]),
  nested: { a: 1 },
  [symKey]: 'symbolValue'
};

// Create a circular reference
original.self = original;

// Execute clone
const copy = deepClone(original);

// Validations
console.log(copy !== original);                        // true (different reference)
console.log(copy.self === copy);                       // true (circular reference maintained)
console.log(copy.date instanceof Date);                // true
console.log(copy.date.getTime() === original.date.getTime()); // true
console.log(copy.regex.source === original.regex.source);     // true
console.log(copy.tags !== original.tags);               // true (deeply cloned Set)
console.log(copy.lookup.get('key1') !== original.lookup.get('key1')); // true (deeply cloned Map value)
console.log(copy[symKey]);                             // 'symbolValue'

```

---

**Key Implementation Details**

* **`WeakMap` Cache:** Prevents infinite recursive loops caused by circular dependencies (`original.self = original`) and ensures object identity graph preservation.
* **`Reflect.ownKeys`:** Traverses all properties, including **non-enumerable properties and `Symbol` keys**, which standard `Object.keys()` or `for...in` ignore.
* **`Object.getPrototypeOf`:** Preserves custom class prototypes rather than flattening instances into plain `{}` objects.

While `structuredClone()` is the modern built-in standard for deep cloning in JavaScript, it comes with several explicit limitations defined by the HTML Structured Clone Algorithm:

---

**1. Throws Errors on Unsupported Types**

* **Functions / Methods:** Attempting to clone a function or an object containing methods (e.g., `{ greet() {} }`) throws a `DataCloneError: function could not be cloned`.
* **DOM Nodes / Elements:** Cloning DOM nodes (e.g., `document.getElementById('app')`) throws a `DataCloneError`.
* **Symbols and Symbol Keys:** Symbol primitives and object properties keyed by Symbols (e.g., `{ [Symbol('id')]: 1 }`) are ignored or cause failures depending on context.

---

**2. Prototype Chain Loss**

* `structuredClone()` discards custom class prototypes. If you pass an instance of a custom class (`class User { ... }`), the resulting clone becomes a plain JavaScript `Object` (`{}`), losing all class methods and `instanceof` checks:

```javascript
class User {
  getName() { return 'Alex'; }
}

const u = new User();
const cloned = structuredClone(u);

console.log(cloned instanceof User); // false (plain Object)
// cloned.getName(); // TypeError: cloned.getName is not a function

```

---

**3. Property Descriptors & Getters/Setters Are Flattened**

* **Getters & Setters:** Invokes getters and clones the resulting value as a static, writable property. It does not clone the getter/setter function descriptors.
* **Non-enumerable & Read-only Properties:** All cloned properties default to `writable: true`, `enumerable: true`, and `configurable: true`. Non-enumerable properties are completely skipped.

---

**4. Error Objects Lose Custom Fields**

* While native `Error` objects (`TypeError`, `SyntaxError`, etc.) can be cloned, non-standard or custom attached properties on the error instance are frequently stripped.

---

**Summary Comparison**

| Feature                                      | `structuredClone()`               | Custom Deep Clone                                     |
| -------------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| **Circular References**                      | Supported natively                | Requires `WeakMap`                                    |
| **Dates, Maps, Sets, RegExps, ArrayBuffers** | Supported natively                | Requires explicit type checks                         |
| **Functions & Methods**                      | ❌ Throws `DataCloneError`         | Supported (by reference or copy)                      |
| **Class Prototypes / `instanceof**`          | ❌ Strips prototype (becomes `{}`) | Supported (via `Object.getPrototypeOf`)               |
| **Symbol Keys**                              | ❌ Stripped / Ignored              | Supported (via `Reflect.ownKeys`)                     |
| **Property Descriptors / Getters**           | ❌ Flattened to static properties  | Configurable (via `Object.getOwnPropertyDescriptors`) |
| **DOM Nodes**                                | ❌ Throws `DataCloneError`         | Supported (via `node.cloneNode(true)`)                |

How do you write a deep clone function that preserves custom class prototypes, getters, and property descriptors?

To preserve custom class prototypes, getters, setters, and property descriptors (like `enumerable`, `writable`, `configurable`), you must clone using **`Object.getOwnPropertyDescriptors()`** and reconstruct the object using **`Object.create()`** with the original prototype.

---

**Complete Implementation**

```javascript
function advancedDeepClone(value, hash = new WeakMap()) {
  // 1. Return primitives and functions as-is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // 2. Handle circular references
  if (hash.has(value)) {
    return hash.get(value);
  }

  // 3. Handle built-in special objects
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const clonedMap = new Map();
    hash.set(value, clonedMap);
    value.forEach((v, k) => {
      clonedMap.set(advancedDeepClone(k, hash), advancedDeepClone(v, hash));
    });
    return clonedMap;
  }
  if (value instanceof Set) {
    const clonedSet = new Set();
    hash.set(value, clonedSet);
    value.forEach((v) => clonedSet.add(advancedDeepClone(v, hash)));
    return clonedSet;
  }

  // 4. Preserve prototype (custom classes, Array, Object)
  const proto = Object.getPrototypeOf(value);
  const clone = Array.isArray(value) ? [] : Object.create(proto);

  // Store in cache before recursing
  hash.set(value, clone);

  // 5. Extract all property descriptors (enumerable, non-enumerable, Symbol keys)
  const descriptors = Object.getOwnPropertyDescriptors(value);

  for (const key of Reflect.ownKeys(descriptors)) {
    const descriptor = descriptors[key];

    if ('value' in descriptor) {
      // Standard data property: deeply clone the value
      descriptor.value = advancedDeepClone(descriptor.value, hash);
    }
    // Note: If descriptor has 'get' or 'set', we keep them as-is without invoking them!

    // Apply exact descriptor settings (writable, enumerable, configurable, get/set)
    Object.defineProperty(clone, key, descriptor);
  }

  return clone;
}

```

---

**Verification Test Cases**

```javascript
// 1. Custom Class
class Account {
  constructor(owner, initialBalance) {
    this.owner = owner;
    this._balance = initialBalance;
  }

  // Getter & Setter
  get balance() {
    return this._balance;
  }
  set balance(val) {
    if (val < 0) throw new Error('Invalid balance');
    this._balance = val;
  }

  // Class Method
  deposit(amount) {
    this._balance += amount;
  }
}

// 2. Instantiate and add non-enumerable + symbol properties
const symSecret = Symbol('secret');
const original = new Account('Alex', 1000);

Object.defineProperty(original, 'internalId', {
  value: 'ID-999',
  writable: false,
  enumerable: false, // Hidden from standard loops
  configurable: false,
});

original[symSecret] = 'classified';
original.self = original; // Circular reference

// 3. Perform Deep Clone
const cloned = advancedDeepClone(original);

// 4. Validations
console.log(cloned instanceof Account); // true (Prototype preserved!)
console.log(cloned !== original);       // true (Distinct object reference)
console.log(cloned.self === cloned);    // true (Circular reference preserved)

// Class methods & Getters/Setters work properly
cloned.deposit(500);
console.log(cloned.balance);            // 1500
console.log(original.balance);          // 1000 (Original is untouched)

// Property Descriptors
const clonedDescriptor = Object.getOwnPropertyDescriptor(cloned, 'internalId');
console.log(clonedDescriptor.enumerable); // false (Descriptor flags preserved)
console.log(clonedDescriptor.writable);   // false
console.log(cloned[symSecret]);           // 'classified' (Symbol keys preserved)

```

---

**Key Technical Details**

* **`Object.getOwnPropertyDescriptors()`:** Captures the full descriptor map for every own property—including getters, setters, non-enumerable properties, and symbol keys.
* **Accessor Preservation:** By inspecting `'value' in descriptor`, getters are never triggered during cloning; the getter/setter functions themselves are attached directly via `Object.defineProperty()`.
* **`Object.create(Object.getPrototypeOf(value))`:** Connects the cloned object directly to the original's prototype chain, preserving class methods, inheritance, and `instanceof` checks.

***  How do writable, enumerable, and configurable attributes work under the hood in Object.defineProperty?.md ***

In JavaScript, every object property is backed by an internal record called a **Property Descriptor**. When you define or modify a property using `Object.defineProperty(obj, prop, descriptor)`, the JavaScript engine configures attributes that control mutability, iteration visibility, and metadata locking.

---

### The Two Types of Descriptors

A property can be either a **Data Descriptor** or an **Accessor Descriptor**:

```
                       ┌────────────────────────────┐
                       │    Property Descriptor     │
                       └─────────────┬──────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────┐                           ┌──────────────────────┐
│   Data Descriptor    │                           │ Accessor Descriptor  │
├──────────────────────┤                           ├──────────────────────┤
│ • [[Value]]          │                           │ • [[Get]]            │
│ • [[Writable]]       │                           │ • [[Set]]            │
│ • [[Enumerable]]     │                           │ • [[Enumerable]]     │
│ • [[Configurable]]   │                           │ • [[Configurable]]   │
└──────────────────────┘                           └──────────────────────┘

```

> **Default Rule:** When creating a property with standard assignment (`obj.a = 1`), attributes default to `true`. When creating a property with `Object.defineProperty()`, unspecified boolean attributes default to **`false`**, and `value`/`get`/`set` default to `undefined`.

---

### 1. `writable`: Controls Value Mutation

Determines whether the property's `[[Value]]` can be changed using an assignment operator (`=`).

```javascript
const user = {};

Object.defineProperty(user, 'id', {
  value: 101,
  writable: false,     // Value is locked
  configurable: true,
  enumerable: true,
});

user.id = 202; // Non-strict: silently ignored; Strict mode: TypeError

console.log(user.id); // 101

```

* **Object Mutation Caveat:** `writable: false` creates a **shallow freeze**. If the value is an object or array, its internal nested properties remain mutable:

```javascript
Object.defineProperty(user, 'config', {
  value: { theme: 'dark' },
  writable: false,
});

user.config = { theme: 'light' }; // ❌ Fails (cannot overwrite reference)
user.config.theme = 'light';      // ✅ Succeeds (nested object is mutable)

```

---

### 2. `enumerable`: Controls Traversal & Serialization

Determines whether the property appears during iteration or serialization.

```javascript
const product = {};

Object.defineProperty(product, 'sku', {
  value: 'SKU-994',
  enumerable: false, // Hidden from standard iteration
});

Object.defineProperty(product, 'name', {
  value: 'Wireless Mouse',
  enumerable: true,
});

```

#### How Operations Treat `enumerable: false`

| Operation                                        | Includes Non-Enumerable Properties? |
| ------------------------------------------------ | ----------------------------------- |
| **`for...in` loop**                              | ❌ No                                |
| **`Object.keys(obj)`**                           | ❌ No                                |
| **`Object.values(obj)` / `Object.entries(obj)**` | ❌ No                                |
| **`JSON.stringify(obj)`**                        | ❌ No (Omitted from output)          |
| **`{ ...obj }` (Object spread)**                 | ❌ No                                |
| **`Object.assign(target, obj)`**                 | ❌ No                                |
| **Direct Access (`obj.sku`)**                    | ✅ Yes                               |
| **`'sku' in obj`**                               | ✅ Yes                               |
| **`Object.getOwnPropertyNames(obj)`**            | ✅ Yes                               |
| **`Reflect.ownKeys(obj)`**                       | ✅ Yes                               |

---

### 3. `configurable`: The Master Descriptor Lock

`configurable` controls two key capabilities:

1. Whether the property can be removed using `delete`.
2. Whether the property descriptor attributes can be modified in the future.

```javascript
const account = {};

Object.defineProperty(account, 'iban', {
  value: 'GB82WEST123456',
  writable: true,
  enumerable: true,
  configurable: false, // Locked
});

// 1. Deletion fails
delete account.iban; // Non-strict: returns false; Strict mode: TypeError

// 2. Changing enumerable fails
// Object.defineProperty(account, 'iban', { enumerable: false });
// ❌ TypeError: Cannot redefine property: iban

```

#### The Single Exception to `configurable: false`

When `configurable` is `false`, you **cannot** flip `enumerable` or change `configurable` back to `true`. However, you are permitted to make a one-way transition of **`writable: true` $\rightarrow$ `false**`:

```javascript
// ✅ Allowed even when configurable: false
Object.defineProperty(account, 'iban', {
  writable: false,
});

// ❌ Cannot transition back from false -> true
// Object.defineProperty(account, 'iban', { writable: true }); 
// TypeError: Cannot redefine property: iban

```

---

### How Built-in Object Methods Map to Descriptors

High-level immutability utilities in JavaScript simply apply batch property descriptor changes:

* **`Object.preventExtensions(obj)`:** Sets the internal `[[Extensible]]` slot to `false` (no new properties can be added).
* **`Object.seal(obj)`:** Marks every existing property as `configurable: false` and prevents extensions.
* **`Object.freeze(obj)`:** Marks every existing data property as `writable: false`, `configurable: false`, and prevents extensions.

```javascript
const data = { x: 10 };
Object.freeze(data);

console.log(Object.getOwnPropertyDescriptor(data, 'x'));
// {
//   value: 10,
//   writable: false,
//   enumerable: true,
//   configurable: false
// }

```

When performing operations like `Object.keys(proxy)`, `Object.values(proxy)`, `Object.entries(proxy)`, `Object.assign({}, proxy)`, or object spreading (`{ ...proxy }`), the JavaScript engine does **not** rely on a single trap.

Instead, it executes a standardized **two-phase protocol** combining `ownKeys` and `getOwnPropertyDescriptor`.

---

### The Two-Phase Engine Protocol

```
Step 1: Discover Keys                       Step 2: Filter & Read
┌───────────────────────────┐               ┌──────────────────────────────────────────────┐
│        ownKeys()          │               │         getOwnPropertyDescriptor()           │
│                           │               │                                              │
│ • Returns raw array of    │ ────────────► │ • Engine inspects `enumerable: true | false` │
│   all candidate property  │  (Iterates    │ • If `true`  ──► Key is kept / value read    │
│   names (Strings/Symbols) │   each key)   │ • If `false` ──► Key is discarded / skipped │
└───────────────────────────┘               └──────────────────────────────────────────────┘

```

1. **Phase 1 (`[[OwnPropertyKeys]]`):** The engine invokes the `ownKeys` trap to retrieve an array of **all** candidate property keys (both strings and symbols).
2. **Phase 2 (`[[GetOwnProperty]]`):** The engine loops over every key returned by `ownKeys` and invokes `getOwnPropertyDescriptor` on each one to check its **`enumerable`** attribute.

* If `enumerable === true`: The key is included in the output.
* If `enumerable === false` (or returns `undefined`): The key is **silently filtered out**.

---

### Code Walkthrough: How the Traps Interact

Consider this proxy wrapping an object:

```javascript
const target = {
  visible: 'Hello',
  hidden: 'Secret',
  virtual: 'I am dynamic',
};

const proxy = new Proxy(target, {
  // Phase 1: Return list of candidate keys
  ownKeys(t) {
    console.log('[Trap: ownKeys] Called');
    return ['visible', 'hidden', 'virtual'];
  },

  // Phase 2: Inspect descriptors for each key from Phase 1
  getOwnPropertyDescriptor(t, prop) {
    console.log(`[Trap: getOwnPropertyDescriptor] Checking "${prop}"`);

    if (prop === 'hidden') {
      return {
        value: t[prop],
        writable: true,
        enumerable: false, // ❌ Non-enumerable: will be filtered out
        configurable: true,
      };
    }

    if (prop === 'virtual') {
      return {
        value: 'Dynamic Value',
        writable: false,
        enumerable: true, // ✅ Enumerable: will be included
        configurable: true,
      };
    }

    return Reflect.getOwnPropertyDescriptor(t, prop);
  },
});

```

#### What happens during `Object.keys(proxy)`

```javascript
console.log(Object.keys(proxy));

```

**Console Execution Trace:**

```text
[Trap: ownKeys] Called
[Trap: getOwnPropertyDescriptor] Checking "visible"
[Trap: getOwnPropertyDescriptor] Checking "hidden"
[Trap: getOwnPropertyDescriptor] Checking "virtual"

Output: ['visible', 'virtual']

```

---

### Comparing `Object.keys()` vs. Object Spread (`{ ...proxy }`)

While both operations follow this two-phase protocol, they differ slightly in which types of keys they process and how they read values:

| Operation                      | Keys Checked                                                 | Value Retrieval Trap                                            |
| ------------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------- |
| **`Object.keys(proxy)`**       | **Strings only** (Symbols returned by `ownKeys` are ignored) | Reads `value` directly from the returned descriptor             |
| **`Object.assign({}, proxy)`** | **Strings + Symbols**                                        | Calls the **`get`** trap (`proxy[key]`) for each enumerable key |
| **`{ ...proxy }` (Spread)**    | **Strings + Symbols**                                        | Calls the **`get`** trap (`proxy[key]`) for each enumerable key |

#### Why Spread Triggers the `get` Trap

```javascript
const user = { name: 'Alice' };

const proxy = new Proxy(user, {
  ownKeys(t) {
    return ['name'];
  },
  getOwnPropertyDescriptor(t, prop) {
    return { enumerable: true, configurable: true, value: t[prop] };
  },
  get(t, prop) {
    console.log(`[Trap: get] Accessing "${prop}"`);
    return t[prop].toUpperCase();
  },
});

const cloned = { ...proxy };
// 1. Calls ownKeys()
// 2. Calls getOwnPropertyDescriptor(target, "name") -> enumerable is true
// 3. Calls get(target, "name") -> returns "ALICE"

console.log(cloned); // { name: 'ALICE' }

```

---

### Common Pitfall: The "Invisible Key" Bug

If you implement the `ownKeys` trap to expose virtual/computed keys but **forget** to implement `getOwnPropertyDescriptor`, `Object.keys()` and spread will fail to output the key:

```javascript
const target = { a: 1 };

const brokenProxy = new Proxy(target, {
  ownKeys() {
    return ['a', 'virtualKey']; // 'virtualKey' does not exist on target
  },
});

console.log(Object.keys(brokenProxy)); 
// Output: ['a'] 
// ('virtualKey' is skipped because default fallback descriptor returns undefined!)

```

* **The Fix:** Whenever you synthesize keys in `ownKeys`, you **must** also return an explicit descriptor with `{ enumerable: true, configurable: true }` in `getOwnPropertyDescriptor`.

---

### Invariant Rules to Remember

1. **Target non-configurable properties:** If a property exists on `target` and is `configurable: false`, `ownKeys` **must** include that key in the returned array.
2. **Non-extensible targets:** If `Object.preventExtensions(target)` has been applied, `ownKeys` must return **exactly** the keys already present on `target`—no additional keys and no omitted keys.

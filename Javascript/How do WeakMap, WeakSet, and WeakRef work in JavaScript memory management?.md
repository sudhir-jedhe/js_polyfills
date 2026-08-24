JavaScript uses a **mark-and-sweep** garbage collection (GC) algorithm. Standard data structures (`Map`, `Set`, `Array`, `Object`) hold **strong references** to their contents, preventing the garbage collector from reclaiming an object as long as that collection exists in memory.

`WeakMap`, `WeakSet`, and `WeakRef` hold **weak references**, allowing objects to be garbage-collected when no other strong references to them remain.

---

**1. `WeakMap**`

A collection of key/value pairs where **keys must be objects** (or non-registered symbols) and values can be arbitrary values.

* **Memory behavior:** References to keys are held weakly. If an object used as a key has no other strong references anywhere in the program, the key-value pair is garbage collected.
* **Non-enumerable:** Because entries can disappear at any time during garbage collection, `WeakMap` has **no `.size` property**, no `.keys()`, no `.values()`, and **cannot be iterated** (`for..of`, `forEach`).
* **Common Use Cases:**
* **Associating metadata with DOM nodes / objects** without causing memory leaks:

```javascript
const clickCounts = new WeakMap();

function trackClick(domButton) {
  const count = clickCounts.get(domButton) || 0;
  clickCounts.set(domButton, count + 1);
}
// When `domButton` is removed from the DOM and dereferenced, 
// its count entry in `clickCounts` is automatically garbage collected.

```

* **True Private State:** Storing private fields for class instances before native `#private` syntax.

---

**2. `WeakSet**`

A collection of **unique objects** where every element is held weakly.

* **Memory behavior:** When an object inside a `WeakSet` is dereferenced elsewhere, it is automatically removed from the `WeakSet` during GC.
* **Non-enumerable:** Like `WeakMap`, it has no `.size`, no iteration methods, and only supports `.add()`, `.has()`, and `.delete()`.
* **Common Use Cases:**
* **Tagging or marking objects** (e.g., tracking visited objects in graph traversal, tracking initialized instances, or circular reference checks):

```javascript
const processedNodes = new WeakSet();

function process(node) {
  if (processedNodes.has(node)) return;
  processedNodes.add(node);
  // Execute work...
}

```

---

**3. `WeakRef` (Weak References) & `FinalizationRegistry**`

Introduced in ES2021, `WeakRef` allows you to hold a weak reference to a target object directly without keeping it alive.

* **`deref()` Method:** Returns the target object if it is still in memory, or `undefined` if the garbage collector has reclaimed it.
* **`FinalizationRegistry`:** Registers a cleanup callback to run after an object has been garbage collected.

```javascript
// 1. WeakRef Example (In-memory caching without holding memory)
let largeDataObject = { data: new Array(1_000_000).fill('payload') };
const weakRef = new WeakRef(largeDataObject);

// Reading the object:
const cachedObj = weakRef.deref();
if (cachedObj) {
  console.log('Object is still in memory');
} else {
  console.log('Object was garbage collected!');
}

// 2. FinalizationRegistry Example
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Resource [${heldValue}] was garbage collected.`);
});

registry.register(largeDataObject, 'LargePayload-01');

// Dereference original object
largeDataObject = null; 
// Once the engine runs GC, the registry callback will fire.

```

---

**Summary Comparison**

| Feature                | `Map` / `Set`               | `WeakMap` / `WeakSet`                          | `WeakRef`                            |
| ---------------------- | --------------------------- | ---------------------------------------------- | ------------------------------------ |
| **Reference Type**     | Strong                      | Weak (keys for `WeakMap`, items for `WeakSet`) | Weak (direct target reference)       |
| **Allowed Types**      | Any primitive or object     | Objects (and non-registered Symbols)           | Objects (and non-registered Symbols) |
| **Iterable / `.size**` | Yes                         | ❌ No                                           | ❌ No                                 |
| **Prevents GC?**       | Yes                         | ❌ No                                           | ❌ No                                 |
| **Primary Use Case**   | General-purpose collections | Metadata association, tagging, leak prevention | Ephemeral caching, memory monitoring | s |

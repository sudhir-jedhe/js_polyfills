*** copy How do you build a memory-safe ephemeral cache using a combination of Map and WeakRef in JavaScript?.md ***

An ephemeral cache uses a standard `Map` to store string/primitive keys pointing to **`WeakRef`** values, paired with a **`FinalizationRegistry`** to automatically remove the dead key from the `Map` once the garbage collector reclaims the object.

---

**Implementation**

```javascript
class EphemeralCache {
  constructor() {
    this.cache = new Map();

    // Registry automatically cleans up dead keys when values are garbage-collected
    this.registry = new FinalizationRegistry((key) => {
      const ref = this.cache.get(key);
      // Ensure we only delete the key if the current ref inside the map is dead
      if (ref && ref.deref() === undefined) {
        this.cache.delete(key);
      }
    });
  }

  set(key, value) {
    if (value === null || typeof value !== 'object') {
      throw new TypeError('EphemeralCache only stores non-null objects as values.');
    }

    // 1. Wrap value in a WeakRef
    const weakRef = new WeakRef(value);
    this.cache.set(key, weakRef);

    // 2. Register with FinalizationRegistry using `key` as the held cleanup token
    // The 3rd argument (the value itself) serves as the unregister token
    this.registry.register(value, key, value);
  }

  get(key) {
    const ref = this.cache.get(key);
    if (!ref) return undefined;

    const value = ref.deref();
    if (value === undefined) {
      // The object was GC'd, clean up the stale key immediately
      this.cache.delete(key);
      return undefined;
    }

    return value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const ref = this.cache.get(key);
    if (ref) {
      const value = ref.deref();
      if (value) {
        this.registry.unregister(value);
      }
      this.cache.delete(key);
      return true;
    }
    return false;
  }
}

```

---

**Usage Example**

```javascript
const cache = new EphemeralCache();

// Scope block creating a temporary heavy object
function loadHeavyData() {
  let heavyReport = { id: 101, data: new Array(1_000_000).fill('payload') };
  
  // Cache it by string key
  cache.set('report-101', heavyReport);

  // Still reachable in scope
  console.log(cache.get('report-101')); // { id: 101, data: [...] }

  return heavyReport;
}

let activeReport = loadHeavyData();

// As long as `activeReport` holds a strong reference, the cache returns it
console.log(cache.has('report-101')); // true

// Dereference the object
activeReport = null;

// Once the engine executes Garbage Collection:
// 1. `cache.get('report-101')` returns `undefined`
// 2. The FinalizationRegistry callback runs and purges 'report-101' from the inner Map

```

---

**Why this Architecture Works**

* **Primitive Keying:** Unlike `WeakMap` (which requires object keys), a `Map<string, WeakRef<Object>>` allows arbitrary string/numeric keys like API endpoints or resource IDs.
* **No Memory Leaks:** The values do not prevent garbage collection. When memory pressure rises, the engine can free the objects even if the keys remain in the cache.
* **Zero Orphan Keys:** The `FinalizationRegistry` ensures that keys inside the internal `Map` do not grow unboundedly as their values get collected.

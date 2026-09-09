***  How do you build a hybrid LRU cache with TTL expiration in JavaScript?.md ***

A **Hybrid LRU-TTL Cache** enforces both **temporal expiration (TTL)** and **spatial capacity limits (LRU)**.

When capacity is exceeded, it evicts the least recently used item. When items are queried or updated, it checks for expiration before returning or updating LRU order.

---

### Implementation ($O(1)$ Operations using JavaScript `Map`)

```javascript
class LRUTTLCache {
  /**
   * @param {number} capacity Maximum number of items the cache can hold
   * @param {number} defaultTTL Default time-to-live in ms (0 = no expiry)
   * @param {number} cleanupIntervalMs Periodic active cleanup interval (default: 60s)
   */
  constructor(capacity, defaultTTL = 0, cleanupIntervalMs = 60000) {
    if (capacity <= 0) throw new Error('Capacity must be greater than 0');
    this.capacity = capacity;
    this.defaultTTL = defaultTTL;
    this.cache = new Map(); // key -> { value, expiresAt }

    // Active sweep for stale keys that are never queried
    this.cleanupTimer = setInterval(() => {
      this._purgeExpired();
    }, cleanupIntervalMs);

    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key);

    // 1. Passive TTL check
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // 2. Refresh LRU position (delete & re-insert moves key to the end)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTTL) {
    const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : null;

    // If key exists, remove it first to reset insertion order
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Proactively purge any expired keys before dropping LRU items
      this._purgeExpired();

      // If still at capacity, evict least recently used (first key in map)
      if (this.cache.size >= this.capacity) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { value, expiresAt });
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Active sweep to free memory from dead entries
  _purgeExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupTimer);
    this.cache.clear();
  }
}

```

---

### Verification Test Cases

```javascript
// Cache with capacity = 2, default TTL = 1000ms (1 sec)
const cache = new LRUTTLCache(2, 1000);

cache.set('a', 100);
cache.set('b', 200);

// 1. Check LRU refresh
console.log(cache.get('a')); // returns 100, moves 'a' to most recently used
cache.set('c', 300);         // Capacity full: evicts 'b' (LRU)

console.log(cache.get('b')); // null (evicted by LRU)
console.log(cache.get('a')); // 100
console.log(cache.get('c')); // 300

// 2. Check TTL expiration
setTimeout(() => {
  console.log(cache.get('a')); // null (expired past 1000ms TTL)
  console.log(cache.get('c')); // null (expired past 1000ms TTL)
}, 1100);

```

---

### Eviction Lifecycle & Priority

```text
Incoming Write:
 1. Key already exists?       ── Yes ─► Update value/TTL + Move to Most Recently Used (MRU)
          │ No
 2. Reached Capacity Limit?   ── Yes ─► Run _purgeExpired()
          │                                   │
          │ Still at capacity? ◄──────────────┘
          │        │ Yes
          │        └─► Evict first element (Least Recently Used)
          ▼
 3. Insert new entry at the MRU tail

```

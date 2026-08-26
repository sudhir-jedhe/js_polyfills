*** copy How do you implement an in-memory Cache with Time-To-Live (TTL) expiry in JavaScript?.md ***

An in-memory **TTL (Time-To-Live) Cache** typically uses two eviction strategies:

1. **Lazy Eviction (Passive):** Checks expiration timestamp when `get()` or `has()` is called.
2. **Active Cleanup (Proactive):** Periodically purges dead entries using an interval or individual timers (`setTimeout`) to prevent stale entries from lingering indefinitely in memory.

---

### Implementation (Hybrid: Passive + Periodic Active Sweep)

```javascript
class TTLCache {
  /**
   * @param {number} cleanupIntervalMs Interval to run active background cleanup (default: 60s)
   */
  constructor(cleanupIntervalMs = 60000) {
    this.cache = new Map();

    // Active cleanup timer to purge unread expired items
    this.cleanupTimer = setInterval(() => {
      this._purgeExpired();
    }, cleanupIntervalMs);

    // Prevent active timer from blocking Node.js process exit if available
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * @param {string|number} key
   * @param {any} value
   * @param {number} ttlMs Time to live in milliseconds (default: 0 = no expiry)
   */
  set(key, value, ttlMs = 0) {
    const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : null;

    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Passive check: Is the item expired?
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
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

  get size() {
    this._purgeExpired();
    return this.cache.size;
  }

  // Active sweep to prevent memory leaks from keys that are never read again
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

### Alternative: Timer-Based Immediate Eviction (`setTimeout`)

If immediate cleanup on exact millisecond expiry is required (useful for UI notifications or ephemeral sessions):

```javascript
class PreciseTTLCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlMs) {
    // Clear existing timer if updating an existing key
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timer);
    }

    const timer = setTimeout(() => {
      this.cache.delete(key);
    }, ttlMs);

    // Node.js support: allow clean exit
    if (timer.unref) timer.unref();

    this.cache.set(key, { value, timer });
  }

  get(key) {
    return this.cache.get(key)?.value ?? null;
  }

  delete(key) {
    const entry = this.cache.get(key);
    if (entry) {
      clearTimeout(entry.timer);
      return this.cache.delete(key);
    }
    return false;
  }
}

```

---

### Verification Example

```javascript
const cache = new TTLCache(5000); // Check background purge every 5s

cache.set('session-token', 'abc-123', 1000); // Expires in 1 second
cache.set('permanent-config', { theme: 'dark' }); // No expiry

console.log(cache.get('session-token')); // 'abc-123'
console.log(cache.get('permanent-config')); // { theme: 'dark' }

// Simulate waiting past TTL
setTimeout(() => {
  console.log(cache.get('session-token')); // null (expired & lazily deleted)
  console.log(cache.get('permanent-config')); // { theme: 'dark' }
}, 1100);

```

---

### Strategy Trade-offs

| Strategy                  | Memory Footprint                                           | CPU Overhead                       | Use Case                                           |
| ------------------------- | ---------------------------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| **Passive (Lazy)**        | Can retain expired memory if unused keys are never queried | Near zero                          | Infrequently written, frequently queried caches    |
| **Active Periodic Sweep** | Low; periodically frees unread expired keys                | Low amortized cost                 | General production API caching (e.g., Redis style) |
| **Exact `setTimeout**`    | Higher (allocates a timer handle per key)                  | Higher timer registration overhead | Small caches needing event triggers on expiration  |

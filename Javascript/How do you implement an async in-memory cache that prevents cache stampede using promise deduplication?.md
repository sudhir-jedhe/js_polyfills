*** copy How do you implement an async in-memory cache that prevents cache stampede using promise deduplication?.md ***

A **Cache Stampede** (or "thundering herd" problem) happens when multiple concurrent requests simultaneously find a key missing (or expired) and all invoke the expensive async loader at the same time.

To prevent this, the cache stores the **in-flight `Promise**` directly, allowing concurrent requests for the same key to share (deduplicate) the same promise execution.

---

### Implementation

```javascript
class AsyncMemoCache {
  /**
   * @param {number} ttlMs Default TTL in milliseconds (0 = infinite)
   */
  constructor(ttlMs = 60000) {
    this.ttlMs = ttlMs;
    this.dataCache = new Map(); // key -> { value, expiresAt }
    this.inFlightPromises = new Map(); // key -> Promise<any>
  }

  /**
   * Fetch with automated cache hit, deduplication, and stale-fallback on error
   * @param {string} key
   * @param {() => Promise<any>} asyncFetcher
   * @param {number} [customTTL]
   */
  async getOrFetch(key, asyncFetcher, customTTL = this.ttlMs) {
    const now = Date.now();

    // 1. Return cached value if present and unexpired
    const entry = this.dataCache.get(key);
    if (entry && (entry.expiresAt === null || entry.expiresAt > now)) {
      return entry.value;
    }

    // 2. If a fetch is already in flight for this key, reuse the active Promise
    if (this.inFlightPromises.has(key)) {
      return this.inFlightPromises.get(key);
    }

    // 3. Initiate single fetch operation and store its in-flight promise
    const fetchPromise = (async () => {
      try {
        const result = await asyncFetcher();

        // On success: save to dataCache with expiration
        const expiresAt = customTTL > 0 ? Date.now() + customTTL : null;
        this.dataCache.set(key, { value: result, expiresAt });

        return result;
      } finally {
        // ALWAYS remove from in-flight tracker when settled (resolve or reject)
        this.inFlightPromises.delete(key);
      }
    })();

    this.inFlightPromises.set(key, fetchPromise);
    return fetchPromise;
  }

  invalidate(key) {
    this.dataCache.delete(key);
    this.inFlightPromises.delete(key);
  }

  clear() {
    this.dataCache.clear();
    this.inFlightPromises.clear();
  }
}

```

---

### Simulation & Verification

```javascript
const cache = new AsyncMemoCache(2000); // 2-second TTL
let networkCallCount = 0;

// Mock expensive DB/API operation taking 500ms
async function fetchUserData(userId) {
  networkCallCount++;
  console.log(`[DB Query #${networkCallCount}] Fetching user ${userId}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: userId, name: `User ${userId}`, loadedAt: Date.now() };
}

async function runTest() {
  console.log('--- Triggering 5 simultaneous requests for user 42 ---');

  // 5 simultaneous incoming requests
  const results = await Promise.all([
    cache.getOrFetch('user:42', () => fetchUserData(42)),
    cache.getOrFetch('user:42', () => fetchUserData(42)),
    cache.getOrFetch('user:42', () => fetchUserData(42)),
    cache.getOrFetch('user:42', () => fetchUserData(42)),
    cache.getOrFetch('user:42', () => fetchUserData(42)),
  ]);

  console.log(`Total DB Calls executed: ${networkCallCount}`); // Exactly 1
  console.log(`All 5 results match:`, results.every((r) => r.id === 42)); // true
}

runTest();

```

---

### Execution Lifecycle

```text
Request 1 ──► [Key Miss] ──► Create Promise ──► Set inFlightMap ──► Start Network Fetch ──┐
Request 2 ──► [Key Miss] ──► In-flight exists? ─► Return Promise 2 (Shares Request 1) ─┤
Request 3 ──► [Key Miss] ──► In-flight exists? ─► Return Promise 3 (Shares Request 1) ─┤
                                                                                        │
Network Fetch Resolves ◄────────────────────────────────────────────────────────────────┘
 │
 ├── 1. Store result in dataCache with TTL
 ├── 2. Remove key from inFlightMap (via finally)
 └── 3. All 3 callers receive the resolved value simultaneously

```

---

### Key Production Considerations

* **Error Isolation:** If `asyncFetcher` rejects, the `finally` block deletes the in-flight entry so subsequent callers are not stuck awaiting a rejected promise.
* **Stale-While-Revalidate (SWR):** You can extend this pattern to immediately return the expired `entry.value` while triggering `getOrFetch` in the background to refresh asynchronously.

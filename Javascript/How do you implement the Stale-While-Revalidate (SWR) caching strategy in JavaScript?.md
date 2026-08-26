*** copy How do you implement the Stale-While-Revalidate (SWR) caching strategy in JavaScript?.md ***

The **Stale-While-Revalidate (SWR)** caching strategy follows a specific contract:

1. **Cache Hit (Fresh):** If data is fresh, return it immediately without background work.
2. **Cache Hit (Stale):** If data is stale, **return the stale data immediately** (zero latency for the user) while triggering an asynchronous background fetch to refresh the cache.
3. **Cache Miss:** If no cached data exists, wait for the network fetch, cache the result, and return it.

---

### Implementation

```javascript
class SWRCache {
  /**
   * @param {Object} options
   * @param {number} options.freshDurationMs How long data is considered strictly fresh (default: 5s)
   * @param {number} options.staleDurationMs How long stale data can be served while revalidating (default: 60s)
   */
  constructor({ freshDurationMs = 5000, staleDurationMs = 60000 } = {}) {
    this.freshDurationMs = freshDurationMs;
    this.staleDurationMs = staleDurationMs;
    this.cache = new Map(); // key -> { data, cachedAt }
    this.inFlightFetches = new Map(); // key -> Promise (for deduplication)
    this.subscribers = new Map(); // key -> Set<callback> (for UI updates on revalidation)
  }

  /**
   * Subscribe to updates when background revalidation finishes
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);

    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) this.subscribers.delete(key);
      }
    };
  }

  _notify(key, data) {
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach((cb) => cb(data));
    }
  }

  /**
   * Performs deduplicated network fetch and updates the cache
   */
  _revalidate(key, fetcher) {
    if (this.inFlightFetches.has(key)) {
      return this.inFlightFetches.get(key);
    }

    const fetchPromise = (async () => {
      try {
        const freshData = await fetcher();
        this.cache.set(key, {
          data: freshData,
          cachedAt: Date.now(),
        });
        // Notify any active UI subscribers of the fresh data
        this._notify(key, freshData);
        return freshData;
      } catch (error) {
        console.error(`[SWR] Revalidation failed for key "${key}":`, error);
        throw error;
      } finally {
        this.inFlightFetches.delete(key);
      }
    })();

    this.inFlightFetches.set(key, fetchPromise);
    return fetchPromise;
  }

  /**
   * Main SWR execution method
   */
  async get(key, fetcher) {
    const now = Date.now();
    const entry = this.cache.get(key);

    // 1. Cache Miss or Completely Expired: Must wait for fetch
    if (!entry || (now - entry.cachedAt) > (this.freshDurationMs + this.staleDurationMs)) {
      return this._revalidate(key, fetcher);
    }

    const age = now - entry.cachedAt;

    // 2. Fresh Hit: Return cached data directly
    if (age <= this.freshDurationMs) {
      return entry.data;
    }

    // 3. Stale Hit: Serve stale data immediately, revalidate in background
    this._revalidate(key, fetcher).catch(() => {
      // Revalidation error caught silently so caller gets the stale data without crashing
    });

    return entry.data;
  }

  invalidate(key) {
    this.cache.delete(key);
    this.inFlightFetches.delete(key);
  }
}

```

---

### Step-by-Step Flow

```text
               Incoming Request for Key
                          │
                   Is key in cache?
                    │            │
                  [No]         [Yes]
                    │            │
            Fetch from Network   Is it within Fresh Window?
                    │            │                     │
                    ▼          [Yes]                  [No]
             Save & Return       │                     │
                                 ▼            Is it within Stale Window?
                           Return Cached               │             │
                                                     [Yes]          [No]
                                                       │             │
                                ┌──────────────────────┘             ▼
                                │                              Fetch Fresh
                     ┌──────────┴──────────┐                   (Full Miss)
                     ▼                     ▼
             Return Stale Data     Trigger Background
                Immediately           Revalidation

```

---

### Verification Simulation

```javascript
const swr = new SWRCache({
  freshDurationMs: 1000,  // Fresh for 1s
  staleDurationMs: 4000,  // Stale (usable) for next 4s
});

let fetchCount = 0;
const fetchUser = async () => {
  fetchCount++;
  console.log(`-> Network fetch #${fetchCount} running...`);
  await new Promise((r) => setTimeout(r, 400));
  return { version: fetchCount, timestamp: Date.now() };
};

async function test() {
  // 1. Initial Call: Full Miss -> Waits 400ms
  console.log('Call 1 (Miss):', await swr.get('user', fetchUser));

  // 2. Call within 500ms: Fresh Hit -> Instant
  await new Promise((r) => setTimeout(r, 500));
  console.log('Call 2 (Fresh):', await swr.get('user', fetchUser));

  // 3. Call at 1500ms: Stale Window -> Returns Version 1 INSTANTLY, fetches Version 2 in background
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Call 3 (Stale - Instant):', await swr.get('user', fetchUser));

  // 4. Wait for background fetch to complete and call again
  await new Promise((r) => setTimeout(r, 600));
  console.log('Call 4 (After Revalidation):', await swr.get('user', fetchUser));
}

test();

```

**Output:**

```text
-> Network fetch #1 running...
Call 1 (Miss): { version: 1, timestamp: ... }
Call 2 (Fresh): { version: 1, timestamp: ... }
Call 3 (Stale - Instant): { version: 1, timestamp: ... }
-> Network fetch #2 running...
Call 4 (After Revalidation): { version: 2, timestamp: ... }

```

---

### Key Advantages

* **Instant Perceived Performance:** UI components render without loading spinners when stale data is available.
* **Network Resilience:** If the background revalidation fails due to offline/network issues, the user still sees cached data rather than a blank error screen.
* **Auto Deduplication:** Even if 10 components query the stale key simultaneously, only **one** background network request is dispatched.

***  How do shared closure contexts show up as memory leaks in Chrome DevTools Memory heap snapshots?.md ***

In V8, all closures created inside the same parent function scope share a single, unified **`system / Context`** object on the Heap.

If one closure retains a large data structure (e.g., a buffer or large array), and a second tiny closure is kept alive (e.g., via `setInterval`, a global event listener, or an exported API), the entire shared `Context`—including the large data—is pinned in memory.

---

### The Classic Shared Context Leak Code

Paste this snippet into Chrome DevTools to reproduce the leak:

```javascript
let leakyRunner;

function startLeak() {
  // A huge array (~80MB)
  const hugeData = new Array(10000000).fill("🚨 Memory Hog 🚨");
  let smallCounter = 0;

  // Closure 1: References hugeData (never exported, but created in scope)
  function unusedWorker() {
    return hugeData.length;
  }

  // Closure 2: Only touches smallCounter, but SHARES the Heap Context with unusedWorker!
  leakyRunner = function keepAlive() {
    return ++smallCounter;
  };
}

startLeak();

```

---

### Step-by-Step Heap Snapshot Inspection

#### Step 1: Take a Heap Snapshot

1. Open **Chrome DevTools** (`F12` or `Cmd + Option + I`).
2. Go to the **Memory** tab.
3. Select **Heap snapshot** and click **Take snapshot** (Snapshot 1).

---

#### Step 2: Locate the Leaked Memory

In the Snapshot view:

1. In the **Class filter** box at the top right, type `system / Context` (or `Array`).
2. Sort the table by **Retained Size** (descending).
3. You will immediately notice a `system / Context` holding ~80MB+ of memory.

```text
Constructor                Distance  Shallow Size  Retained Size
▼ system / Context             4          64 B       80,000,064 B  (100%)
  ▼ hugeData in system / Context                      80,000,000 B
    smallCounter: 0

```

---

#### Step 3: Inspect the Retainers Tree (Root Cause Analysis)

Click on the `system / Context` row and look at the bottom **Retainers** pane:

```text
▼ Retainers
  ▼ system / Context in @134523
    ▼ context in keepAlive() [@134527]          <-- The innocent small closure
      ▼ leakyRunner in Window / Global Scope     <-- The GC Root holding it alive

```

**How to read this:**

1. **GC Root:** The global variable `leakyRunner` holds a reference to `keepAlive()`.
2. **Context Link:** `keepAlive()` retains the shared `system / Context` object via its internal `[[Scopes]]`.
3. **The Leak:** Inside that exact same `system / Context` sits `hugeData`, even though `keepAlive()` never accesses it.

---

### Key Takeaways & Mitigation

* **Shallow Size vs Retained Size:**
* `keepAlive()` has a tiny *Shallow Size* (a few dozen bytes).
* Its *Retained Size* is ~80MB because freeing `keepAlive()` would allow the GC to collect the entire `system / Context` and `hugeData`.

* **The Fix (Manual Nulling):** If a large variable is only needed temporarily inside a shared scope, set it to `null` (`hugeData = null`) once finished, or split independent operations into separate lexical helper functions.

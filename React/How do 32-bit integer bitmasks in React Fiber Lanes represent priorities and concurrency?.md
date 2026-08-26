*** copy How do 32-bit integer bitmasks in React Fiber Lanes represent priorities and concurrency?.md ***

React Fiber represents priority and concurrent task groups using **31-bit integer bitmasks** (JavaScript treats bitwise operands as 32-bit signed integers; React reserves 31 bits to avoid sign-bit pitfalls).

Lanes replaced the older expiration-time model (which used continuous numbers) because numbers only represent a 1D scale of urgency. Bitmasks allow React to represent **both priority** (which bit position is active) and **groups/batches of independent work** (multiple bits flipped simultaneously) in $O(1)$ operations with zero heap allocation.

---

**1. The 31-bit Bitmask Layout**

In `ReactFiberLane.js`, each bit corresponds to a specific category of work. Lower numerical values (lower bit positions) have higher priority:

```javascript
// Highest Priority
export const SyncLane: Lane                = 0b0000000000000000000000000000001; // 1 (Discrete user inputs like clicks/keypress)
export const InputContinuousHydrationLane: Lane = 0b0000000000000000000000000000010; // 2
export const InputContinuousLane: Lane     = 0b0000000000000000000000000000100; // 4 (Mousemove, scrolling, hover)

export const DefaultHydrationLane: Lane    = 0b0000000000000000000000000001000; // 8
export const DefaultLane: Lane             = 0b0000000000000000000000000010000; // 16 (Normal state updates, network response fetches)

// Transition Lanes (16 bits grouped together for startTransition)
export const TransitionHydrationLane: Lane = 0b0000000000000000000000000100000; // 32
const TransitionLanes: Lanes               = 0b0000000001111111111111111000000; // 64 to 4,194,176 (16 distinct slots)

// Low Priority / Background
export const IdleHydrationLane: Lane       = 0b0010000000000000000000000000000;
export const IdleLane: Lane                = 0b0100000000000000000000000000000; // Background tasks when CPU is free
export const OffscreenLane: Lane           = 0b1000000000000000000000000000000; // React Suspense hidden prerendering
export const NoLanes: Lanes                = 0b0000000000000000000000000000000; // 0 (No work pending)

```

---

**2. Bitwise Algebra for Scheduler Operations**

Because lanes are bitmasks, complex priority comparisons and batch aggregations run in single CPU instructions.

### A. Finding the Highest-Priority Lane: `lanes & -lanes`

To isolate the single lowest set bit (the most urgent task) from a multi-bit mask, React uses the two's complement bitwise trick:

```typescript
function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes;
}

```

* **Example:** If `lanes = 0b00010100` (`DefaultLane | InputContinuousLane`),
* `-lanes = (~lanes) + 1 = 0b11101100`
* `lanes & -lanes = 0b00000100` $\rightarrow$ **`InputContinuousLane` extracted in 1 instruction**.

---

### B. Merging Updates (Union): `lanes | newLane`

When a state update is dispatched on a Fiber, its lane is merged into the Fiber and bubbled up through its ancestors:

```typescript
fiber.lanes |= updateLane;
parentFiber.childLanes |= updateLane;

```

---

### C. Checking Intersection / Subsets: `(lanes & renderLanes) !== 0`

To check whether a Fiber has work in the current render pass:

```typescript
function isSubsetOfLanes(set: Lanes, subset: Lane | Lanes): boolean {
  return (set & subset) === subset;
}

function includesSomeLane(a: Lanes, b: Lanes): boolean {
  return (a & b) !== 0;
}

```

---

### D. Clearing Completed Work: `lanes & ~completedLanes`

Once a render pass commits successfully, React clears those lanes from the root:

```typescript
root.pendingLanes &= ~renderLanes;

```

---

**3. Concurrency via Transition Lane Multiplexing**

One limitation of single-priority models was the inability to run multiple, independent background tasks without them entangling each other.

React reserves **16 discrete Transition Lanes** (`TransitionLane1` through `TransitionLane16`):

```
TransitionLanes bitmask:
  0b0000000001111111111111111000000
             └────── 16 bits ──────┘

```

* When `startTransition(fn1)` is called, React assigns bit `TransitionLane1` (`0b0000000000000000000000001000000`).
* If another concurrent transition `startTransition(fn2)` begins before the first finishes, React assigns the next slot: `TransitionLane2` (`0b0000000000000000000000010000000`).
* **Independent Suspense:** If `Transition 1` suspends (waiting for data), React does not block `Transition 2`. React clears `TransitionLane1` from active work, processes `TransitionLane2`, and commits it independently.

---

**4. Starvation Prevention and Lane Expiration**

If low-priority transitions are continuously interrupted by high-priority inputs (like typing), the low-priority work risks **starvation**.

React tracks an `expirationTimes` array indexed by lane position:

1. When a lane becomes pending, React assigns an expiration timestamp:

$$\text{expirationTime} = \text{currentTime} + \text{laneBudget}$$

1. During every Scheduler tick, `markStarvedLanesAsExpired()` checks:

```typescript
if (currentTime > expirationTime) {
  root.expiredLanes |= lane; // Mark as expired
}

```

1. React's scheduler checks `expiredLanes`. If any lane is expired, React elevates that work directly to **`SyncLane`**, disabling time-slicing and forcing a synchronous, non-interruptible commit to guarantee the UI updates.

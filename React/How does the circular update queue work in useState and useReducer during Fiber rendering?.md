*** copy How does the circular update queue work in useState and useReducer during Fiber rendering?.md ***

When you call `setState` or `dispatch`, React does not update `hook.memoizedState` immediately. Instead, it appends an **`Update` object** to a **circular singly-linked list** attached to `hook.queue.pending`.

---

**1. The `Update` and `UpdateQueue` Data Structures**

Every `useState` or `useReducer` hook instance owns an update queue:

```typescript
type Update<S, A> = {
  lane: Lane,               // Priority of this specific update
  action: A,               // Value or updater function: (prevState) => nextState
  hasEagerState: boolean,  // True if state was pre-computed for optimization
  eagerState: S | null,    // Pre-computed state (if applicable)
  next: Update<S, A>,      // Pointer to next update in the circular ring
};

type UpdateQueue<S, A> = {
  pending: Update<S, A> | null, // Pointer to the LAST update inserted
  lanes: Lanes,                 // Combined priority bitmask of pending updates
  dispatch: (action: A) => any, // Bound dispatch/setState function
  lastRenderedReducer: (state: S, action: A) => S,
  lastRenderedState: S,
};

```

---

**2. Why Circular? $O(1)$ Enqueuing and $O(1)$ Head Access**

In a standard singly-linked list, storing a pointer to the **head** requires traversing all nodes ($O(n)$) to append a new update to the tail. Storing a pointer to the **tail** requires keeping a second pointer for the head.

By making the list **circular** where `queue.pending` points to the **tail (newest update)**:

* **Tail (Newest Update):** `queue.pending`
* **Head (Oldest Update / First to process):** `queue.pending.next`

Both head and tail are accessible in **$O(1)$ time with a single pointer**.

---

**3. Enqueuing an Update (`dispatchSetState`)**

When multiple state updates occur between renders (e.g., inside an event handler):

```javascript
setCount(c => c + 1); // Update u1
setCount(c => c + 2); // Update u2
setCount(c => c + 3); // Update u3

```

React wires the ring step-by-step:

### Step 1: First update (`u1`)

`u1.next` points to itself:

```
queue.pending ──► [ u1 ] ──┐
                    ▲      │
                    └──────┘

```

### Step 2: Second update (`u2`)

`u2` is inserted after `u1`, and `queue.pending` moves to `u2`:

```
                  ┌───────────────┐
                  ▼               │
queue.pending ──► [ u2 ] ──► [ u1 ]

```

* `u2.next` points to `u1` (the head).
* `u1.next` points to `u2`.

### Step 3: Third update (`u3`)

`u3` is inserted between `u2` and `u1`:

```
                  ┌───────────────────────────────┐
                  ▼                               │
queue.pending ──► [ u3 ] ──► [ u1 ] ──► [ u2 ] ───┘
                    ▲          ▲
                 (Tail)      (Head)

```

* Head: `queue.pending.next` $\rightarrow$ `u1`
* Tail: `queue.pending` $\rightarrow$ `u3`

---

**4. Processing the Circular Queue in `beginWork()` (`updateReducer`)**

When the component re-renders, `updateReducer()` (which powers both `useReducer` and `useState`) processes the queue:

```
[beginWork: updateReducer]
           │
           ▼
1. Break Circle into Linear List
   firstUpdate = queue.pending.next
   queue.pending.next = null
           │
           ▼
2. Iterate from firstUpdate to End
   ┌────────────────────────────────────────────────┐
   │ Loop:                                          │
   │  - Check if update.lane matches renderLanes    │
   │  - If matches: newState = reducer(state, action)
   │  - If skipped: preserve in baseQueue           │
   │  - update = update.next                        │
   └───────────────────────┬────────────────────────┘
                           │
                           ▼
3. Set hook.memoizedState = newState

```

### Step-by-Step Execution

1. **Break the Circle:**
To safely iterate using a standard loop (`while (update !== null)`), React severs the ring:

```typescript
const pendingQueue = queue.pending;
const firstUpdate = pendingQueue.next; // Head
pendingQueue.next = null;             // Break loop at tail

```

1. **Sequential Reducer Calculation:**
Starting at `firstUpdate`, React loops through the chain in FIFO order (First-In, First-Out), feeding each action into the reducer:

```typescript
let update = firstUpdate;
let newState = hook.baseState;

do {
  const action = update.action;
  newState = typeof action === 'function' ? action(newState) : action;
  update = update.next;
} while (update !== null);

hook.memoizedState = newState;

```

1. **Handling Interleaved / Skipped Priorities (Lanes):**
If an update's lane has lower priority than the current render lane, React **skips** it for now. The skipped update—and all subsequent updates (to maintain deterministic state calculation)—are saved in `hook.baseQueue` and re-processed during the next lower-priority render pass.

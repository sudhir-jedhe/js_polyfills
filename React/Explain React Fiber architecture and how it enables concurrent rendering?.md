React Fiber is a complete rewrite of React’s core reconciliation engine, designed to enable **incremental rendering** and **concurrency** by breaking rendering work into interruptible units of execution.

---

### The Problem Fiber Solved: Stack Reconciler

Prior to Fiber (React 15 and earlier), React used recursive tree traversal (the **Stack Reconciler**).

* **Synchronous & Blocking:** Once reconciliation started, it could not be paused until the entire component tree was traversed and updated.
* **Frame Drops:** If the tree was large and took longer than 16ms (for a 60fps refresh rate), the browser main thread was blocked, causing stuttering animations, delayed keystrokes, and dropped user inputs.

---

### What is a "Fiber"?

A **Fiber** is both an architecture and a plain JavaScript object representing a unit of work. It acts as a virtual stack frame maintained in heap memory.

Each Fiber node points to:

* **`child`**: Its first direct child.
* **`sibling`**: Its next immediate sibling.
* **`return`**: Its parent node (where control returns after processing).
* **`alternate`**: The corresponding Fiber node in the alternate tree (used for double buffering).
* **`memoizedState` / `memoizedProps**`: The state and props used to render the node in the previous commit.
* **`lanes`**: Bitmasks indicating the priority levels of pending updates.

Because these pointers form a linked list rather than relying on JavaScript's call stack, React can stop mid-tree, yield execution back to the browser's event loop, and resume later from the exact Fiber node where it left off.

---

### Core Architecture: Two Phases & Double Buffering

Fiber splits the rendering pipeline into two distinct phases:

```
┌────────────────────────────────────────────────────────┐
│ Render / Reconciliation Phase (Asynchronous)           │
│ - Work loop traverses Fiber tree                       │
│ - Pausable, interruptible, abortable                   │
│ - Computes changes (effects)                           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Commit Phase (Synchronous)                             │
│ - Applies DOM mutations and lifecycle methods          │
│ - Fast, non-interruptible                              │
│ - Swaps `current` and `workInProgress` pointers        │
└────────────────────────────────────────────────────────┘

```

#### 1. Double Buffering

React maintains two Fiber trees at any given time:

* **`current` tree:** Represents the state currently visible on the screen.
* **`workInProgress` (WIP) tree:** Constructed in memory during the render phase. If work is interrupted or aborted, the WIP tree is simply discarded without affecting the UI. When the render phase completes, React switches the root pointer to the WIP tree during the commit phase.

#### 2. The Render Phase (Pausable)

The internal `workLoopConcurrent` checks whether there is remaining time on the main thread:

```javascript
function workLoopConcurrent() {
  // Perform work until deadline or tree completes
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

```

* `beginWork()`: Processes the current Fiber, reconciles children, and returns the next child node.
* `completeWork()`: Traverses up and sideways when a leaf node is reached, preparing DOM nodes and bubbling up side-effects.

#### 3. The Commit Phase (Non-interruptible)

Once the entire WIP tree is constructed, React enters the synchronous commit phase:

1. **Mutation:** Inserts, updates, or removes DOM nodes.
2. **Layout:** Runs synchronous layout effects (`useLayoutEffect`).
3. **Passive:** Runs asynchronous side-effects (`useEffect`).

---

### How Fiber Enables Concurrent Rendering

Concurrent rendering allows React to prepare multiple versions of the UI simultaneously and prioritize user-critical interactions over background rendering.

* **Cooperative Multitasking:** Fiber uses the browser’s task scheduler (historically `requestIdleCallback`, now React's internal `Scheduler` using `MessageChannel`) to split rendering into discrete time slices (~5ms slices).
* **Lanes-Based Priority:** Fiber groups updates using 31-bit priority masks called **Lanes**. Urgent updates (typing, clicking) receive high-priority lanes, while transitions or deferred data fetches receive lower-priority lanes.
* **Interruptibility & Preemption:** If React is rendering a heavy list in a low-priority lane and a user clicks a button (high priority), React halts the low-priority render, executes the high-priority update immediately, commits it, and then restarts or resumes the lower-priority work.
* **Concurrent Features (React 18+):**
* `useTransition`: Marks state updates as non-urgent transitions that yield to user inputs.
* `useDeferredValue`: Defers re-rendering a section of the component tree until urgent work completes.
* `Suspense`: Lets components suspend during the render phase without blocking sibling rendering or committing incomplete DOM trees.

Here is the simplified, annotated TypeScript definition of the internal `Fiber` node as implemented in React’s source code (`ReactInternalTypes.js`), followed by a functional breakdown of its fields.

```typescript
export type WorkTag = 0 | 1 | 2 | 3 | 5 | 6 | 7 | 11 | 14 /* ... */;
export type Flags = number; // 32-bit bitmask (formerly EffectTag)
export type Lanes = number; // 31-bit bitmask

export interface Fiber {
  // ─── 1. Identity & Tagging ─────────────────────────────────────────
  tag: WorkTag;              // Type of component (FunctionComponent, HostComponent, etc.)
  key: null | string;        // Unique key for reconciliation
  elementType: any;          // The raw unresolved element type
  type: any;                 // Resolved function/class or DOM string tag
  stateNode: any;            // Local instance (DOM node, class instance, etc.)

  // ─── 2. Tree Traversal Pointers (The Singly Linked List) ────────────
  return: Fiber | null;      // Parent Fiber (where execution returns after completeWork)
  child: Fiber | null;       // First immediate child Fiber
  sibling: Fiber | null;     // Next immediate sibling Fiber
  index: number;             // Index among siblings

  ref: null | (((handle: any) => void) & { _stringRef?: string }) | { current: any };

  // ─── 3. Props, State & Hooks ───────────────────────────────────────
  pendingProps: any;         // Props incoming from parent / JSX element
  memoizedProps: any;        // Props used during the previous commit
  updateQueue: any;          // Queue of pending state updates or effects
  memoizedState: any;        // State used to create the output (Hooks linked list for FCs)
  dependencies: any | null;  // Context dependencies list

  // ─── 4. Concurrency, Prioritization & Effects ──────────────────────
  mode: number;              // Bitfield for runtime mode (ConcurrentMode, StrictLegacyMode, etc.)
  flags: Flags;              // Bitmask of side-effects to perform in commit phase (Placement, Update, Deletion)
  subtreeFlags: Flags;       // Bitmask of all flags in this subtree (avoids deep traversal if 0)
  deletions: Array<Fiber> | null; // Child Fibers scheduled for deletion

  lanes: Lanes;              // Bitmask representing priority of work scheduled on this fiber
  childLanes: Lanes;         // Bitmask representing priority of work in its subtree

  // ─── 5. Double Buffering Pointer ───────────────────────────────────
  alternate: Fiber | null;   // The corresponding node in the other tree (Current <-> WorkInProgress)
}

```

---

### Key Field Groups Explained

**1. Tree Navigation (Why React Can Pause)**
Unlike a traditional tree with a `children: Fiber[]` array, Fiber uses three pointers:

* `child`: Points solely to the first child.
* `sibling`: Points to the adjacent sibling.
* `return`: Points back to the parent.

This forms a linked list that React traverses iteratively using a simple pointer (`workInProgress = workInProgress.child || workInProgress.sibling || ...`). Because there is no nested call stack, React can pause by saving a single pointer in memory and yield execution.

**2. State & Hooks Storage (`memoizedState`)**

* In **Class Components**: `memoizedState` holds the state object (`this.state`).
* In **Function Components**: `memoizedState` is the head of a singly linked list of Hook objects (`useState`, `useEffect`, `useMemo`), which is why Hooks must always be called in the exact same order on every render.

**3. Prioritization & Scheduling (`lanes`, `childLanes`)**

* `lanes`: A 31-bit bitmask where each bit represents a priority level (e.g., `SyncLane`, `InputContinuousLane`, `DefaultLane`, `IdleLane`).
* `childLanes`: Tracks whether any descendant has pending work. If a Fiber's `childLanes` does not match the currently rendering lane, React can bailout and skip traversing that entire subtree instantly.

**4. Mutation Flags (`flags`, `subtreeFlags`)**

* `flags` (e.g., `Placement`, `Update`, `Passive`): Tells the commit phase what DOM operations or side-effects are needed for this specific node.
* `subtreeFlags`: Aggregates the flags of all child nodes. If `subtreeFlags === NoFlags`, the commit phase can skip the subtree entirely without inspecting every child.

**5. Double Buffering (`alternate`)**

* The `alternate` property connects a node in the visible `current` tree to its counterpart in the offscreen `workInProgress` tree. React recycles these objects rather than allocating new memory on every render, drastically reducing garbage collection overhead.

Walk through how beginWork and completeWork manipulate Fiber pointers during a render pass with a concrete component example.

To see how `beginWork` and `completeWork` operate, consider this component tree:

```jsx
function App() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

```

---

### The Work Loop Mechanics

React traverses the Fiber tree in a **Depth-First Search (DFS)** pattern using a single global pointer: `workInProgress`.

* **`beginWork(current, workInProgress, renderLanes)` (Downward phase):** Executes component functions, evaluates hooks, computes new props/state, runs reconciliation/diffing against child elements, and returns the **first child** Fiber node.
* **`completeWork(current, workInProgress, renderLanes)` (Upward phase):** Executes when reaching a leaf (or when all children are done). Creates or updates host instances (DOM nodes), links DOM parent-child relationships in memory, bubbles up `subtreeFlags`, and moves to the next `sibling` or `return` parent.

```
       App
        │
       div
      ┌─┴─┐
     h1   p

```

---

### Step-by-Step Execution Trace

**Step 1: Process `App` (Downward)**

* `workInProgress` points to `App`.
* `beginWork(App)` runs: Executes the `App()` function, which returns JSX `<div>...</div>`.
* React reconciles JSX to spawn a child Fiber: `div`.
* Sets `App.child = div` and `div.return = App`.
* **Result:** `beginWork` returns the `div` Fiber. Next `workInProgress = div`.

**Step 2: Process `div` (Downward)**

* `workInProgress` points to `div`.
* `beginWork(div)` runs: Reconciles the array of children `[<h1>, <p>]`.
* Creates `h1` and `p` Fibers.
* Links pointers:
* `div.child = h1`
* `h1.return = div`
* `h1.sibling = p`
* `p.return = div`

* **Result:** `beginWork` returns `h1`. Next `workInProgress = h1`.

**Step 3: Process `h1` (Downward & Upward)**

* `workInProgress` points to `h1`.
* `beginWork(h1)` runs: Reconciles string child `"Title"`. (Text nodes can be handled directly or as leaf host text fibers).
* `h1` has no child Fiber to traverse down into.
* **Result:** `beginWork` returns `null`. React switches to `completeUnitOfWork(h1)`.

**Step 4: Complete `h1**`

* `completeWork(h1)` runs:
* Creates the actual DOM element: `document.createElement('h1')`.
* Appends the text node `"Title"` to the DOM element.
* Checks for `flags` (e.g., `Placement` for initial mount).

* React checks `h1.sibling` → finds `p`.
* **Result:** Next `workInProgress = p`.

**Step 5: Process `p` (Downward & Upward)**

* `workInProgress` points to `p`.
* `beginWork(p)` runs: Reconciles text `"Content"`, finds no child Fiber.
* Returns `null` → switches to `completeUnitOfWork(p)`.
* `completeWork(p)` runs:
* Creates DOM element: `document.createElement('p')`.
* Appends `"Content"`.

* React checks `p.sibling` → `null` (no more siblings).

**Step 6: Complete `div**`

* Because `p.sibling` is `null`, React moves up: `workInProgress = p.return` (`div`).
* `completeWork(div)` runs:
* Creates `document.createElement('div')`.
* Appends the already-created DOM nodes of `h1` and `p` to the `div` DOM node: `divNode.appendChild(h1Node)` and `divNode.appendChild(pNode)`.
* Bubbles up `subtreeFlags` from `h1` and `p` to `div`.

* React checks `div.sibling` → `null`.

**Step 7: Complete `App` & Root**

* React moves up: `workInProgress = div.return` (`App`).
* `completeWork(App)` runs: App has no DOM element of its own; it collects `subtreeFlags` from `div`.
* React moves up: `workInProgress = App.return` (`FiberRootNode`).
* `workInProgress` becomes `null`. The render phase finishes.

---

### Pointer Movement Summary

| Step | Current Node | Phase          | Next Pointer Action              | Next Node       |
| ---- | ------------ | -------------- | -------------------------------- | --------------- |
| 1    | `App`        | `beginWork`    | Descend via `.child`             | `div`           |
| 2    | `div`        | `beginWork`    | Descend via `.child`             | `h1`            |
| 3    | `h1`         | `beginWork`    | Leaf reached (returns `null`)    | `h1`            |
| 4    | `h1`         | `completeWork` | Advance via `.sibling`           | `p`             |
| 5    | `p`          | `beginWork`    | Leaf reached (returns `null`)    | `p`             |
| 6    | `p`          | `completeWork` | No sibling, ascend via `.return` | `div`           |
| 7    | `div`        | `completeWork` | No sibling, ascend via `.return` | `App`           |
| 8    | `App`        | `completeWork` | Ascend to root                   | `FiberRootNode` |

Once `workInProgress` reaches the root and becomes `null`, React passes the constructed off-screen DOM tree and the aggregated `subtreeFlags` to the synchronous **Commit Phase**, where it attaches the top-level `div` to the real container in a single fast DOM mutation.

Explain how React interrupts the beginWork/completeWork loop when a higher priority event occurs.

React interrupts the `beginWork`/`completeWork` traversal through a combination of **cooperative time-slicing**, **lane-based priority preemption**, and **safe discard/restart mechanisms**.

---

### 1. The Yielding Mechanism (`shouldYield`)

During the render phase, the work loop doesn't run continuously; it repeatedly checks with the `Scheduler` to see if it should yield back to the browser:

```javascript
function workLoopConcurrent() {
  // Perform work on one fiber node at a time until time runs out
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

```

* **Time Slices (~5ms):** React allocates roughly 5ms chunks of work.
* `shouldYield()` returns `true` when the current frame budget has expired or when higher-priority browser events (like a keypress or click) are waiting in the browser task queue.
* When `shouldYield()` returns `true`, `workLoopConcurrent` exits the `while` loop cleanly.

---

### 2. The Interruption Sequence Step-by-Step

Imagine React is rendering a low-priority transition (e.g., sorting a massive list) when the user suddenly types into an input field:

```
Low-Priority Task (DefaultLane) Running
                │
                ▼
      User types in <input />  ───► Browser fires discrete event (SyncLane)
                │
                ▼
React yields execution back to browser event loop
                │
                ▼
React schedules new Root Update with higher priority
                │
                ▼
Scheduler compares: SyncLane > DefaultLane (Preemption!)
                │
                ▼
WIP Tree discarded/paused ───► High-priority render executes & commits
                │
                ▼
Low-priority task restarts or resumes in background

```

#### Step A: Discrete Event Enters the Queue

1. The user presses a key. The browser fires an `onKeyDown`/`onChange` event.
2. React wraps this event in a high-priority lane: `SyncLane` (or `InputContinuousLane`).
3. React calls `scheduleUpdateOnFiber(root, fiber, lane)`.

#### Step B: Priority Comparison & Preemption

React calls `ensureRootIsScheduled(root)` to determine what to work on next:

* It looks at the currently executing lane: `currentRenderLanes` (`DefaultLane` / low priority).
* It checks the most urgent pending lane: `nextLanes` (`SyncLane` / high priority).
* Because `SyncLane` has higher numerical bit priority than `DefaultLane`, React decides to **preempt** the current work.

#### Step C: Interruption & Tree Discard

If the current render is not yet committed, React cannot safely mix changes from two different priority levels on the same work-in-progress tree.

1. React resets the global `workInProgress` pointer:

```javascript
// Abandon the current WIP tree
workInProgressRoot = null;
workInProgress = null;

```

1. The entire in-memory `workInProgress` tree that was half-built is safely abandoned to garbage collection. Because no DOM mutations occurred during the render phase, the screen remains completely intact and undisturbed.

#### Step D: Processing the High-Priority Render

1. React immediately kicks off a new render pass targeting `SyncLane`.
2. `prepareFreshStack(root, SyncLane)` allocates a brand-new `workInProgress` tree cloned from the still-valid `current` tree.
3. The high-priority update completes, enters the **Commit Phase**, and updates the input value on screen instantly (under 16ms).

#### Step E: Resuming/Restarting Low-Priority Work

1. After committing the high-priority render, React calls `ensureRootIsScheduled(root)` again.
2. It detects remaining work in the lower-priority `DefaultLane`.
3. React schedules a new background task with the `Scheduler` to start the low-priority render from scratch (or rebase it against the newly committed state).

---

### Summary of Safety Guarantees

* **No Tearing or Broken UI:** Because all interruptions happen strictly during the **Render Phase** (which is side-effect-free and only builds virtual pointers/offscreen DOM fragments), discarding work leaves the live DOM untouched.
* **Double Buffering Protection:** The user is always looking at the `current` Fiber tree. The abandoned work was isolated inside the discarded `workInProgress` tree.

Explain how React uses bitwise operations and Lanes for priority scheduling.
React uses a **31-bit integer bitmask system called "Lanes"** to represent task priorities, batch updates, and coordinate concurrent rendering.

In earlier Fiber designs, React used a single expiration timestamp to express priority. Lanes replaced timestamps because integers allow React to express **multidimensional sets of tasks** (e.g., "process task A and task B together, but exclude task C") using fast, zero-allocation bitwise operations.

---

### 1. Lane Definitions & Priority Layout

JavaScript bitwise operators treat numbers as 32-bit signed integers (the 32nd bit is the sign bit, so React uses 31 bits).

In React’s convention: **Lower numerical bit value = Higher priority**.

```javascript
// A small subset from ReactFiberLane.js
export const NoLanes: Lanes               = 0b0000000000000000000000000000000;
export const SyncLane: Lane               = 0b0000000000000000000000000000001; // Discrete user input (click, keypress)
export const InputContinuousLane: Lane   = 0b0000000000000000000000000000100; // Continuous events (scroll, mousemove)
export const DefaultLane: Lane           = 0b0000000000000000000000100000000; // Standard setState / network response
export const TransitionLane1: Lane       = 0b0000000000000000010000000000000; // useTransition / startTransition
export const TransitionLane2: Lane       = 0b0000000000000000100000000000000;
// ... (TransitionLanes span bits 6 to 21)
export const IdleLane: Lane               = 0b0100000000000000000000000000000; // Off-screen / low priority work

```

---

### 2. Core Bitwise Operations Used in Scheduling

Because priorities are single bits, React performs scheduling operations with standard bitwise logic:

#### A. Finding the Highest-Priority Lane (`getHighestPriorityLane`)

To determine what to render next, React needs to find the **lowest set bit** (the rightmost `1`):

```javascript
export function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes;
}

```

> **How `lanes & -lanes` works (Two's Complement):**
>
> * If `lanes = 0b0110` (bits 2 and 3 are set):
> * `-lanes = (~lanes + 1) = (~0b0110 + 1) = 0b1001 + 1 = 0b1010`
> * `0b0110 & 0b1010 = 0b0010` (isolates the lowest bit instantly in 1 CPU cycle).
>
>

#### B. Adding Work to a Fiber (`mergeLanes`)

When an update is triggered, React merges the new lane into the Fiber's existing pending lanes using **Bitwise OR (`|`)**:

```javascript
fiber.lanes = fiber.lanes | updateLane;

```

#### C. Clearing Completed Work (`removeLanes`)

When a render pass finishes and commits, React removes the completed lanes using **Bitwise AND-NOT (`& ~`)**:

```javascript
root.pendingLanes = root.pendingLanes & ~renderedLanes;

```

#### D. Checking for Intersection (`includesSomeLane`)

To check if a Fiber or subtree has pending work matching the current render batch, React uses **Bitwise AND (`&`)**:

```javascript
const hasPendingWork = (fiber.lanes & renderLanes) !== NoLanes;
if (!hasPendingWork && (fiber.childLanes & renderLanes) === NoLanes) {
  // Bailout: skip this component and its entire subtree
  return null;
}

```

---

### 3. Key Scheduling Behaviors Enabled by Lanes

#### Batching Updates

Multiple updates of the same or compatible priority can be combined into a single bitmask:

```javascript
// Batching discrete and transition work
const renderBatch = SyncLane | InputContinuousLane; 

```

#### Entanglement & Decoupling

Transitions often need to run together, but if an update in `TransitionLane1` depends on state from `TransitionLane2`, React sets an **entanglement bitmask**:

```javascript
// Marking lanes as entangled
root.entangledLanes |= (TransitionLane1 | TransitionLane2);

```

When React checks `getHighestPriorityLane()`, it checks if the selected lane is entangled; if so, it forces both lanes to render in the same batch rather than splitting them.

#### Starvation Prevention & Expiration

If a low-priority lane (e.g., `DefaultLane`) keeps getting preempted by continuous high-priority inputs (e.g., `InputContinuousLane`), React tracks an **expiration timestamp** for that lane.

Once the deadline passes without the lane committing:

1. React moves the starved lane into `root.expiredLanes`.
2. `getHighestPriorityLane` checks `expiredLanes` first.
3. The expired task is promoted to run **synchronously (blocking)**, guaranteeing it won't be delayed indefinitely.

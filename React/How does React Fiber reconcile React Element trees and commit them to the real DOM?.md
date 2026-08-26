*** copy How does React Fiber reconcile React Element trees and commit them to the real DOM?.md ***

React Fiber is React's core reconciliation engine. It breaks rendering down into an incremental, interruptible unit-of-work pipeline using a singly-linked tree of **Fiber nodes** and a **Double Buffering** strategy.

---

**1. The Fiber Data Structure**

Unlike raw React Elements (which are ephemeral objects recreated on every render), a **Fiber Node** is a persistent, mutable JavaScript object representing a unit of work.

Key fields on each Fiber node:

* **`child`**: Points to its first direct child.
* **`sibling`**: Points to its next sibling.
* **`return`**: Points to its parent fiber (the return address after work is done).
* **`alternate`**: Points to its corresponding fiber in the opposing tree (current vs. work-in-progress).
* **`flags` / `subtreeFlags**`: Bitmasks indicating mutations needed (e.g., `Placement`, `Update`, `Deletion`).
* **`memoizedProps` / `memoizedState**`: Output state from the previous render.

---

**2. Double Buffering Architecture**

React maintains two trees in memory at all times:

* **`current` tree:** Reflects the nodes currently rendered on the screen.
* **`workInProgress` (WIP) tree:** The tree currently being constructed, computed, and reconciled in memory.

When a render finishes, React flips the root pointer: `workInProgress` becomes `current`.

```
                ┌──────────────────────────────┐
                │        FiberRootNode         │
                └──────────────┬───────────────┘
                               │ current
                               ▼
  [ Current Tree ]   ◄── alternate ──►   [ WorkInProgress Tree ]
   (Visible on DOM)                       (Assembled in background)
      HostRoot                               HostRoot (WIP)
         │                                         │
       AppFiber                                AppFiber (WIP)
     ┌───┴───┐                               ┌───┴───┐
   ChildA  ChildB                          ChildA  ChildB

```

---

**3. The Two-Phase Execution Pipeline**

React splits the lifecycle into an asynchronous **Render Phase** and a synchronous **Commit Phase**.

```
[Trigger (setState/Props)]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│ 1. RENDER PHASE (Concurrent, Interruptible, Pure)     │
│                                                        │
│  workLoopConcurrent()                                  │
│    ├── beginWork()  (Diff element vs old Fiber, down)  │
│    └── completeWork() (Assemble DOM nodes/flags, up)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Finished WIP Tree
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. COMMIT PHASE (Synchronous, Uninterruptible)         │
│                                                        │
│  commitRoot()                                          │
│    ├── Before Mutation (getSnapshotBeforeUpdate)       │
│    ├── Mutation Phase  (DOM insert, remove, update)    │
│    ├── Pointer Flip    (current = workInProgress)      │
│    └── Layout Phase    (useLayoutEffect, componentDid*)│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
              [ Passive Effects (useEffect) ]

```

### Phase 1: The Render Phase (Work Loop)

React iterates through the tree via `workLoopConcurrent()`. If a higher-priority task (e.g., user input) enters the queue or the main thread runs out of time (using the `Scheduler`), React can pause work and yield to the browser.

* **`beginWork(current, workInProgress, renderLanes)` (Downward Traversal)**
* Traverses down to leaves via `.child`.
* Executes function components or calls class `render()`.
* **Diffing & Reconciliation:** Compares the new React Elements returned by the component against the existing `current.child` fibers.
* Marks side-effect flags on the node (e.g., marks `Placement` if new, `Update` if props changed, or stages deletions on the parent).
* Reuses unmodified subtrees if props and state haven't changed (bailout).

* **`completeWork(current, workInProgress, renderLanes)` (Upward Traversal)**
* Triggered when a node has no remaining children.
* For host components (`<div>`, `<span>`), it creates the DOM instance (if initial mount) or prepares the update payload (diffing old vs. new attributes).
* Bubbles `subtreeFlags` up to the parent so the commit phase knows which subtrees contain mutations without traversing the whole tree.
* Continues to `.sibling` if present; otherwise, steps back up to `.return`.

### Phase 2: The Commit Phase

The commit phase is **synchronous and uninterruptible** to avoid inconsistent visual UI states. React reads the effect flags on the root fiber and executes three sub-stages:

1. **Before Mutation Phase:** Reads the DOM state prior to modifications (e.g., executing `getSnapshotBeforeUpdate`).
2. **Mutation Phase:** Applies mutations directly to the host DOM:

* Inserts nodes with `Placement`.
* Removes nodes with `Deletion`.
* Updates attributes and event listeners with `Update`.
* Detaches old DOM nodes and executes cleanup functions for layout effects.

1. **Pointer Swap:** `root.current = workInProgress`. The WIP tree officially becomes the new `current` tree.
2. **Layout Phase:** Executes layout lifecycles and hooks synchronously (`useLayoutEffect`, `componentDidMount`, `componentDidUpdate`).
3. **Passive Effects:** Schedules `useEffect` cleanup and callback execution to run asynchronously in a microtask/macrotask after the browser has completed its paint.

---

**Summary of Key Differences**

| Mechanism        | Stack Reconciler (React 15)                 | Fiber Reconciler (React 16+)                         |
| ---------------- | ------------------------------------------- | ---------------------------------------------------- |
| **Execution**    | Recursive, synchronous, blocking            | Loop-based, incremental, interruptible               |
| **Tree Storage** | JavaScript call stack                       | Singly-linked list of Fiber heap objects             |
| **Concurrency**  | Not possible; drops frames on large updates | Supports priority lanes, suspension, and transitions |
| **DOM Updates**  | Interleaved directly during traversal       | Deferred entirely to a distinct, fast commit phase   |

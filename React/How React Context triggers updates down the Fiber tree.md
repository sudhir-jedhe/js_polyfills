***  How React Context triggers updates down the Fiber tree.md ***

React Context updates do not rely on standard top-down prop passing. Instead, React uses a push-based tree traversal algorithm centered around **`propagateContextChange()`** and a linked list of dependencies on each Fiber (`fiber.dependencies`).

This mechanism allows context changes to **bypass intermediate components** wrapped in `React.memo` or `shouldComponentUpdate`.

---

**1. How Consumers Register (`readContext` / `useContext`)**

When a component executes `useContext(MyContext)`, Fiber does not just return the current value; it registers the consumer on the Fiber itself:

```typescript
// Simplified representation of readContext()
function readContext<T>(context: ReactContext<T>): T {
  const value = isPrimaryRenderer ? context._currentValue : context._currentValue2;

  const contextItem = {
    context: (context: ReactContext<mixed>),
    memoizedValue: value,
    next: null, // Linked list of context dependencies
  };

  // Attach to currently rendering Fiber
  if (lastContextDependency === null) {
    currentlyRenderingFiber.dependencies = {
      lanes: NoLanes,
      firstContext: contextItem,
    };
  } else {
    lastContextDependency.next = contextItem;
  }

  return value;
}

```

Each Fiber maintains a `dependencies` linked list pointing to every Context object it subscribes to.

---

**2. The Trigger: Provider Diffing in `beginWork()**`

When a `<MyContext.Provider value="{newValue}">` renders, Fiber evaluates whether the value changed using strict `Object.is()`:

```
                  [ Provider Renders ]
                           │
                 Object.is(oldVal, newVal)
                           │
            ┌──────────────┴──────────────┐
          Same                          Changed
            │                             │
    Continue normal              updateContextProvider()
       beginWork                 calls propagateContextChange()

```

If the value changed, React does not wait for natural traversal to reach consumers. It immediately invokes **`propagateContextChange()`**.

---

**3. `propagateContextChange()`: Eager Downward Marking**

`propagateContextChange()` walks down the child Fiber tree starting from the Provider node to locate all subscribers and mark them for updates:

```
Provider (Value Changed!)
   │
   ├── IntermediateComp (React.memo -> normally bails out)
   │      │
   │      └── childLanes MARKED with renderLanes
   │             │
   │             └── ConsumerComp
   │                    │
   │                    ├── fiber.lanes MARKED with renderLanes
   │                    └── Dependencies flagged

```

### The Traversal Steps

1. **Scan Descendant Fibers:** React loops through `.child`, `.sibling`, and `.return` pointers within the Provider's subtree.
2. **Match Dependencies:** For each child Fiber, React inspects its `fiber.dependencies`:

* It walks the `firstContext` linked list.
* If `dependency.context === changedContext`, a match is found.

1. **Schedule Update on Consumer:**

* It merges the update priority: `consumerFiber.lanes |= renderLanes`.
* If an `alternate` (current tree) exists, it marks `alternate.lanes` as well.

1. **Bubble Up `childLanes` Through Ancestors:**

* React walks up from the consumer along the `return` pointer chain back to the Provider.
* On every parent along the path (even components wrapped in `React.memo`), it marks `parentFiber.childLanes |= renderLanes`.

---

**4. How Context Pierces `React.memo` and Bailouts**

This dual-lane marking is what allows Context to bypass memoized barriers:

```typescript
// When beginWork reaches IntermediateComponent (React.memo):
function beginWork(current, workInProgress, renderLanes) {
  // Step 1: Check intermediate component's own lanes
  // workInProgress.lanes does NOT contain renderLanes (props didn't change)
  if (!includesSomeLane(renderLanes, workInProgress.lanes)) {
    
    // Step 2: Intermediate component passes memo check and tries to bail out!
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }
}

function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  // Step 3: Check childLanes
  // childLanes WAS marked by propagateContextChange()!
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    return null; // Won't happen!
  }

  // Step 4: Shallow bailout! Intermediate doesn't re-render,
  // but React traverses down to the consumer.
  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}

```

* **Intermediate Component:** Skips executing its render function (props are identical).
* **Consumer Component:** Reaches `beginWork()`, where `consumerFiber.lanes` matches `renderLanes`, forcing the consumer to execute and read the new `context._currentValue`.

---

**Summary of the Propagation Lifecycle**

| Step             | Location                       | Action                                                                                    |
| ---------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| **1. Subscribe** | `useContext` / `readContext`   | Adds Context item to `fiber.dependencies`.                                                |
| **2. Detect**    | Provider `beginWork`           | `!Object.is(oldValue, newValue)` triggers change.                                         |
| **3. Propagate** | `propagateContextChange`       | Eagerly marks `fiber.lanes` on subscribers and `childLanes` on all ancestors up the tree. |
| **4. Traverse**  | `bailoutOnAlreadyFinishedWork` | Intermediate memoized parents bail out, but pass work down because `childLanes` is dirty. |
| **5. Consume**   | Consumer `beginWork`           | Consumer re-renders with fresh context value.                                             |

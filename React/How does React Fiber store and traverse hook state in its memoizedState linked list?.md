***  How does React Fiber store and traverse hook state in its memoizedState linked list?.md ***

In React Fiber, hooks do not use a Map or an array keyed by name. Instead, every function component's hooks are stored as a **singly-linked list of `Hook` objects** attached to `fiber.memoizedState`.

The order in which hooks are called during execution dictates their exact position in this linked list.

---

**1. The `Hook` Object Data Structure**

Each hook in a component corresponds to a single `Hook` object allocated on the heap:

```typescript
type Hook = {
  memoizedState: any,       // The calculated state (e.g. state value, [cachedValue, deps], or Effect object)
  baseState: any,           // State before pending updates were processed
  baseQueue: Update | null, // Pending updates skipped due to priority lanes
  queue: UpdateQueue | null,// Circular linked list of pending updates queued via dispatch/setState
  next: Hook | null,        // Pointer to the next hook in the component
};

```

What `memoizedState` holds depends on the hook type:

* **`useState` / `useReducer**`: The current resolved state value (e.g., `0` or `{ count: 1 }`).
* **`useMemo`**: A tuple `[computedValue, deps]`.
* **`useCallback`**: A tuple `[callbackFunction, deps]`.
* **`useRef`**: An object `{ current: initialValue }`.
* **`useEffect` / `useLayoutEffect**`: An `Effect` descriptor object (`{ tag, create, destroy, deps, next }`), also stored in a separate circular linked list on `fiber.updateQueue`.

---

**2. The Hook Linked List Architecture**

When a component runs:

```jsx
function UserProfile() {
  const [name, setName] = useState('Alex');    // Hook 1
  const [age, setAge] = useState(25);          // Hook 2
  useEffect(() => { ... }, [name]);            // Hook 3
  const userCard = useMemo(() => ({ ... }), [age]); // Hook 4
}

```

Fiber constructs and maintains the chain:

```
FiberNode (UserProfile)
  │
  └── .memoizedState
            │
            ▼
     ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
     │    Hook 1    │      │    Hook 2    │      │    Hook 3    │      │    Hook 4    │
     │ (useState)   ├─────►│ (useState)   ├─────►│ (useEffect)  ├─────►│  (useMemo)   ├─────► null
     │ state: 'Alex'│      │  state: 25   │      │ EffectObject │      │ [card, [25]] │
     └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘

```

---

**3. Traversal Mechanics: Mount vs. Update Dispatchers**

React swaps its internal hook dispatcher (`ReactCurrentDispatcher.current`) depending on whether the component is mounting or updating.

```
                  Component Renders
                          │
          Is currentFiber === null ?
                 /                  \
             YES                      NO
             /                          \
   [HooksDispatcherOnMount]    [HooksDispatcherOnUpdate]
   mountWorkInProgressHook()   updateWorkInProgressHook()

```

### A. Mount Phase (`mountWorkInProgressHook`)

1. Creates a brand new `Hook` object: `{ memoizedState: null, ..., next: null }`.
2. If it is the first hook, it points `workInProgressHook = fiber.memoizedState = newHook`.
3. For subsequent hooks, it sets `workInProgressHook.next = newHook`, advancing the pointer: `workInProgressHook = newHook`.

### B. Update Phase (`updateWorkInProgressHook`)

During updates, React maintains **two pointers** tracking both trees:

* **`currentHook`**: Walks the old linked list in `current.memoizedState`.
* **`workInProgressHook`**: Walks and builds the new list in `workInProgress.memoizedState`.

```typescript
function updateWorkInProgressHook(): Hook {
  let nextCurrentHook: Hook | null;

  if (currentHook === null) {
    // First hook call of the update render
    const current = currentlyRenderingFiber.alternate;
    nextCurrentHook = current !== null ? current.memoizedState : null;
  } else {
    // Step to the next hook in the old list
    nextCurrentHook = currentHook.next;
  }

  currentHook = nextCurrentHook;

  // Clone or prepare the corresponding WIP hook
  const newHook: Hook = {
    memoizedState: currentHook.memoizedState,
    baseState: currentHook.baseState,
    baseQueue: currentHook.baseQueue,
    queue: currentHook.queue,
    next: null,
  };

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }

  return workInProgressHook;
}

```

---

**4. Why the "Rules of Hooks" Exist**

Because hooks rely strictly on **pointer advancement (`currentHook = currentHook.next`)** rather than keys or variable names:

* **Conditional Hook Call:**
If a hook inside an `if` statement is skipped on update, the list offset shifts by 1.

```
Mount:   [Hook 1: useState] -> [Hook 2: useEffect (Conditional)] -> [Hook 3: useState]
Update:  [Hook 1: useState] -> [Hook 3's code runs, but reads Hook 2's slot!]

```

React reads `Hook 2`'s state for `Hook 3`, causing state type mismatches, corrupted data, or runtime crashes.

* **Early Return:**
Returning before all hooks execute leaves remaining hooks unvisited, causing React to throw the error: *"Rendered fewer hooks than expected"*.

*** copy How the children-as-props pattern avoids re-renders without React.memo.md ***

The **"children-as-props"** pattern avoids unnecessary re-renders through **reference equality** ($=== comparison$) of React Elements created in a parent scope, triggering React Fiber's default bailout mechanism without requiring `React.memo`.

---

**1. The Anti-Pattern vs. The Pattern**

### Anti-Pattern: Component Declared Directly Inside Heavy State Owner

When `Parent` owns rapidly changing state (`count`), every render invokes `ExpensiveChild`'s JSX factory again, creating a brand-new object reference every tick:

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div onClick={() => setCount(c => c + 1)}>
      <p>Count: {count}</p>
      {/* ⚠️ Re-evaluates React.createElement(ExpensiveChild) on every click */}
      <ExpensiveChild />
    </div>
  );
}

```

### The Pattern: Lifting Content to Grandparent and Passing `children`

Move state into a wrapper component (`ScrollTracker` or `StatefulWrapper`) and pass `ExpensiveChild` in from above:

```jsx
// 1. Grandparent (App) creates the element once
function App() {
  return (
    <StatefulWrapper>
      <ExpensiveChild /> {/* Created in App's scope */}
    </StatefulWrapper>
  );
}

// 2. StatefulWrapper accepts children as a prop
function StatefulWrapper({ children }) {
  const [count, setCount] = useState(0);

  return (
    <div onClick={() => setCount(c => c + 1)}>
      <p>Count: {count}</p>
      {children} {/* Passed through unchanged */}
    </div>
  );
}

```

---

**2. Under the Hood: Transpilation and Ownership**

The performance difference comes down to **who calls `jsx()` / `React.createElement()**`.

* In JSX, `<Component/>` is just syntactic sugar for an object creation function call:

```javascript
// When App renders:
const childElement = jsx(ExpensiveChild, {}); // Object Reference: 0xAAAA

// App passes 0xAAAA into StatefulWrapper props:
const wrapperElement = jsx(StatefulWrapper, {
  children: childElement // Reference 0xAAAA
});

```

* When `StatefulWrapper` updates its own state via `setCount`:
* `App` does **not** re-render.
* Because `App` did not re-run, no new `jsx(ExpensiveChild)` call occurs.
* `StatefulWrapper` re-renders and evaluates `{children}`.
* The reference to `children` passed in props remains the exact same in-memory object reference (`0xAAAA`).

---

**3. How Fiber Bails Out (Step-by-Step Traversal)**

When `StatefulWrapper` re-renders, React Fiber executes `beginWork()`:

```
[StatefulWrapper re-renders]
           │
           ▼
beginWork(StatefulWrapper) ──> Executes component body
           │
           ▼
Returns props.children (Reference 0xAAAA)
           │
           ▼
beginWork(ExpensiveChild)
  ├── 1. Check update lanes: No state/context changes on ExpensiveChild (fiber.lanes === NoLanes)
  └── 2. Check props identity: oldProps === newProps (True! 0xAAAA === 0xAAAA)
           │
           ▼
Calls bailoutOnAlreadyFinishedWork()
           │
           ▼
Subtree has no updates (childLanes === NoLanes) ──> Returns null (Skips render!)

```

### The Fiber Bailout Condition

In React Fiber's `beginWork()`:

```typescript
if (oldProps === newProps && workInProgress.type === current.type) {
  // Strict reference equality check passed!
  // No need to execute ExpensiveChild() function at all.
  return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
}

```

Because `oldProps === newProps` is `true` via simple JavaScript reference comparison, React skips executing `ExpensiveChild`, avoiding Virtual DOM creation and reconciliation for that entire subtree.

---

**Key Comparison**

| Feature                        | `React.memo`                                                                     | `children` as Props Pattern                                |
| ------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Bailout Mechanism**          | Executes shallow prop comparison (`shallowEqual`) every render                   | Built-in reference equality (`oldProps === newProps`)      |
| **Component Wrapper Overhead** | Adds a wrapper Fiber (`MemoComponent` / `SimpleMemoComponent`)                   | Zero extra Fiber wrapper overhead                          |
| **Maintenance**                | Developers must maintain stable prop references (e.g., `useCallback`, `useMemo`) | Natural architectural decoupling via component composition |
| **Context Behavior**           | Subscribed `useContext` still forces a re-render                                 | Subscribed `useContext` still forces a re-render           |

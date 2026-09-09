***   Explain why props changing is technically a symptom, not a trigger.md ***

In React, a component **never re-renders simply because its props changed**. Instead, a prop change is a **symptom (downstream result)** of an ancestor component having already triggered and executed a re-render.

---

**The Cause-and-Effect Chain**

Props are just arguments passed to a function. In JavaScript, arguments cannot change themselves; a caller must invoke the function with new arguments.

```
[Actual Trigger]
1. State update (`setState`), Context change, or Force update in Parent Component
       │
       ▼
[Parent Renders]
2. Parent executes its function body and generates a new React Element tree:
   `<Child count={newCount} />`  ──▶  `jsx(Child, { count: newCount })`
       │
       ▼
[Symptom Appears]
3. React evaluates the child Fiber and passes the newly created props object.
       │
       ▼
[Child Renders]
4. Child component executes.

```

The trigger happened at **Step 1** (in the parent). The child receives new props at **Step 3** solely because the parent ran and created a fresh JSX/element descriptor.

---

**Two Proofs That Props Do Not Trigger Renders**

**1. A Child Re-renders Even If Props NEVER Change**
By default in React, if a parent component re-renders, **all child components re-render recursively**, even if their props are 100% identical:

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* <StaticChild /> receives NO props or unchanging props, 
          yet it STILL re-renders every time Parent re-renders */}
      <StaticChild />
    </div>
  );
}

```

If props were the trigger, `<StaticChild/>` would not re-render. It re-renders because parent re-renders cascade top-down by default.

**2. `React.memo` Inverts the Mental Model**
`React.memo` does not add a listener for "re-render when props change." It does the opposite: it acts as an **early exit (bailout)** during the parent-driven render pass:

* Parent re-renders $\to$ React visits the memoized child.
* React checks: *Are the new props shallowly equal to the old props?*
* If **equal**, React bails out and skips the child render.
* If **different**, React proceeds with the parent-initiated render.

---

**Why the Distinction Matters**

| Misconception ("Props trigger renders")                                    | Reality ("Parent execution is the trigger")                                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Trying to fix child re-renders by micro-optimizing props inside the child. | Fixing child re-renders requires either memoizing the child (`React.memo`) or moving state down so the parent stops rendering. |
| Assuming passing static primitives prevents child renders.                 | Static props do not prevent renders unless wrapped in `React.memo` or hoisted via `children`.                                  |
| Thinking `useEffect(..., [prop])` detects a standalone prop event.         | The effect runs because the component was already re-rendered by its parent and the dependency comparison found a change.      |

**The actual triggers of a render:**

1. A state setter (`useState` / `useReducer`).
2. A context provider value mutation (`useContext`).
3. An external store snapshot mutation (`useSyncExternalStore`).

Changing props is simply data flowing downstream along the render tree that was already set in motion by one of those three triggers.

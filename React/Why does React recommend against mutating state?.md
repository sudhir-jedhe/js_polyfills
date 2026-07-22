React recommends against mutating state directly because **React relies on immutable state changes to detect updates, trigger re-renders correctly, and manage time-travel debugging.**

When you mutate state directly, you break the core assumptions of React’s rendering engine. Here is why direct mutation causes severe problems:

---

### 1. React Misses Re-renders (Stale UI)

React determines when a component needs to re-render by comparing references (`Object.is`).

- When you use a state setter (e.g., `setUsers(newUsers)`), React checks if the memory reference of the state object has changed.
- If you mutate state directly (e.g., `users.push(newUser)`), **the reference stays exactly the same**, even though the internal contents changed. React looks at it, thinks nothing happened, and skips the re-render entirely, leaving your UI completely out of sync with your data.

### 2. Breaks Time-Travel Debugging and Undo/Redo

Advanced developer tools (like Redux DevTools or custom time-travel debuggers) rely on **immutability** to record a history of your application's states.

- If every state change creates a _new_ object in memory, tools can safely snapshot each step in time and let you "rewind" or "fast-forward" through user actions.
- If you mutate state in place, every snapshot in history will point to the exact same modified object, completely breaking history tracking.

### 3. Unpredictable Concurrency and Race Conditions

Modern React features like **Concurrent Mode** (and features built around transitions and suspense) rely on the ability to pause, resume, or abandon rendering work based on priority.

- If components rely on mutable data that can be changed out from underneath them mid-render by another piece of code, your app enters an unpredictable state where different parts of the UI display conflicting versions of data.

---

### Example: Mutation vs. Immutability

#### ❌ The Wrong Way (Direct Mutation)

```javascript
const [todos, setTodos] = useState(["Learn React", "Build App"]);

function addTodo() {
  // Direct mutation! Mutating the existing array in memory.
  todos.push("Deploy to Production");
  setTodos(todos); // React sees the exact same array reference and skips re-rendering!
}
```

#### ✅ The Right Way (Immutable Update)

```javascript
const [todos, setTodos] = useState(["Learn React", "Build App"]);

function addTodo() {
  // Creating a brand-new array reference using the spread operator
  setTodos([...todos, "Deploy to Production"]);
  // React sees a new reference in memory and triggers a clean re-render.
}
```

React recommends against mutating state because several of its mechanisms depend on the previous and next state being different objects (reference inequality). When you mutate state in place, the reference does not change, which breaks Object.is bailouts in useState/useReducer, breaks React.memo and useMemo/useEffect dependency comparisons, and can cause tearing under concurrent rendering. It also defeats time-travel debugging in React DevTools. Always produce a new object/array (with the spread operator, array methods like map/filter/toSorted, or a library such as Immer) and pass it to the state setter.

**Why does React recommend against mutating state?**
**A quick terminology note**
In modern React, state is updated by the setter returned from useState (or by dispatch from useReducer). The class-based this.setState API still exists but is rarely used in new code. Both APIs share the same expectation: you give React a new state value rather than mutating the existing one. The rest of this answer focuses on the hooks-based APIs.

**Where reference equality actually matters**
A common misconception is that mutating state breaks the "virtual DOM diff." That is not quite right — the diff happens against the rendered element tree, not against the state object. The places where state immutability genuinely matters are:

- Object.is bailout in useState / useReducer: When you call the setter (or return a value from a reducer), React compares the new value with the current one using Object.is. If they are the same reference, React can skip re-rendering the component. Mutate-in-place returns the same reference, so React thinks nothing changed and skips the render — but the data has actually changed, so the UI goes stale.

- React.memo, useMemo, useCallback, and useEffect dependencies: These all compare values across renders with Object.is. A mutated array or object still has the same reference, so memoized children will not re-render and effects will not re-run, even though their underlying data is now different.

**Concurrent rendering and tearing:**
Since React 18, rendering can be interrupted, paused, or even abandoned. If you mutate state during a render, an in-progress render and a discarded render can read different values from the same object — producing tearing, where different parts of the UI reflect different versions of the state.

**DevTools and time-travel debugging:**
React DevTools (and tools like Redux DevTools) rely on snapshots of past states to let you step backwards. Mutation overwrites those snapshots, so the history becomes meaningless.
**React schedules a render either way**
Calling setState/dispatch always schedules a render — React does not refuse to render because you passed the same reference. What the reference comparison controls is what happens after the render is queued: whether the component bails out (skips actually rendering), and whether downstream React.memo/useMemo/useEffect consumers see a "change." Mutation is a problem precisely because it produces "looks the same to React, actually different in memory" — the worst of both worlds.

**Problems with mutating state**

1. The bailout above means the UI does not refresh when the underlying data changed.
2. Broken memoization: Memoized children, memoized values, and effects all compare by reference and will silently skip updates.
3. Tearing under concurrent features such as startTransition and Suspense.
4. Lost debuggability: Time-travel and "previous props/state" inspection in React DevTools stop working correctly.
5. Hard-to-track bugs: Multiple components or hooks may close over the same object reference. Mutating it can have spooky action-at-a-distance effects.

**How to update state correctly**
Always produce a new value:

```js
const [user, setUser] = useState({ name: "Ada", age: 36 });

// Incorrect: mutates the existing object — same reference, bailout fires.
user.age = 37;
setUser(user);

// Correct: a brand new object.
setUser({ ...user, age: 37 });

// Equally correct, and safer when the new value depends on the old one
// (avoids stale-closure issues across batched updates):
setUser((prev) => ({ ...prev, age: 37 }));
```

For arrays, prefer non-mutating methods like map, filter, concat, the spread operator, or the newer toSorted/toReversed/toSpliced (avoid push, splice, sort, reverse on state):

```js
const [items, setItems] = useState([3, 1, 2]);

// Incorrect: sort() mutates in place.
items.sort();
setItems(items);

// Correct.
setItems([...items].sort((a, b) => a - b));
// Or, with the modern non-mutating method:
setItems(items.toSorted((a, b) => a - b));
```

**When the spread gets painful: Immer**
Spreading deeply nested state by hand is verbose and error-prone. Immer is the de facto solution: you write code that looks like mutation against a draft, and Immer produces a new immutable state for you. It is built into Redux Toolkit's createSlice, and the useImmer / useImmerReducer hooks plug directly into React.

```js
import { produce } from "immer";

setUser((prev) =>
  produce(prev, (draft) => {
    draft.address.city = "Singapore";
  }),
);
```

You get the ergonomics of mutation and the guarantees of immutability.

Updating objects and arrays in React requires strict adherence to **immutability**. Because React relies on reference equality checks (`Object.is`) to detect when to re-render, you must **never** modify an existing object or array directly (e.g., using `push`, `pop`, or direct property assignment like `user.name = 'Bob'`). Instead, you must always create a **brand-new copy** with your updates applied.

---

## 1. Updating Objects in State

When updating an object, you use the **spread syntax (`...`)** to copy the existing properties of the object into a new object, overwriting only the specific properties you want to change.

### ❌ The Wrong Way (Direct Mutation)

```javascript
const [user, setUser] = useState({
  name: "Alice",
  age: 25,
  email: "alice@mail.com",
});

function updateName() {
  user.name = "Bob"; // ❌ Direct mutation! React won't re-render.
  setUser(user); // Reference hasn't changed.
}
```

### ✅ The Right Way (Immutable Spread)

```javascript
const [user, setUser] = useState({
  name: "Alice",
  age: 25,
  email: "alice@mail.com",
});

function updateName() {
  setUser({
    ...user, // 1. Spread copies all existing properties
    name: "Bob", // 2. Overwrite the specific property you want to change
  });
}
```

### Handling Nested Objects

If your object is nested, you must shallow-copy **every level** of the object hierarchy leading down to the property you want to change:

```javascript
const [person, setPerson] = useState({
  name: "Niki",
  artwork: {
    title: "Blue Dreams",
    city: "Hamburg",
  },
});

function updateCity() {
  setPerson({
    ...person,
    artwork: {
      ...person.artwork, // Copy the nested object too!
      city: "Berlin",
    },
  });
}
```

---

## 2. Updating Arrays in State

Arrays require special handling because array methods like `push`, `pop`, `shift`, `unshift`, and `splice` mutate the original array in place. Instead, you must use **non-mutating array methods** (like `map`, `filter`, or the spread operator) that return a brand-new array.

### A. Adding Items to an Array

Use the spread operator (`...`) to append or prepend items into a new array.

```javascript
const [todos, setTodos] = useState(["Eat", "Sleep"]);

function addTodo() {
  // ✅ Appending to the end
  setTodos([...todos, "Code"]);

  // ✅ Prepending to the beginning
  setTodos(["Code", ...todos]);
}
```

### B. Removing Items from an Array

Use the **`filter`** method, which returns a brand-new array containing only the items that pass a test condition.

```javascript
const [todos, setTodos] = useState(["Eat", "Sleep", "Code"]);

function removeTodo(itemToRemove) {
  // ✅ Returns a new array excluding the matching item
  setTodos(todos.filter((todo) => todo !== itemToRemove));
}
```

### C. Updating/Modifying Items in an Array

Use the **`map`** method to iterate through the array. When you find the item you want to change, return a new updated object; otherwise, return the original item unchanged.

```javascript
const [tasks, setTasks] = useState([
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build an App", done: false },
]);

function toggleTask(idToToggle) {
  setTasks(
    tasks.map((task) => {
      if (task.id === idToToggle) {
        // ✅ Return a new object with the toggled property
        return { ...task, done: !task.done };
      }
      // ✅ Return untouched items as-is
      return task;
    }),
  );
}
```

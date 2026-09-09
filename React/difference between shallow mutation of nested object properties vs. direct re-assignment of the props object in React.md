***  difference between shallow mutation of nested object properties vs. direct re-assignment of the props object in React.md ***

difference between shallow mutation of nested object properties vs. direct re-assignment of the props object in Reac

This is a classic **Rippling interview question** testing the difference between **shallow mutation of nested object properties** vs. **direct re-assignment of the `props` object** in React.

---

### The Code Representation

```jsx
// App.jsx
function App() {
  const [user, setUser] = useState({ name: 'frontendmaster' });

  return <Magic user={user} />;
}

// Magic.jsx (Scenario A: Mutating a nested property)
function Magic(props) {
  props.user.name = 'XYZ'; // ⚠️ Shallow mutation of an inner object property

  return <h1>{props.user.name}</h1>;
}

// Magic.jsx (Scenario B: Direct re-assignment of the props object)
function Magic(props) {
  props.user = { name: 'XYZ' }; // ❌ Re-assigning a read-only property of the `props` object

  return <h1>{props.user.name}</h1>;
}

```

---

### Why does Scenario A work while Scenario B throws an Error?

#### 1. Shallow Mutation (`props.user.name = 'XYZ'`) $\rightarrow$ **No Error**

* React freezes the top-level **`props`** object in development (`Object.freeze(props)`).
* However, `Object.freeze()` is **shallow**. It does **not** recursively freeze nested objects or objects passed by reference from `useState`.
* Because `props.user` refers to the mutable object stored in `App`'s state, mutating `props.user.name` modifies the memory reference directly without violating the shallow freeze on `props`.
* **Result:** Renders without errors (though it breaks React's unidirectional data flow principles).

---

#### 2. Direct Re-assignment (`props.user = ...`) $\rightarrow$ **Error in Development Mode**

* Because React executes `Object.freeze(props)` in development mode, the `props` object becomes read-only.
* Attempting to assign a new value directly to `props.user` in strict mode triggers:

```text
TypeError: Cannot assign to read only property 'user' of object '#<Object>'

```

---

#### 3. Why No Error in Production Mode?

* React omits `Object.freeze(props)` in **production builds** to maximize performance and avoid freeze-traversal overhead.
* Without the freeze check, the reassignment fails silently in non-strict environments or overwrites the local component variable without throwing a runtime crash.

---

### Summary Comparison Table

| Action                                            | Dev Mode Behavior                                  | Prod Mode Behavior             | Why?                                                          |
| ------------------------------------------------- | -------------------------------------------------- | ------------------------------ | ------------------------------------------------------------- |
| `props.user.name = 'XYZ'` (Property mutation)     | ✅ Runs without error                               | ✅ Runs without error           | `Object.freeze` is shallow; nested references remain mutable. |
| `props.user = { ... }` (Prop object reassignment) | ❌ `TypeError: Cannot assign to read-only property` | ⚠️ Silent pass / local mutation | `props` is frozen in Dev mode, but unfrozen in Prod mode.     |

The dependency array of `useEffect` determines **when** the effect function runs. By passing an array of values (variables, props, or state), you tell React to re-run the effect whenever any of those tracked values change between renders.

---

### The Three Ways to Use the Dependency Array

#### 1. No Dependency Array (Runs on Every Render)

If you omit the dependency array entirely, the effect runs after **every single render** (initial mount and every subsequent re-render).

```javascript
useEffect(() => {
  console.log("I run after every render!");
}); // ❌ Missing dependency array
```

#### 2. An Empty Dependency Array `[]` (Runs Once on Mount)

If you pass an empty array, the effect runs **only once** when the component first mounts (appears on the screen), and its cleanup function runs when the component unmounts.

```javascript
useEffect(() => {
  console.log("I run only once when the component mounts!");
}, []); // ✅ Empty array
```

#### 3. An Array with Values `[prop, state, variable]` (Runs on Change)

If you include specific values in the array, React runs the effect on the initial mount, and then re-runs it **only if one or more of those dependencies have changed** since the last render.

```javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(`Count changed to: ${count}`);
}, [count]); // ✅ Runs on mount AND whenever 'count' changes
```

---

### What Does React Actually Compare?

React determines whether a dependency has "changed" by performing a **shallow comparison** (using `Object.is`) between the value from the previous render and the value on the current render.

### Common Pitfalls to Avoid

- **Stale Closures / Missing Dependencies:** If your effect uses a variable, function, or prop from outside its scope, you must include it in the dependency array. Leaving it out can lead to bugs where your effect reads outdated ("stale") values.
- **Objects/Arrays as Dependencies:** Because objects and arrays are reference types in JavaScript, creating a new object or array inline on every render (e.g., `[ { id: 1 } ]`) changes its memory reference every time, causing the effect to run on **every render** even if the data looks identical.

Introduction to useEffect
The useEffect hook in React is used to perform side effects in functional components. These side effects can include data fetching, subscriptions, or manually changing the DOM. The useEffect hook takes two arguments: a function that contains the side effect logic and an optional dependency array.

Dependency array
The dependency array is the second argument to the useEffect hook. It is an array of values that the effect depends on. React uses this array to determine when to re-run the effect.

```js
useEffect(() => {
  // Side effect logic here
}, [dependency1, dependency2]);
```

How the dependency array affects useEffect
Empty dependency array ([]):

The effect runs once after the initial render and its cleanup runs once on unmount.
This is roughly analogous to componentDidMount plus componentWillUnmount, but with an important caveat: in development with Strict Mode, React intentionally mounts, unmounts, and remounts each component to surface bugs in effect cleanup. Your effect (and its cleanup) will run twice on the initial mount in development. Production runs the effect once.

```js
useEffect(() => {
  // This code runs after the initial render
  return () => {
    // Cleanup runs on unmount
  };
}, []);
```

Dependency array with variables:

The effect runs after the initial render and whenever any of the specified dependencies change.
React compares each dependency with its previous value using Object.is (reference equality, not a deep or shallow object comparison). Inline objects, arrays, or functions therefore change identity on every render unless memoized.

```js
useEffect(() => {
  // This code runs after the initial render and whenever dependency1 or dependency2 changes
}, [dependency1, dependency2]);
```

No dependency array:

The effect runs after every render.
This can lead to performance issues if the effect is expensive.

```js
useEffect(() => {
  // This code runs after every render
});
```

Cleanup behavior on dependency change
When dependencies change, React first runs the previous effect's cleanup function (if any) before running the effect again with the new values. The same is true on unmount. This means dependency changes effectively perform a tear-down/set-up cycle, which matters for subscriptions, intervals, and event listeners.

```js
useEffect(() => {
  const subscription = source.subscribe(id);
  return () => subscription.unsubscribe(); // runs before next effect or on unmount
}, [id]);
```

**The react-hooks/exhaustive-deps lint rule**
The official eslint-plugin-react-hooks ships an exhaustive-deps rule that warns when reactive values used inside an effect are missing from the dependency array. Treat its warnings as bugs — silencing the rule is almost always the wrong fix and a common source of stale closures.

Common pitfalls
**Stale closures:**

If you use state or props inside the effect without including them in the dependency array, you might end up with stale values.
Always include all state and props that the effect depends on in the dependenc

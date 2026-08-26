*** copy How does React.memo work and what are the best practices for memoizing props?.md ***

**`React.memo`** is a higher-order component that wraps a functional component to optimize its rendering performance. It tells React to **skip re-rendering the component if its incoming props are shallowly equal to its previous props**, even if its parent component re-renders.

---

**How `React.memo` Works Under the Hood**

By default, when a parent component renders, React recursively renders all children. When wrapped in `React.memo`, React intercepts the render phase:

1. **Prop Comparison:** React performs a shallow equality check (`Object.is`) on every prop key and value between the previous render and the new render.
2. **Bailing Out:** If all props match (`prevProps[key] === nextProps[key]`), React reuses the previously rendered Fiber output and skips executing the component function.
3. **Internal State Override:** If the memoized component's own local state (`useState` / `useReducer`) or consumed context (`useContext`) changes, the component **will still re-render**.

```jsx
const UserCard = React.memo(function UserCard({ name, age, onSelect }) {
  console.log('Rendered UserCard');
  return (
    <div onClick={onSelect}>
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
});

```

---

**Best Practices for Memoizing Props**

`React.memo` is only as effective as the stability of the props passed to it. If any prop reference breaks equality on each render, `React.memo` provides zero benefit and adds unnecessary comparison overhead.

* **1. Stabilize Callback Functions with `useCallback**`
Inline function declarations create a new function reference every time the parent renders, breaking memoization.

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ Breaks memoization: new reference created every render
  // const handleClick = () => console.log('Clicked');

  // ✅ Preserves memoization: stable reference
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <UserCard name="Alex" age={30} onSelect={handleClick} />;
}

```

* **2. Stabilize Objects and Arrays with `useMemo` (or Hoist Constants)**
Inline object/array literals create new references on every render.

```jsx
function Parent() {
  // ❌ Breaks memoization: new object reference each time
  // <Profile config={{ theme: 'dark', role: 'admin' }} />

  // ✅ Option A: Hoist outside component if static
  // const STATIC_CONFIG = { theme: 'dark', role: 'admin' };

  // ✅ Option B: Memoize if derived from state/props
  const config = useMemo(() => ({ theme: 'dark', role: 'admin' }), []);

  return <Profile config={config} />;
}

```

* **3. Prefer Primitive Props Over Complex Objects**
Passing individual primitives (`name`, `id`, `status`) allows `Object.is` to compare values directly (`"Alex" === "Alex"`), making memoization naturally resilient without needing wrappers.

```jsx
// ✅ Less prone to reference-equality breakage
<UserCard name={user.name} age={user.age} />

```

* **4. Custom Comparator Functions (Use Sparingly)**
If you must pass deeply nested objects, you can provide a custom equality comparison function as the second argument:

```jsx
function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.updatedAt === nextProps.user.updatedAt
  );
}

export const UserProfile = React.memo(UserProfileComponent, arePropsEqual);

```

*(Note: Unlike `shouldComponentUpdate`, returning `true` means props are equal and render is skipped; returning `false` triggers a re-render).*

---

**When to Use vs. Avoid `React.memo**`

| Situation                                                     | Should Use `React.memo`? | Why                                                                           |
| ------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| Heavy component with complex UI/SVG trees                     | **Yes**                  | Computation saved by skipping renders outweighs the shallow comparison cost.  |
| Component re-renders frequently with the **exact same props** | **Yes**                  | Prevents redundant DOM diffing down the child branch.                         |
| Simple, lightweight components (`<button>`, `<span>`)         | **No**                   | The shallow comparison check can be slower than the trivial re-render itself. |
| Props change on almost every render                           | **No**                   | Wastes CPU time running comparison logic that always evaluates to `false`.    |

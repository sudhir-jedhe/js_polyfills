# What Does useId Produce Across Two Renders of the Same Component Instance?

```jsx
function Field() {
  const id = useId();
  console.log(id);
  return <input id={id} />;
}

function App() {
  const [, forceRender] = useReducer((x) => x + 1, 0);
  return (
    <>
      <Field />
      <button onClick={forceRender}>re-render</button>
    </>
  );
}
```

**Answer:** The same ID string logs on every re-render of that `Field` instance (e.g., `":r0:"` both times).

**Why:** `useId` generates a stable ID tied to the component instance's position in the tree, computed once and preserved across re-renders — it is not regenerated on every render like `Math.random()` would be. It only changes if the component unmounts and a new instance mounts.

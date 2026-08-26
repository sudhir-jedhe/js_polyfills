# What Does `isPending` Show, and in What Order?

```jsx
function Demo() {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("a");

  function update() {
    startTransition(() => {
      setValue("b");
    });
  }

  console.log("render", value, isPending);
  return <button onClick={update}>go</button>;
}
```

**Answer:** On click: `"render b true"` may briefly log (or be skipped if the update is fast enough), followed by `"render b false"` once the transition completes. For a very fast, synchronous update like this, React may batch it such that you mostly only observe the final `false` state — the `true` intermediate render is not guaranteed to be visually distinguishable for trivial updates.

**Why:** `isPending` becomes `true` while the transition's work is in progress and flips back to `false` once React finishes committing the transitioned update; for cheap updates like a plain string set, this can happen fast enough that the pending state is easy to miss without an actual expensive computation in between.

# Output-Based: Keying by the value itself during a sort

```jsx
function Sortable() {
  const [nums, setNums] = useState([3, 1, 2]);
  return (
    <div>
      <button onClick={() => setNums((n) => [...n].sort())}>Sort</button>
      {nums.map((n) => (
        <input key={n} defaultValue={n} />
      ))}
    </div>
  );
}
```

Before sorting, the user types extra text into the input showing `1` (making it read "1x"). After clicking Sort, which input shows "1x"?

**Answer:** The input keyed `1` still shows "1x" — it just moves to whatever position `1` now sorts into (the first position, since sorted is `[1,2,3]`).

**Why:** Here the key is the value itself (`n`), which is stable and unique per item, so React correctly tracks that specific input across the reorder and keeps its DOM node (and typed-in value, since it's uncommitted `defaultValue` state) attached to the "1" item rather than to a position. This is the *correct* use of a non-id key when the values themselves are unique identifiers.

# Does Clicking "Add" Cause the Sibling Timer to Reset?

```jsx
function App() {
  const [items, setItems] = useState([]);
  return (
    <div>
      <Timer />
      <button onClick={() => setItems([...items, "x"])}>Add</button>
      <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{seconds}</p>;
}
```

**Answer:** No, `Timer` does not reset — it keeps counting across `Add` clicks.

**Why:** `Timer`'s position in the tree and its type stay the same across re-renders of `App`, so React preserves its component instance and state; the `items` list re-rendering (even with fragile index keys) doesn't remount unrelated siblings. This question is a contrast case: index keys are a real problem specifically for *reordering/removing items within* a keyed list, not for arbitrary state elsewhere in the tree.

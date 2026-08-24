# Interview Q&A: Referential Equality and React.memo

**Q: Why does referential equality matter in React?**

Because JavaScript compares objects, arrays, and functions by reference, not structural content — two objects with identical contents are still `!==` if they're different instances. React leans on this for optimization: `React.memo` does a shallow prop comparison to decide whether to skip a re-render, and `useEffect`/`useMemo`/`useCallback` compare dependency arrays by reference to decide whether to rerun. If you pass a freshly created object/array/function every render, these checks always see "something changed," defeating the optimization even when nothing meaningfully did.

---

**Q: Give a concrete example of an inline prop defeating `React.memo`.**

```jsx
const Child = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <Child onClick={() => console.log('clicked')} /> {/* new function every render */}
    </>
  );
}
```

`onClick` is a new arrow function every time `Parent` renders, so `Child`'s shallow prop comparison always sees a change and re-renders anyway, regardless of `React.memo`. Wrapping the handler in `useCallback` fixes it.

---

**Q: Does wrapping a component in `React.memo` do anything if its props include a callback that changes every render?**

No meaningful benefit — `React.memo`'s shallow comparison will see the changed callback prop as "different" every time and re-render the component anyway, exactly as if `React.memo` weren't applied at all (for that render trigger). `React.memo` and stable prop references (via `useMemo`/`useCallback` in the parent) need to be used together; neither one alone solves the unnecessary re-render problem.

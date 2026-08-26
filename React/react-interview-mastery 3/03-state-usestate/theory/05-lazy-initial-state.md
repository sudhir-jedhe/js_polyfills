*** copy 05-lazy-initial-state.md ***

# Lazy Initial State

If computing the initial value is expensive (parsing localStorage, heavy computation), pass a function instead of a value. React calls it exactly once, on the first render only — passing a plain expensive call directly would re-run it on every render even though its result is discarded after the first:

```jsx
// Bad: runs expensiveParse() on every render, even though only the first result is used
const [data, setData] = React.useState(expensiveParse(rawInput));

// Good: React only invokes this function once
const [data, setData] = React.useState(() => expensiveParse(rawInput));
```

## Lazy initial state vs. eager initial state

| Aspect | `useState(expensiveFn())` | `useState(() => expensiveFn())` |
|---|---|---|
| When the function runs | Every render (JS evaluates the argument before the call) | Only once, on the component's first mount |
| Appropriate for | Cheap, trivial initial values (`useState(0)`, `useState('')`) | Expensive computation (parsing, heavy loops, reading localStorage) |

Use the lazy form any time computing the initial value costs more than a property access or literal. The common mistake is using the eager form for something like `JSON.parse(localStorage.getItem(...))`, silently re-parsing on every render for no benefit — the wasted call happens because JavaScript evaluates function-call arguments before the function they're passed to (`useState`) even runs, regardless of whether that argument's result ends up being used.

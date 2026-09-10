# `useCallback`

```js
const cachedFn = useCallback(fn, dependencies)
```

Caches a **function definition** between re-renders. (`useMemo` caches a
*value*; `useCallback(fn, deps)` is just `useMemo(() => fn, deps)`.)

> **React Compiler note (now at the top of the docs):**
> *"React Compiler automatically memoizes values and functions, reducing the
> need for manual `useCallback` calls."*

The docs stop short of "don't use it" — the compiler *reduces* the need
rather than removing it. But the direction of travel is clear: if you adopt
the compiler, most of what follows becomes something you read to *debug*,
not to write.

---

## The only two reasons to use it

Straight from the docs:

1. **You pass it as a prop to a component wrapped in `memo`.**
2. **The function is used as a dependency of some Hook** — another
   `useCallback`, a `useMemo`, or a `useEffect`.

> *"There is no benefit to wrapping a function in `useCallback` in other cases."*

And the rule that matters most:

> *"You should only rely on `useCallback` as a performance optimization. If
> your code doesn't work without it, find the underlying problem and fix it
> first."*

If removing a `useCallback` **breaks** your code rather than slowing it, you
have a different bug — usually an effect that shouldn't depend on a
function, or state that shouldn't have been lifted.

---

## The trap: an unstable dependency defeats the whole thing

```js
// 🔴 useCallback that does nothing
function useList(fetchPage) {
  const load = useCallback(() => fetchPage(), [fetchPage]);
}

// caller
useList(() => api.get('/items'));   // new function EVERY render
```

`fetchPage` is new each render → `load` is new each render → you pay the
memoisation cost and get none of the benefit, while the code *looks*
optimised. This is the most common way `useCallback` is wrong: not a missing
dependency array, but a dependency that never stops changing.

**Fix — keep the unstable thing in a ref so it isn't a dependency:**

```js
const fetchPageRef = useRef(fetchPage);
useEffect(() => { fetchPageRef.current = fetchPage; });

const load = useCallback(() => fetchPageRef.current(), []);   // ✅ actually stable
```

*(This exact bug was in `usePagination.js` in this repo — see the audit below.)*

---

## Avoiding dependencies

### Updater functions instead of state deps

```js
// 🔴 todos is new every render, so the callback is too
const addTodo = useCallback((text) => {
  setTodos([...todos, { text }]);
}, [todos]);

// ✅ the updater form doesn't need the current value
const addTodo = useCallback((text) => {
  setTodos(todos => [...todos, { text }]);
}, []);
```

### Move the function into the Effect

If a function exists only to be used by one Effect, it doesn't need
`useCallback` — or to be outside the Effect at all:

```js
// 🔴
const createOptions = useCallback(() => ({ roomId }), [roomId]);
useEffect(() => { connect(createOptions()); }, [createOptions]);

// ✅ simpler, and no useCallback
useEffect(() => {
  function createOptions() { return { roomId }; }
  connect(createOptions());
}, [roomId]);
```

> *"Now your code is simpler and doesn't need `useCallback`."*

---

## Custom Hooks: do wrap what you return

```js
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  return { navigate };
}
```

> *"This ensures that the consumers of your Hook can optimize their own code
> when needed."*

This is the one place to be liberal: you don't know whether your caller will
put the returned function in a dependency array, so hand back something
stable. Every `useCallback` in this repo's `hooks/` folder is here for that
reason.

---

## Troubleshooting

**"`useCallback` returns a different function every render."**
Usually a missing dependency array:

```js
useCallback(fn);          // 🔴 no array — new function every time
useCallback(fn, [a, b]);  // ✅
```
…or an unstable dependency (see the trap above).

**"I need `useCallback` per list item, but Hooks can't go in loops."**
Extract a component:

```jsx
function Report({ item }) {
  const handleClick = useCallback(() => sendReport(item), [item]);  // ✅ top level
  return <Chart onClick={handleClick} />;
}
```

Or skip `useCallback` and wrap `Report` in `memo` instead.

---

## Five ways to need less memoisation

The docs' own list, and it's better advice than any amount of `useCallback`:

1. Accept JSX as `children` in wrapper components
2. Keep state local — don't lift it unnecessarily
3. Keep rendering logic pure (fix bugs, don't memoise around them)
4. Avoid unnecessary Effects that update state
5. Remove unnecessary dependencies from Effects

---

## Audit of this repo

10 `useCallback` calls. **No `memo()` anywhere**, so justification #1 never
applies here — every legitimate use is #2 or the custom-Hook rule.

| Where | Why | Verdict |
|---|---|---|
| `useQueryCache.js` `subscribe` | fed to `useSyncExternalStore` | ✅ **correctness, not perf** |
| `useQueryCache.js` `getSnapshot` | fed to `useSyncExternalStore` | ✅ **correctness, not perf** |
| `useApi.js` `refetch`, `execute`, `reset` | returned from a custom Hook | ✅ |
| `useQueryCache.js` `refetch` | returned from a custom Hook | ✅ |
| `usePagination.js` `next`, `previous`, `goTo` | returned; empty deps via updater fns | ✅ |
| `usePagination.js` `loadMore` | dep on `fetchPage` — a hook **argument** | 🔴 **was defeated — fixed** |

The two `useSyncExternalStore` cases are worth calling out: that Hook
**re-subscribes whenever `subscribe`'s identity changes**. An unstable
`subscribe` means unsubscribe/resubscribe on every render — a real bug, not
a slow render. This is the rare case where the docs' "only a performance
optimization" framing doesn't hold, because the Hook's contract demands
stability.

Verified against [react.dev/reference/react/useCallback](https://react.dev/reference/react/useCallback).

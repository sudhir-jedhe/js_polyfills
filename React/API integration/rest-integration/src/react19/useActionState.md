# `useActionState`

```js
const [state, dispatchAction, isPending] =
  useActionState(reducerAction, initialState, permalink?);
```

The mental model that makes the whole API obvious:

> **It is `useReducer` where the reducer is allowed to be `async`.**

Everything unusual about it follows from that one difference. An async
reducer takes time, so calls **queue** — and a queue can be skipped,
cancelled, or reset.

| | |
|---|---|
| `reducerAction` | `(previousState, payload) => newState \| Promise<newState>` |
| `dispatchAction` | queues an action; returns a promise |
| `isPending` | true while an action is in flight |
| `permalink` | URL for progressive enhancement before hydration |

---

## The two rules

**1. `dispatchAction` must run inside a Transition.**

Passing it to an Action prop does this for you:

```jsx
<form action={dispatchAction}>        {/* ✅ wrapped automatically */}
```

Calling it yourself does not:

```jsx
onClick={() => dispatchAction()}                          // ❌ isPending never flips
onClick={() => startTransition(() => dispatchAction())}   // ✅
```

Outside a Transition with an async reducer you get:
*"An async function with useActionState was called outside of a transition."*

**2. Throwing cancels the queue.**

If `reducerAction` throws, React **cancels every action still queued behind
it** and escalates to the nearest Error Boundary. Submit three things, have
the first throw, and the other two silently never run.

```js
// ✅ Known failure — return it
catch (error) { return { ...previousState, error: error.message }; }

// ❌ Only for genuinely unrecoverable bugs
catch (error) { throw error; }
```

**Known** errors (validation, 4xx, business rules) → return as state.
**Unknown** errors (a real bug) → throw, and let a boundary take the screen.

---

## Argument order — the #1 mistake

```js
function action(formData) { }             // plain <form action>
function action(prevState, formData) { }  // useActionState
```

`useActionState` inserts previous state as the **first** argument. Reading
`formData.get('x')` off argument one silently gives you `undefined`, because
argument one is the state.

---

## Multiple action types

It is a reducer, so switch on a `type`:

```js
const [count, dispatchCart, isPending] = useActionState(
  async (previousCount, payload) => {
    switch (payload.type) {
      case 'ADD':    return await addToCart(previousCount);
      case 'REMOVE': return await removeFromCart(previousCount);
      default:       return previousCount;
    }
  },
  0
);

startTransition(() => dispatchCart({ type: 'ADD' }));
```

One state, one pending flag, many operations — instead of three separate
`useActionState` calls that can't see each other.

---

## Cancelling queued actions

Five fast clicks queue five actions. Usually you want only the last. Keep an
`AbortController` in a ref and abort the previous one:

```js
const abortRef = useRef(null);

function onChange(event) {
  abortRef.current?.abort();
  abortRef.current = new AbortController();

  startTransition(() => {
    dispatchSearch({ term: event.target.value, signal: abortRef.current.signal });
  });
}

// The signal travels in the PAYLOAD — the reducer only gets (prevState, payload).
async function reducerAction(previousState, payload) {
  try {
    return await search(payload.term, { signal: payload.signal });
  } catch (error) {
    if (error.name === 'AbortError') return previousState;  // not a failure
    return { ...previousState, error: error.message };
  }
}
```

> **Caveat, straight from the docs:** aborting is *"only safe when you know
> the side effect can be safely ignored or retried."*

Abort reads and idempotent writes. **Do not abort a payment** — you end up
not knowing whether it went through. That is the same reasoning as
`Idempotency-Key` in the offline queue (`state/shared/offlineQueue.js`).

---

## Resetting

There is no `reset()`. Two options:

**Sentinel payload** — keeps the component mounted (and its focus/scroll):

```js
async function reducerAction(previousState, payload) {
  if (payload === null) return initialState;
  return await submit(payload);
}

startTransition(() => dispatchAction(null));
```

**`key` prop** — force a remount. Blunter, occasionally exactly right.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `isPending` never true | manual dispatch outside a Transition | wrap in `startTransition` |
| Form data is `undefined` | read off argument 1 | it's `(prevState, formData)` |
| Later actions never run | an earlier reducer threw | catch and return error state |
| State won't reset | no reset path | sentinel payload, or `key` |
| *"called outside of a transition"* | async reducer, manual dispatch | `startTransition` or an Action prop |
| *"Cannot update action state while rendering"* | dispatch during render | dispatch from an event handler only |

---

## vs. the alternatives

| | Use |
|---|---|
| A form, colocated pending + errors | **`useActionState`** |
| Server data with caching, retries, invalidation | **TanStack Query `useMutation`** |
| Instant feedback before the server replies | **`useOptimistic`** (pairs with either) |
| Sync state | `useState` / `useReducer` |

`useActionState` is **not** a data layer — no cache, no dedup, no
revalidation, no retry. For a form that posts once, it is perfect. For
server state you read in several places, use a query library and let
`useActionState` handle only the form.

Pairing them: `useActionState` owns the **confirmed** state, `useOptimistic`
shows the **pending** one. React drops the optimistic value when the action
settles, so a failure needs no manual rollback.

---

## In this repo

- `useActionState.jsx` — all seven patterns above, runnable
- `use-hook.jsx` — `EditUserForm`, the version wired to the real API layer
- `../query/queries.js` — the `useMutation` comparison, with rollback

Verified against [react.dev/reference/react/useActionState](https://react.dev/reference/react/useActionState).

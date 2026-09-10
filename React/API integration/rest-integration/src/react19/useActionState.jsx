/**
 * useActionState — the complete API.
 *
 *   const [state, dispatchAction, isPending] =
 *     useActionState(reducerAction, initialState, permalink?);
 *
 * The naming is deliberate: it is `useReducer` where the reducer may be
 * ASYNC. That single difference is where all the interesting behaviour
 * comes from — actions QUEUE, and a queue can be skipped or cancelled.
 *
 *   reducerAction   (previousState, payload) => newState | Promise<newState>
 *   dispatchAction  call it to queue an action; returns a promise
 *   isPending       true while an action is in flight
 *   permalink       URL used for progressive enhancement before hydration
 *
 * Two rules that cause most of the bugs:
 *
 *   1. `dispatchAction` MUST run inside a Transition. Passing it to an
 *      Action prop (<form action={...}>) does that for you. Calling it from
 *      an onClick does not — wrap it in startTransition yourself.
 *
 *   2. If `reducerAction` THROWS, React cancels every action still queued
 *      behind it and escalates to the nearest Error Boundary. For anything
 *      you expect (validation, a 4xx), catch and RETURN error state.
 */

import { useActionState, useState, useRef, useTransition, useOptimistic } from 'react';
import { users } from '../api/endpoints.js';
import { toUserMessage } from '../api/errors.js';

/* ------------------------------------------------------------------ *
 * 1. The basic shape: state + form
 * ------------------------------------------------------------------ */

/**
 * Note the argument order. WITHOUT useActionState a form action receives
 * (formData). WITH it, the previous state comes FIRST:
 *
 *   function action(formData)             // plain form action
 *   function action(prevState, formData)  // useActionState
 *
 * Reading `formData.get('name')` off the first argument is the single most
 * common mistake here — the first argument is the state.
 */
export function SubscribeForm() {
  const [state, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get('email');

      if (!email?.includes('@')) {
        // Known/expected failure -> return it, do not throw.
        return { ...previousState, error: 'Enter a valid email address.' };
      }

      try {
        await users.create({ email });
        return { email: '', error: null, success: true, count: previousState.count + 1 };
      } catch (error) {
        return { ...previousState, error: toUserMessage(error), success: false };
      }
    },
    { email: '', error: null, success: false, count: 0 }
  );

  return (
    <form action={submitAction}>
      <input name="email" type="email" defaultValue={state.email} disabled={isPending} />

      {state.error && <p role="alert">{state.error}</p>}
      {state.success && <p>Subscribed. ({state.count})</p>}

      <button disabled={isPending}>{isPending ? 'Subscribing…' : 'Subscribe'}</button>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * 2. Multiple action types — it really is a reducer
 * ------------------------------------------------------------------ */

/**
 * Dispatch a payload carrying a `type` and switch on it, exactly as you
 * would in useReducer. One piece of state, one pending flag, many actions.
 */
export function Cart({ productId }) {
  const [count, dispatchCart, isPending] = useActionState(
    async (previousCount, payload) => {
      switch (payload.type) {
        case 'ADD':
          return await addToCart(productId, previousCount);

        case 'REMOVE':
          return await removeFromCart(productId, previousCount);

        case 'SET':
          return await setCartQuantity(productId, payload.quantity);

        case 'RESET':
          return 0;

        default:
          return previousCount;
      }
    },
    0
  );

  // These are onClick handlers, NOT Action props — so we must wrap them in a
  // Transition ourselves, or isPending never flips to true.
  const [, startTransition] = useTransition();

  const add = () => startTransition(() => dispatchCart({ type: 'ADD' }));
  const remove = () => startTransition(() => dispatchCart({ type: 'REMOVE' }));

  return (
    <div>
      <button onClick={remove} disabled={isPending || count === 0}>−</button>
      <output>{count}</output>
      <button onClick={add} disabled={isPending}>+</button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Cancelling queued actions
 * ------------------------------------------------------------------ */

/**
 * Actions queue. If the user clicks "+" five times fast, five actions run in
 * order. Often you only want the last one — hold an AbortController in a ref
 * and abort the previous action before dispatching the next.
 *
 * The signal is passed through the PAYLOAD, because the reducerAction only
 * receives (previousState, payload).
 *
 * CAVEAT from the docs, and it is a real one: aborting an Action is only
 * safe when the side effect can be safely ignored or retried. Aborting a
 * payment leaves you not knowing whether it went through. Abort reads and
 * idempotent writes; do not abort money.
 */
export function LiveSearch() {
  const abortRef = useRef(null);

  const [state, dispatchSearch, isPending] = useActionState(
    async (previousState, payload) => {
      try {
        // Our API client already understands AbortSignal — see api/client.js.
        const page = await users.list({ search: payload.term, signal: payload.signal });
        return { term: payload.term, results: page.items, error: null };
      } catch (error) {
        // An abort is not a failure: keep whatever was on screen.
        if (error.name === 'AbortError') return previousState;
        return { ...previousState, error: toUserMessage(error) };
      }
    },
    { term: '', results: [], error: null }
  );

  const [, startTransition] = useTransition();

  function onChange(event) {
    const term = event.target.value;

    // Cancel the action already in flight before queueing a new one.
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    startTransition(() => {
      dispatchSearch({ term, signal: abortRef.current.signal });
    });
  }

  return (
    <div>
      <input onChange={onChange} placeholder="Search users" />
      {isPending && <span>Searching…</span>}
      {state.error && <p role="alert">{state.error}</p>}
      <ul>
        {state.results.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 4. Error handling — the two kinds
 * ------------------------------------------------------------------ */

/**
 * KNOWN errors (validation, a 4xx, a business rule) -> return as state.
 * UNKNOWN errors (a bug, a 500 you cannot act on) -> throw, and let the
 * nearest Error Boundary take the screen.
 *
 * The consequence of throwing is bigger than losing the message: React
 * CANCELS every action still queued. If the user submitted three things and
 * the first throws, the other two silently never run.
 */
export function CheckoutForm() {
  const [state, checkoutAction, isPending] = useActionState(
    async (previousState, formData) => {
      const quantity = Number(formData.get('quantity'));

      // Known: validation. Return it.
      if (!Number.isInteger(quantity) || quantity < 1) {
        return { ...previousState, error: 'Quantity must be a whole number of at least 1.' };
      }

      const result = await placeOrder({ quantity });

      // Known: the API told us why it refused. Return it.
      if (result.error) {
        return { ...previousState, error: `Could not order ${quantity}: ${result.error}` };
      }

      // Unknown failures inside placeOrder() propagate — deliberately.
      // An Error Boundary is the right home for "the app is broken".
      return { orderId: result.id, error: null };
    },
    { orderId: null, error: null }
  );

  return (
    <form action={checkoutAction}>
      <input name="quantity" type="number" defaultValue={1} />
      {state.error && <p role="alert">{state.error}</p>}
      {state.orderId && <p>Order {state.orderId} placed.</p>}
      <button disabled={isPending}>Place order</button>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * 5. Resetting state
 * ------------------------------------------------------------------ */

/**
 * There is no `reset()`. Two options:
 *
 *   a) a sentinel payload the reducer recognises  (shown here)
 *   b) a `key` prop on the component, to force a remount
 *
 * (a) keeps the component mounted, which matters if it holds focus or
 * scroll position; (b) is a sledgehammer that is sometimes exactly right.
 */
const INITIAL_FEEDBACK = { message: '', sent: false, error: null };

export function FeedbackForm() {
  const [state, dispatchFeedback, isPending] = useActionState(async (previousState, payload) => {
    // The sentinel: dispatch(null) means "go back to the start".
    if (payload === null) return INITIAL_FEEDBACK;

    try {
      await submitFeedback(payload.get('message'));
      return { message: '', sent: true, error: null };
    } catch (error) {
      return { ...previousState, error: toUserMessage(error) };
    }
  }, INITIAL_FEEDBACK);

  const [, startTransition] = useTransition();
  const reset = () => startTransition(() => dispatchFeedback(null));

  if (state.sent) {
    return (
      <div>
        <p>Thanks for the feedback.</p>
        <button onClick={reset}>Send another</button>
      </div>
    );
  }

  return (
    <form action={dispatchFeedback}>
      <textarea name="message" required />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={isPending}>Send</button>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * 6. With useOptimistic
 * ------------------------------------------------------------------ */

/**
 * useActionState owns the CONFIRMED state; useOptimistic shows the pending
 * one. React drops the optimistic value automatically when the action
 * settles, so a failure needs no manual rollback.
 */
export function TodoList({ initialTodos }) {
  const [todos, dispatchTodo, isPending] = useActionState(async (previousTodos, formData) => {
    const text = formData.get('text');

    try {
      const saved = await createTodo(text);
      return [...previousTodos, saved];
    } catch {
      // Return the list unchanged; the optimistic entry disappears on its own.
      return previousTodos;
    }
  }, initialTodos);

  const [optimisticTodos, addOptimistic] = useOptimistic(todos, (current, text) => [
    ...current,
    { id: `pending-${text}`, text, pending: true },
  ]);

  async function submit(formData) {
    addOptimistic(formData.get('text')); // paints immediately
    await dispatchTodo(formData);        // Action props wrap this in a Transition
  }

  return (
    <>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
      <form action={submit}>
        <input name="text" required />
        <button disabled={isPending}>Add</button>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 7. The mistakes, side by side
 * ------------------------------------------------------------------ */

export function Antipatterns() {
  const [state, dispatchAction] = useActionState(async (prev) => prev + 1, 0);
  const [, startTransition] = useTransition();

  // ❌ "Cannot update action state while rendering" — and an infinite loop.
  // dispatchAction();

  // ❌ isPending never becomes true: no Transition around a manual dispatch.
  const brokenClick = () => dispatchAction();

  // ✅ Wrapped.
  const workingClick = () => startTransition(() => dispatchAction());

  return <button onClick={workingClick}>{state}</button>;
}

/**
 * ❌ Reading form data off the wrong argument.
 *
 *   useActionState(async (formData) => {
 *     formData.get('name');   // undefined — this is previousState
 *   }, initialState);
 *
 * ✅ State first, payload second:
 *
 *   useActionState(async (previousState, formData) => {
 *     formData.get('name');
 *   }, initialState);
 */

/* ------------------------------------------------------------------ *
 * Stubs, so this file reads standalone
 * ------------------------------------------------------------------ */

const addToCart = async (id, count) => count + 1;
const removeFromCart = async (id, count) => Math.max(0, count - 1);
const setCartQuantity = async (id, quantity) => quantity;
const placeOrder = async ({ quantity }) => ({ id: `ord_${quantity}`, error: null });
const submitFeedback = async (message) => ({ ok: true, message });
const createTodo = async (text) => ({ id: Date.now(), text });

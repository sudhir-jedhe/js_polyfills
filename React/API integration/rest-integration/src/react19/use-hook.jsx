/**
 * React 19: data fetching with `use()`, Suspense and Error Boundaries.
 *
 * `use()` unwraps a promise during render. React suspends the component
 * until it settles, so there is NO isLoading branch and NO useEffect.
 *
 * The one rule that trips everyone up:
 *
 *   DO NOT CREATE THE PROMISE INSIDE THE COMPONENT THAT `use()`s IT.
 *
 * Every render would create a new promise, suspend, re-render, create
 * another — an infinite loop. The promise must come from OUTSIDE the
 * suspending component: a parent, a cache, or a router loader.
 *
 * This is exactly the gap TanStack Query fills. `use()` is the primitive;
 * it does not cache, dedupe, revalidate or retry. For real apps, use
 * `useSuspenseQuery`. Use `use()` when you already have a promise.
 */

import {
  use,
  Component,
  Suspense,
  useState,
  useTransition,
  useOptimistic,
  useActionState,
} from 'react';
import { users } from '../api/endpoints.js';
import { toUserMessage } from '../api/errors.js';

/* ------------------------------------------------------------------ *
 * A promise cache — the missing piece
 * ------------------------------------------------------------------ */

const promiseCache = new Map();

/**
 * Stable promise per key. Calling this repeatedly during re-renders returns
 * the SAME promise, which is what makes `use()` safe.
 */
export function cachedPromise(key, factory) {
  if (!promiseCache.has(key)) {
    const promise = factory();
    promiseCache.set(key, promise);
    // Evict failures so a retry can actually re-request.
    promise.catch(() => promiseCache.delete(key));
  }
  return promiseCache.get(key);
}

export const invalidatePromise = (key) => promiseCache.delete(key);

/* ------------------------------------------------------------------ *
 * The suspending component
 * ------------------------------------------------------------------ */

/** Receives a promise as a prop — it never creates one. */
function UserDetail({ userPromise }) {
  const user = use(userPromise); // suspends until resolved; throws on reject

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <span>{user.role}</span>
    </article>
  );
}

/** The parent owns the promise, so it is created once per userId. */
export function UserPage({ userId }) {
  const userPromise = cachedPromise(`user:${userId}`, () => users.byId(userId));

  return (
    <ErrorBoundary fallback={(error, reset) => <ErrorState error={error} onRetry={reset} />}>
      <Suspense fallback={<UserSkeleton />}>
        <UserDetail userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

/* ------------------------------------------------------------------ *
 * Error boundary — still a class, even in React 19
 * ------------------------------------------------------------------ */

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Ship to Sentry/Datadog here.
    console.error('[boundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return typeof this.props.fallback === 'function'
        ? this.props.fallback(this.state.error, this.reset)
        : this.props.fallback;
    }
    return this.props.children;
  }
}

function ErrorState({ error, onRetry }) {
  return (
    <div role="alert">
      <p>{toUserMessage(error)}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
}

function UserSkeleton() {
  return <div aria-busy="true">Loading…</div>;
}

/* ------------------------------------------------------------------ *
 * Writes: useActionState + useOptimistic
 * ------------------------------------------------------------------ */

/**
 * useActionState wires a form to an async action and gives you the pending
 * state for free — no useState triple for loading/error/data.
 *
 * Passing the dispatcher to <form action={...}> wraps it in a Transition
 * automatically. Calling it from an onClick does NOT — see
 * ./useActionState.jsx for that and the rest of the API.
 */
export function EditUserForm({ user }) {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      try {
        const updated = await users.update(user.id, {
          name: formData.get('name'),
          email: formData.get('email'),
        });
        invalidatePromise(`user:${user.id}`);
        return { ok: true, user: updated, errors: {} };
      } catch (error) {
        // CATCH AND RETURN — do not let this throw.
        // A reducerAction that throws does more than lose the message: React
        // CANCELS every dispatchAction still queued behind it and escalates
        // to the nearest Error Boundary. Returning error state keeps the
        // queue alive and keeps the error next to the field that caused it.
        return { ok: false, message: toUserMessage(error), errors: error.fieldErrors ?? {} };
      }
    },
    { ok: false, errors: {} }
  );

  return (
    <form action={formAction}>
      <label>
        Name
        <input name="name" defaultValue={user.name} aria-invalid={Boolean(state.errors.name)} />
        {state.errors.name && <span role="alert">{state.errors.name}</span>}
      </label>

      <label>
        Email
        <input name="email" type="email" defaultValue={user.email} />
        {state.errors.email && <span role="alert">{state.errors.email}</span>}
      </label>

      {state.message && <p role="alert">{state.message}</p>}
      {state.ok && <p>Saved.</p>}

      <button disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

/**
 * useOptimistic: show the change instantly, and React reverts it
 * automatically if the action throws.
 */
export function CommentList({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments);

  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (current, pending) => [...current, { ...pending, id: `temp-${Date.now()}`, isPending: true }]
  );

  async function submit(formData) {
    const text = formData.get('text');

    addOptimistic({ text, author: 'You' }); // appears immediately

    try {
      const saved = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      }).then((r) => r.json());

      setComments((prev) => [...prev, saved]);
    } catch {
      // Nothing to undo: React drops the optimistic entry when the action
      // finishes and `comments` has not changed.
    }
  }

  return (
    <>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id} style={{ opacity: c.isPending ? 0.5 : 1 }}>
            <b>{c.author}</b> {c.text}
          </li>
        ))}
      </ul>
      <form action={submit}>
        <input name="text" required />
        <button>Post</button>
      </form>
    </>
  );
}

/**
 * useTransition keeps the old UI interactive while new data loads, instead
 * of dropping to a Suspense fallback on every filter change.
 */
export function SearchableUsers() {
  const [query, setQuery] = useState('');
  const [deferredQuery, setDeferredQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function onChange(event) {
    const value = event.target.value;
    setQuery(value); // urgent: the input must feel instant

    startTransition(() => {
      setDeferredQuery(value); // non-urgent: results can lag
    });
  }

  const promise = cachedPromise(`search:${deferredQuery}`, () =>
    users.list({ search: deferredQuery })
  );

  return (
    <div>
      <input value={query} onChange={onChange} />
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<p>Searching…</p>}>
          <Results promise={promise} />
        </Suspense>
      </div>
    </div>
  );
}

function Results({ promise }) {
  const page = use(promise);
  return (
    <ul>
      {page.items.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

# REST API Integration in React

A working reference for talking to a REST API from React — the layer most
tutorials skip, and the one that decides whether an app is pleasant or
miserable to maintain.

Written against **React 19** and **TanStack Query v5**.

---

## The one idea

**Server state is not application state.**

`useState` and Redux hold state you *own*: a modal is open, a form is
half-typed. You are the source of truth.

Data from a REST API is different. It is a **cache of something you do not
own**, which can go stale the moment it arrives — someone else edited that
record while you were reading it. Once you accept that, the hard parts stop
being surprises:

| It needs                          | Because                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| Caching                           | Refetching the same thing on every mount is waste          |
| Deduplication                     | Three components wanting `/users` should cause one request |
| Revalidation                      | Your copy is stale the instant it lands                    |
| Loading **and** background states | A refresh must not blank the screen                        |
| Cancellation                      | Users navigate away mid-request                            |
| Retries                           | Networks fail transiently; 4xx failures do not             |
| Optimistic updates                | Waiting for a round trip feels broken                      |

Any library you pick — TanStack Query, SWR, RTK Query — is solving exactly
this list. Knowing the list is what lets you evaluate them, and what
interviewers are actually probing for.

---

## Layer the code

The single most valuable structural decision: **no component ever calls
`fetch` directly.**

```
components  ──►  hooks  ──►  endpoints  ──►  client  ──►  fetch/axios
   UI            state       URL shapes     transport
```

| Layer        | File                   | Job                                           |
| ------------ | ---------------------- | --------------------------------------------- |
| Transport    | `src/api/client.js`    | Base URL, JSON, timeout, retry, interceptors  |
| Errors       | `src/api/errors.js`    | Turn every failure into one predictable shape |
| Auth         | `src/api/auth.js`      | Attach tokens, refresh once, CSRF             |
| Endpoints    | `src/api/endpoints.js` | One function per route + response mapping     |
| Server state | `src/query/`           | Cache, invalidation, mutations                |
| UI           | `src/components/`      | Render four states, nothing more              |

Why it pays off: when the API moves from `/users` to `/v2/accounts`, or the
team swaps `fetch` for `axios`, or auth changes from bearer tokens to
cookies — you edit one file, not forty components. And every test can mock
one seam.

---

## fetch vs axios

|                        | `fetch`                          | `axios`            |
| ---------------------- | -------------------------------- | ------------------ |
| Bundle                 | 0 kB (built in)                  | ~13 kB gzipped     |
| **Rejects on 4xx/5xx** | **No** — you must check `res.ok` | Yes                |
| JSON                   | Manual `.json()`                 | Automatic          |
| Timeout                | Wire an `AbortController`        | `timeout: 5000`    |
| Interceptors           | Build your own                   | Built in           |
| Upload progress        | Not supported                    | `onUploadProgress` |
| Node support           | Native (18+)                     | Yes                |

**The `fetch` gotcha that bites everyone:**

```js
// BROKEN — a 500 lands in .then(), not .catch()
fetch('/api/users')
  .then((res) => res.json())
  .then(setData)
  .catch(setError);        // never fires for HTTP errors

// CORRECT
const res = await fetch('/api/users');
if (!res.ok) throw new HttpError(res.statusText, { status: res.status });
```

`fetch` only rejects when the request *never completed* — DNS failure,
offline, CORS. A 404 is a perfectly successful HTTP round trip as far as
`fetch` is concerned.

**Which to use:** wrap `fetch` (see `client.js`) unless you need upload
progress or you are already carrying axios. The wrapper is ~150 lines and
you control it.

---

## The four states

Every request has four possible renderings, and skipping any of them is a
bug users will find:

```jsx
if (isLoading) return <Skeleton />;        // first load, no data yet
if (error)     return <ErrorState />;      // failed
if (!data.length) return <EmptyState />;   // succeeded, nothing to show
return <List items={data} />;              // succeeded, has data
```

Two refinements that separate a polished app from a rough one:

**`isLoading` ≠ `isFetching`.** `isLoading` is the *first* load. `isFetching`
is *any* load, including a background refresh. Use `isLoading` for the
skeleton, `isFetching` for a subtle indicator. Conflating them means the
list blanks out every time it silently refreshes.

**Skeletons beat spinners.** A skeleton holds the layout, so nothing jumps
when data arrives (good CLS), and it communicates the *shape* of what is
coming.

---

## Race conditions

The bug most React data-fetching code has:

```jsx
// BROKEN
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((r) => r.json())
    .then(setResults);        // whichever finishes LAST wins
}, [query]);
```

Type `a`, then `ab`. If the request for `a` is slower, it resolves *second*
and overwrites the results for `ab`. The box says "ab"; the list shows
results for "a".

```jsx
// CORRECT
useEffect(() => {
  const controller = new AbortController();
  let cancelled = false;

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then((data) => { if (!cancelled) setResults(data); })
    .catch((err) => { if (err.name !== 'AbortError') setError(err); });

  return () => { cancelled = true; controller.abort(); };
}, [query]);
```

Both guards matter: `abort()` stops the network work, and `cancelled` covers
the window where the promise already resolved but the effect has been torn
down.

`useApi` in `src/hooks/useApi.js` does this for you. TanStack Query does it
automatically — just forward the `signal` it hands you.

---

## Errors worth acting on

Four failures need four different responses. Collapsing them into
`catch (e) { setError(e) }` throws that away.

| Failure                               | Retry? | Show the user?                            |
| ------------------------------------- | ------ | ----------------------------------------- |
| `NetworkError` — offline, DNS, CORS   | Yes    | "You appear to be offline"                |
| `TimeoutError` — our deadline elapsed | Yes    | "That took too long"                      |
| `AbortError` — *we* cancelled         | No     | **Nothing** — this is not a failure       |
| `HttpError` 4xx                       | No     | Server's own message (written for humans) |
| `HttpError` 5xx                       | Yes    | Generic — never leak the body             |

The `AbortError` row is the one people get wrong: cancelling a request on
unmount is normal, and rendering "Error: aborted" for it is a self-inflicted
bug.

Never show a raw 5xx body — it can contain stack traces, SQL, internal
hostnames. `toUserMessage()` in `errors.js` is the single gate.

---

## Auth: refresh exactly once

The classic bug: ten requests fire, all get 401, all ten start a token
refresh. Nine fail because the first one already rotated the refresh token,
and the user gets logged out mid-session.

The fix is a **single in-flight refresh promise** every 401 awaits:

```js
let refreshPromise = null;

function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;    // everyone shares this one

  refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  return refreshPromise;
}
```

**Where to keep tokens** — the honest ranking:

|                          | XSS-safe | Survives reload | Needs                       |
| ------------------------ | -------- | --------------- | --------------------------- |
| `httpOnly` cookie        | Yes      | Yes             | CSRF protection             |
| Memory (module variable) | Yes      | No              | A refresh cookie to restore |
| `localStorage`           | **No**   | Yes             | —                           |

`localStorage` is readable by any injected script — a compromised npm
dependency is enough. The production answer is an `httpOnly` refresh cookie
plus a short-lived access token held in memory. `src/api/auth.js` implements
this.

---

## Optimistic updates

Apply the change immediately, keep a snapshot, roll back if the server
disagrees:

```js
onMutate: async ({ id, changes }) => {
  await client.cancelQueries({ queryKey: key });    // stop refetches clobbering us
  const snapshot = client.getQueryData(key);         // save for rollback
  client.setQueryData(key, (old) => ({ ...old, ...changes }));
  return { snapshot };
},
onError:   (err, vars, ctx) => client.setQueryData(key, ctx.snapshot),
onSettled: () => client.invalidateQueries({ queryKey: key }),
```

`cancelQueries` is the step people skip: without it, a refetch that was
already in flight can land *after* your optimistic write and undo it.

Use optimism where success is near-certain and cheap to reverse — likes,
toggles, reordering, adding a comment. Do **not** use it for payments,
irreversible deletes, or anything where a rollback would confuse more than a
spinner would.

React 19's `useOptimistic` does the same for form actions, and reverts
automatically when the action throws.

---

## Pagination

|                     | Offset (`?page=2`)      | Cursor (`?cursor=abc`) |
| ------------------- | ----------------------- | ---------------------- |
| Jump to page N      | Yes                     | No                     |
| Total count         | Usually                 | Usually not            |
| Stable under writes | **No**                  | Yes                    |
| Fast at depth       | No — the DB still scans | Yes                    |

Offset pagination *duplicates and skips rows* when the underlying data
changes while a user is paging — an insert shifts everything across page
boundaries. For a feed, that is a visible bug; use cursors. For an admin
table where page numbers matter, offset is fine.

---

## React 19: `use()`

`use()` unwraps a promise during render, so there is no `isLoading` branch
and no `useEffect`:

```jsx
function UserDetail({ userPromise }) {
  const user = use(userPromise);   // suspends until it settles
  return <h2>{user.name}</h2>;
}
```

**The rule that breaks people:** do *not* create the promise inside the
component that `use()`s it. Every render would make a new promise → suspend
→ re-render → new promise → infinite loop. The promise must come from a
parent, a cache, or a router loader.

`use()` is a primitive, not a data layer — it has no cache, no dedup, no
revalidation, no retries. That gap is exactly what TanStack Query fills.
For real screens use `useSuspenseQuery`; use `use()` when you already have a
promise in hand.

---

## Decision guide

| Situation                          | Use                                                   |
| ---------------------------------- | ----------------------------------------------------- |
| One or two screens, no shared data | `useApi` (`hooks/useApi.js`)                          |
| Anything bigger                    | **TanStack Query**                                    |
| Already all-in on Redux Toolkit    | RTK Query                                             |
| Next.js App Router                 | Server Components + `fetch`, Query for client islands |
| You must not add a dependency      | `hooks/useQueryCache.js` — ~150 lines, dedup + SWR    |

For most React apps, **TanStack Query is the right default**. It is not a
"nice to have": it is roughly 2,000 lines of edge cases you would otherwise
rediscover one production incident at a time.

---

## Files

```
src/
├── api/
│   ├── errors.js         Error taxonomy + toUserMessage()
│   ├── client.js         fetch wrapper: timeout, retry, interceptors
│   ├── axios-client.js   The same, on axios
│   ├── auth.js           Token store, single-flight refresh, CSRF
│   └── endpoints.js      Per-resource functions + DTO mapping
├── hooks/
│   ├── useApi.js         Correct useEffect fetching (abort + race-safe)
│   ├── useQueryCache.js  Mini TanStack Query: cache, dedup, SWR
│   └── usePagination.js  Offset, cursor, infinite scroll, search
├── query/
│   ├── queryClient.js    v5 config + query-key factory
│   └── queries.js        Queries, mutations, optimistic, infinite
├── react19/
│   └── use-hook.jsx      use(), Suspense, useActionState, useOptimistic
├── components/
│   ├── UserList.jsx      The same screen at three levels of machinery
│   └── App.jsx           Providers and bootstrap
└── test/
    ├── handlers.js       MSW handlers
    └── api.test.js       Client, error mapping, and race-condition tests
```

---

## Checklist

Before calling an integration done:

- [ ] No component calls `fetch`/`axios` directly
- [ ] Every request can be cancelled; unmount aborts it
- [ ] `AbortError` is never rendered as an error
- [ ] 4xx are not retried; 5xx/429/408 are, with backoff + jitter
- [ ] `Retry-After` is honoured
- [ ] Loading, error, empty and success are all handled
- [ ] `isLoading` and `isFetching` are distinguished
- [ ] Token refresh is single-flight
- [ ] Tokens are not in `localStorage`
- [ ] The cache is cleared on logout
- [ ] Server 5xx bodies never reach the UI
- [ ] Field-level validation errors map to inputs
- [ ] Tests mock the network (MSW), not the module

---

## Interview questions this covers

1. *Why doesn't `fetch` reject on a 404?* → It only rejects when the request
   never completes. HTTP errors are successful round trips.
2. *How do you cancel a request in React?* → `AbortController`, aborted in
   the effect cleanup, plus a `cancelled` flag for the resolved-but-torn-down
   window.
3. *A user types fast and sees stale results. Why?* → Race condition; the
   slower earlier request resolves last. Abort + ignore stale.
4. *Build a `useFetch` with caching and dedup.* → `hooks/useQueryCache.js`.
5. *What is stale-while-revalidate?* → Serve the cached value immediately,
   refetch in the background, swap when it lands. No spinner on repeat views.
6. *Where do you store a JWT?* → `httpOnly` cookie; access token in memory.
   Not `localStorage` — XSS reads it.
7. *Ten requests 401 at once. What happens?* → Without single-flight refresh,
   ten refreshes and a logout. Share one promise.
8. *How do optimistic updates roll back?* → Snapshot in `onMutate`, restore
   in `onError`, `invalidate` in `onSettled`. Cancel in-flight queries first.
9. *Offset vs cursor pagination?* → Offset duplicates/skips under concurrent
   writes and is slow at depth; cursor is stable and fast but has no page
   numbers.
10. *Why not just `useEffect`?* → No cache, no dedup, no revalidation, no
    retry, and it is easy to get races and cleanup wrong.

<https://www.sitepoint.com/react-19-use-hook-data-fetching-patterns-that-actually-work/>

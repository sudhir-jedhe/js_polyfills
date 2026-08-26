# Race Conditions, Cleanup, and AbortController

## Bug 1: race conditions

If `userId` changes quickly (fast tab clicks, a search box, arrow-key navigation), you fire multiple requests and they can resolve **out of order**. The last request to resolve wins, not the last request to be sent. If request A (for user 1) resolves after request B (for user 2), you render user 1's data while `userId` is 2. The fix is either an abort flag or `AbortController` (below) — you need to ignore results from stale requests.

## Bug 2: missing cleanup / setting state after unmount

If the component unmounts (or the effect re-runs) before the promise resolves, calling `setData` afterward is a no-op in React 18 (no crash, and React 18 removed the old "Can't perform a React state update on an unmounted component" warning because it was overly aggressive) — but it's still wasted work and a code smell worth fixing, since it can mask stale-closure issues. Always guard with a cleanup flag or abort the request.

```jsx
useEffect(() => {
  let cancelled = false;
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then((json) => {
      if (!cancelled) setData(json);
    });
  return () => {
    cancelled = true;
  };
}, [userId]);
```

## AbortController — the proper fix

`AbortController` cancels the underlying network request (not just the state update), which is strictly better: it saves bandwidth and lets the server stop working on a response nobody wants.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    } finally {
      setLoading(false);
    }
  }

  load();
  return () => controller.abort();
}, [userId]);
```

Gotcha: an aborted `fetch` rejects with a `DOMException` named `"AbortError"` — you must special-case it, otherwise you'll show an error UI for a cancellation that isn't really an error. Calling `controller.abort()` cancels the fetch even if called synchronously right after starting it (the abort signal is checked asynchronously by the fetch implementation).

The cleanup function returned from `useEffect` runs before the effect re-runs (when dependencies change) and when the component unmounts — for fetching, you use it to abort the in-flight request (`controller.abort()`) or set a flag so a late-arriving response is ignored, preventing both race conditions and wasted state updates.

## Cleanup flag vs AbortController

| Aspect | Cancelled flag (`let cancelled = false`) | AbortController |
|---|---|---|
| What it stops | Only the `setState` call after resolution | The actual network request/response |
| Server cost | Server still does full work, response is wasted | Server can stop processing (if it respects the signal) |
| Browser support | Universal, no API needed | Native in all modern browsers, needs `fetch`/library support |
| Common mistake | Fine for correctness but leaves it looking like an unresolved perf issue in review | Forgetting to special-case `AbortError` in `.catch`, turning cancellations into false error states |

Use `AbortController` whenever you're using `fetch` directly — it's strictly better and barely more code. Use a plain cancelled flag only when your fetching function doesn't support cancellation (e.g., some older SDKs).

## Loading state doesn't fix correctness

Setting `loading` back to `true` on every dependency change is fine for the spinner, but if you don't also handle stale responses, the underlying race condition (an old, slow request resolving after a newer, fast one) still exists — the loading indicator disappearing doesn't mean the *correct* data was the one that arrived. Loading state and correctness are separate problems; fixing the spinner doesn't fix the race.

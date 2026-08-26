*** copy 04-uselayouteffect-and-async-race-conditions-qa.md ***

# Interview Q&A — `useLayoutEffect` and Async Race Conditions

**Q: What's the difference between `useEffect` and `useLayoutEffect`?**
They share the same API, but `useLayoutEffect` runs synchronously immediately after DOM mutations are applied and *before* the browser paints, blocking the paint until it completes; `useEffect` runs asynchronously after paint. Use `useLayoutEffect` only when you need to measure the DOM and synchronously adjust something before the user sees a frame with the wrong layout — otherwise `useEffect` is the correct default since it doesn't delay rendering.

**Q: If an effect performs an async fetch and the component unmounts (or the dependency changes) before the fetch resolves, what problem can occur, and how do you guard against it?**
Calling a state setter after the component has unmounted, or after a newer request has superseded an older one, can apply a stale response's data on top of newer state — a race condition where an older, slower request "wins" and overwrites the correct result. The standard guard is a boolean flag (or an `AbortController`) set in the cleanup function so the async callback checks whether it's still valid before calling the setter.

```jsx
React.useEffect(() => {
  let cancelled = false;
  fetchData(id).then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, [id]);
```

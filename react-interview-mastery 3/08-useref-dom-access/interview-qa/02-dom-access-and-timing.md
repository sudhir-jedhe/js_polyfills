# Interview Q&A: DOM Access & Commit Timing

**Q: When you attach `ref={myRef}` to a JSX element, when does `myRef.current` actually get set?**

After React commits the DOM changes for that render — specifically, before layout effects (`useLayoutEffect`) and `useEffect` run, but not during the render phase itself. This is why reading `ref.current` synchronously in the middle of the function body (during render) for a DOM ref is unreliable — it reflects the *previous* commit's value, not the current one. DOM access should happen in an effect or an event handler, both of which run after commit.

**Q: Give an example of using `useRef` for something other than DOM access.**

Tracking a previous prop or state value:

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
```

Also common: storing interval/timeout IDs so they can be cleared from a different handler, storing a "latest callback" to avoid stale closures in intervals/effects, and tracking whether a component has already mounted to skip an effect's first run.

**Q: What's a stale-closure bug related to `useRef`, and how does `useRef` help fix it?**

`setInterval`/event listeners set up inside a `useEffect` with an empty dependency array capture the state/props values from that one render forever. Storing the "latest" value in a ref (updated on every render via a separate effect with no dependency array, or directly during render) and reading `ref.current` inside the interval callback lets the callback always see the current value without needing to recreate the interval every render.

**Q: Does calling a ref callback function (`ref={(el) => {...}}`) behave differently from passing a ref object?**

Yes — a callback ref is invoked by React with the DOM node (or class instance) when it's attached, and called again with `null` when it's detached (unmount, or the ref itself changes identity between renders). This makes callback refs useful for tracking dynamic collections of elements (e.g., a list of item refs keyed by id) where a single ref object wouldn't work, since you need per-item ref slots.

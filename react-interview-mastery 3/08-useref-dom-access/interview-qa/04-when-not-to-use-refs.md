# Interview Q&A: When Not to Reach for Refs

**Q: Can `useRef` be used to skip an effect on a component's initial mount?**

Yes, a common pattern uses a ref as a boolean flag:

```jsx
function useSkipFirstEffect(callback, deps) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    callback();
  }, deps);
}
```

This is a reasonable escape hatch, though frequently a sign the effect's actual dependency logic could be reconsidered — "run only after the first render" is sometimes solved more cleanly by restructuring what triggers the effect in the first place.

**Q: Why is it generally discouraged to read or write DOM state via refs when the same thing could be expressed with props/state?**

Because it bypasses React's declarative model — the DOM becomes a second source of truth that has to be kept in sync manually, which is error-prone and hard to reason about compared to letting React derive the DOM from state. Refs for DOM access are meant for things React genuinely can't express declaratively (focus, scroll position, measuring layout, third-party imperative library integration), not as a general substitute for controlled state.

**Q: A teammate uses `useRef` to store a click counter that's displayed in the UI, to "avoid unnecessary re-renders." Is this a good idea?**

No. If a value needs to be displayed, a re-render is exactly what needs to happen when it changes — that's not "unnecessary," it's the whole point. `useRef` mutations don't schedule re-renders, so the displayed value would appear frozen even as the underlying ref value changes correctly. `useRef` is for bookkeeping that the component needs to remember internally without that change being reflected in the rendered output by itself (timer IDs, previous values, "have I already done X" flags) — not a general performance trick for values that are supposed to be visible.

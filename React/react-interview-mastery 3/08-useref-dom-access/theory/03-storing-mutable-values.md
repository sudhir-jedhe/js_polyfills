*** copy 03-storing-mutable-values.md ***

# Storing mutable values across renders

The other major use has nothing to do with the DOM — `useRef` is the standard way to keep a mutable value alive between renders without causing re-renders when it changes. Two classic examples:

**Previous value tracking:**

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; // updates AFTER this render commits, so during render it still holds the old value
  });
  return ref.current;
}

function PriceDisplay({ price }) {
  const prevPrice = usePrevious(price);
  const direction = prevPrice === undefined ? null : price > prevPrice ? 'up' : 'down';
  return <span className={direction}>{price}</span>;
}
```

**Interval/timeout IDs:**

```jsx
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback; // always keep the latest callback without re-running the interval effect
  });

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

Storing `callback` in a ref instead of a dependency avoids tearing down and restarting the interval every time the parent re-renders with a new inline function — the interval only resets when `delay` actually changes.

## Stale-closure bugs and how `useRef` fixes them

`setInterval`/event listeners set up inside a `useEffect` with an empty dependency array capture the state/props values from that one render forever — if the callback reads `count` from that closure, it will always see the value `count` had when the effect first ran, even after `count` updates. Storing the "latest" value in a ref (updated on every render via a separate effect with no dependency array, or directly during render) and reading `ref.current` inside the interval callback lets the callback always see the current value without needing to recreate the interval every render.

## Skipping an effect on initial mount

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

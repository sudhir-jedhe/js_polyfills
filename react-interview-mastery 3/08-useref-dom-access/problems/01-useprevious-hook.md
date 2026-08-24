# Problem: `usePrevious(value)` hook using `useRef`

## Task

Build a `usePrevious` hook that returns whatever a given value was on the *previous* render — `undefined` on the very first render — and use it to show a price change indicator.

## Solution

```jsx
import { useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef(undefined);

  // Runs AFTER this render commits, so during the render itself `ref.current`
  // still holds whatever was stored from the previous render's effect.
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function PriceDisplay({ price }) {
  const prevPrice = usePrevious(price);

  let direction = null;
  if (prevPrice !== undefined && price !== prevPrice) {
    direction = price > prevPrice ? 'up' : 'down';
  }

  return (
    <p className={direction ? `price price--${direction}` : 'price'}>
      ${price.toFixed(2)}
      {direction === 'up' && ' ▲'}
      {direction === 'down' && ' ▼'}
      {prevPrice !== undefined && prevPrice !== price && (
        <span className="price-prev"> (was ${prevPrice.toFixed(2)})</span>
      )}
    </p>
  );
}

export default PriceDisplay;
```

## Why this works

- The critical detail is *where* the ref gets updated: inside `useEffect`, not directly in the render body. Effects run after the render has committed and painted, so while the component function is executing for render N, `ref.current` still holds whatever value was written during render N-1's effect — exactly "the previous render's value."
- If the update happened directly during render (`ref.current = value;` with no effect), it would overwrite the ref *before* the return statement reads it, making `previous` always equal `current` — a bug demonstrated in `output-based/03-broken-useprevious-without-effect.md`.
- On the very first render, `ref.current` is still `undefined` (its `useRef(undefined)` initial value), since the effect hasn't run yet — `usePrevious` correctly returns `undefined` to signal "there was no previous render," which `PriceDisplay` uses to avoid showing a spurious "was $X" on first mount.
- Because `useRef` mutations don't trigger re-renders, updating `ref.current` inside the effect doesn't cause an extra render — the hook just makes the previous value available the *next* time the component happens to re-render for its own reasons (here, a new `price` prop).

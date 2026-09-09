***  03-prove-independent-hook-instances.md ***

# Problem 3: Prove Two Components Calling the Same Custom Hook Get Independent State

## The hook under test

```jsx
import { useState, useCallback } from 'react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, reset };
}
```

## Demonstration: two sibling components, same hook, zero shared state

```jsx
function LikeButton() {
  const { count, increment } = useCounter(0);
  return <button onClick={increment}>♥ Likes: {count}</button>;
}

function ShareButton() {
  const { count, increment } = useCounter(0);
  return <button onClick={increment}>↗ Shares: {count}</button>;
}

function PostFooter() {
  return (
    <div>
      <LikeButton />
      <ShareButton />
    </div>
  );
}
```

Clicking "Likes" five times moves only the Likes counter to `5` — "Shares" stays at `0`. Each call to `useCounter()` allocates its own `useState` slot inside its own component instance; there is no shared variable, module-level state, or storage connecting them. `useCounter` is reused *code*, not reused *state*.

## Proving it more rigorously: same hook, same component, two calls

To make the independence even more explicit, call the hook twice in a single component:

```jsx
function DualCounterDemo() {
  const first = useCounter(0);
  const second = useCounter(100); // different initial value — proves no shared slot

  return (
    <div>
      <button onClick={first.increment}>First: {first.count}</button>
      <button onClick={second.increment}>Second: {second.count}</button>
      <button onClick={first.reset}>Reset first</button>
    </div>
  );
}
```

Initial render: `First: 0`, `Second: 100`. Clicking "First" repeatedly only moves `first.count`; `second.count` never changes as a side effect. Clicking "Reset first" only resets `first.count` back to `0` (its own `initial`), leaving `second.count` at whatever it currently is. React allocates two entirely separate hook slots for the two `useCounter()` calls, matched by call order — the first call in the function body always maps to the first slot, the second call always to the second slot, and they never interact.

## The only way to actually share state across hook calls

If `LikeButton` and `ShareButton` genuinely needed to observe the *same* count, `useCounter` alone cannot provide that — the fix is to lift the state up into a shared ancestor and pass it down as props, or store it in Context/an external store:

```jsx
const CountContext = createContext(null);

function CountProvider({ children }) {
  const counter = useCounter(0); // one shared instance
  return <CountContext.Provider value={counter}>{children}</CountContext.Provider>;
}

function useSharedCount() {
  return useContext(CountContext);
}
```

Now every component calling `useSharedCount()` reads and writes the *same* underlying state, because they're all consuming a single `useCounter()` instance held in the provider — a fundamentally different mechanism from just calling the hook independently in each component.

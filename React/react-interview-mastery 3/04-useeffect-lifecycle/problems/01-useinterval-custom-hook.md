***  01-useinterval-custom-hook.md ***

# Problem: Implement a `useInterval(callback, delay)` Custom Hook

## Problem Statement

Implement a `useInterval(callback, delay)` custom hook that runs `callback` every `delay` milliseconds, correctly cleans up the interval on unmount or when `delay` changes, and — critically — lets `callback` change on every render (a fresh closure each time) **without** tearing down and recreating the underlying `setInterval`, avoiding both the stale-closure bug and unnecessary interval resets.

## Requirements

- `useInterval(callback, delay)` calls `callback` every `delay` ms.
- Passing a new `callback` function on every render (e.g. an inline arrow function reading current props/state) must NOT reset the interval's timing — the interval should keep ticking on its original schedule.
- Changing `delay` MUST reset the interval to the new timing.
- Passing `delay = null` pauses the interval (no `setInterval` running) — resuming by passing a number again should work.
- Must clean up (`clearInterval`) on unmount.

## Approach

The classic fix (from the official React docs' `useInterval` recipe) is to store the *latest* `callback` in a `ref`, updated via its own effect that runs on every render — refs don't trigger re-renders or need to be listed as effect dependencies, so updating one doesn't cause the interval-managing effect to re-run. The interval-creating effect itself only depends on `delay`, and its `setInterval` callback always calls `callbackRef.current(...)`, meaning it invokes whatever the *latest* callback is at tick time, without needing `callback` in its own dependency array.

## Solution

```jsx
function useInterval(callback, delay) {
  const callbackRef = React.useRef(callback);

  // Keep the ref pointed at the LATEST callback on every render — this effect
  // runs after every render (no dependency array) but never touches setInterval.
  React.useEffect(() => {
    callbackRef.current = callback;
  });

  // The interval itself only depends on `delay` — a new `callback` reference
  // never tears this effect down, so the interval's timing is never reset.
  React.useEffect(() => {
    if (delay === null) return; // paused — no interval running

    const id = setInterval(() => {
      callbackRef.current(); // always calls the LATEST callback, no stale closure
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

// --- usage: a ticking counter whose "tick" logic can change without resetting the timer ---
function Timer() {
  const [seconds, setSeconds] = React.useState(0);
  const [delay, setDelay] = React.useState(1000);

  // A brand-new arrow function every render — useInterval handles this correctly.
  useInterval(() => {
    setSeconds(s => s + 1);
  }, delay);

  return (
    <div>
      <p>{seconds}s elapsed (every {delay}ms)</p>
      <button onClick={() => setDelay(500)}>Speed up</button>
      <button onClick={() => setDelay(null)}>Pause</button>
    </div>
  );
}

// --- verification (conceptual timeline) ---
// mount, delay=1000: interval A created, ticks every 1000ms
// re-render with a NEW inline callback, delay still 1000: interval A is NOT recreated
//   (its own effect only depends on `delay`, and the ref-update effect has no cleanup)
// setDelay(500): interval A's cleanup fires (clearInterval), interval B created at 500ms
// setDelay(null): interval B's cleanup fires, no new interval started (early return)
```

**Why this works:** Splitting "track the latest callback" and "manage the interval" into two separate effects is what decouples them — the ref-updating effect intentionally has no dependency array (so it always captures the newest `callback`), while the interval-managing effect intentionally depends only on `delay` (so it's immune to `callback` identity changes). Reading `callbackRef.current()` inside the `setInterval` tick means the interval callback is always "fresh" without ever needing the interval itself to be torn down and recreated — the same ref-based pattern flagged as an alternative fix for stale closures in `../theory/04-stale-closures-in-effects.md`.

**Known limitation:** this hook fires on a fixed-delay schedule via `setInterval`, which can drift under heavy main-thread load (each tick is scheduled relative to the previous, not to a fixed wall-clock target) — for drift-sensitive timing, a `setTimeout`-based self-rescheduling loop that computes elapsed time would be more precise, though `setInterval` is sufficient for typical UI polling/ticking use cases.

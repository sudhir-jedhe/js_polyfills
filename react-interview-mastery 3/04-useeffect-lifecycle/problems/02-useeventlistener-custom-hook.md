# Problem: Implement a `useEventListener(eventName, handler, target)` Hook

## Problem Statement

Implement a `useEventListener(eventName, handler, target)` custom hook that attaches a native event listener to a given target (defaulting to `window`) and safely removes it on cleanup — while, like `useInterval`, allowing `handler` to be a fresh closure on every render without tearing down and re-attaching the listener on every render.

## Requirements

- `useEventListener(eventName, handler, target)` attaches `handler` for `eventName` on `target` (default `window` when `target` is omitted).
- A new `handler` function reference each render must NOT cause the listener to be removed and re-added.
- Changing `eventName` or `target` MUST remove the old listener and attach a new one.
- Must handle `target` being a ref object (`{ current: someElement }`) in addition to a plain DOM node/`window`, since refs are the common way to target a specific element — and the target might not be attached (`ref.current === null`) on the first render.
- Must clean up (`removeEventListener`) on unmount or before re-attaching.

## Approach

Same latest-ref pattern as `useInterval`: store `handler` in a ref, updated every render via a dependency-less effect, so the listener-attaching effect never needs `handler` as a dependency. The listener-attaching effect resolves `target` (unwrapping a ref object if given one) and depends on `[eventName, target]`; it bails out early if the resolved element doesn't support `addEventListener` (e.g. a ref that hasn't attached yet), and otherwise attaches a thin wrapper function that calls `handlerRef.current(event)`.

## Solution

```jsx
function useEventListener(eventName, handler, target) {
  const handlerRef = React.useRef(handler);

  // Always keep the ref pointed at the latest handler — doesn't affect the listener itself.
  React.useEffect(() => {
    handlerRef.current = handler;
  });

  React.useEffect(() => {
    // Resolve the actual DOM node: a ref object, a raw node, or default to window.
    const resolvedTarget = target && 'current' in target ? target.current : target ?? window;

    if (!resolvedTarget || !resolvedTarget.addEventListener) {
      return; // nothing to attach to yet (e.g. ref not mounted) — effect re-runs when target changes
    }

    function eventHandler(event) {
      handlerRef.current(event); // always calls the LATEST handler
    }

    resolvedTarget.addEventListener(eventName, eventHandler);
    return () => resolvedTarget.removeEventListener(eventName, eventHandler);
  }, [eventName, target]);
}

// --- usage 1: listening on window (default target) ---
function MousePosition() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  useEventListener('mousemove', (e) => {
    setPos({ x: e.clientX, y: e.clientY }); // fresh closure every render, no problem
  });

  return <p>Mouse: {pos.x}, {pos.y}</p>;
}

// --- usage 2: listening on a specific element via ref ---
function ClickOutsideBox({ onOutsideClick }) {
  const boxRef = React.useRef(null);

  useEventListener('mousedown', (e) => {
    if (boxRef.current && !boxRef.current.contains(e.target)) {
      onOutsideClick();
    }
  }, document); // listen on the whole document to detect outside clicks

  return <div ref={boxRef} className="box">Click outside me</div>;
}

// --- verification (conceptual) ---
// mount: attaches 'mousemove' on window
// re-render with a NEW inline handler (same eventName/target): listener NOT removed/re-added
//   (the attaching effect only depends on [eventName, target], not handler)
// unmount: cleanup runs, removeEventListener is called
```

**Why this works:** Resolving `target` once per effect run (unwrapping a ref via `'current' in target`) lets the same hook support both `window`/plain DOM nodes and React refs without the caller needing to branch. As with `useInterval`, decoupling "track latest handler" (no deps, runs every render) from "manage the listener" (`[eventName, target]` deps only) means the listener's actual `addEventListener`/`removeEventListener` calls only happen when they structurally need to — not every time the caller's inline handler closure changes identity, which would otherwise mean removing and re-adding a listener on every single render.

**Known limitation:** this version resolves `target.current` only inside the effect at the time it runs — if a ref's `.current` becomes non-null *after* this effect already ran and bailed out early (e.g., attaching to a conditionally-rendered element mounted later without a `target`/`eventName` change to re-trigger the effect), the listener won't retroactively attach. A more robust version would accept a `deps` array to force re-evaluation, or use a callback-ref pattern instead of a plain ref to react to the DOM node itself changing.

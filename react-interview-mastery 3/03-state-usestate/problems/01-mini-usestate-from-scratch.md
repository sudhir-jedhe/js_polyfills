# Problem: Implement a Simplified `useState` From Scratch

## Problem Statement

Implement a simplified `useState` using a module-level closure, for a **single, always-mounted component** — enough to illustrate the core mechanism (state living outside the function, a setter that mutates it and triggers a re-render) without attempting to reimplement React's actual multi-component, multi-hook-slot fiber architecture.

## Requirements

- `useState(initialValue)` returns `[value, setValue]`, matching the real hook's shape.
- State must persist across re-renders of the same component — i.e., calling the component function again must NOT reset the value back to `initialValue`.
- Calling the setter must trigger the app to re-render (call the component function again and re-apply its output) using the *new* value.
- This is explicitly scoped to **one** always-mounted component with a **single** `useState` call — not a general hook system supporting multiple components, multiple hooks per component, or conditional hook calls. That generalization (an array/list of hook slots per component instance, indexed by call order) is what real React does internally, and is out of scope here.

## Approach

Because there's only one component and one hook call, a single module-level variable can hold the current state, and a single module-level render function can be called again after a state update. The setter closes over both that variable and the "re-render" function: it updates the variable, then invokes a full re-render so the component function runs again and produces new output. This makes the mechanism itself unmistakable, even though it's a huge simplification of what React actually does (which needs to track state per component *instance*, per hook call *position*, across a whole tree).

## Solution

```jsx
// --- the mini useState "runtime" ---
let _state;          // holds the current state value (module-level, single slot)
let _hasRendered = false; // tracks whether initialValue has already been applied
let _rerender = null; // set by mountApp(); calling it re-runs the component

function useState(initialValue) {
  if (!_hasRendered) {
    _state = initialValue; // initialValue only used on the very first "render"
    _hasRendered = true;
  }

  function setState(next) {
    // Support both direct values and the functional updater form,
    // matching real useState's dual API.
    _state = typeof next === 'function' ? next(_state) : next;
    _rerender(); // re-run the component function with the new state
  }

  return [_state, setState];
}

// --- wiring it up to a single always-mounted component ---
function mountApp(Component, container) {
  _rerender = () => {
    const output = Component(); // re-invoke the component; useState() returns the LATEST _state
    container.textContent = output; // stand-in for "commit to the DOM"
  };
  _rerender(); // initial mount/render
}

// --- usage: a counter component ---
function Counter() {
  const [count, setCount] = useState(0);
  // (in a real component this would return JSX with an onClick; here we
  // simulate the click externally via `simulateClick` for verification)
  Counter._increment = () => setCount(prev => prev + 1);
  return `Count: ${count}`;
}

// --- verification ---
const fakeContainer = { textContent: '' };
mountApp(Counter, fakeContainer);
console.log(fakeContainer.textContent); // "Count: 0"

Counter._increment(); // simulates a click firing setCount
console.log(fakeContainer.textContent); // "Count: 1" — state persisted and incremented

Counter._increment();
Counter._increment();
console.log(fakeContainer.textContent); // "Count: 3"
```

**Why this works:** `_hasRendered` reproduces the real `useState` behavior where `initialValue` is only honored on the very first call — every subsequent invocation of `useState(0)` inside `Counter` ignores the `0` argument and returns whatever `_state` currently holds, exactly like React ignoring the initializer argument after mount (see `../theory/01-usestate-mechanics.md`). The setter closing over `_rerender` mirrors how a real `setState` call schedules a re-render rather than mutating a local variable in place — calling `Counter()` again is the (extremely simplified) stand-in for React re-rendering a function component.

**Known limitations (why this is not "React from scratch"):** this only supports exactly one `useState` call in exactly one always-mounted component. Real React supports many components and many hook calls per component by keeping an ordered array of "hook slots" per component *instance*, advancing an index into that array on every hook call during a render, and resetting the index at the start of each render — which is also exactly why hooks must be called in the same order every render (see `../theory/01-usestate-mechanics.md`'s note on unconditional hook calls: this simplified version has no such array/index at all, so it can't even represent the bug that rule prevents).

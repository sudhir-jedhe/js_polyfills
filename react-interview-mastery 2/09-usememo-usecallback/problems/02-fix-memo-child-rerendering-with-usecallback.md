# Problem 2: Fix a `React.memo`'d Child Re-Rendering Because of a New Inline Function Every Render

## The problem

`ExpensiveChild` is wrapped in `React.memo` and does deliberately expensive work on render (simulated here with a busy loop, standing in for something like a heavy SVG or canvas draw). The parent, `Toolbar`, has its own unrelated `count` state. Every time `count` changes, `Toolbar` re-renders and passes a brand-new inline arrow function as `onSave` — which defeats `React.memo` and forces `ExpensiveChild` to redo its expensive work for no reason.

## Before: inline function defeats memo

```jsx
import { useState } from 'react';

function expensiveRender(label) {
  // Simulate real render cost
  let x = 0;
  for (let i = 0; i < 5_000_000; i++) x += i;
  return `${label} (computed ${x})`;
}

const ExpensiveChild = React.memo(function ExpensiveChild({ onSave }) {
  console.log('ExpensiveChild render');
  const label = expensiveRender('ExpensiveChild');
  return (
    <div>
      <p>{label}</p>
      <button onClick={onSave}>Save</button>
    </div>
  );
});

function ToolbarBefore() {
  const [count, setCount] = useState(0);

  // New function identity on every ToolbarBefore render — defeats
  // ExpensiveChild's React.memo every single time.
  const handleSave = () => console.log('saved');

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Unrelated count: {count}</button>
      <ExpensiveChild onSave={handleSave} />
    </div>
  );
}
```

Clicking "Unrelated count" logs `"ExpensiveChild render"` every single time, and re-runs the expensive busy loop each click — `React.memo` never gets a chance to skip anything, because `onSave` is a "different" function reference every render even though its behavior never changes.

## After: `useCallback` stabilizes the reference

```jsx
import { useState, useCallback } from 'react';

function ToolbarAfter() {
  const [count, setCount] = useState(0);

  // Same function reference across renders — React.memo can now
  // actually see that ExpensiveChild's props haven't changed.
  const handleSave = useCallback(() => console.log('saved'), []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Unrelated count: {count}</button>
      <ExpensiveChild onSave={handleSave} />
    </div>
  );
}
```

Now clicking "Unrelated count" only re-renders `ToolbarAfter` itself. `handleSave`'s reference is unchanged across renders (empty dependency array — it doesn't close over anything that changes), so `React.memo`'s shallow comparison sees identical props for `ExpensiveChild` and skips re-rendering it entirely — `"ExpensiveChild render"` no longer logs on click, and the busy loop never reruns.

## Key point

`useCallback` alone does nothing by itself — it only matters because `ExpensiveChild` is wrapped in `React.memo`. Stabilizing a prop reference with no memoized consumer downstream has no effect on whether that consumer re-renders.

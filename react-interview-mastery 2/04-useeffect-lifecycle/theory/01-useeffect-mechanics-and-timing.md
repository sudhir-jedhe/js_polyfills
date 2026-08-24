# `useEffect` Mechanics and Timing

`useEffect(fn, deps)` schedules `fn` to run *after* React commits the render's output to the DOM — not during render. This matters: effects can safely read the actual DOM, and they never block the browser from painting (unlike `useLayoutEffect`, covered in `06-uselayouteffect-and-effects-as-synchronization.md`).

```jsx
function Example() {
  console.log('1: render');
  React.useEffect(() => {
    console.log('3: effect, after paint');
  });
  console.log('2: still rendering');
  return <div>hi</div>;
}
// Order: "1: render", "2: still rendering", (React commits to DOM), "3: effect"
```

The component function body (render phase) runs completely and synchronously first, producing the JSX. React commits the resulting DOM changes, and only after paint does it run the effect callback. Effects never run interleaved with the render function's own synchronous code — this is the timing every other concept in this topic (cleanup, stale closures, dependency arrays) builds on.

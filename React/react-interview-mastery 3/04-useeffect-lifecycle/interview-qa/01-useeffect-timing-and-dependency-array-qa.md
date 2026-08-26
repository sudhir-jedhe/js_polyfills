*** copy 01-useeffect-timing-and-dependency-array-qa.md ***

# Interview Q&A — `useEffect` Timing and Dependency Array

**Q: When does `useEffect`'s callback actually run relative to rendering?**
It runs after React commits the render's output to the DOM and the browser has had a chance to paint — never during the render/function-body execution itself. This means effects can safely read the real DOM (e.g., measure an element) and never block the initial paint of a frame, unlike `useLayoutEffect`.

**Q: What's the difference between omitting the dependency array, passing `[]`, and passing `[a, b]`?**
No array means the effect runs after every single render, unconditionally. An empty array means it runs exactly once, right after the initial mount, and never again. An array with values means it runs after mount and then again any time one of those listed values differs (by `Object.is`) from its value in the previous render.

**Q: Is it accurate to think of `useEffect(fn, [])` as equivalent to `componentDidMount`?**
Only loosely, and this framing causes bugs. The more accurate mental model is that an effect synchronizes the component with something external based on the reactive values it reads, and the dependency array declares what those values are — not "when in the lifecycle should this run." Thinking in lifecycle terms tempts people to under-specify the dependency array to control timing, which produces stale closures; thinking in synchronization terms leads to correctly exhaustive dependency arrays.

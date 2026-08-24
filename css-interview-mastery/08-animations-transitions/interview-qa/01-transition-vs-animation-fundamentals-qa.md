# Interview Q&A — `transition` vs. `animation` Fundamentals

**Q: What's the core difference between `transition` and `animation`?**
`transition` implicitly animates a property change between two states (start and end), and requires something external to trigger the change (a `:hover`, a class toggle, a state update). `animation` (with `@keyframes`) is fully self-contained and explicit — it can define any number of intermediate steps, starts playing on its own once the CSS rule applies (no external trigger needed), and can loop.

**Q: Can a `transition` loop or repeat automatically the way `animation` can with `iteration-count: infinite`?**
No — a transition has no native looping mechanism; it only ever animates once, from whatever the previous value was to the new value, per actual value change. To make something repeat, you'd need `animation` instead, or JS logic that repeatedly toggles the triggering state.

**Q: What does `animation-fill-mode: forwards` do, and why is it commonly needed?**
It makes the element retain the styles from the animation's final keyframe after the animation completes, instead of reverting to its normal (non-animation) CSS values. It's commonly needed for "enter and stay" animations (like a fade-in that should remain fully visible) — without `forwards`, the element would snap back to its un-animated state the instant the animation technically finishes.

**Q: What's the difference between `animation-direction: reverse` and `animation-direction: alternate`?**
`reverse` plays every iteration backward, from the last keyframe to the first, every single time. `alternate` only reverses direction on every other (even-numbered) iteration — odd iterations play forward as normal, even iterations play backward — producing a back-and-forth, ping-ponging effect across multiple loops.

**Q: Why might a `transition` not visibly play at all on an element's first render, even though the CSS looks correct?**
Because a transition only animates a change between two states the browser has actually rendered/committed as separate frames — if the starting and ending styles are both applied within the same initial render pass (e.g. an element mounted with both its base styles and its "triggering" class simultaneously), there's no committed "before" frame to transition away from, so the browser just paints the final state directly with no visible animation.

**Q: What's `steps()`, and when would you use it instead of a smooth easing curve like `ease` or `cubic-bezier()`?**
`steps(n)` divides the animation duration into `n` discrete segments and jumps directly between them, with no smooth interpolation in between. It's used for sprite-sheet frame animations (cycling through a fixed number of distinct images) or deliberately mechanical/typewriter-style effects, where continuous blending between states would look wrong or simply isn't applicable (e.g. there's no meaningful "in-between" frame of a sprite sheet).

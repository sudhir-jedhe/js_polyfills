# `animation-direction: alternate` — What's the State at a Given Moment?

```css
@keyframes sway {
  from { transform: translateX(-20px); }
  to   { transform: translateX(20px); }
}

.leaf {
  animation: sway 2s linear infinite alternate;
}
```

**Question:** At `t = 5s` after the animation started, what is `.leaf`'s `transform`? (Assume the animation started at `t = 0s` with no delay.)

**Answer:** `transform: translateX(0px)` — the leaf is exactly at its horizontal midpoint, and moving in the *leftward* direction at that instant (mid-way through an even-numbered, reversed iteration).

**Why:** Each full iteration takes `2s`. At `t = 5s`, `5 / 2 = 2.5`, meaning the animation is currently `0.5` of the way through its **3rd** iteration (iterations are 1-indexed here for clarity: iteration 1 spans `0s–2s`, iteration 2 spans `2s–4s`, iteration 3 spans `4s–6s`; at `t=5s` we're `1s` into iteration 3, i.e. halfway through it). `animation-direction: alternate` reverses direction on every *even-numbered* iteration (2nd, 4th, 6th...) while odd-numbered iterations (1st, 3rd, 5th...) play in their normal, forward direction as defined by the keyframes. Iteration 3 is odd, so it plays forward: `from` (`translateX(-20px)`) → `to` (`translateX(20px)`), linearly over its `2s` span. Halfway through (`1s` into iteration 3), `translateX` is linearly interpolated exactly halfway between `-20px` and `20px`, which is `0px`. If instead the question asked about `t = 3s` (halfway through iteration 2, the first *reversed* iteration), the interpolation would run backward — from `20px` back down toward `-20px` — and halfway through would still numerically be `0px` (the midpoint is the same regardless of direction), but the leaf would be moving rightward-to-leftward at that instant rather than leftward-to-rightward, which is the detail `alternate` actually changes: not necessarily the position at any given "halfway" moment (which is symmetric here), but the direction of travel and which end of the range each iteration starts/ends at.

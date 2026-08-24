# How Many Times Does This Animation Play?

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.badge-a {
  animation: blink 1s ease-in-out 3;
}

.badge-b {
  animation-name: blink;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.badge-c {
  animation: blink 1s ease-in-out 2.5;
}
```

**Question:** How many full (or partial) cycles does each badge's blink animation run before stopping (if it stops at all), and for `.badge-c` specifically, does it stop mid-blink or complete the cycle it's on?

**Answer:** `.badge-a` runs exactly 3 complete cycles, then stops. `.badge-b` runs forever (never stops on its own). `.badge-c` runs 2 full cycles, then continues into a third cycle but stops exactly halfway through it (at the point corresponding to the `50%` keyframe of that third cycle) — it does not complete the third cycle, and it does not round up or down to a whole number.

**Why:** `animation-iteration-count` accepts either `infinite` or any non-negative number, including a fractional/decimal value — a fractional count is entirely valid and means the animation runs that exact fraction of a final cycle before stopping, ending at whatever intermediate keyframe-interpolated state corresponds to that fraction, rather than snapping to the nearest whole iteration. For `.badge-c` with `2.5` iterations, it plays 2 full cycles (0% → 50% → 100%, twice), then starts a third cycle and stops exactly at the `50%` mark of that cycle (`opacity: 0.3`, mid-blink) — the fractional part of the count directly corresponds to how far into the final iteration the animation gets before halting. `.badge-b` uses `infinite`, which is the one special, non-numeric keyword value `animation-iteration-count` accepts, meaning the animation has no defined stopping point and continues looping until something external removes it (a class change, `animation-play-state: paused` freezing it in place, or the element being removed from the DOM).

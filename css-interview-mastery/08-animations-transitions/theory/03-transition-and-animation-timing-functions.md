# Timing Functions: `ease`, `linear`, `cubic-bezier()`, `steps()`

A timing function controls the *rate of change* over an animation/transition's duration — not just "how long" it takes, but the pacing/acceleration curve within that duration.

## The keyword shortcuts (all really just named `cubic-bezier()` curves)

```css
.a { transition: transform 0.3s ease; }        /* default-ish — slow start, fast middle, slow end; slightly front-loaded */
.b { transition: transform 0.3s linear; }       /* constant speed throughout, no acceleration at all */
.c { transition: transform 0.3s ease-in; }      /* starts slow, accelerates through to the end — no easing out */
.d { transition: transform 0.3s ease-out; }     /* starts fast, decelerates into the end — no easing in */
.e { transition: transform 0.3s ease-in-out; }  /* slow start AND slow end, faster in the middle — symmetric */
```

- `linear` reads as mechanical/robotic — constant velocity rarely looks natural for UI motion, but it's exactly right for continuous, uniform effects like a spinner rotation or a progress bar fill that should track 1:1 with real elapsed time.
- `ease-out` is generally the most natural-feeling default for UI elements entering/appearing (fast start feels responsive, deceleration into the resting position feels like it's settling naturally) — a very common choice for modals, tooltips, dropdowns appearing.
- `ease-in` suits elements leaving/exiting (slow start as if gathering momentum, then accelerating away) — common for dismiss/close animations.
- `ease-in-out` suits animations that both start and end "at rest" — a toggle switch, an accordion expand/collapse.

## Custom curves with `cubic-bezier(x1, y1, x2, y2)`

```css
.el {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* a "back-out" overshoot curve */
}
```

All the keyword timing functions above are themselves just specific `cubic-bezier()` values under the hood (e.g. `ease` = `cubic-bezier(0.25, 0.1, 0.25, 1)`). A cubic bezier defines two control points (the curve always starts at `(0,0)` and ends at `(1,1)`) that shape the velocity curve — values for `y1`/`y2` outside the `0–1` range produce an "overshoot" effect, where the animated value briefly exceeds its target before settling (useful for a springy, bouncy feel, like a button that pops slightly past its final size before settling).

## `steps(n, jump-term)` — discrete, stepped motion instead of continuous interpolation

```css
.sprite-animation {
  animation: run 0.8s steps(8, jump-start) infinite; /* 8 discrete frames per cycle, no in-between blending */
}
```

Instead of smoothly interpolating, `steps(n)` divides the duration into `n` equal segments and jumps directly between them, with no motion blur/interpolation in between — the classic use case is sprite-sheet frame animation (cycling through a fixed number of discrete images), or deliberately mechanical/typewriter-style effects (e.g. a text "typing" reveal effect using `steps()` on a `width` or `clip-path` transition, one character-width per step). `jump-start`/`jump-end`/`jump-both`/`jump-none` control whether the first/last step's change happens at the very start or end of that step's time slice — this fine detail mostly matters for exact frame-timing precision in sprite animations, less so for general UI use.

## Comparison table

| Function | Feel | Typical use |
|---|---|---|
| `linear` | Constant, mechanical | Spinners, progress bars, continuous rotation |
| `ease-out` | Fast start, gentle settle | Elements entering/appearing |
| `ease-in` | Gentle start, fast exit | Elements leaving/dismissing |
| `ease-in-out` | Symmetric, settles at both ends | Toggles, accordions, anything starting and ending at rest |
| `cubic-bezier(custom)` | Fully custom, can overshoot | Springy/bouncy branded motion |
| `steps(n)` | Discrete, no blending | Sprite sheets, typewriter effects, mechanical ticks |

# `transition` vs. `animation`: When to Use Which

Both let a CSS property's value change smoothly over time instead of jumping instantly, but they differ in triggering model, complexity, and control — and picking the wrong one for a given use case is a common source of unnecessarily complicated code.

## `transition`: implicit, two-state, externally triggered

```css
.button {
  background: #3b82f6;
  transition: background 0.2s ease;
}
.button:hover {
  background: #1d4ed8; /* transition animates FROM the current value TO this one */
}
```

A transition only defines *how* a property should animate when its value changes — it never defines *when* that change happens or *what* the end value is. Something else (a `:hover`/`:focus` state, a class toggle via JS, a media query flipping) has to actually change the property's value; the transition just makes that change gradual instead of instant. Transitions are inherently two-state: a start value (whatever it currently is) and an end value (whatever it's being changed to) — there's no way to define arbitrary intermediate keyframes with a transition alone.

## `animation` + `@keyframes`: explicit, multi-state, self-triggering

```css
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.notification-dot {
  animation: pulse 1.5s ease-in-out infinite;
}
```

An animation is fully self-contained — it starts running as soon as the element matches the CSS rule (no external trigger needed), can define any number of intermediate steps via `@keyframes` percentages, can loop (`infinite` or a specific count), can play in reverse or alternate direction, and can be paused/resumed via `animation-play-state`. This is the right tool whenever you need more than a simple two-point A→B transition — looping effects, multi-step sequences, or anything that should start playing on its own without waiting for a state change.

## Decision guide

| Need | Use |
|---|---|
| Animate a property change triggered by `:hover`, `:focus`, a class toggle, or any other state change | `transition` |
| Something that plays automatically on its own, without an external trigger | `animation` |
| A simple two-point (start → end) change | `transition` (simpler, less code) |
| Multiple distinct intermediate states/steps | `animation` + `@keyframes` |
| Looping/repeating effects | `animation` (has `iteration-count`) — `transition` has no native looping |
| Reversible on its own, alternating back and forth automatically | `animation` (`direction: alternate`) |
| Need to pause/resume programmatically without removing the effect | `animation` (`animation-play-state`) — pausing a `transition` mid-flight isn't directly supported the same way |

## A common overlap case: hover effects can technically use either

```css
/* Simple hover lift: transition is the natural, simpler choice */
.card {
  transform: translateY(0);
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
```

Using `@keyframes`/`animation` for a case this simple would work but adds unnecessary complexity — reach for `animation` specifically once you need something a plain two-state transition genuinely can't express (looping, multiple intermediate steps, self-triggering on mount, or fine-grained playback control).

# `@keyframes` and the `animation-*` Properties

## Defining keyframes

```css
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

`from`/`to` are shorthand for `0%`/`100%`. You can define any number of intermediate steps with explicit percentages:

```css
@keyframes bounce {
  0%   { transform: translateY(0); }
  30%  { transform: translateY(-20px); }
  50%  { transform: translateY(0); }
  70%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
```

Multiple selectors can share one keyframe block: `0%, 100% { ... }` applies the same declarations at both points.

## The `animation-*` longhand properties (and the shorthand)

```css
.el {
  animation-name: slide-in;
  animation-duration: 0.4s;
  animation-timing-function: ease-out;
  animation-delay: 0.1s;
  animation-iteration-count: 1;       /* or a number, or `infinite` */
  animation-direction: normal;        /* normal | reverse | alternate | alternate-reverse */
  animation-fill-mode: both;          /* none | forwards | backwards | both */
  animation-play-state: running;      /* running | paused */
}

/* Shorthand, same effect, in this specific order:
   name duration timing-function delay iteration-count direction fill-mode play-state */
.el {
  animation: slide-in 0.4s ease-out 0.1s 1 normal both running;
}
```

## `animation-fill-mode` — what happens *outside* the active animation duration

This one is genuinely easy to get wrong, and worth memorizing precisely:

- `none` (default): the element uses its normal, un-animated CSS values both before the animation starts (during any `animation-delay`) and after it finishes — the keyframes' `from`/`to` styles have no effect outside the active running window.
- `forwards`: after the animation finishes, the element **retains the styles from the final keyframe** (`100%`/`to`), rather than reverting to its normal CSS. This is the one to reach for whenever an animation is meant to leave the element in its "ended" visual state (e.g. a fade-in that should stay fully visible once done, rather than snapping back to invisible when the animation technically completes).
- `backwards`: **before** the animation starts (during `animation-delay`), the element takes on the styles from the *first* keyframe (`0%`/`from`) immediately, rather than showing its normal un-animated styles during the delay window.
- `both`: combines `forwards` and `backwards` — first-keyframe styles apply during the delay, last-keyframe styles persist after completion.

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.el {
  animation: fade-in 0.3s ease forwards; /* stays visible (opacity: 1) after finishing */
}
```

Without `forwards` here, the element would snap back to its un-animated `opacity` (whatever the base CSS rule specifies, likely `1` by default anyway for most elements — but if the base rule explicitly sets `opacity: 0` for some other reason, or if the animation is meant to be the *only* thing establishing full visibility, omitting `forwards` causes a visible flash back to the pre-animation state the instant the animation ends).

## `animation-iteration-count` and `animation-direction`

```css
.el {
  animation: bounce 1s ease-in-out 3;              /* plays exactly 3 times, then stops */
  animation: pulse 1s ease-in-out infinite;         /* loops forever */
  animation: bounce 1s ease-in-out infinite alternate; /* forward, then backward, then forward... */
}
```

`alternate` reverses direction on every other iteration (odd iterations play forward, even iterations play in reverse), which is different from `reverse` (every iteration plays backward from the start) — a common point of confusion.

## Multiple simultaneous animations

```css
.el {
  animation: fade-in 0.3s ease forwards, slide-in 0.3s ease forwards;
}
```

Comma-separated, exactly like multiple `transition` properties — each can reference a different `@keyframes` block and have its own independent duration/timing/delay.

# What's the Element's Visual State After the Animation Finishes?

```css
@keyframes slide-up {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

.card-a {
  animation: slide-up 0.5s ease-out; /* no fill-mode specified — default: none */
}

.card-b {
  animation: slide-up 0.5s ease-out forwards;
}
```

Both `.card-a` and `.card-b` have no other CSS rules setting `transform`/`opacity` outside the animation.

**Question:** One second after each animation has finished, what are `.card-a` and `.card-b`'s computed `transform` and `opacity`?

**Answer:** `.card-a`: `transform: none` (i.e. the element's normal, un-animated initial value, since no other rule sets a `transform`), `opacity: 1` (the initial/default value for `opacity`, since nothing else sets it either). `.card-b`: `transform: translateY(0)`, `opacity: 1` — matching the animation's final (`to`) keyframe exactly, held indefinitely.

**Why:** `animation-fill-mode` defaults to `none`, which means the keyframe styles have **no effect at all outside the animation's active running window** — once the animation finishes, the element reverts entirely to whatever its normal (non-animation) computed styles would otherwise be. Since neither `.card-a` nor any other rule sets `transform`/`opacity` outside the `@keyframes` block, it reverts to each property's ordinary initial value (`transform: none`, `opacity: 1`) — which, in this specific case, happens to visually coincide with the animation's own `to` state (both end at `translateY(0)`-equivalent and `opacity: 1`), making `.card-a`'s reversion invisible/undetectable by eye. This is a subtle trap: `.card-a` LOOKS correct purely by coincidence, not because `fill-mode: none` is actually preserving the end state — if the base (non-animation) styles for `.card-a` had instead been, say, `opacity: 0.5` for some unrelated reason, `.card-a` would visibly snap from fully opaque back down to `0.5` opacity the instant the animation ended, exposing the missing `forwards`. `.card-b`, with `forwards` explicit, retains the final keyframe's styles by design, regardless of what the element's own non-animation base styles happen to be — a robust, intentional behavior rather than a lucky coincidence.

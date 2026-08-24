# `will-change`: Usage and Misuse

## What `will-change` actually does

`will-change` is a hint to the browser: "I'm about to change this property on this element, so it's worth doing some setup work ahead of time." Concretely, the most impactful thing it typically does is promote the element to its own **compositor layer** *before* the animation starts, rather than the browser discovering mid-animation that a layer needs to be created (which can cause a visible hitch on the very first frame of an otherwise-smooth `transform`/`opacity` animation — that "layer promotion cost" has to happen at some point, and `will-change` lets you pay it proactively, ahead of time, rather than during the animation itself).

```css
.card {
  will-change: transform;
}
.card:hover {
  transform: translateY(-8px);
}
```

## The correct usage pattern: apply it shortly before, remove it shortly after

```css
/* Applied via JS just before a known, upcoming animation, and removed just after */
.about-to-animate {
  will-change: transform, opacity;
}
```

```js
el.classList.add('about-to-animate');
requestAnimationFrame(() => {
  el.classList.add('is-animating'); // triggers the actual transition/animation
});
el.addEventListener('transitionend', () => {
  el.classList.remove('about-to-animate'); // remove the hint once done
});
```

The intent is genuinely temporary: `will-change` is meant to be applied briefly, only around the actual window of time an animation is expected, then removed.

## The common misuse: applying `will-change` broadly and permanently "just in case"

```css
/* Anti-pattern */
* {
  will-change: transform;
}
```

```css
/* Also an anti-pattern, even if scoped */
.card {
  will-change: transform; /* left on permanently, whether or not the card is ever actually animating */
}
```

Every element with an active `will-change` hint gets promoted to its own compositor layer and typically **kept there indefinitely** (or for a heuristically-determined "while it seems likely to still be relevant" period, which is not something you can rely on precisely) — and compositor layers are not free. Each one consumes GPU memory, and having a large number of unnecessary layers can actually *hurt* performance overall: more layers means more compositing work per frame, more memory pressure (which is especially costly on memory-constrained mobile devices), and in extreme cases can even cause the browser to hit internal layer-count limits and start behaving unpredictably. A blanket `will-change: transform` on every card in a long list, left on permanently regardless of whether any of them are actually animating at a given moment, is a textbook example of "optimizing" in a way that actually degrades performance.

## Rules of thumb

1. **Don't apply `will-change` to elements that aren't about to animate soon.** It's a hint for near-term upcoming work, not a general "make this fast forever" switch.
2. **Remove it once the animation is done**, rather than leaving it applied permanently.
3. **Don't apply it to a large number of elements simultaneously** — if an entire list is animating at once, consider whether they can share fewer layers, or whether the animation approach itself needs rethinking, rather than promoting dozens/hundreds of elements to individual layers.
4. **Prefer discovering you need `will-change` through actual profiling** (a visible first-frame hitch in DevTools' Performance panel) rather than adding it preemptively everywhere an animation exists "just to be safe" — most `transform`/`opacity` animations perform fine without it; it's a targeted fix for a specific, observed problem, not a default best practice to sprinkle everywhere.
5. **Don't use `will-change` as a substitute for actually animating cheap properties.** It doesn't make an expensive, layout-triggering animation (e.g. animating `width`) cheap — it only helps with the layer-promotion cost for properties that were already compositor-eligible in the first place.

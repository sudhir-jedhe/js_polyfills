# `prefers-reduced-motion`

Some users experience genuine physical discomfort (dizziness, nausea, migraines — vestibular disorders being a common underlying cause) from large-scale motion, parallax, or flashing effects on screen. Operating systems expose a system-level setting for this (macOS: Reduce Motion; Windows: Show animations in Windows; iOS/Android: equivalent accessibility settings), and CSS can detect and respond to it via the `prefers-reduced-motion` media feature.

## Basic usage

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

This blanket "kill switch" approach (near-instant durations, forcing single iteration, disabling smooth scroll) is a common, pragmatic baseline — it doesn't literally delete every animation's *effect* (an opacity fade still technically happens, just over 0.001ms, which reads as instant to the eye), while requiring minimal per-component effort. Using an extremely small duration rather than `0s`/`none` outright is a deliberate technique in some implementations, since forcibly setting `animation: none` can sometimes suppress `animationend`/`transitionend` events that other JS logic depends on firing — an interview-relevant subtlety, though many teams do simply disable outright and adjust dependent JS instead, which is also a valid approach.

## The more precise, per-component approach

```css
.hero-parallax {
  transform: translateY(calc(var(--scroll) * 0.5px));
}

@media (prefers-reduced-motion: reduce) {
  .hero-parallax {
    transform: none; /* disable the large-scale parallax motion specifically */
  }
}

.button {
  transition: transform 0.15s ease; /* small, subtle hover feedback */
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none; /* or leave a much-shortened, near-instant transition */
  }
}
```

The more precise approach distinguishes between motion that's genuinely problematic for vestibular-sensitive users (large-scale parallax, spinning/zooming effects, auto-playing carousels, anything that fills a large portion of the screen with motion) and small, subtle micro-interactions (a button's slight hover lift, a focus ring fade) that are generally not the kind of motion the setting is meant to address, and which some accessibility guidance suggests can reasonably be left mostly intact — this requires more deliberate, per-component judgment than the blanket kill-switch approach, but produces a more nuanced result.

## `no-preference` and the default assumption

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-parallax {
    transform: translateY(calc(var(--scroll) * 0.5px));
  }
}
```

`prefers-reduced-motion` has two values: `reduce` and `no-preference`. Since most users haven't explicitly set a reduced-motion preference, `no-preference` matches by far the most common case (not because most users have positively opted into wanting motion, but because it's simply the default absence of an explicit request to reduce it) — a common, reasonably safe pattern is to write animations normally as the base/default behavior, then specifically override/disable them inside `@media (prefers-reduced-motion: reduce)`, rather than gating all motion behind an explicit `no-preference` check (which would also work, but inverts which case is the "default" code path, and is more code to maintain for the same result in most codebases).

## Common interview framing

"How would you implement an animated page transition, or an auto-playing background video/carousel, in a way that's accessible?" is a standard prompt where the expected answer explicitly mentions checking `prefers-reduced-motion` and either substantially shortening/disabling large-scale motion, or providing a static, non-animated equivalent for users with the preference set — treating accessibility for motion sensitivity as a first-class part of implementing the feature, not an unrelated afterthought bolted on separately.

# Scenario: A User Reports Feeling Sick from the Site's Animations

**Scenario:** A support ticket comes in from a user who reports feeling dizzy and nauseated when browsing a marketing site that uses a large parallax scrolling effect in the hero section, an auto-rotating background carousel, and a "zoom in" animation on every section as it scrolls into view. The user mentions they have a vestibular disorder and have their OS's "Reduce Motion" accessibility setting enabled, but the site doesn't seem to respect it. How do you address this properly, not just as a one-off fix for this user's complaint?

**Diagnosis:**

The site never checks `prefers-reduced-motion` at all, so every user gets the full motion experience regardless of their OS-level accessibility preference — this is exactly the kind of gap `prefers-reduced-motion` exists to close, and the fact that the user has already correctly enabled the OS setting (expecting sites to honor it) but experienced no difference in behavior confirms the CSS simply isn't checking for it anywhere.

**Fix — apply reduced-motion handling at two levels: a broad safety net, plus targeted fixes for the worst offenders specifically named in the report:**

```css
/* Broad safety net: catches anything not individually audited */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

```css
/* Targeted fix: the parallax effect specifically, which is exactly the kind of
   large-scale, continuous motion most likely to trigger vestibular symptoms */
.hero-parallax {
  transform: translateY(calc(var(--scroll-offset) * 0.5px));
}
@media (prefers-reduced-motion: reduce) {
  .hero-parallax {
    transform: none; /* static hero image instead, no scroll-linked motion at all */
  }
}
```

```js
// The auto-rotating carousel needs a JS-level check too, since "auto-advancing
// every N seconds" isn't something CSS alone controls
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  startCarouselAutoRotate();
} else {
  // Show the carousel in a static, user-controlled (manual next/prev only) state instead
}
```

**Why both a blanket rule AND targeted fixes, rather than just one:** the blanket `!important` rule is a fast, low-effort baseline that ensures no animation anywhere on the site is left completely unaddressed, but it doesn't distinguish between large-scale motion (parallax, carousels, zoom effects — the kind explicitly implicated in this report and the primary category of concern for vestibular disorders) and small, subtle micro-interactions (a button's slight hover lift) that some accessibility guidance treats as lower-priority to fully eliminate. The targeted fixes specifically address the exact effects the user named — genuinely removing the parallax's scroll-linked transform, and stopping the carousel's automatic timer-driven advancement (which the blanket CSS rule alone can't do, since it's JS-driven behavior, not a CSS transition/animation duration).

**Not just a one-off fix:** since this is a systemic gap (no `prefers-reduced-motion` handling anywhere), the right response is auditing every animation/auto-playing effect on the site against this checklist, not just patching the three effects this particular user happened to report — the same underlying accessibility gap will affect every user with the same OS setting enabled, most of whom won't file a support ticket about it.

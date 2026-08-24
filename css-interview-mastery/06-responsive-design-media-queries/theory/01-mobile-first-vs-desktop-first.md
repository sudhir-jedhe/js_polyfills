# Mobile-First vs. Desktop-First

These are two opposite strategies for writing responsive CSS, distinguished by which viewport size your *unqualified* (no media query) styles target, and which direction your `@media` breakpoints then adjust things.

## Mobile-first: base styles target small screens, `min-width` queries add complexity as the screen grows

```css
/* Base styles: apply to ALL screens, written for the smallest/simplest layout */
.nav {
  display: block; /* stacked links, mobile default */
}

/* Progressively enhance as viewport grows */
@media (min-width: 768px) {
  .nav {
    display: flex; /* horizontal nav once there's room */
  }
}

@media (min-width: 1200px) {
  .nav {
    gap: 32px; /* extra breathing room on large screens */
  }
}
```

Unqualified styles are the mobile layout; each `min-width` query only ever *adds* rules for larger viewports. This is the industry-standard default approach today, for a few concrete reasons:

- **Performance-aligned**: mobile devices (often on slower connections/weaker hardware) get the simplest CSS with the least overriding to compute; you're not shipping desktop-oriented styles that then get undone.
- **Matches actual traffic patterns**: mobile traffic dominates for most consumer-facing sites, so designing/writing the common case first tends to produce a better base experience.
- **Naturally encourages progressive enhancement**: you start from a working, simple baseline and add complexity, rather than starting from a complex layout and trying to subtractively simplify it for small screens (which is harder and more error-prone — desktop layouts often rely on space that just isn't there to remove cleanly).

## Desktop-first: base styles target large screens, `max-width` queries strip complexity down as the screen shrinks

```css
/* Base styles: apply to ALL screens, written for the full desktop layout */
.nav {
  display: flex;
  gap: 32px;
}

/* Override/simplify as viewport shrinks */
@media (max-width: 767px) {
  .nav {
    display: block; /* fall back to stacked links on small screens */
    gap: 0;
  }
}
```

This was the historical default (CSS predates mobile-first thinking), and it's still seen in older codebases or in some internal/admin tools where desktop usage genuinely dominates and mobile support is a lower-priority afterthought. Every media query here is *subtracting or overriding* complexity that was already set as the default, which tends to produce more overridden/undone CSS overall as the number of breakpoints grows.

## Comparison table

| | Mobile-first | Desktop-first |
|---|---|---|
| Base (unqualified) styles target | Smallest screen | Largest screen |
| Media query direction | `min-width` (add complexity going up) | `max-width` (remove complexity going down) |
| Typical modern usage | Default choice for new projects, consumer-facing sites | Legacy codebases, desktop-dominant internal tools |
| CSS specificity/override pattern | Additive — later queries add more rules | Subtractive — later queries override/undo earlier rules |

## The one thing that trips people up: mixing the two strategies in one codebase

Combining `min-width` breakpoints in some places and `max-width` breakpoints in others within the same project is a common source of confusing, hard-to-reason-about override chains — a `min-width: 768px` rule and a `max-width: 900px` rule can both apply simultaneously in the 768–900px range, and which one "wins" then depends purely on source order/specificity rather than a clean mental model of "smaller vs. larger." Picking one strategy consistently for a whole project (mobile-first, by default, today) avoids this entirely.

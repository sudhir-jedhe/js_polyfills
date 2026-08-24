# `@media` Query Syntax and Features

A media query is made of an optional **media type**, and one or more **media features** wrapped in parentheses, joined with logical keywords.

## Media types

```css
@media screen { /* ... */ }   /* screens (default/implicit if omitted) */
@media print { /* ... */ }    /* print preview / actual printing */
@media all { /* ... */ }      /* explicitly matches everything (same as omitting a type) */
```

In modern practice, `screen` and `print` are essentially the only two media types worth knowing — most other legacy types (`tty`, `speech` as a type, `projection`, etc.) are deprecated/unsupported. If no media type is given, it defaults to `all`.

## Media features (the actual conditions)

The most commonly used features:

```css
@media (min-width: 768px) { /* viewport is at least 768px wide */ }
@media (max-width: 767px) { /* viewport is at most 767px wide */ }
@media (orientation: landscape) { /* width > height */ }
@media (prefers-color-scheme: dark) { /* user's OS/browser is set to dark mode */ }
@media (prefers-reduced-motion: reduce) { /* user has requested less motion */ }
@media (hover: hover) { /* primary input can hover (e.g. mouse, not touch) */ }
@media (pointer: fine) { /* primary input is precise (mouse/stylus, not a finger) */ }
@media (resolution: 2dppx) { /* device pixel ratio, e.g. Retina displays */ }
```

## Logical operators

```css
/* AND — both conditions must be true */
@media (min-width: 768px) and (max-width: 1023px) { /* tablet band only */ }

/* OR — comma-separated queries are combined with OR */
@media (max-width: 600px), (orientation: portrait) { /* either condition */ }

/* NOT — negates the entire query it's applied to (rarely needed) */
@media not all and (monochrome) { /* anything that ISN'T a monochrome device */ }
```

## The modern range syntax (Media Queries Level 4)

Widely supported in current browsers, this reads much closer to normal math notation and is now generally preferred over the old `min-`/`max-` prefixed features for new code:

```css
/* old syntax */
@media (min-width: 768px) and (max-width: 1199px) { /* ... */ }

/* new range syntax — equivalent, more readable */
@media (768px <= width <= 1199px) { /* ... */ }

/* also valid: single-sided range comparisons */
@media (width >= 768px) { /* same as min-width: 768px */ }
@media (width < 768px) { /* same as max-width: 767.98px, without the off-by-one rounding hack */ }
```

The range syntax also elegantly fixes an old, subtle rounding problem: with `max-width: 767px`, on a device with fractional/sub-pixel viewport widths (common with certain zoom levels or device pixel ratios), a viewport of `767.5px` could fall into *neither* a `min-width: 768px` query nor a `max-width: 767px` query, leaving a "dead zone." Developers historically worked around this with awkward values like `767.98px`. `(width < 768px)` in the range syntax handles this correctly and exactly, with no rounding hack needed.

## Feature queries inside media queries vs. `@supports`

It's worth explicitly distinguishing: `@media` conditions are about the **environment** (viewport size, color scheme, input type, print vs. screen). `@supports` is a completely separate at-rule that tests **CSS feature support** (e.g. `@supports (display: grid) { ... }`) — the two are often confused by name but test entirely different things and are not interchangeable.

## Combining features across breakpoints, the common real-world pattern

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (width >= 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (width >= 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
}
```

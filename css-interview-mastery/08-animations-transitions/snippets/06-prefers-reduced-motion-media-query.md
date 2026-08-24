# Snippet: Respecting `prefers-reduced-motion`

```css
.hero-banner {
  animation: parallax-drift 8s ease-in-out infinite alternate;
}

@keyframes parallax-drift {
  from { transform: translateY(0); }
  to   { transform: translateY(-40px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-banner {
    animation: none; /* large-scale continuous motion disabled entirely for users who requested it */
  }
}
```

```css
/* A more global, blanket safety net, layered on top of per-component overrides */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

The `.hero-banner`-specific override disables the large parallax drift entirely and explicitly (the kind of motion most likely to trigger discomfort), while the global fallback rule ensures any other animation/transition on the page that wasn't individually audited still gets reduced to a near-instant duration rather than left running at full, unreduced motion.

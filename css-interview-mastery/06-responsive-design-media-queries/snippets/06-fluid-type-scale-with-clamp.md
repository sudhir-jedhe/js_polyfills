# Snippet: A Fluid Type Scale with `clamp()`

```css
:root {
  --step-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem);
  --step-base: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --step-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --step-xl: clamp(1.75rem, 1.4rem + 1.75vw, 2.5rem);
  --step-2xl: clamp(2.25rem, 1.6rem + 3vw, 3.5rem);
}

small { font-size: var(--step-sm); }
body { font-size: var(--step-base); }
h3 { font-size: var(--step-lg); }
h2 { font-size: var(--step-xl); }
h1 { font-size: var(--step-2xl); }
```

Every step scales continuously as the viewport resizes, with the browser resolving each `clamp()` to a single computed pixel value at any given width, always staying inside its own floor/ceiling — no `@media` breakpoints, and no abrupt jump anywhere across the full range of viewport widths.

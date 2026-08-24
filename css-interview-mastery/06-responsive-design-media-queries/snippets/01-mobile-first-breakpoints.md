# Snippet: Mobile-First Breakpoint Ladder

```css
/* Base styles = mobile default, no media query needed */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

/* Tablet and up */
@media (width >= 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Small desktop and up */
@media (width >= 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 24px;
  }
}

/* Large desktop and up */
@media (width >= 1440px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

Each breakpoint only adds or overrides rules for viewports at least that wide — nothing needs to be "undone" going from mobile to desktop, since the base case already is mobile.

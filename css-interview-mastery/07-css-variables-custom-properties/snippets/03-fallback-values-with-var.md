# Snippet: `var()` Fallback Values

```css
/* A reusable component that works even if the consumer never sets --card-radius */
.card {
  border-radius: var(--card-radius, 8px); /* 8px used if --card-radius is undefined anywhere in the cascade */
  box-shadow: var(--card-shadow, 0 1px 3px rgb(0 0 0 / 0.1));
  font-family: var(--card-font, 'Inter', system-ui, sans-serif); /* fallback itself is a comma-separated list */
}
```

```css
/* Chained fallback: prefer a user override, then a theme default, then a hardcoded value */
.button {
  background: var(--user-accent, var(--theme-accent, #3b82f6));
}
```

```html
<!-- No --card-radius set anywhere: falls back to 8px -->
<div class="card">Default radius</div>

<!-- Explicit override: fallback is never used -->
<div class="card" style="--card-radius: 20px;">Custom radius</div>
```

Fallbacks let a shared/reusable component (like a design-system `.card`) ship sensible defaults while still remaining fully overridable by whichever consumer sets the corresponding custom property — without needing a separate CSS class or prop-driven variant for every possible customization.

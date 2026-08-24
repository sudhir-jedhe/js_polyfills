# Snippet: `color-mix()` for Derived Colors

```css
:root {
  --brand: #2563eb;
}

.btn {
  background: var(--brand);
}
.btn:hover {
  background: color-mix(in srgb, var(--brand) 85%, black);
}
.btn:active {
  background: color-mix(in srgb, var(--brand) 70%, black);
}
.btn:disabled {
  background: color-mix(in srgb, var(--brand) 40%, white);
  color: color-mix(in srgb, black 40%, white);
}

/* A tinted background derived from the same brand variable, without a second hardcoded color */
.alert-info {
  background: color-mix(in srgb, var(--brand) 12%, white);
  border: 1px solid color-mix(in srgb, var(--brand) 40%, white);
}
```

Every derived shade traces back to the single `--brand` custom property — changing the brand color in one place automatically updates every hover/active/disabled/tint variant, since they're all computed relative to it rather than hardcoded as separate hex values.

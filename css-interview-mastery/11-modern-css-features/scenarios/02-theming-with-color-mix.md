# Scenario: A Theming System Built on `color-mix()`

**Situation:** A design system needs to support light/dark themes and multiple accent colors (blue, green, purple) selectable per-tenant in a multi-tenant SaaS product, without hand-authoring a full hover/active/disabled/tint palette for every accent color combination.

**Approach:** Define a single `--accent` custom property per tenant, and derive every other shade from it with `color-mix()` instead of hardcoding a full palette per accent.

```css
:root {
  --accent: #2563eb; /* the ONLY hardcoded color per tenant/theme */
  --surface: white;
  --text: #111827;
}

[data-theme="dark"] {
  --surface: #111827;
  --text: #f9fafb;
}

.btn-accent {
  background: var(--accent);
  color: white;
}
.btn-accent:hover {
  background: color-mix(in oklch, var(--accent) 85%, black);
}
.btn-accent:disabled {
  background: color-mix(in oklch, var(--accent) 35%, var(--surface));
  color: color-mix(in oklch, var(--text) 40%, var(--surface));
}

.accent-tint-bg {
  /* a soft tinted background, derived from --accent but readable against --surface in either theme */
  background: color-mix(in oklch, var(--accent) 12%, var(--surface));
}
```

```html
<!-- switching tenants only requires changing ONE variable -->
<html data-theme="dark" style="--accent: #16a34a">
```

**Why this works:** every derived color (hover, disabled, tint) is computed relative to `--accent` and `--surface`, both of which change per tenant/theme — so a single custom-property change instantly recolors the entire derived palette correctly, without maintaining a separate hardcoded shade for every accent × theme combination (which would otherwise be `accents × themes × states` distinct hardcoded values to keep in sync). Mixing `in oklch` rather than `in srgb` keeps the derived shades visually consistent in perceived lightness/contrast across very different accent hues (blue vs green vs purple), since oklch interpolation doesn't suffer from sRGB's tendency to produce muddy or unevenly-lightened midpoints.

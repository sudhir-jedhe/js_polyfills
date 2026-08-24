# Problem: Build a Runtime Theme Switcher Using `color-mix()`

## Problem Statement

Build a light/dark theme switcher where a user can also pick a custom accent color, and every derived UI color (button hover, disabled states, tinted backgrounds, borders) updates correctly for both themes and any chosen accent — without hardcoding a palette per accent color.

## Requirements

- A single `--accent` custom property drives every accent-derived color.
- Light and dark themes are toggled via a `data-theme` attribute on `<html>`.
- Hover/disabled states are computed via `color-mix()`, not separate hardcoded colors.
- Switching either the theme or the accent color must not require touching component CSS.

## Solution

```css
:root {
  --accent: #2563eb;
  --surface: #ffffff;
  --surface-2: #f3f4f6;
  --text: #111827;
}

[data-theme="dark"] {
  --surface: #111827;
  --surface-2: #1f2937;
  --text: #f9fafb;
}

body {
  background: var(--surface);
  color: var(--text);
}

.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.6em 1.4em;
  border-radius: 8px;
}
.btn-primary:hover {
  background: color-mix(in oklch, var(--accent) 85%, black);
}
.btn-primary:disabled {
  background: color-mix(in oklch, var(--accent) 35%, var(--surface-2));
  color: color-mix(in oklch, var(--text) 40%, var(--surface-2));
}

.card {
  background: var(--surface-2);
  border: 1px solid color-mix(in oklch, var(--accent) 25%, var(--surface-2));
}

.badge-accent {
  background: color-mix(in oklch, var(--accent) 15%, var(--surface));
  color: color-mix(in oklch, var(--accent) 70%, var(--text));
}
```

```html
<html data-theme="dark" style="--accent: #16a34a">
  <button class="btn-primary">Confirm</button>
  <div class="card">...</div>
  <span class="badge-accent">New</span>
</html>
```

**Why this satisfies the requirements:** every color that isn't `--accent`, `--surface`, `--surface-2`, or `--text` is *derived* via `color-mix()` from those four variables — there is no second hardcoded palette anywhere. Changing `data-theme` swaps `--surface`/`--surface-2`/`--text`, and every derived tint/border/disabled-state recomputes correctly because they reference those variables rather than fixed values. Changing `--accent` (e.g. per-user preference or per-tenant branding) similarly recolors every accent-derived UI element instantly, with zero additional CSS authored per possible accent color.

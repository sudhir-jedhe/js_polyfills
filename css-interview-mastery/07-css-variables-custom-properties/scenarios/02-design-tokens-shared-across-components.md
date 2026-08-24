# Scenario: Design Tokens Shared Consistently Across Many Independently-Built Components

**Scenario:** A design system has dozens of components (buttons, cards, inputs, modals), each originally built by different engineers over time with their own hardcoded spacing, color, and radius values. Design wants to standardize on a consistent token scale (a handful of spacing values, a handful of colors, a couple of border-radius sizes) across every component, and wants future design tweaks (e.g. "make the whole product's corners slightly rounder") to require changing a value in exactly one place, not hunting through every component's stylesheet. How do you structure this with custom properties?

**Approach:**

Define a single, centralized token layer of custom properties, then have every component consume tokens via `var()` instead of hardcoded values — with component-specific custom properties as an optional second layer for anything that needs component-level (not global) overriding.

```css
/* tokens.css — the single source of truth, loaded once, globally */
:root {
  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;

  /* Color tokens */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-surface: #ffffff;
  --color-border: #e5e5e5;

  /* Radius scale */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

```css
/* button.css — consumes global tokens directly */
.button {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-primary);
}

/* card.css — consumes global tokens, but exposes its OWN component-level
   custom property (defaulting to a token) for a specific, intentional override point */
.card {
  --card-radius: var(--radius-lg); /* component-level override point, defaults to the lg token */
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--card-radius);
}
```

```css
/* A consumer that needs ONE specific card to have a different radius,
   without touching the shared .card class at all */
.card.card--compact {
  --card-radius: var(--radius-sm);
}
```

**Why this two-layer structure (global tokens + optional component-level custom properties) works well:** every component pulls its default values from the single global token layer, so a design-wide change (e.g. bumping `--radius-md` from `8px` to `12px`) automatically ripples through every component that references it, with zero per-component edits. Components that need a deliberate, documented override point (like `.card`'s `--card-radius`) expose their *own* custom property defaulting to a token, which keeps the override surface explicit and scoped to that component, rather than every component needing bespoke prop/class-based variant systems — a consumer can override `--card-radius` inline, via a modifier class, or via a wrapping context, and it composes with the rest of the cascade for free.

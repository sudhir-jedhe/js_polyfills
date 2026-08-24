# Scenario: Structuring a New Design System's CSS with ITCSS

**Situation:** You're setting up the foundational CSS architecture for a company-wide design system that will be consumed by multiple product teams. It needs to support base resets, design tokens, a set of core components (buttons, cards, form fields), and a small set of escape-hatch utility classes for one-off adjustments — all while guaranteeing that a consuming team's own app-level CSS can still override design-system defaults without a specificity fight.

**Approach:** Structure the design system's own source using ITCSS layering, and expose it via `@layer` so consumers get a hard priority guarantee, not just a convention.

```css
/* design-system.css — the package's single entry point */
@layer ds-settings, ds-generic, ds-elements, ds-components, ds-utilities;

@layer ds-settings {
  :root {
    --ds-color-primary: #2563eb;
    --ds-space-2: 0.5rem;
    --ds-space-4: 1rem;
  }
}

@layer ds-generic {
  *, *::before, *::after { box-sizing: border-box; }
}

@layer ds-components {
  .ds-card { border-radius: 10px; padding: var(--ds-space-4); }
  .ds-button { background: var(--ds-color-primary); color: white; padding: var(--ds-space-2) var(--ds-space-4); }
}

@layer ds-utilities {
  .ds-u-flex { display: flex; }
}
```

```css
/* consumer-app.css — NOT wrapped in any @layer, so it's unlayered */
.ds-button { background: #16a34a; } /* consumer's override */
```

**Why this works:** because the entire design system's CSS lives inside named layers, and the consuming app's own CSS is left unlayered (its normal, default state), the unlayered consumer CSS automatically outranks every layer in the design system — including `ds-utilities`, the design system's own highest-priority internal layer — without the consumer needing to know or match the design system's specificity, use `!important`, or add extra classes. This solves a problem ITCSS alone (as a pure naming/ordering convention) can't guarantee for a *distributed* package: a convention only works if every consumer follows it too, whereas `@layer`'s "unlayered always wins" rule is enforced by the browser regardless of what the consumer does.

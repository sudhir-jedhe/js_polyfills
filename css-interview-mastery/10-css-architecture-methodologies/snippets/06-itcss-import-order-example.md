# Snippet: An ITCSS-Style Import Order

```css
/* main.css — the only place import order is decided */
@import "settings/tokens.css";     /* :root custom properties, no visible output */
@import "generic/reset.css";       /* * { box-sizing: border-box } etc. */
@import "elements/headings.css";   /* bare h1, h2, a defaults — no classes */
@import "objects/container.css";   /* .o-container, .o-grid — structural, undecorated */
@import "components/card.css";     /* .c-card, .c-card__title — most of the app's CSS */
@import "components/button.css";
@import "utilities/spacing.css";   /* .u-mt-4, .u-text-center — imported LAST on purpose */
```

```css
/* utilities/spacing.css */
.u-mt-4 { margin-top: 1rem !important; }
.u-text-center { text-align: center !important; }
```

Because `utilities/spacing.css` is imported last, `.u-mt-4` reliably overrides any component's own margin rules at the same or even lower specificity, purely due to source order — the `!important` here is a deliberate ITCSS convention (utilities are meant to always win) rather than a sign something's broken. Compare this to the native `@layer` snippet: `@layer` achieves the same "utilities always win" guarantee without needing `!important` at all, since layer order itself enforces precedence.

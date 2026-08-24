# ITCSS: Inverted Triangle CSS

ITCSS (Harry Roberts) is a way of *ordering* your stylesheets (as files, imported in a specific sequence) so that specificity and explicitness increase monotonically as you move through the source — meaning later rules are both more specific in reach (fewer elements) and safely allowed to win over earlier, more generic ones, without any specificity fights.

## The layers, generic → explicit

```
Settings   →  variables, tokens (no CSS output — e.g. custom property definitions)
Tools      →  mixins/functions (no CSS output — Sass tooling, largely N/A with plain CSS)
Generic    →  resets, box-sizing, normalize — zero classes, broad element selectors
Elements   →  bare HTML element defaults — h1, a, ul (still no classes)
Objects    →  OOCSS-style structural patterns, class-based but undecorated — .o-container, .o-media
Components →  actual UI components — .c-button, .c-card, .c-nav (most of a typical app's CSS lives here)
Utilities  →  single-purpose overrides — .u-hidden, .u-text-center (highest specificity/priority on purpose)
```

The "inverted triangle" shape refers to two properties that both narrow as you go down the list: the **number of selectors** shrinks (few broad element-level rules at the top, many narrowly-targeted component rules in the middle, a handful of utilities at the bottom), while the **specificity/explicitness** grows (generic element selectors at the top, single highly-specific utility classes with intentional override power at the bottom).

## Why import order matters here

```css
/* 1. generic.css — broad, low specificity */
* { box-sizing: border-box; }

/* 2. elements.css — still low specificity */
a { color: inherit; text-decoration: none; }

/* 3. components.css — class-based, moderate specificity */
.c-nav__link { color: #2563eb; text-decoration: underline; }

/* 4. utilities.css — imported LAST, so it wins ties by source order even at equal specificity */
.u-text-muted { color: #6b7280 !important; }
```

Because CSS resolves ties (equal specificity) by **source order** — whichever rule appears later in the cascade wins — ITCSS's ordering means you rarely need to manually escalate specificity to win a conflict; being later in the defined layer sequence is enough. Utilities are deliberately last (and sometimes `!important`) because their entire purpose is "always override whatever component styling is present."

## ITCSS vs BEM vs SMACSS

These aren't competitors — ITCSS answers "what file, and in what order," SMACSS answers a similar but coarser-grained categorization question, and BEM answers "what do I name this specific class." A common real stack: ITCSS-ordered folders/imports, BEM naming within the Components layer, utilities as single-property override classes at the bottom.

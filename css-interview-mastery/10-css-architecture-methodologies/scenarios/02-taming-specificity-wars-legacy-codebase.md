# Scenario: Taming a Specificity War in a Legacy Codebase

**Situation:** A five-year-old app has accumulated selectors like `#main-content .widget-container .card.featured.highlighted { ... }` and roughly 40 uses of `!important` scattered across the stylesheet, each added to win some earlier specificity fight. New CSS changes routinely require guessing-and-checking specificity to have any visible effect at all.

**Approach:** Rather than trying to "win" further specificity fights, freeze the legacy CSS's priority using `@layer` and build new/refactored CSS in a lower-declared layer that's guaranteed to lose to nothing you don't want it to — or, once confident, invert it so new CSS structurally outranks the legacy mess.

```css
/* Wrap ALL existing legacy CSS, unmodified, into one layer */
@layer legacy, new-components;

@layer legacy {
  /* paste the entire existing stylesheet here, verbatim, no rewriting required */
  #main-content .widget-container .card.featured.highlighted { padding: 2rem !important; }
}

@layer new-components {
  /* new BEM-style CSS, written cleanly, wins over ANY legacy rule
     regardless of the legacy selector's specificity or !important use,
     simply because "new-components" is declared after "legacy" */
  .card { padding: 1.5rem; }
}
```

**Why this works:** normally, beating `!important` plus high specificity would require even higher specificity plus your own `!important` — a losing arms race. `@layer` sidesteps the arms race entirely: layer order is checked *before* specificity or `!important` weight (within a layer, `!important` still matters and even reverses layer-priority order for `!important` declarations specifically — important rules in an *earlier* layer actually beat important rules in a later layer, which is the one exception to "later layer always wins" worth knowing). Once the legacy CSS is quarantined in its own layer, new work can be built cleanly in a modern methodology (BEM + a `new-components` layer) with a hard guarantee it won't be silently defeated by decade-old specificity debt, and the legacy layer can be shrunk file-by-file over time as components are migrated out of it.

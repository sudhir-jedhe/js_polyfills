# Scenario: Introducing `@layer` to a Legacy App Without Breaking Anything

**Situation:** A production app has years of unlayered CSS with unpredictable specificity. The team wants to start using cascade layers for new work, but is worried that introducing `@layer` will silently change how existing styles resolve.

**Approach:** Rely on the rule that unlayered CSS always forms an implicit final layer that outranks every named layer — this makes adoption safe by default.

```css
/* New CSS, added incrementally — wrapped in named layers */
@layer new-reset, new-components;

@layer new-reset {
  .btn { box-sizing: border-box; }
}

@layer new-components {
  .btn-primary { background: #2563eb; color: white; padding: 0.6em 1.2em; }
}

/* ALL existing legacy CSS stays completely untouched, outside any @layer block */
.btn-primary { background: red; } /* legacy rule, unlayered */
```

**Result:** the legacy `.btn-primary { background: red; }` rule — despite being defined *earlier* in the file and having identical specificity to the new one — still wins, because unlayered CSS is always treated as coming after all named layers in priority. The new layered CSS is inert against existing pages until the team deliberately removes or migrates the conflicting legacy rule.

**Why this matters:** this means `@layer` can be introduced incrementally with zero regression risk on day one — teams can start writing all *new* components inside layers immediately, verify layer behavior on isolated new features, and only later begin the (separate, deliberate) process of migrating old CSS into layers, at which point they gain control over its priority too. The rollout order that actually causes the fewest surprises is: (1) adopt `@layer` syntax for new code only, confirm legacy still wins as expected, (2) once comfortable, begin wrapping legacy CSS in a `legacy` layer declared *before* the new layers, which is the point at which new component styles actually start overriding old ones.

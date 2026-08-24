# Scenario: Refactoring Nested, Fragile CSS to BEM

**Situation:** You've inherited a stylesheet full of deeply nested, markup-dependent selectors like this:

```css
.profile .header .title { font-size: 1.2rem; }
.profile .header .title.big { font-size: 1.6rem; }
.profile .content ul li a { color: #2563eb; }
```

Every time someone reorders the markup slightly (e.g. wraps `.title` in an extra `<div>`), styles silently break because the selectors depend on exact DOM structure, not on stable class contracts.

**Approach:** Convert to BEM incrementally, component by component, rather than as one big rewrite.

```css
/* Before */
.profile .header .title { font-size: 1.2rem; }
.profile .header .title.big { font-size: 1.6rem; }

/* After */
.profile__title { font-size: 1.2rem; }
.profile__title--large { font-size: 1.6rem; }
```

```html
<!-- Before: relies on .title being inside .header being inside .profile -->
<div class="profile">
  <div class="header"><div class="title big">Name</div></div>
</div>

<!-- After: markup can be restructured freely, styling still resolves correctly -->
<div class="profile">
  <div class="profile__header"><h2 class="profile__title profile__title--large">Name</h2></div>
</div>
```

**Why this works, and how to roll it out safely:**
1. Pick one component at a time (start with the most frequently-touched/most-bug-prone one), not the whole codebase at once.
2. Add the new BEM classes alongside the old ones temporarily if needed, migrate markup usages, then delete the old nested selector once nothing depends on it.
3. Verify with a specificity audit — every migrated rule should now be a single class selector (0,1,0), which is trivially greppable/lintable (stylelint's `selector-max-specificity` or `selector-max-compound-selectors` rules catch regressions).
4. The payoff: after migration, moving `.profile__title` into a completely different wrapper element no longer breaks its styling, because the rule no longer encodes "must be inside `.header` inside `.profile`" — it just says "this element has this class."

# Scenario: Migrating a Nested-Selector Codebase to BEM

**Scenario:** A Sass codebase heavily uses nesting for convenience: `.sidebar { .widget { .title { font-size: 1.2rem; &.is-active { color: blue; } } } }`. This compiles to deeply specific selectors like `.sidebar .widget .title.is-active` (specificity (0,3,0) plus a class combo), and moving a `.widget` component into a different part of the page (say, the footer) breaks its styling because the new parent context doesn't match the nested selector chain anymore. Leadership wants components to be portable and predictable. How do you migrate this to BEM without a stop-the-world rewrite?

**Approach:**

1. **Identify component boundaries first, not selectors.** Before touching CSS, decide what's a "block" — `.widget` is a block, `.title` is one of its elements, `.is-active` is a state that should become a modifier (`.widget__title--active`) or stay a state class combined with the BEM element class (`.widget__title.is-active` — both are legitimate BEM-adjacent conventions; the important part is that the *component* class itself no longer depends on ancestor context).

2. **Rewrite nesting as flat BEM classes, one component at a time:**
   ```scss
   // before — specificity grows with nesting depth, breaks if moved
   .sidebar {
     .widget {
       .title {
         font-size: 1.2rem;
         &.is-active { color: blue; }
       }
     }
   }

   // after — flat, portable, specificity constant regardless of nesting depth
   .widget__title {
     font-size: 1.2rem;
   }
   .widget__title--active {
     color: blue;
   }
   ```
   Note Sass `&` nesting is fine to *keep using as an authoring convenience* for BEM modifiers (`&--active`) — the point isn't "never nest in the .scss source," it's that the *compiled selector* shouldn't depend on DOM ancestry.

3. **Migrate incrementally, component by component, behind visual regression tests.** Pick low-risk, self-contained components first (a badge, a button) to validate the process, then move to widely-reused ones (`.widget`) last, since those touch the most pages.

4. **Use `@layer components` for the new BEM CSS during the transition**, declared after the legacy nested CSS's layer. This guarantees the new flat-specificity rules win over any not-yet-migrated legacy nested rule, even though the legacy selectors are technically more specific — so partial migration doesn't require perfectly matching or exceeding old specificity by hand while the codebase is in a mixed state.

5. **Verify portability as the actual acceptance criterion**, not just "does it look the same" — literally move a migrated component (e.g. `.widget`) into a different DOM ancestor (footer instead of sidebar) in a test page and confirm it renders identically, since that was the original bug this migration is meant to fix.

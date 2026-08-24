# Scenario: An `!important`-Riddled Legacy Stylesheet

**Scenario:** You've inherited a 4,000-line `legacy.css` where roughly 30% of declarations end in `!important`, seemingly added over years by different developers each trying to "just make it work." A new feature needs a button to be gray in one specific context, but every override you try gets beaten by an existing `!important` rule elsewhere. How do you approach untangling this without a risky big-bang rewrite?

**Approach:**

1. **Find what's actually winning.** Use DevTools' computed styles panel — it shows every matching rule for the element, struck through if overridden, with the winning one highlighted and its source file/line. This tells you exactly which `!important` rule (and where) is blocking you, instead of guessing.

2. **Match or exceed, as a documented stopgap — never remove the old rule blind.** If `.btn { background: blue !important; }` is blocking you, and you can't safely delete it (unknown blast radius across the app), add a more specific `!important` scoped narrowly to your context:
   ```css
   .checkout-page .btn.btn--secondary { background: gray !important; } /* scoped narrowly on purpose */
   ```
   This is still "using `!important` to fix `!important`," but it's a *contained*, targeted stopgap rather than a blind global change — and it doesn't make the underlying mess worse (it doesn't touch existing behavior anywhere else).

3. **Don't try to remove all 30% at once.** Big-bang `!important` removal on a stylesheet nobody fully understands is how you cause a regression sweep across the whole app. Instead, triage: outright *delete* `!important` on declarations where DevTools shows no other rule ever competed for that property (i.e. the `!important` was never load-bearing, just copy-pasted defensively) — that's a zero-risk cleanup pass you can do incrementally, file by file, verified with visual regression screenshots.

4. **Stop the bleeding going forward.** Introduce a lint rule (`stylelint`'s `declaration-no-important`) that fails CI on *new* `!important` usage outside an explicit `// eslint-disable`-style allowlist comment, so the debt stops growing while you pay down the existing balance.

5. **Longer term, migrate load-bearing `!important` rules into a `@layer` declared last** (e.g. `@layer critical-overrides`), so the *layer* — not the keyword — carries the "this must win" intent, and it becomes possible to eventually strip the `!important` keywords entirely once layer order alone guarantees the priority.

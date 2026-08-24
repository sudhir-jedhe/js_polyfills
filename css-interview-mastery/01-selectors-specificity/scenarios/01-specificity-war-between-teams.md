# Scenario: Specificity War Between Two Teams' Stylesheets

**Scenario:** Team A owns a shared component library (`components.css`) and Team B owns a product's page-level CSS (`page.css`), loaded after it. Every time Team B needs to tweak a component's look for their page, their selector doesn't win, so they've started adding IDs and `!important` to force it through. Team A then does the same in the next component release to defend their defaults. Six months in, the codebase has selectors like `#page-root .content #widget-list .item.item.item` and multiple `!important` chains. How do you fix this?

**Diagnosis:** This is the classic specificity arms race: neither side has a *system*, so each override is a local, escalating patch. The root cause isn't that anyone wrote "bad" CSS in isolation — it's that there's no agreed priority mechanism, so specificity became the only lever, and specificity is a blunt, monotonically-increasing lever (you can't ever selectively lower it later without touching every prior rule).

**Fix — introduce cascade layers to make priority explicit and reset the specificity race:**

```css
@layer reset, components, page-overrides;

@layer components {
  /* Team A's component CSS, verbatim, specificity untouched */
  .item { padding: 8px; border-bottom: 1px solid #eee; }
}

@layer page-overrides {
  /* Team B's tweaks — LOW specificity is fine now, because the LAYER guarantees priority */
  .item { padding: 12px; }
}
```

Because `page-overrides` is declared after `components`, every rule inside it beats the matching component rule regardless of specificity — Team B no longer needs to escalate selectors or add `!important` to win. This also means Team A can freely refactor their internal selectors (nesting, nested nesting, whatever) without ever breaking Team B's overrides, since layer order — not specificity — is the actual contract between the two teams.

**Migration plan for the existing mess:**
1. Wrap the existing component CSS in `@layer components` and page CSS in `@layer page-overrides`, unchanged, to establish the two teams' relative priority without touching a single selector yet (this alone typically lets 80%+ of the `!important`/ID hacks be removed immediately, since the layer now guarantees the win).
2. Gradually flatten Team B's inflated selectors (`#page-root .content #widget-list .item.item.item` → `.item`) now that they no longer need artificial weight to win.
3. Agree that new "must always win" utility classes go in a `utilities` layer declared last, so there's one sanctioned final-say mechanism instead of an ad hoc one.

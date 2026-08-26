*** copy 03-redundant-role-on-semantic-element.md ***

# Output: Redundant ARIA Role on an Already-Semantic Element

```html
<button role="button" aria-label="Save">Save</button>
<nav role="navigation" aria-label="Primary">...</nav>
```

**Question:** Do these `role` attributes change anything about how the elements are announced? Is there a real cost to including them?

**Answer:** Functionally, nothing changes — `<button>` already has an implicit role of `button`, and `<nav>` already has an implicit role of `navigation`; explicitly restating the same role is redundant, not harmful in terms of the resulting accessible name/role output. However, it's not entirely costless: it's dead weight in the markup that can mislead future developers into thinking the role is somehow necessary or was added deliberately for a reason that no longer applies, and some linters (`eslint-plugin-jsx-a11y`'s `no-redundant-roles` rule, for example) flag it specifically to keep markup lean and signal-carrying — every ARIA attribute present should mean something; redundant ones dilute that signal.

**Why:** Every native HTML element that has an ARIA equivalent already carries an **implicit ARIA role** as part of the HTML-AAM (Accessibility API Mappings) spec — this is exactly the mechanism that lets a `<nav>` show up as a "navigation" landmark without any ARIA at all. Explicitly setting `role="navigation"` on a `<nav>` is not wrong, but it is unnecessary; it's really only useful/needed on elements that *don't* have the desired implicit role (e.g. `<div role="navigation">` when, for some structural reason, `<nav>` truly can't be used).

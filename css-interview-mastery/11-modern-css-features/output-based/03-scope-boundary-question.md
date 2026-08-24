# Does This `@scope` Rule Apply Here?

```html
<div class="widget">
  <p>Outer widget text.</p>
  <div class="widget__nested-widget">
    <p>Inner nested widget text.</p>
  </div>
</div>
```

```css
@scope (.widget) to (.widget__nested-widget) {
  p {
    color: crimson;
  }
}
```

**Question:** Which `<p>` elements turn crimson?

**Answer:** Only "Outer widget text." turns crimson. "Inner nested widget text." is unaffected.

**Why:** `@scope (.widget) to (.widget__nested-widget)` establishes a scope that starts at `.widget` and explicitly stops at the boundary of any `.widget__nested-widget` found inside it — this is the "donut scope" pattern. The outer `<p>` is a descendant of `.widget` but not inside any `.widget__nested-widget`, so it's within the active scope and gets styled. The inner `<p>` is inside `.widget__nested-widget`, which is the declared lower boundary — the scope explicitly excludes everything from that boundary downward, so the inner paragraph is untouched by this rule, even though it's technically still a descendant of `.widget` in the DOM tree.

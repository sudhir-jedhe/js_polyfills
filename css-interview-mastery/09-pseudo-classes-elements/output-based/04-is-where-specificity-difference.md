# `:is()` vs `:where()`: Which Color Wins?

```html
<div id="sidebar">
  <a href="#">Link</a>
</div>
```

```css
:is(#sidebar) a { color: blue; }
.simple-link { color: green; }
```

```html
<!-- second scenario, same HTML but with :where() instead -->
:where(#sidebar) a { color: blue; }
.simple-link { color: green; }
```

Assume `<a href="#" class="simple-link">Link</a>` in both scenarios.

**Answer:** In the first scenario (using `:is()`), the link is **blue**. In the second scenario (using `:where()`), the link is **green**.

**Why:** `:is(#sidebar)` takes on the specificity of its argument — an ID selector, specificity (1,0,0) — so `:is(#sidebar) a` has specificity (1,0,1), which beats `.simple-link`'s (0,1,0). `:where(#sidebar)` matches the exact same elements but always contributes zero specificity, so `:where(#sidebar) a` has specificity (0,0,1) — weaker than `.simple-link`'s (0,1,0), so the class wins. Same matching logic, opposite specificity outcome — this is precisely why `:where()` exists, for writing overridable default styles.

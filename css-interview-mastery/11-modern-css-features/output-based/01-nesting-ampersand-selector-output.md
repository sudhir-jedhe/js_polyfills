# What Selectors Does This Nested CSS Compile To?

```css
.menu {
  display: flex;

  li {
    list-style: none;

    &.active {
      font-weight: 700;
    }

    a {
      color: inherit;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

**Question:** Write out the equivalent flat (non-nested) selectors this produces.

**Answer:**
```css
.menu { display: flex; }
.menu li { list-style: none; }
.menu li.active { font-weight: 700; }
.menu li a { color: inherit; }
.menu li a:hover { text-decoration: underline; }
```

**Why:** A bare simple selector nested inside a rule (like `li` inside `.menu`, or `a` inside `li`) is implicitly joined to its parent with a descendant combinator (a space) — so `li { }` inside `.menu { }` becomes `.menu li { }`. `&` explicitly attaches to the parent selector with **no** combinator — `&.active` inside `.menu li { }` becomes `.menu li.active` (compound, no space), not `.menu li .active` (descendant, which would be wrong — it would require a *separate* element with class `.active` nested inside the `<li>`, not the `<li>` itself having that class). The `&:hover` case works the same way: it attaches `:hover` directly to `a`, producing `.menu li a:hover`.

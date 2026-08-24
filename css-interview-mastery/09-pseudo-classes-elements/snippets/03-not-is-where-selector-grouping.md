# Snippet: Grouping Selectors with `:not()`, `:is()`, `:where()`

```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a class="active" href="/pricing">Pricing</a>
</nav>
```

```css
/* :not() — style every link except the active one */
nav a:not(.active) {
  color: #555;
}

/* :is() — apply the same hover rule across multiple contexts without repeating it */
:is(header, nav, footer) a:hover {
  text-decoration: underline;
}

/* :where() — same matching as :is(), but contributes ZERO specificity, so it's trivially
   overridden by a single class from consumer code (useful for design-system defaults) */
:where(header, nav, footer) a {
  color: #333;
}

/* A single-class override beats the :where() rule above without any specificity fight,
   because :where() adds 0 specificity — this would NOT work if :is() were used instead,
   since :is() would take the specificity of its strongest argument. */
.brand-link {
  color: goldenrod;
}
```

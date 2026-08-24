# `:has()` — Recap (Full Depth in Topic 09)

`:has()` is covered in full depth — matching semantics, specificity rules, worked output-based questions — in `09-pseudo-classes-elements/theory/04-functional-pseudo-classes-not-is-where-has.md`. This file is a short recap framed around *why* `:has()` belongs in a "modern CSS features" discussion, plus a couple of use cases that lean specifically on other modern features covered in this topic.

## The one-line summary

`:has()` matches an element if a selector relative to it (descendant, or `+`/`~` sibling) matches something inside or after it — the first native way to select based on children or later siblings, previously only possible via JavaScript.

```css
.card:has(img) { }              /* a card that contains an image */
label:has(+ input:required)::after { content: " *"; } /* a label immediately followed by a required input */
```

## Why it's grouped with "modern CSS features"

`:has()` reached broad browser support (Chrome, Safari, Firefox all shipping) only recently, alongside the other features in this topic — nesting, `@scope`, `subgrid`, `color-mix()` — as part of the same general wave of CSS gaining capabilities that used to require JavaScript or a preprocessor. It's frequently combined with the other modern features covered here:

```css
/* :has() + native nesting */
.card {
  border: 1px solid #ddd;

  &:has(img) {
    padding-top: 0; /* nested rule, no preprocessor needed */
  }
}
```

```css
/* :has() + container queries (full container-query depth is in topic 06) —
   a component can react both to its own children (:has()) and to its container's
   size (@container) at the same time */
.panel:has(.panel__chart) {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .panel__chart { height: 300px; }
}
```

See the pseudo-classes topic for the full treatment: matching semantics for descendant vs sibling forms, specificity rules (`:has()` takes its argument's specificity, same as `:is()`), and dedicated output-based practice questions.

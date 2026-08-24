# Native CSS Nesting

CSS now supports nesting rules inside other rules natively — no Sass/Less compilation step required. Browser support is broad in current versions of Chrome, Firefox, and Safari.

## Basic syntax

```css
.card {
  padding: 1rem;
  border: 1px solid #e5e7eb;

  .card__title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &:hover {
    border-color: #2563eb;
  }
}
```

Compiles conceptually to:

```css
.card { padding: 1rem; border: 1px solid #e5e7eb; }
.card .card__title { font-size: 1.1rem; font-weight: 600; }
.card:hover { border-color: #2563eb; }
```

## The `&` nesting selector

`&` explicitly refers to the parent selector at that point in the nest — required when the nested rule needs to attach directly to the parent (like a pseudo-class) rather than being read as a descendant.

```css
.btn {
  background: #2563eb;

  &:hover { background: #1d4ed8; }         /* .btn:hover — attaches directly, no space */
  &.btn--large { padding: 1em 2em; }        /* .btn.btn--large — compound, no space */
  & + & { margin-left: 0.5rem; }            /* .btn + .btn — adjacent sibling */
}
```

Without `&`, a nested simple selector is implicitly treated as a **descendant** combinator (a space) — `.card { .title { } }` means `.card .title { }`. This is a key difference from how many people initially expect nesting to work if they're used to Sass, where `&` behavior is similar but native CSS nesting has its own specific parsing rules (e.g. a nested selector starting with a type selector like `div` needs `&` or must be wrapped, because `.card div {}` alone is fine, but nesting rules require the nested block to start with `&`, a class, an ID, or certain other tokens directly — a bare type selector immediately after `{` needs `& div` in some implementations for parser disambiguation reasons).

## Nesting media/container queries too

```css
.card {
  display: block;

  @media (min-width: 768px) {
    display: flex;
  }
}
```

This nests conditional rules inside the component definition itself, keeping related responsive behavior physically next to the base rule instead of in a separate media-query block elsewhere in the file.

## Specificity implication

Nesting is purely a *syntax* convenience — the resulting specificity is identical to writing the equivalent selectors out flatly. `.card .card__title` nested or not still computes to (0,2,0). Nesting doesn't reduce or increase specificity by itself; it just changes how the source is authored. This means nesting can reintroduce the exact selector-depth/specificity creep that BEM (see the architecture topic) exists to avoid, if used carelessly to mirror deep markup structure — nesting is a tool for organizing source code, not a replacement for keeping selectors flat where that matters.

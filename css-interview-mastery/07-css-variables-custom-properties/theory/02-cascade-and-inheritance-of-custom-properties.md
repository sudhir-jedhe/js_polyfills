# Cascade and Inheritance of Custom Properties

This is the single most important — and most commonly tested — fact about custom properties:

> **Custom properties inherit by default.** This is the opposite of how most CSS properties behave. Properties like `border`, `padding`, `margin`, `background`, `width` do **not** inherit — a child element doesn't automatically pick up its parent's `border` value. But custom properties do, automatically, with no `inherit` keyword needed.

## Why this matters

```css
:root {
  --text-color: black;
}

.dark-section {
  --text-color: white; /* overrides the inherited value, for this element and its descendants */
}

p {
  color: var(--text-color); /* resolves to whatever --text-color is, at THIS element, following inheritance */
}
```

```html
<body>
  <p>Black text (inherits --text-color: black from :root)</p>
  <div class="dark-section">
    <p>White text (--text-color is re-declared to white here, and this <p> inherits THAT value)</p>
  </div>
</body>
```

Every `<p>` reads `var(--text-color)`, but resolves to a different actual value depending on where it sits in the DOM tree, because the custom property's *value itself* is inherited and can be overridden at any level — this is exactly the mechanism that makes theming with custom properties work: redefine a handful of custom properties on a wrapping element (`.dark-section`, `[data-theme="dark"]`, etc.), and every descendant that reads those properties via `var()` automatically picks up the new values, with zero changes needed to the descendants' own CSS.

## Some properties, like normal properties, follow the cascade at each level too

Inheritance and the cascade aren't mutually exclusive — a custom property re-declared directly on an element (rather than inherited) simply follows the normal cascade rules (specificity, source order, `!important`) exactly like any property, at that level; inheritance is just what happens for elements that *don't* have a competing declaration of their own.

## Custom properties are **not inherited into different "contexts"** like pseudo-elements without explicit propagation... except that they mostly are

One nuance worth being precise about: custom properties do inherit into `::before`/`::after` pseudo-elements, since pseudo-elements are conceptually children of their originating element for inheritance purposes:

```css
.badge {
  --badge-bg: crimson;
}
.badge::before {
  content: '';
  background: var(--badge-bg); /* inherited correctly — pseudo-elements inherit from their host element */
}
```

## Where inheritance does *not* reach: across Shadow DOM boundaries, unless explicitly designed to

Custom properties **do** cross into shadow DOM by default (they're one of the few things that intentionally pierce shadow boundaries, specifically to support theming web components from the outside) — but a shadow tree's *own* internal custom property declarations don't leak back out to the light DOM. This cross-boundary inheritance behavior is actually one of the main reasons custom properties are the standard mechanism for theming web components.

## Comparison: custom property vs. a normal non-inherited property

```css
.parent {
  --gap: 20px;   /* inherits to all descendants automatically */
  border: 1px solid red; /* does NOT inherit — children have no border unless they declare their own */
}
```

If you need a normal property to inherit its parent's *computed* value explicitly, CSS provides the `inherit` keyword for that purpose (`border: inherit;`) — but that's an explicit opt-in per property, whereas custom properties get this behavior automatically, with no keyword required.

# Selector Types and Combinators

CSS selectors fall into a handful of categories. Knowing all of them — not just class/ID — is table stakes, and combinators (how selectors relate to each other) come up constantly in refactoring questions.

## Simple selectors

| Selector | Example | Matches |
|---|---|---|
| Universal | `*` | every element |
| Type (element) | `p` | every `<p>` |
| Class | `.card` | every element with `class="card"` (or one of several classes) |
| ID | `#header` | the element with `id="header"` (should be unique per page) |
| Attribute | `[type="text"]`, `[href^="https"]`, `[data-active]` | elements matching the attribute presence/value |
| Pseudo-class | `:hover`, `:first-child`, `:nth-child(2n)`, `:not(.disabled)` | elements in a particular *state* or structural position |
| Pseudo-element | `::before`, `::after`, `::first-line`, `::placeholder` | a sub-part of an element, not a real DOM node |

Attribute selectors support operators: `[attr=val]` (exact), `[attr~=val]` (space-separated word match), `[attr^=val]` (starts with), `[attr$=val]` (ends with), `[attr*=val]` (contains substring), `[attr|=val]` (exact or hyphen-prefixed, used for language codes).

## Combinators

Combinators express a *relationship* between two compound selectors:

```css
div p       /* descendant combinator: any <p> anywhere inside a <div> */
div > p     /* child combinator: only <p> that are DIRECT children of <div> */
h2 + p      /* adjacent sibling: a <p> immediately following an <h2>, same parent */
h2 ~ p      /* general sibling: any <p> that comes after an <h2>, same parent */
```

The descendant combinator (a plain space) is the most commonly misused — it matches at *any* depth, so `nav a` matches an `<a>` nested five levels deep inside `<nav>`, which is often broader than intended and one reason large stylesheets accumulate unintentional overrides.

## Grouping and relational pseudo-classes

```css
h1, h2, h3 { font-weight: 600; }          /* selector list: matches any of these */
a:is(.primary, .secondary) { color: red; } /* :is() — matches if ANY argument matches */
a:not(.disabled) { cursor: pointer; }       /* :not() — matches if the argument does NOT */
section:has(> img) { padding: 0; }          /* :has() — matches if a descendant matches (the only way to select a PARENT based on its children) */
```

`:has()` is the newest of these and is the first native way to style a parent/ancestor based on what it contains — previously this required JavaScript.

## Combinators contribute zero specificity

This is the detail people forget: combinators (` `, `>`, `+`, `~`) and the universal selector `*` add **nothing** to specificity. Only the compound selectors on either side of them matter. `div > p` and `div p` have identical specificity (0,0,2) even though they behave very differently.

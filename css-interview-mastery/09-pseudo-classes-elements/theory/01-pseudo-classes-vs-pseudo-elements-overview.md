# Pseudo-Classes vs Pseudo-Elements

Both are keywords appended to a selector, but they select fundamentally different things.

- A **pseudo-class** (single colon, `:`) selects an entire real element, but only when it's in a particular *state* or *position* — `a:hover` still selects the `<a>` element, just conditionally.
- A **pseudo-element** (double colon, `::`) selects a *sub-part* of an element that has no corresponding node in the DOM — `p::first-line` doesn't exist as an element you could `querySelector` for; the browser generates it on the fly based on layout.

```css
a:hover { color: firebrick; }           /* the <a>, only while hovered */
li:first-child { font-weight: bold; }    /* the first <li>, based on position among siblings */
p::first-line { font-weight: bold; }     /* just the rendered first line of text inside <p> */
p::before { content: "→ "; }             /* a generated box before <p>'s content, not a real node */
```

## Why the colon count matters

CSS2 only had pseudo-elements like `:before` and `:after` with a single colon. CSS3 introduced the `::` syntax specifically to visually disambiguate pseudo-elements from pseudo-classes. For backwards compatibility, browsers still accept `:before`, `:after`, `:first-line`, and `:first-letter` with a single colon — but any *new* pseudo-element (`::placeholder`, `::marker`, `::selection`) only exists in double-colon form. In modern code, always use `::` for pseudo-elements to keep the distinction clear and to be forward-compatible.

## Quick comparison

| Aspect | Pseudo-class | Pseudo-element |
|---|---|---|
| Syntax | Single colon `:hover` | Double colon `::before` |
| What it selects | A real element, conditionally | A generated/virtual sub-part of an element |
| Can you have more than one per selector? | Yes, chainable (`a:hover:not(.disabled)`) | Only one per selector (can't do `p::before::after`) |
| DOM presence | None — it's the same element, just matched conditionally | None — it's not in the DOM tree, only in the render tree |
| Examples | `:hover`, `:focus`, `:nth-child()`, `:not()`, `:has()` | `::before`, `::after`, `::first-line`, `::placeholder` |

The rest of this topic splits along that line: pseudo-classes (state and structure) in most theory files, and pseudo-elements (generated content and text fragments) in the last two.

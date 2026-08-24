# `:not()`, `:is()`, `:where()`, and `:has()`

These four "functional" pseudo-classes take other selectors as arguments, letting you compose complex matching logic. They read similarly but differ sharply in **specificity**, which is a favorite interview probe.

## `:not()` — negation

Matches an element that does *not* match the selector(s) inside it.

```css
li:not(.featured) { opacity: 0.7; }        /* every li except .featured ones */
input:not([type="checkbox"]):not([type="radio"]) { width: 100%; } /* text-like inputs */
:not(.a, .b, .c) { }                        /* modern: comma list allowed inside a single :not() */
```

**Specificity of `:not()`:** it takes the specificity of its *most specific argument* — `:not(.featured)` contributes a class's worth of specificity (0,1,0), same as writing `.featured` directly, not zero.

## `:is()` — matches any selector in a list (specificity = strongest argument)

Shorthand for writing out repetitive selector groups.

```css
/* instead of: */
header a:hover, main a:hover, footer a:hover { color: blue; }
/* write: */
:is(header, main, footer) a:hover { color: blue; }
```

`:is()` takes the specificity of its **most specific** argument. `:is(#id, .class)` has the specificity of `#id` (an ID), even though `.class` is also a valid match — this can make `:is()` accidentally very powerful and hard to override.

## `:where()` — identical matching, but zero specificity

`:where()` behaves exactly like `:is()` for matching purposes, but **always contributes zero specificity**, regardless of what's inside it.

```css
:where(header, main, footer) a { color: blue; } /* specificity: 0,0,1 (just the "a") */
:is(header, main, footer) a    { color: blue; } /* specificity: 0,0,2 (as if "header a" were written) */
```

| Selector | Matching behavior | Specificity contributed |
|---|---|---|
| `:not(.x)` | Negation | Specificity of `.x` (its argument) |
| `:is(.x, #y)` | Matches if any argument matches | Specificity of the *strongest* argument (`#y`) |
| `:where(.x, #y)` | Matches if any argument matches (same as `:is()`) | Always `0,0,0` |

**Why `:where()` matters in practice:** it's the standard tool for writing reusable/library CSS that's trivially overridable by consumer code, since it never adds specificity weight that would fight with the user's own rules. Design-system base styles are a classic use case: `:where(.btn, .btn-outline) { padding: 0.5em 1em; }` lets any single-class override win without `!important` or selector escalation.

## `:has()` — the "parent selector"

`:has()` matches an element if a selector *relative to it* (typically a descendant, but also next-sibling `+` / subsequent-sibling `~`) matches something inside/after it. This is the first native way to select a parent based on its children, or a sibling based on what follows it.

```css
/* a <figure> that contains a <figcaption> */
figure:has(figcaption) { border: 1px solid #ddd; }

/* a form group whose input is invalid */
.form-group:has(input:invalid) { border-color: crimson; }

/* a heading immediately followed by a paragraph (adjusts spacing) */
h2:has(+ p) { margin-bottom: 0.5em; }
```

**Specificity of `:has()`:** like `:is()`, it takes the specificity of its most specific argument.

`:has()` is covered in full depth (browser support, `:has()` vs JS-based alternatives, real-world patterns) in the modern CSS features topic — this file focuses on how it fits alongside `:not()`/`:is()`/`:where()` as a functional selector family.

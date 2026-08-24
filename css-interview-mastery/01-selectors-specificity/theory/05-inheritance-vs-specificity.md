# Inheritance vs. Specificity

Inheritance and specificity are often confused because both affect "what value does this element end up with," but they operate at completely different stages of value resolution.

## How inheritance works

Some CSS properties (mostly text-related: `color`, `font-family`, `font-size`, `line-height`, `visibility`, `list-style`, etc.) are marked as **inherited by default** — if you don't specify a value for them on an element, the element takes its parent's *computed* value. Box-model properties (`margin`, `padding`, `border`, `width`, `display`, `position`, background/border properties, etc.) are **not** inherited by default — they reset to their initial value on every element unless a rule explicitly sets them.

```css
body { color: darkslategray; font-family: sans-serif; }
```
Every element inside `<body>` renders in `darkslategray` sans-serif text *by inheritance* — there's no selector matching `<p>` or `<span>` directly for `color`; the value simply flows down the DOM tree.

## Inheritance always loses to ANY specified value

This is the key interview point: inheritance sits at the *bottom* of value resolution. If **any** declaration — no matter how low its specificity — explicitly sets a property on an element, that declaration wins over an inherited value, full stop:

```css
body { color: blue; }
* { color: initial; } /* universal selector: specificity (0,0,0), the WEAKEST possible selector */
```
Result: every element's `color` resolves to `initial` (`canvastext`/black), **not** blue — because `* { color: initial; }` is still an explicit declaration for `color` on every element, and any explicit declaration, however weak, beats inheritance. Specificity only decides ties *between two explicit declarations that both match* — it never comes into play when the alternative is "no explicit declaration, fall back to inheritance."

## `inherit`, `initial`, `unset`, and `revert`

| Keyword | Effect |
|---|---|
| `inherit` | Forces the property to take the parent's computed value, even for properties that don't inherit by default |
| `initial` | Resets the property to its CSS-specification default value (e.g. `display: initial` → `inline`) |
| `unset` | Acts like `inherit` if the property is naturally inherited, or like `initial` if it isn't — a "do the sensible default thing" reset |
| `revert` | Resets to the value the property would have from the user-agent stylesheet (or user stylesheet), as if none of the author's CSS existed for it |

```css
.card a { color: inherit; } /* links normally get browser-default blue/purple — force them to match surrounding text color instead */
button { all: unset; }       /* wipe all browser button styling back to sensible per-property defaults, then restyle from scratch */
```

`all: unset` (or `all: revert`) is a common practical use — it's the cleanest way to strip a `<button>` or `<input>` of its heavy user-agent styling before applying custom design system styles.

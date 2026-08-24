# Specificity Calculation Rules

Specificity decides which of two *matching* rules wins, before source order is even consulted. The standard mental model is a 4-column tuple, ordered from most to least powerful:

| Column | Counts | Example contributing 1 |
|---|---|---|
| **Inline** | a `style="..."` attribute on the element | `<div style="color:red">` |
| **ID** | ID selectors | `#header` |
| **Class** | class selectors, attribute selectors, pseudo-classes | `.btn`, `[type="text"]`, `:hover` |
| **Type** | type (element) selectors, pseudo-elements | `div`, `::before` |

Each column is compared **left to right**, and a higher value in an earlier column always wins outright — columns are never "added together" numerically or averaged. 100 type selectors can never out-rank a single class selector, because you compare column-by-column, not by summing into one number.

## Worked comparisons

```css
#nav .menu-item { color: blue; }     /* (0 id:1, class:1, type:0) */
.container ul li a { color: red; }   /* (0 id:0, class:1, type:3) */
```
Compare ID column first: `1 > 0` → `#nav .menu-item` wins, **regardless** of the second rule having 3 type selectors. The type column is never even consulted.

```css
input[type="text"] { border: 1px solid gray; } /* class:1 (attribute), type:1 → (0,1,1) */
.foo { border: 1px solid black; }               /* class:1 → (0,1,0) */
```
Class column ties at 1, so the type column breaks the tie: `1 > 0` → `input[type="text"]` wins.

## `*`, combinators, `:is()`, `:not()`, `:has()`, and `:where()`

- `*` (universal) and combinators (` `, `>`, `+`, `~`) contribute **zero**.
- `:not()`, `:is()`, and `:has()` are NOT zero-cost — each takes on the specificity of its **most specific argument** (not the sum of all arguments):
  ```css
  :is(#id, .class) span {}   /* :is() contributes the specificity of #id → (1,0,0), plus type:1 for span → (1,0,1) */
  p:not(.a, .b) {}            /* :not() contributes the specificity of .a or .b (they're equal) → class:1, plus type:1 for p → (0,1,1) */
  ```
- `:where()` is the one exception — it **always** contributes zero specificity, no matter what's inside it. This makes it a deliberate tool for writing selectors that are easy to override later:
  ```css
  :where(.card, #sidebar) p { color: gray; } /* specificity is just type:1 (for p) — the :where() contributes nothing */
  ```

## Quick-reference weight table

| Selector | Specificity (id, class, type) |
|---|---|
| `*` | (0, 0, 0) |
| `li` | (0, 0, 1) |
| `li::before` | (0, 0, 2) |
| `.list-item` | (0, 1, 0) |
| `ul .list-item` | (0, 1, 1) |
| `#sidebar` | (1, 0, 0) |
| `#sidebar .list-item` | (1, 1, 0) |
| `:where(#sidebar) .list-item` | (0, 1, 0) |
| inline `style=""` | beats all of the above |

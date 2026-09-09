***  06-block-vs-inline-elements-html-semantics.md ***

# Block vs. Inline Elements: the HTML Side

This is a frequently conflated topic: there are **two separate concepts** that share confusingly similar names.

1. **HTML content categories** ("block-level" / "inline-level" as defined by the HTML spec's content model) — determines *what elements are allowed to contain what*.
2. **CSS `display` property** (`display: block`, `display: inline`, `display: inline-block`, etc.) — determines *how an element is rendered/laid out*, and can be set to anything regardless of the element's HTML category.

Interviewers ask this specifically to see if a candidate conflates the two — a `<span>` is inline-level *in HTML*, but `span { display: block; }` is completely valid CSS and does not change the underlying HTML content model or validity rules.

## HTML content categories (simplified: block vs. inline)

| | Block-level (HTML sense) | Inline-level (HTML sense) |
|---|---|---|
| Examples | `div`, `p`, `h1`–`h6`, `section`, `article`, `header`, `footer`, `ul`, `li`, `table`, `form` | `span`, `a`, `strong`, `em`, `img`, `code`, `label`, `input`, `br` |
| Default rendering | Starts on a new line, takes full available width | Flows inline with surrounding text, only as wide as content |
| Can contain | Both block and inline content (context-dependent) | Generally only inline/phrasing content |

(Modern HTML5 formally uses more granular categories — "flow content," "phrasing content," "sectioning content," "heading content," etc. — but "block vs. inline" is still the practical shorthand nearly everyone, including the spec's informative notes, uses.)

## The content-model rule that actually matters: what can nest in what

This is where it gets practically important, independent of any CSS:

```html
<!-- INVALID: <p> is defined to only accept "phrasing content" (inline-level) -->
<p>
  Some text
  <div>a block-level element</div>  <!-- parser will force-close the <p> here -->
</p>

<!-- VALID: inline elements nest fine inside a block element -->
<p>
  Some text with <strong>inline emphasis</strong> and a <a href="#">link</a>.
</p>
```

When you put a block-level element inside a `<p>`, the browser's parser doesn't throw an error — it silently **auto-closes the `<p>` early**, splitting your intended single paragraph into a broken DOM structure. This is a real, hard-to-spot bug class: your CSS/JS may be selecting `p > div` expecting nesting, but the actual DOM has two sibling elements because the browser repaired the invalid nesting for you.

## CSS `display` does not change the HTML content category

```css
span { display: block; }   /* renders like a block, but <span> is still HTML "phrasing content" */
li { display: inline; }    /* renders inline, but <li> is still only valid inside <ul>/<ol>/<menu> */
```

Changing `display` is purely a **rendering** instruction — it never changes what the HTML parser considers valid nesting, what ARIA role the element implies by default, or the element's fundamental content-model category. A `<div style="display: inline">` is still parsed and exposed to the accessibility tree as a generic block-level container that just happens to render inline; it doesn't magically become valid inside a `<p>`.

## Practical interview-relevant takeaways

- "Block vs. inline" pre-dates and is independent of CSS's `display` property — don't answer a "what's the difference between block and inline elements" question purely in terms of CSS.
- The HTML-level distinction governs **valid nesting** (content models) — this is enforced by the parser regardless of any styling.
- `<a>` is a notable case: HTML5 relaxed the rule so `<a>` can now legally wrap block-level content (`<a href="#"><div>...</div></a>` is valid in HTML5, unlike HTML4/XHTML) — a frequently-cited "gotcha" exception.

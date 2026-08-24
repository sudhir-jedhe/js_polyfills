# Snippet: Combinators — Descendant, Child, Adjacent, General Sibling

```css
/* descendant combinator: matches at ANY depth */
.card p { color: #333; }

/* child combinator: ONLY direct children */
.card > p { margin-top: 0; }

/* adjacent sibling: the element immediately following, same parent */
h2 + p { margin-top: 4px; } /* tightens the paragraph right after a heading */

/* general sibling: any later sibling, same parent, not necessarily adjacent */
h2 ~ p { color: #555; } /* every paragraph after the heading, however far */
```

```html
<div class="card">
  <p>Direct child — matched by .card p AND .card > p</p>
  <section>
    <p>Nested two levels deep — matched by .card p, but NOT .card > p</p>
  </section>
</div>

<h2>Heading</h2>
<p>Matched by h2 + p AND h2 ~ p</p>
<p>Matched by h2 ~ p only — not adjacent to the h2 anymore</p>
```

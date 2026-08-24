# Snippet: Block vs. Inline Nesting Rules

```html
<!-- VALID: inline elements freely nest inside a block element -->
<p>
  This is <strong>important</strong>, this is <em>emphasized</em>,
  and <a href="#">this is a link</a>, all inline within one paragraph.
</p>

<!-- INVALID: block-level content inside <p> forces an early close -->
<p>
  Intro text
  <div>A block element here breaks the paragraph</div>
  More text intended for the same paragraph
</p>
```

The invalid example parses as:

```html
<p>Intro text</p>
<div>A block element here breaks the paragraph</div>
"More text intended for the same paragraph"  <!-- orphaned text node, NOT inside any <p> -->
```

```html
<!-- CSS display does NOT change HTML validity/content-model rules -->
<span style="display:block">Renders as a block box, but is still HTML phrasing content</span>

<!-- HTML5 exception: <a> may legally wrap block-level content -->
<a href="/product/42" class="product-card">
  <img src="product.jpg" alt="Product thumbnail">
  <div>
    <h3>Product Name</h3>
    <p>$49.99</p>
  </div>
</a>
```

The `<a>`-wrapping-a-`<div>` pattern is common in card-style UIs and is valid HTML5 (it was invalid in HTML4/XHTML, where `<a>` was strictly inline-only).

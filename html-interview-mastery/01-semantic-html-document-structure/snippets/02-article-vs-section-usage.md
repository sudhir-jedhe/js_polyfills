# Snippet: `<article>` vs. `<section>` in Practice

```html
<!-- A "Latest Posts" SECTION (thematic, page-specific) containing standalone ARTICLEs -->
<section aria-labelledby="latest-heading">
  <h2 id="latest-heading">Latest Posts</h2>

  <article>
    <h3>Understanding Closures</h3>
    <p>Published March 1, 2026</p>
    <p>A closure is a function bundled with references to its surrounding state…</p>
  </article>

  <article>
    <h3>CSS Cascade Layers Explained</h3>
    <p>Published February 20, 2026</p>
    <p>Cascade layers let you control priority independently of specificity…</p>
  </article>
</section>

<!-- A single ARTICLE broken into thematic SECTIONs -->
<article>
  <h2>Annual Report 2026</h2>
  <section>
    <h3>Financial Summary</h3>
    <p>Revenue grew 12% year over year…</p>
  </section>
  <section>
    <h3>Team Highlights</h3>
    <p>We hired 20 new engineers…</p>
  </section>
</article>
```

`aria-labelledby="latest-heading"` gives the `<section>` an accessible name, which is what actually promotes it to a `region` landmark in the accessibility tree — a `<section>` with no heading/label is not exposed as a landmark at all, and behaves like a plain `<div>` to assistive technology.

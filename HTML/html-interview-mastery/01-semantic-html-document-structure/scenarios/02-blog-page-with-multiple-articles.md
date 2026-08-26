*** copy 02-blog-page-with-multiple-articles.md ***

# Scenario: Structuring a Blog Index Page with Multiple Posts

**Scenario:** You're building a blog index page: a page-level intro, a list of post previews (title, excerpt, date, "read more" link), and a sidebar with a newsletter signup and popular tags. How do you structure this semantically, including heading levels?

**Approach:**

```html
<body>
  <header>
    <h1>The Dev Blog</h1>
    <nav aria-label="Primary"><!-- site nav --></nav>
  </header>

  <main>
    <h2>Latest Posts</h2>

    <article>
      <h3><a href="/posts/closures">Understanding Closures</a></h3>
      <p><time datetime="2026-03-01">March 1, 2026</time></p>
      <p>A closure is a function bundled with references to its surrounding state…</p>
      <a href="/posts/closures">Read more</a>
    </article>

    <article>
      <h3><a href="/posts/cascade-layers">CSS Cascade Layers Explained</a></h3>
      <p><time datetime="2026-02-20">February 20, 2026</time></p>
      <p>Cascade layers let you control priority independently of specificity…</p>
      <a href="/posts/cascade-layers">Read more</a>
    </article>

    <nav aria-label="Pagination">
      <a href="/blog?page=2">Older posts &rarr;</a>
    </nav>
  </main>

  <aside aria-labelledby="sidebar-heading">
    <h2 id="sidebar-heading">More</h2>
    <section aria-labelledby="newsletter-heading">
      <h3 id="newsletter-heading">Subscribe</h3>
      <form><!-- newsletter form --></form>
    </section>
    <section aria-labelledby="tags-heading">
      <h3 id="tags-heading">Popular Tags</h3>
      <ul><li><a href="/tag/html">HTML</a></li></ul>
    </section>
  </aside>

  <footer>
    <p>&copy; 2026 The Dev Blog</p>
  </footer>
</body>
```

**Key decisions:**
- Each post preview is an `<article>` — it's self-contained and would make sense syndicated in an RSS feed independent of this page.
- Post titles are `<h3>` (not `<h1>`, not `<h3>` reset per-article) — they sit one level below the page's `<h2>` "Latest Posts" section heading, continuing the single real page-wide hierarchy.
- The sidebar is one `<aside>` landmark containing two `<section>`s, each with its own labeled sub-heading — this avoids creating four separate top-level landmarks for what's conceptually one "more stuff" region.
- `<time datetime="...">` machine-encodes the date separately from its human-readable display text, which both search engines and any date-sorting/parsing JS can rely on.

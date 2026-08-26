*** copy 02-nested-article-in-section-outline.md ***

# Output: Nested `<article>` Inside `<section>`

```html
<h1>Tech Blog</h1>
<section aria-labelledby="recent">
  <h2 id="recent">Recent Posts</h2>
  <article>
    <h3>Post One</h3>
    <p>Body…</p>
  </article>
  <article>
    <h3>Post Two</h3>
    <p>Body…</p>
  </article>
</section>
```

**Question:** Is this valid, well-structured semantic HTML? What is the actual heading hierarchy here?

**Answer:** Yes, it's valid and well structured. The heading hierarchy is a single continuous sequence: `h1` (page title) → `h2` (section title, "Recent Posts") → `h3`, `h3` (two article titles, siblings at the same level). There's no skipped level, and the two `h3`s being identical in level is correct — they're two peer items in the same list of posts, not a hierarchy relative to each other.

**Why:** Despite the nesting (`section` containing two `article`s), the *browser does not reset heading levels per sectioning element* — that behavior was part of the deprecated document outline algorithm that no browser implements. The `h3`s are literally level-3 headings in one flat page-wide sequence, and that's exactly what makes this correct: the author deliberately chose `h3` to reflect "one level below the section's `h2`," not because nesting forced it.

# Problem: Build a Semantic Blog Post Page

## Problem Statement

Build the markup for a single blog post page. It needs: a site-wide header with a nav, a byline (author + date) for the post, the post body with at least two subheadings, an author bio box after the post, a "related posts" list, and a site-wide footer. No CSS required — this is a pure markup/structure exercise.

## Constraints

- Exactly one `<h1>` on the page.
- Every landmark-producing element must be unambiguous — if there's more than one of the same landmark type, it needs a distinct accessible name.
- Heading levels must not skip going down.
- The date must be machine-readable, not just human text.
- No `<div>` unless there's genuinely no more specific semantic element that fits.

## Solution

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Understanding the Event Loop | Dev Blog</title>
</head>
<body>
  <header>
    <p class="logo">Dev Blog</p>
    <nav aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/archive">Archive</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Understanding the Event Loop</h1>
        <p>
          By <a href="/authors/jane">Jane Doe</a> &middot;
          <time datetime="2026-03-01">March 1, 2026</time>
        </p>
      </header>

      <p>JavaScript is single-threaded, but non-blocking I/O is possible thanks to the event loop…</p>

      <h2>The Call Stack</h2>
      <p>...</p>

      <h2>The Task Queue vs. the Microtask Queue</h2>
      <p>...</p>
      <h3>Why Promises Jump the Queue</h3>
      <p>...</p>

      <footer>
        <p>Tags: <a href="/tag/javascript">javascript</a>, <a href="/tag/async">async</a></p>
      </footer>
    </article>

    <aside aria-labelledby="author-bio-heading">
      <h2 id="author-bio-heading">About the Author</h2>
      <img src="/authors/jane.jpg" alt="Jane Doe" width="80" height="80">
      <p>Jane writes about JavaScript internals and performance.</p>
    </aside>

    <nav aria-labelledby="related-heading">
      <h2 id="related-heading">Related Posts</h2>
      <ul>
        <li><a href="/posts/closures">Understanding Closures</a></li>
        <li><a href="/posts/promises">Mastering Promises</a></li>
      </ul>
    </nav>
  </main>

  <footer>
    <p>&copy; 2026 Dev Blog. All rights reserved.</p>
  </footer>
</body>
</html>
```

**Why this satisfies the constraints:** the single `<h1>` is the post title (not the site logo, which is deliberately a plain `<p>`); the `<article>` has its own scoped `<header>`/`<footer>` independent of the page-level ones; heading levels go `h1 → h2 → h2 → h3` with no downward skips; `<time datetime="2026-03-01">` encodes the date machine-readably while still showing human text; the "Related Posts" list is marked up as a `<nav>` (it's a block of navigational links) with an `aria-labelledby` name so it's distinguishable from the primary nav in a landmarks list; and the only `<div>`-candidate content (logo text) intentionally avoids a semantic tag since it isn't a heading of the page.

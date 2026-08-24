# Snippet: Lazy-Loaded Third-Party Iframe Embed

```html
<article>
  <h2>Article Title</h2>
  <p>Some intro text above the fold…</p>

  <!-- Heavy embedded video, well below the fold -->
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    loading="lazy"
    width="560"
    height="315"
    title="Embedded video"
    allow="accelerometer; autoplay; encrypted-media; gyroscope"
    allowfullscreen>
  </iframe>
</article>
```

The (often multi-hundred-KB) YouTube embed script and iframe content only load once the user scrolls near it, rather than on initial page load — meaningfully reducing the initial page weight for readers who never scroll that far down the article.

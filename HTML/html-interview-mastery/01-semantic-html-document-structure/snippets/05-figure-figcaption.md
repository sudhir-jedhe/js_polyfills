*** copy 05-figure-figcaption.md ***

# Snippet: `<figure>` and `<figcaption>`

`<figure>` groups self-contained content (an image, diagram, code listing, quote) with an optional `<figcaption>` caption. It's semantic, not purely presentational — it tells assistive technology and search engines "this content is a unit, and here's its caption," and unlike a caption written as an adjacent `<p>`, the association is programmatic, not just visual proximity.

```html
<figure>
  <img src="architecture.png" alt="Three-tier architecture: client, API, database">
  <figcaption>Fig. 1 — High-level system architecture.</figcaption>
</figure>

<!-- figure isn't only for images — a code sample is a valid use too -->
<figure>
  <pre><code>function add(a, b) {
  return a + b;
}</code></pre>
  <figcaption>Example: a simple pure function.</figcaption>
</figure>

<!-- a pull quote -->
<figure>
  <blockquote>
    <p>The best error message is the one that never shows up.</p>
  </blockquote>
  <figcaption>&mdash; Thomas Fuchs</figcaption>
</figure>
```

`<figcaption>` must be the first or last child of `<figure>` — it's optional, and a `<figure>` can contain multiple pieces of content (e.g. several related images) with a single caption describing the group.

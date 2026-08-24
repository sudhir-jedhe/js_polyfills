# Snippet: `@scope` for Component-Local Styling

```html
<article class="post">
  <h2>Post Title</h2>
  <p>Some post body text.</p>
  <div class="post__embed">
    <h2>Embedded Widget Title</h2>
    <p>This should NOT get the post's paragraph styling.</p>
  </div>
</article>
```

```css
@scope (.post) to (.post__embed) {
  h2 {
    font-size: 1.4rem;
    color: #111827;
  }
  p {
    color: #4b5563;
    line-height: 1.6;
  }
}
```

The `to (.post__embed)` clause creates a "donut scope": styling applies to `h2`/`p` inside `.post`, but stops at the boundary of any nested `.post__embed` — so the embedded widget's own `<h2>`/`<p>` are unaffected, without needing a `:not()` escape hatch or a separate stylesheet for embedded content.

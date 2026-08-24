# Snippet: A Card Component in BEM

```html
<article class="card card--featured">
  <img class="card__image" src="post.jpg" alt="" />
  <div class="card__body">
    <h3 class="card__title">Building Design Systems</h3>
    <p class="card__excerpt">A practical guide to scaling CSS across teams.</p>
    <button class="card__cta card__cta--primary">Read more</button>
  </div>
</article>
```

```css
.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}
.card--featured {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px #fde68a;
}
.card__image {
  width: 100%;
  display: block;
}
.card__body {
  padding: 1rem;
}
.card__title {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}
.card__excerpt {
  color: #6b7280;
  font-size: 0.9rem;
}
.card__cta {
  border: none;
  padding: 0.5em 1em;
  border-radius: 6px;
  cursor: pointer;
}
.card__cta--primary {
  background: #2563eb;
  color: white;
}
```

Every selector is a single class — none of the CSS nests `.card .card__title`, even though `card__title` is visually nested inside `.card` in the markup. That's the point of BEM: the relationship is encoded in the *name*, not in selector nesting.

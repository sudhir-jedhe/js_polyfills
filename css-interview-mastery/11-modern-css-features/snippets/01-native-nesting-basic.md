# Snippet: Native CSS Nesting

```css
.nav {
  display: flex;
  gap: 1rem;
  background: #111827;

  a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.active {
      font-weight: 700;
      border-bottom: 2px solid #2563eb;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
}
```

```html
<nav class="nav">
  <a href="#" class="active">Home</a>
  <a href="#">Docs</a>
  <a href="#">Blog</a>
</nav>
```

The nested `@media` block keeps the mobile layout adjustment physically next to the `.nav` rule it modifies, instead of in a separate media-query section elsewhere in the file — a common ergonomic win from native nesting.

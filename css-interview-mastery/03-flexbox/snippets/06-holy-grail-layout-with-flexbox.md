# Snippet: Holy-Grail Layout With Flexbox

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page__header, .page__footer {
  flex: 0 0 auto; /* fixed to content height, never grows or shrinks */
}
.page__body {
  display: flex;
  flex: 1 1 auto; /* grows to fill all remaining vertical space between header and footer */
}
.page__nav {
  flex: 0 0 220px; /* fixed-width sidebar */
}
.page__main {
  flex: 1 1 auto; /* fills remaining horizontal space */
  padding: 24px;
}
.page__aside {
  flex: 0 0 200px; /* fixed-width secondary sidebar */
}
```

```html
<div class="page">
  <header class="page__header">Header</header>
  <div class="page__body">
    <nav class="page__nav">Nav</nav>
    <main class="page__main">Main content</main>
    <aside class="page__aside">Aside</aside>
  </div>
  <footer class="page__footer">Footer</footer>
</div>
```

Two nested flex containers: the outer one stacks header/body/footer vertically (`column`), and the inner one arranges nav/main/aside horizontally (default `row`), with `main` as the only flexible element in each direction — the classic pre-grid "holy grail" layout, fully responsive with zero media queries.

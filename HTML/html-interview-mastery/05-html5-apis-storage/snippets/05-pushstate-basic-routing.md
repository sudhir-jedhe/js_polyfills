***  05-pushstate-basic-routing.md ***

# Snippet: `pushState` + `popstate` Minimal Router

```html
<nav>
  <a href="/" data-link>Home</a>
  <a href="/about" data-link>About</a>
</nav>
<main id="view"></main>

<script>
  const view = document.getElementById('view');
  const routes = {
    '/': () => (view.textContent = 'Home page'),
    '/about': () => (view.textContent = 'About page'),
  };

  function render() {
    (routes[location.pathname] || (() => (view.textContent = '404')))();
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    e.preventDefault();
    history.pushState({}, '', link.getAttribute('href'));
    render(); // pushState does NOT trigger popstate — call render manually
  });

  window.addEventListener('popstate', render); // handles Back/Forward
  render(); // initial render on load
</script>
```

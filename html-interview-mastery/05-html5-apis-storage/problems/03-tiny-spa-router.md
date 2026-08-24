# Problem: Build a Tiny SPA Router from Scratch

## Problem Statement

Implement `createRouter(routes)` using the History API, where `routes` is an object mapping path patterns (supporting a single `:param` segment) to render functions, supporting programmatic navigation, Back/Forward, and link interception.

## Requirements

- `createRouter(routes)` returns `{ navigate(path), start() }`.
- Route patterns like `/users/:id` must match `/users/42` and call the corresponding render function with `{ id: '42' }`.
- `navigate(path)` must update the URL via `pushState` and immediately render the matching route (since `pushState` doesn't fire any event on its own).
- Clicking any `<a data-router-link href="...">` in the document must be intercepted (`preventDefault`), routed through `navigate()` instead of a full page load.
- Pressing Back/Forward must re-render the correct view via the `popstate` event.
- `start()` performs the initial render based on the current URL and wires up the global listeners; calling it twice must not double-register listeners.

## Approach

Convert each pattern into a regex with a named capture group per `:param` segment. On any render trigger (`navigate`, `popstate`, or initial `start()`), test `location.pathname` against every pattern in order and call the first match's render function with the extracted params. Guard `start()` against double-initialization with a simple boolean flag.

## Solution

```js
function createRouter(routes) {
  const compiled = Object.entries(routes).map(([pattern, render]) => {
    const paramNames = [];
    const regexSource = pattern
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          paramNames.push(segment.slice(1));
          return '([^/]+)';
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape literal chars
      })
      .join('/');
    return { regex: new RegExp(`^${regexSource}$`), paramNames, render };
  });

  let started = false;

  function renderCurrentPath() {
    const path = location.pathname;
    for (const { regex, paramNames, render } of compiled) {
      const match = path.match(regex);
      if (match) {
        const params = Object.fromEntries(paramNames.map((name, i) => [name, match[i + 1]]));
        render(params);
        return;
      }
    }
    console.warn(`No route matched: ${path}`);
  }

  function navigate(path) {
    if (path === location.pathname) return;
    history.pushState({}, '', path);
    renderCurrentPath(); // pushState never fires popstate — render explicitly
  }

  function handleLinkClick(e) {
    const link = e.target.closest('a[data-router-link]');
    if (!link) return;
    e.preventDefault();
    navigate(new URL(link.href, location.origin).pathname);
  }

  function start() {
    if (started) return; // avoid double-registering listeners on repeat calls
    started = true;
    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', renderCurrentPath); // covers Back/Forward
    renderCurrentPath(); // initial render for whatever URL the page loaded with
  }

  return { navigate, start };
}

// --- verification ---
const router = createRouter({
  '/': () => console.log('render: home'),
  '/users': () => console.log('render: user list'),
  '/users/:id': ({ id }) => console.log('render: user detail', id),
});

router.start();               // renders based on current location.pathname
router.navigate('/users/42'); // logs: render: user detail 42, URL becomes /users/42
// pressing Back in the browser now re-renders the previous route via popstate
```

**Why parameters are extracted with capture groups instead of splitting strings manually:** Converting `:id` into a regex capture group `([^/]+)` lets a single `match()` call both confirm the path matches the pattern *and* pull out every dynamic segment in one pass, correctly handling patterns with multiple params (`/users/:userId/posts/:postId`) without writing separate manual string-splitting logic per pattern.

**Why `start()` is separate from `createRouter()`:** Separating construction (building the compiled route table) from activation (registering global `click`/`popstate` listeners and doing the first render) lets tests construct a router and inspect its compiled routes without side-effecting the real `window`/`document`, and makes the "don't double-register" guard meaningful — `createRouter` is cheap and pure, `start()` is the one-time stateful step.

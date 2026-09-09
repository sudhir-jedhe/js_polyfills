***  05-history-api-spa-routing.md ***

# The History API: `pushState`, `replaceState`, and `popstate`

The History API lets JavaScript manipulate the browser's session history and the URL bar **without triggering a full page reload**. This is the foundation every client-side SPA router (React Router, Vue Router, etc.) is built on.

## Why this matters: the SPA routing problem

A single-page app wants URLs to change as the user navigates (`/products` → `/products/42`) so links are shareable, back/forward work, and refreshing lands on the right view — but it does **not** want the browser to actually request a new HTML document from the server on every navigation, since that would defeat the purpose of being a SPA. `pushState`/`replaceState` solve exactly this: they change `location.href` and add/modify a history entry, entirely client-side.

## `pushState(state, title, url)`

Adds a **new** entry to the session history stack and changes the visible URL, without a network request or reload:

```js
history.pushState({ page: 'product', id: 42 }, '', '/products/42');
// URL bar now shows /products/42, page did NOT reload
// a NEW entry was pushed — pressing Back now returns to whatever URL was there before
```

- `state` — an arbitrary object associated with this history entry (retrievable later via `history.state` or the `popstate` event) — commonly used to store enough data to re-render the view without a fresh fetch.
- `title` — largely ignored by browsers today (historical parameter); pass `''`.
- `url` — the new URL, must be same-origin; relative URLs are resolved against the current URL.

## `replaceState(state, title, url)`

Same signature, but **modifies the current history entry in place** instead of adding a new one — no new Back-button stop is created:

```js
history.replaceState({ page: 'product', id: 42 }, '', '/products/42');
```

## `pushState` vs `replaceState` — when to use which

| | `pushState` | `replaceState` |
|---|---|---|
| History stack | Adds a new entry | Overwrites the current entry |
| Back button | Goes to the previous page/route | Goes to whatever was before the *replaced* entry (skips it) |
| Typical use | User navigates to a new "page" (clicking a link, changing route) | Correcting/normalizing the URL, redirects, updating query params on filter/search changes that shouldn't each be a Back-button stop |

A concrete example: as a user types into a live search box, you'd `replaceState` on every keystroke (so Back doesn't require un-pressing every character) but `pushState` when they actually navigate to a result.

## `popstate` — reacting to Back/Forward

The `popstate` event fires on `window` when the user navigates **through session history** — clicking Back/Forward, or calling `history.back()`/`forward()`/`go()`. Critically: **`popstate` does NOT fire as a result of calling `pushState` or `replaceState` themselves** — only from actual history navigation.

```js
window.addEventListener('popstate', (e) => {
  console.log(e.state); // the state object passed to pushState/replaceState for this entry
  renderRouteFromURL(location.pathname); // re-render the view to match the new URL
});
```

This asymmetry is a classic interview trap: if you build a router that calls `pushState` on link clicks, you must **also** manually call your render function right after `pushState` (since no event fires for it) — `popstate` only covers the Back/Forward case.

```js
function navigate(url, state = {}) {
  history.pushState(state, '', url);
  renderRouteFromURL(url); // pushState doesn't trigger popstate — render manually
}

window.addEventListener('popstate', (e) => {
  renderRouteFromURL(location.pathname); // covers Back/Forward
});

document.body.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (link) {
    e.preventDefault();
    navigate(link.href);
  }
});
```

## Minimal SPA router skeleton

```js
const routes = {
  '/': renderHome,
  '/about': renderAbout,
};

function renderRouteFromURL(path) {
  const render = routes[path] || renderNotFound;
  render();
}

function navigate(path) {
  if (path !== location.pathname) {
    history.pushState({}, '', path);
    renderRouteFromURL(path);
  }
}

window.addEventListener('popstate', () => renderRouteFromURL(location.pathname));
renderRouteFromURL(location.pathname); // initial render on load
```

## Related but distinct: the `hashchange` event

Older SPAs used the URL **hash** (`/#/products/42`) instead of `pushState`, because hash changes never trigger a server request even without any JS API — just setting `location.hash = '...'` updates the URL and fires a `hashchange` event, no History API needed. `pushState`-based ("clean URL") routing is now preferred since it doesn't require the `#`, but it has one operational requirement the hash approach doesn't: **the server must be configured to serve the SPA's `index.html` for every route** (a catch-all/fallback), since a hard refresh or direct link to `/products/42` is a real HTTP request the server must handle, whereas everything after `#` is never sent to the server at all.

## `history.go()`, `back()`, `forward()`

```js
history.back();     // equivalent to clicking the Back button
history.forward();  // equivalent to clicking Forward
history.go(-2);      // go back 2 entries; go(1) is same as forward()
```

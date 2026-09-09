***  02-building-a-spa-router-without-a-framework.md ***

# Scenario: Adding Client-Side Routing to a Vanilla JS Widget

**Scenario:** You're building a small embeddable widget (not a full framework app) that has three views — a list, a detail page, and a settings panel. Product wants shareable URLs (`/widget/list`, `/widget/item/42`) and working Back/Forward buttons, but pulling in a full router library is considered too heavy for this widget's bundle-size budget. How do you build minimal client-side routing yourself?

**Diagnosis:** This is a direct application of the History API — `pushState` for navigation, `popstate` for Back/Forward, with a small route-matching function. The two easy-to-miss pieces: (1) `pushState` never fires `popstate`, so navigation and rendering must be triggered from the *same* place a link is clicked, not deferred to the event listener; and (2) since real URLs are being used (not a `#hash`), the host page's server needs a fallback so a hard refresh on `/widget/item/42` doesn't 404.

**Implementation:**

```js
const routes = [
  { pattern: /^\/widget\/list$/, render: renderList },
  { pattern: /^\/widget\/item\/(\d+)$/, render: (m) => renderDetail(m[1]) },
  { pattern: /^\/widget\/settings$/, render: renderSettings },
];

function matchAndRender(path) {
  for (const { pattern, render } of routes) {
    const match = path.match(pattern);
    if (match) return render(match);
  }
  renderNotFound();
}

function navigate(path) {
  if (path === location.pathname) return;
  history.pushState({}, '', path);
  matchAndRender(path);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-widget-link]');
  if (!link) return;
  e.preventDefault();
  navigate(new URL(link.href).pathname);
});

window.addEventListener('popstate', () => matchAndRender(location.pathname));
matchAndRender(location.pathname); // initial render on load
```

**Server-side requirement:** Direct navigation to `/widget/item/42` (a hard reload, or someone pasting the link) is a real HTTP request — the server must be configured to respond with the same `index.html` shell for any `/widget/*` path, letting client-side JS take over and render the correct view based on `location.pathname` on load, exactly as `matchAndRender(location.pathname)` does at the bottom of the script above.

**Trade-off acknowledged:** A hand-rolled router like this is fine for 3 fixed routes with no nested routing, no route guards, and no transition animations — the moment any of those requirements show up, the maintenance cost of hand-rolling starts to exceed the bundle-size savings of avoiding a router library.

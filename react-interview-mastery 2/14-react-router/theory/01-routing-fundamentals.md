# Routing Fundamentals

## Why SPA routing needs to intercept link clicks

By default, clicking an `<a href="/about">` tells the browser to make a full HTTP request for `/about`, tearing down the current page and loading a fresh HTML document. That defeats the point of a single-page app, which wants to keep the JS runtime alive and just swap out which components render. React Router's `<Link>` renders an `<a>` under the hood (for accessibility, right-click "open in new tab," etc.) but attaches an `onClick` handler that calls `event.preventDefault()` and instead pushes a new entry onto the browser's History API (`history.pushState`), then re-renders the matching route — no network round-trip, no full page reload.

```jsx
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>
// vs
<a href="/about">About</a> // triggers a full page reload — avoid for in-app navigation
```

## `<Link>` vs `<a>`

| Aspect | `<Link to="...">` | `<a href="...">` |
|---|---|---|
| Navigation | Intercepts the click, uses History API — no full page reload, React state preserved | Default browser navigation — full HTTP request, page teardown/reload |
| When to use | Any in-app navigation between routes handled by your router | External links (different domain) or links that genuinely need a full reload |
| Common mistake | None major — it's the correct default for internal navigation | Using a plain `<a>` for internal routes by habit/copy-paste, silently losing SPA behavior and app state |

Default to `<Link>`/`useNavigate` for anything within your app's routed pages; use `<a>` only for external URLs, `mailto:`/`tel:` links, or file downloads.

## Core setup: `Routes` and `Route`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

`Routes` picks the single best-matching `Route` for the current URL (unlike the old v5 `Switch`, matching is more explicit/ranked). `path="*"` is the catch-all for 404s.

If two sibling routes are defined for the exact same path, React Router uses the first matching route in document order — a real footgun when routes are generated dynamically from a config array and accidentally produce duplicate paths.

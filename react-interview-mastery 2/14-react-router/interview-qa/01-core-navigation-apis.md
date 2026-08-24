# Interview Q&A: Core Navigation APIs

**Q: Why does client-side routing need to intercept link clicks instead of letting the browser handle them?**
A default `<a href>` click triggers a full HTTP request and page reload, destroying the JS runtime and all in-memory React state. To behave like a single-page app, the router must call `event.preventDefault()` on the click, then use the History API (`pushState`) to change the URL and re-render the matching route entirely client-side, with no network round-trip for the navigation itself.

**Q: What's the difference between `<Link to="/x">` and `<a href="/x">` in a React Router app?**
`<Link>` renders an `<a>` tag (preserving accessibility and native behaviors like middle-click/open-in-new-tab) but intercepts left-clicks to perform client-side navigation instead of a full page load. A plain `<a href>` has none of that — clicking it always causes a full page reload, since React Router never sees or handles the click.

**Q: What's the difference between `navigate('/path')` and `navigate('/path', { replace: true })`?**
Without `replace`, navigation pushes a new entry onto the browser history stack, so the previous page is still reachable via the back button. With `replace: true`, the current history entry is overwritten instead of a new one being added — commonly used after a redirect (e.g., post-login) so the back button doesn't take the user back to an intermediate/redirect page.

**Q: What does `useLocation()` give you, and give a practical use case.**
It returns the current location object: `{ pathname, search, hash, state, key }`. A practical use: reading `location.state` after a redirect (e.g., `<Navigate to="/login" state={{ from: location }} />`) to send the user back to where they originally tried to go after they successfully log in.

**Q: Why is `<Navigate>` used inside a component's render output instead of just calling `navigate()` directly during render?**
Calling `navigate()` (an imperative function) directly during the render phase is a side effect and violates React's rule against side effects in render — it can cause warnings or double-invocation issues, especially in Strict Mode. `<Navigate>` is a component specifically designed to perform its redirect as a controlled effect internally when rendered, making it safe to return conditionally from JSX.

**Q: What's the difference between how `BrowserRouter` and a hash-based router (`HashRouter`) represent the URL, and when would you use each?**
`BrowserRouter` uses the History API to produce clean URLs (`/about`) but requires the server to be configured to serve the SPA's `index.html` for any path (so direct loads/refreshes work). `HashRouter` encodes the route in the URL fragment (`/#/about`), which never hits the server on navigation or refresh (since fragments aren't sent in HTTP requests) but produces uglier URLs. Use `BrowserRouter` by default; `HashRouter` is a fallback when you can't configure server-side routing/fallback rules (e.g., a static file host with no rewrite rules).

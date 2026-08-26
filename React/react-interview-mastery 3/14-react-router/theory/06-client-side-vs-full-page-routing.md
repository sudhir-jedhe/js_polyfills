# Client-Side Routing vs Full Page Reloads

## Client-side routing vs full page reload (traditional multi-page app)

| Aspect | Client-side routing (SPA) | Full page reload (MPA) |
|---|---|---|
| Perceived speed | Fast — only the changed portion of the DOM updates, no full document re-parse | Slower per navigation — full HTML/CSS/JS re-download and re-parse each time |
| State preservation | In-memory state (unrelated to the URL) survives navigation | All JS state is lost; must be re-derived from the server response or URL each time |
| Common mistake | Forgetting that direct URL entry / hard refresh / shared links must still work correctly server-side (or via a fallback), since the server needs to serve the SPA shell for any route | Assuming an MPA can't have fast navigation at all — modern MPAs can still feel snappy with proper caching |

Use client-side routing for app-like interactive experiences where state continuity across "pages" matters; plain server-rendered navigation is still reasonable for largely static, content-first sites.

## `BrowserRouter` vs `HashRouter`

`BrowserRouter` uses the History API to produce clean URLs (`/about`) but requires the server to be configured to serve the SPA's `index.html` for any path (so direct loads/refreshes work). `HashRouter` encodes the route in the URL fragment (`/#/about`), which never hits the server on navigation or refresh (since fragments aren't sent in HTTP requests) but produces uglier URLs.

Use `BrowserRouter` by default; `HashRouter` is a fallback when you can't configure server-side routing/fallback rules (e.g., a static file host with no rewrite rules).

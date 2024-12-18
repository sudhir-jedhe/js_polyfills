### **Preflight Request:**

`What it is:` A preflight request is an OPTIONS HTTP request sent by the browser before making the actual request. It checks if the server will allow the actual request, especially in the case of cross-origin requests (CORS).

`When it happens:` It occurs automatically when the browser detects that a request might involve cross-origin operations like using methods such as PUT, DELETE, or custom headers.

`Purpose:` The preflight request ensures the server is configured to allow the actual request. If the server responds with the appropriate CORS headers (e.g., Access-Control-Allow-Origin), the actual request is made.

`Example`:
A PUT request to an API would trigger a preflight request to verify the method and headers are allowed.

### **Prefetch:**

`What it is:` Prefetching is a technique where the browser requests resources that might be needed in the future, typically before the user actively interacts with them. It is a low-priority request and the browser might fetch the resource when idle.

`When it happens:` Prefetching is usually used when the browser predicts that the user is likely to visit another page, or an asset will be required soon.

`Purpose:` It helps speed up future page loads by preloading resources, but it won’t block the rendering of the current page.

`Example:`
Prefetching resources for a link that is likely to be clicked soon:

```html

<link rel="prefetch" href="next-page.js">
```

### **Preloading:**

What it is: Preloading is similar to prefetching, but with a higher priority. It ensures resources required for the current page are fetched as early as possible and ready for use when needed.
When it happens: It is used for resources that are required immediately or soon after the page starts rendering, such as CSS files, JavaScript files, or fonts.
Purpose: Preloading is specifically for resources that are essential for the current page’s layout or functionality, reducing delays during page rendering.
Example:
Preloading an important stylesheet or script:

```html

<link rel="preload" href="styles.css" as="style">
```
### **Prerendering:**

`What it is`: Prerendering involves loading and rendering an entire web page in the background before the user navigates to it. This makes the page ready to display instantly when the user actually visits it.

`When it happens:` It is usually done when the browser anticipates the user will navigate to a certain page next, and the page will be fully rendered and ready in the background.

`Purpose:` Prerendering improves user experience by reducing the wait time when navigating between pages, especially for Single Page Applications (SPAs)..

`Example:`
Prerendering the next page:

```html
<link rel="prerender" href="next-page.html">
```

| **Feature**           | **Preflight**                                   | **Prefetch**                                          | **Preloading**                                        | **Prerendering**                                      |
|-----------------------|-------------------------------------------------|------------------------------------------------------|------------------------------------------------------|-------------------------------------------------------|
| **Definition**        | A request to check CORS permissions before the actual request. | Requests resources that may be needed in the future, but not immediately. | Requests critical resources needed soon or immediately to ensure availability. | Requests and renders a full page in the background before the user navigates to it. |
| **Use Case**          | CORS validation for cross-origin requests.      | Load resources for a possible future need (e.g., the next page). | Ensuring essential resources are available and ready when needed. | Preload an entire page for faster navigation.         |
| **Priority**          | High (necessary for security).                 | Low priority (does not block the page’s current load). | High priority (critical for the current page's function). | High priority (aims to fully render a page ahead of time). |
| **Impact on Rendering**| Does not impact rendering (only checks CORS).   | Does not block rendering, but may use idle time.      | Ensures resources are available, improving rendering time. | Full page is rendered and ready, eliminating load time for the user. |
| **Example Tag**       | Not used directly in HTML (automatically handled). | `<link rel="prefetch" href="...">`                    | `<link rel="preload" href="..." as="...">`            | `<link rel="prerender" href="...">`                   |

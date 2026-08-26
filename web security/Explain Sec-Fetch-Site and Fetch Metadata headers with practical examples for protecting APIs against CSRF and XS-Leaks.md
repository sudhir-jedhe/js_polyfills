**Fetch Metadata** headers are a suite of `Sec-Fetch-*` HTTP request headers sent automatically by modern browsers. They give your backend server exact context about **who initiated the request, where it came from, and how it will be used** before the server processes or responds to it.

Because these headers start with `Sec-`, they are **forbidden header names**—meaning malicious JavaScript running in the browser cannot forge, modify, or strip them via `fetch()` or `XMLHttpRequest`.

---

### The 4 Core Fetch Metadata Headers

| Header               | Possible Values                                                                  | Description                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Sec-Fetch-Site`** | `same-origin`, `same-site`, `cross-site`, `none`                                 | Relationship between the initiator's origin and the target origin (`none` means direct user navigation like typing in the address bar or bookmark). |
| **`Sec-Fetch-Mode`** | `navigate`, `cors`, `no-cors`, `same-origin`, `websocket`                        | The mode of the request (e.g., top-level HTML navigation vs. an API `cors` fetch vs. an `<img>` tag `no-cors` subresource).                         |
| **`Sec-Fetch-Dest`** | `document`, `image`, `script`, `empty` (for `fetch`/XHR), `iframe`, `font`, etc. | The ultimate destination/consumer of the requested resource.                                                                                        |
| **`Sec-Fetch-User`** | `?1` (or not sent)                                                               | Present and set to `?1` only if the request was triggered by a user activation (e.g., clicking a link or submitting a form).                        |

---

### The Security Threats They Prevent

1. **Cross-Site Request Forgery (CSRF):** A malicious site (`evil.com`) uses a hidden form or script to trigger state-changing actions (e.g., `POST /api/transfer`) using the victim's ambient browser cookies.
2. **Cross-Site Script Inclusion (XSSI) & XS-Leaks:** A malicious site embeds your private JSON endpoint via `<script src="...">` or `<img src="...">` to infer user state, leakage, or execute side-channel timing attacks.
3. **Clickjacking & Unwanted Framing:** An attacker embeds your entire application inside a malicious iframe.

---

### Designing a Resource Isolation Policy

Instead of defending each individual endpoint with custom tokens, you can implement a global **Resource Isolation Policy** middleware on your server.

#### The Golden Rule

* **Allow:** `same-origin`, `same-site`, and user-initiated top-level `navigate` requests.
* **Reject:** Any incoming `cross-site` request that targets private APIs, state-changing actions, or unauthorized subresources.

---

### Practical Implementation: Express.js / Node.js Middleware

```javascript
// middleware/resourceIsolation.js

export function resourceIsolationPolicy(req, res, next) {
  const site = req.headers['sec-fetch-site'];
  const mode = req.headers['sec-fetch-mode'];
  const dest = req.headers['sec-fetch-dest'];

  // 1. Fallback for legacy browsers or non-browser tools (cURL, mobile apps)
  // If the browser doesn't send Sec-Fetch-Site, fall back to standard CSRF token checks
  if (!site) {
    return next();
  }

  // 2. Always allow requests originating from same-origin or same-site
  // Also allow direct user navigations (bookmarks, entering URL in address bar -> site: 'none')
  if (['same-origin', 'same-site', 'none'].includes(site)) {
    return next();
  }

  // 3. Allow incoming cross-site top-level navigations ONLY (e.g., external links to your public pages)
  // Rejects cross-site iframes, embeds, script tags, and background fetch/XHR
  const isTopLevelNavigation = 
    mode === 'navigate' && 
    req.method === 'GET' && 
    dest !== 'iframe';

  if (isTopLevelNavigation) {
    return next();
  }

  // 4. Reject all other cross-site requests (Blocks CSRF, XS-Leaks, XSSI)
  return res.status(403).json({
    error: 'Blocked by Fetch Metadata Resource Isolation Policy'
  });
}

```

---

### Attack Scenarios & How Headers Block Them

#### Scenario 1: Attacker Attempts CSRF via Hidden Form

An attacker on `[https://evil.com](https://evil.com)` creates a form submitting a `POST` to `[https://bank.com/transfer](https://bank.com/transfer)`:

```http
POST /transfer HTTP/1.1
Host: bank.com
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: document

```

* **Defense Evaluation:** The method is `POST`, not `GET`. The rule rejects it immediately with **`403 Forbidden`** before running business logic or touching the database.

---

#### Scenario 2: Attacker Attempts an XS-Leak / JSON Hijack

An attacker on `[https://evil.com](https://evil.com)` includes your private JSON endpoint inside an image tag: `<img src="[https://bank.com/api/user/balance.json](https://bank.com/api/user/balance.json)">` to detect error status codes or execute timing analysis.

```http
GET /api/user/balance.json HTTP/1.1
Host: bank.com
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: image

```

* **Defense Evaluation:** `Sec-Fetch-Site` is `cross-site` and `Sec-Fetch-Mode` is `no-cors` (not a top-level `document` navigation). The server rejects the request with **`403 Forbidden`**, preventing data leakage.

---

#### Scenario 3: Attacker Attempts to Frame Your Application

An attacker embeds your site via `<iframe src="[https://bank.com/dashboard](https://bank.com/dashboard)"></iframe>`:

```http
GET /dashboard HTTP/1.1
Host: bank.com
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: iframe

```

* **Defense Evaluation:** Even though `mode` is `navigate` and method is `GET`, `Sec-Fetch-Dest` is `iframe`. The policy blocks the response, neutralising framing attacks alongside `X-Frame-Options` / `CSP frame-ancestors`.

---

### Summary Table: Policy Decision Logic

| Request Type                         | `Sec-Fetch-Site` | `Sec-Fetch-Mode` | `Sec-Fetch-Dest`   | Action          |
| ------------------------------------ | ---------------- | ---------------- | ------------------ | --------------- |
| Normal internal app fetch            | `same-origin`    | `cors`           | `empty`            | **Allow**       |
| User typing URL / Bookmark           | `none`           | `navigate`       | `document`         | **Allow**       |
| Link from Google / External site     | `cross-site`     | `navigate`       | `document`         | **Allow**       |
| Cross-site `fetch()` or `XHR`        | `cross-site`     | `cors`           | `empty`            | **Block (403)** |
| Cross-site `<form method="POST">`    | `cross-site`     | `navigate`       | `document`         | **Block (403)** |
| Cross-site `<img>` / `<script>` leak | `cross-site`     | `no-cors`        | `image` / `script` | **Block (403)** |
| Cross-site `<iframe>` embed          | `cross-site`     | `navigate`       | `iframe`           | **Block (403)** |

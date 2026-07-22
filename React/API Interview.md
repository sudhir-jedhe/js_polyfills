Preparing for a frontend interview requires a solid understanding of how your React application communicates with backend servers via REST APIs. This curated guide covers the essential REST API interview questions tailored for a frontend fresher, complete with concise, professional answers.

---

## 1. HTTP Methods & Idempotency

### Q: What are the primary HTTP methods used in REST APIs, and what do they do?

- **`GET`**: Retrieves data from the server. It should be safe and read-only (should not modify server state).
- **`POST`**: Sends data to the server to create a new resource. It is **not** idempotent.
- **`PUT`**: Replaces an existing resource entirely or creates it if it doesn't exist. It **is** idempotent.
- **`PATCH`**: Applies partial modifications to an existing resource.
- **`DELETE`**: Removes a specified resource from the server. It **is** idempotent.

### Q: What does "idempotency" mean in REST APIs?

An operation is idempotent if making multiple identical requests produces the exact same result on the server as making a single request.

- **Idempotent methods:** `GET`, `PUT`, `DELETE` (Calling `DELETE` three times on an already deleted resource still results in the resource being gone).
- **Non-idempotent methods:** `POST` (Calling `POST /checkout` three times might create three separate orders and charge the user three times).

---

## 2. HTTP Status Codes

### Q: What are the common HTTP status codes you should handle on the frontend?

Status codes are grouped into five classes:

- **`200 OK`**: The request succeeded.
- **`201 Created`**: The request succeeded, and a new resource was successfully created (typically returned after a `POST`).
- **`400 Bad Request`**: The server could not process the request due to client-side syntax errors or invalid input.
- **`401 Unauthorized`**: The user is unauthenticated; missing or invalid authentication tokens.
- **`403 Forbidden`**: The user is authenticated, but does not have permission to access the requested resource.
- **`404 Not Found`**: The requested resource or endpoint does not exist on the server.
- **`500 Internal Server Error`**: A generic error indicating something went wrong on the backend server.

---

## 3. The `fetch` API

### Q: How does the native `fetch` API work, and what is a common gotcha with error handling?

`fetch()` is a built-in browser API that returns a **Promise** which resolves to the `Response` object of the request.

> **Crucial Gotcha:** `fetch` **only** rejects a promise on network failures (like a total loss of internet connection or a DNS lookup failure). It **does not** reject on HTTP error statuses like `404` or `500`. If a server responds with a 404, `fetch` considers the request _successful_ and resolves.

#### Correct Error Handling Example:

```javascript
async function getUserData() {
  try {
    const response = await fetch("/api/user/1");

    // Explicitly check response.ok (status in the range 200–299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}
```

---

## 4. CORS (Cross-Origin Resource Sharing)

### Q: What is CORS, and why does it occur in frontend applications?

**CORS** is a security mechanism implemented by web browsers (enforced by the Same-Origin Policy). It prevents a web page from making requests to a different domain than the one that served the web page, unless the server explicitly grants permission via specific HTTP headers (like `Access-Control-Allow-Origin`).

- **Why it happens:** If your React app runs on `http://localhost:5173` and tries to fetch data from `[https://api.mybackend.com](https://api.mybackend.com)`, the browser blocks the response if the backend hasn't configured CORS headers allowing your frontend origin.
- **How to solve it:** The backend server must include appropriate CORS headers. During local development, developers often use a **dev server proxy** (like Vite's `server.proxy` or webpack proxy) to route API calls through the same origin.

---

## 5. Authentication & Authorization

### Q: How do you handle authentication tokens (like JWT) in a frontend application?

Authentication tokens prove who the user is. There are two primary storage strategies:

1. **HttpOnly Cookies (Recommended for Security):** The server sets a cookie marked as `HttpOnly` and `Secure`. JavaScript cannot access it via `document.cookie`, making it immune to **XSS (Cross-Site Scripting)** attacks. The browser automatically attaches cookies to every request.
2. **`localStorage` / `sessionStorage`:** Tokens are stored in web storage and manually attached to API request headers (e.g., `Authorization: Bearer <token>`). While easy to implement, this is vulnerable to XSS attacks because any malicious script running on the page can steal the token.

---

## 6. Caching & Pagination

### Q: How do you handle pagination in frontend API requests?

Pagination prevents loading massive datasets all at once. There are two main strategies managed via query parameters:

- **Offset-based Pagination (`?page=2&limit=10`):** Jumps to specific page numbers. Easy to implement, but performance degrades on large datasets and can cause duplicate items if rows are added or deleted while browsing.
- **Cursor-based Pagination (`?cursor=eyJpZCI6MTA5fQ==&limit=10`):** Uses an opaque string pointer (cursor) pointing to the last fetched item. Ideal for infinite scrolling and high-frequency data feeds because it handles real-time additions/deletions seamlessly.

---

## 7. Error Handling & API Contracts

### Q: What is an API Contract, and why is it important for frontend developers?

An **API Contract** is an agreement between frontend and backend teams defining how communication will occur. It specifies endpoint URLs, HTTP methods, expected request body schemas, query parameters, and exact JSON response structures. Tools like **OpenAPI (Swagger)** are frequently used to document these contracts. It allows frontend developers to mock APIs and build UIs before the backend is fully written.

Bridging the gap between an API contract and a resilient user interface is precisely what interviewers look for when evaluating a frontend developer's architectural thinking. Moving beyond basic syntax, they want to see how you handle real-world edge cases like network latency, race conditions, and security boundaries.

---

### 1. Mapping API Contracts to Methods

An interviewer will look closely at whether you choose the semantic HTTP verb that matches the backend contract:

- **Idempotency & Safety:** Using `GET` for retrieval, `PUT`/`PATCH` for updates, and `POST` for creation.
- **Payload Shape:** Ensuring your request body matches the schema expected by the contract (e.g., sending JSON payloads with proper `Content-Type: application/json` headers).

---

### 2. Defensive Status Code Handling

Production UIs cannot crash or freeze when an API fails. Interviewers evaluate how you handle both success and error responses:

- **Success Ranges (200-299):** Handling standard `200 OK` or `201 Created` payloads.
- **Client Errors (4xx):** Intercepting `401` to trigger a token refresh or redirect to login, handling `403` for permission denied states, and showing validation errors for `400`.
- **Server Errors (5xx):** Catching `500` errors to display a user-friendly fallback UI (e.g., _"Something went wrong on our end. Please try again later."_).

---

### 3. Comprehensive State Management (Loading & Error States)

A reliable UI accounts for asynchronous latency at every stage of the request lifecycle:

- **Loading States:** Using skeleton loaders, disabled buttons, or spinners to prevent duplicate submissions while a request is in flight.
- **Error States:** Displaying inline error messages (e.g., form field errors) or global banners rather than leaving the user staring at an unresponsive screen.
- **Optimistic Updates:** Instantly updating the UI before the API responds (like toggling a "like" button) and rolling back the state if the request fails.

---

### 4. Secure Authentication Transport

Interviewers will test your understanding of how credentials travel across the network:

- **Authorization Headers:** Attaching tokens manually via `Authorization: Bearer <token>` for token-based auth.
- **HttpOnly Cookies:** Relying on the browser to automatically transmit session cookies, protecting your app against Cross-Site Scripting (XSS) token theft.

---

### 5. Demystifying CORS Failures

A classic interview question is: _"Why did my API call fail with a CORS error?"_

- **The Answer:** CORS is a **browser security feature** (Same-Origin Policy), not a server or network failure. The browser successfully reaches the server and gets a response, but because the server's response headers lack the correct `Access-Control-Allow-Origin` directive, the browser blocks your JavaScript code from reading the response data.

---

### 6. Preventing Duplicate & Stale Requests (Race Conditions)

Advanced frontend interviews test whether you can prevent bugs caused by rapid user interaction or out-of-order network responses:

- **Request Cancellation (`AbortController`):** When a user types quickly into a search bar, previous uncompleted `fetch` requests should be aborted so older, slower responses don't overwrite newer data (race conditions).

```javascript
const controller = new AbortController();
fetch("/api/search?q=react", { signal: controller.signal });

// Cancel the request if the user types again
controller.abort();
```

- **Debouncing & Throttling:** Delaying API calls triggered by high-frequency events like window resizing, scrolling, or rapid typing.

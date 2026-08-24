When a browser encounters a **CORS (Cross-Origin Resource Sharing) error**, the browser's security model (Same-Origin Policy) blocks your JavaScript code from accessing the response.

**1. The JavaScript Promise Rejects**

* In `fetch()`, the call throws a generic `TypeError: Failed to fetch`.
* In `XMLHttpRequest` or `axios`, it triggers the `onerror` handler or rejects with `Network Error`.
* Your code cannot read the HTTP status code, headers, or response body.

**2. A Console Error Appears**
The browser's Developer Tools Console logs a red security error, typically formatted like:

> `Access to fetch at '[https://api.example.com/data](https://api.example.com/data)' from origin '[https://mywebsite.com](https://mywebsite.com)' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

**3. What Actually Happens on the Server**

* **Simple Requests (GET, standard POST):** The server often receives and processes the request normally, but the browser discards the response before handing it to your script.
* **Preflight Requests (PUT, DELETE, custom headers like `Authorization`):** The browser automatically sends an HTTP `OPTIONS` request first. If the server does not respond with valid CORS headers, the actual API request is never sent.

---

**How to Fix It**

* **Configure the Server (Standard Fix):** Add the appropriate header to the API response:

```http
Access-Control-Allow-Origin: https://mywebsite.com

```

*(Or `*` for public APIs).*

* **Use a Backend Proxy (If you don't control the API):** Make the call from your frontend to your own server, and have your server fetch the third-party API.

So, what will happen if we make API call in browser and we get course error? So, one server never know as a browser block the request. Second, server process it, but browser block the response. Third, server stop the processing and throw the course error. Which which will the correct answer?

The correct answer is **Option 2: The server processes it, but the browser blocks the response** *(with a nuance for preflight requests)*.

---

**Why Option 2 is the primary behavior:**

* **CORS is enforced entirely by the browser, not the server.**
* For standard/simple requests (like a basic `GET` or `POST`), the browser sends the full request to the server.
* The server processes the logic, saves/updates data if applicable, and sends back an HTTP response.
* Once the response reaches the browser, the browser checks for the `Access-Control-Allow-Origin` header. When it sees the header is missing or incorrect, **the browser hides the response from your JavaScript code** and triggers the CORS error.

---

**The exception (Preflight Requests):**

* If the request uses methods like `PUT`/`DELETE` or custom headers (like `Authorization`), the browser sends an initial `OPTIONS` request (a "preflight check").
* If the preflight fails, the browser stops and never sends the actual request. In that specific scenario, the main request behaves like **Option 1**, but the CORS check itself is still enforced by the browser, never the server.

**Why Option 3 is always incorrect:**
Servers do not inherently understand or throw "CORS errors"—they simply process HTTP requests and return headers. The CORS error exists solely inside the browser's JavaScript environment.

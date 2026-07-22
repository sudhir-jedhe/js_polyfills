Here is how the common HTTP methods map out in a full-stack **React (frontend)** and **Node.js/Express (backend)** application.

---

### 1. `GET` (Read Data)

- **Purpose:** Fetches data from the server. It is safe, read-only, and cacheable.
- **Node.js Backend:**

```javascript
app.get("/api/products", (req, res) => {
  const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Mouse" },
  ];
  res.status(200).json(products);
});
```

- **React Frontend:**

```javascript
const fetchProducts = async () => {
  const response = await fetch("http://localhost:5000/api/products");
  const products = await response.json();
  console.log(products);
};
```

---

### 2. `POST` (Create / Process)

- **Purpose:** Sends data to create a new resource or trigger a backend process. **Not idempotent.**
- **Node.js Backend:**

```javascript
app.post("/api/orders", (req, res) => {
  const newOrder = req.body;
  // Save order to database...
  res.status(201).json({ message: "Order created", orderId: "ord_999" });
});
```

- **React Frontend:**

```javascript
const createOrder = async () => {
  const response = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: 1, quantity: 2 }),
  });
  const data = await response.json();
};
```

---

### 3. `PUT` (Replace Resource)

- **Purpose:** Replaces an entire resource or creates it if it doesn't exist. **Idempotent.**
- **Node.js Backend:**

```javascript
app.put("/api/settings", (req, res) => {
  // Overwrites entire settings object with req.body
  res.status(200).json({ message: "Settings replaced successfully" });
});
```

- **React Frontend:**

```javascript
const replaceSettings = async () => {
  await fetch("http://localhost:5000/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: "dark", notifications: false }),
  });
};
```

---

### 4. `PATCH` (Partial Update)

- **Purpose:** Applies partial modifications to an existing resource without altering unmentioned fields.
- **Node.js Backend:**

```javascript
app.patch("/api/me", (req, res) => {
  const { displayName } = req.body;
  // Updates only the provided fields
  res.status(200).json({ message: "Profile updated", displayName });
});
```

- **React Frontend:**

```javascript
const updateProfile = async () => {
  await fetch("http://localhost:5000/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayName: "Alex" }),
  });
};
```

---

### 5. `DELETE` (Remove Resource)

- **Purpose:** Removes a specified resource from the server. **Idempotent.**
- **Node.js Backend:**

```javascript
app.delete("/api/products/1", (req, res) => {
  // Delete product with ID 1 from database...
  res.status(204).send(); // 204 No Content for successful deletion
});
```

- **React Frontend:**

```javascript
const deleteProduct = async () => {
  await fetch("http://localhost:5000/api/products/1", {
    method: "DELETE",
  });
};
```

---

### 6. `OPTIONS` (CORS Preflight Check)

- **Purpose:** Automatically sent by browsers prior to mutating requests (or requests with custom headers/credentials) to ask the server what methods and origins are permitted.
- **Node.js Backend:**
- _Usually handled automatically using the `cors` package:_

```javascript
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
```

<https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods>

The differences between `GET` and `POST` form a fundamental pillar of REST API design. While both are used to communicate with the server, they serve entirely different purposes and handle data differently.

---

### Key Differences at a Glance

| Feature                   | `GET`                                                                                    | `POST`                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Primary Purpose**       | Retrieves or reads data from the server.                                                 | Submits data to create a resource or trigger server-side processing.                                            |
| **Safety & Side Effects** | **Safe.** It does not modify server state or database records.                           | **Unsafe.** It creates or modifies data and changes server state.                                               |
| **Idempotency**           | **Idempotent.** Making identical requests multiple times produces the exact same result. | **Not Idempotent.** Repeating the exact same request multiple times will create duplicate resources or actions. |
| **Data Transport**        | Sent via **URL query parameters** (visible in the address bar).                          | Sent securely inside the **request body** (hidden from the address bar).                                        |
| **Caching**               | **Cacheable.** Browsers, proxies, and CDNs can cache responses for performance.          | **Not Cacheable.** Responses are never cached by default.                                                       |
| **Bookmarkability**       | **Bookmarkable and shareable** because the full state lives in the URL.                  | **Not bookmarkable** because the data is trapped inside the request body.                                       |
| **Data Size Limits**      | Limited by maximum URL length constraints enforced by browsers/servers.                  | Supports virtually unlimited payload sizes (large JSON objects, files, etc.).                                   |

---

### Interview Summary

- Use **`GET`** when you are fetching resources (e.g., loading a product list, fetching user profile details).
- Use **`POST`** when you are creating new resources or performing actions with side effects (e.g., submitting an order, logging in, uploading a file).

### Practical Example: `GET` vs. `POST`

To see how `GET` and `POST` differ in practice, compare how an e-commerce app retrieves products versus how it creates a new order.

---

### 1. `GET` Example: Fetching & Filtering Products

- **Characteristics:** Read-only, parameters passed in the URL query string, safe to cache and bookmark.
- **Node.js Backend:**

```javascript
// GET /api/products?category=electronics&sort=price
app.get("/api/products", (req, res) => {
  const { category, sort } = req.query;
  // Fetch filtered products from database...
  const products = [
    { id: 1, name: "Wireless Mouse", category: "electronics", price: 29.99 },
  ];
  res.status(200).json({ category, sort, products });
});
```

- **React Frontend:**

```javascript
const fetchFilteredProducts = async () => {
  // Data is sent in the URL query string
  const response = await fetch(
    "http://localhost:5000/api/products?category=electronics&sort=price",
  );
  const data = await response.json();
  console.log(data);
};
```

---

### 2. `POST` Example: Creating a New Order

- **Characteristics:** Modifies server state, parameters passed secretly inside the request body, not cacheable, not idempotent.
- **Node.js Backend:**

```javascript
// POST /api/orders
app.post("/api/orders", (req, res) => {
  const { productId, quantity } = req.body; // Read from request body

  // Create new record in database...
  const newOrder = {
    orderId: "ord_123",
    productId,
    quantity,
    status: "created",
  };

  res.status(201).json(newOrder); // 201 Created status
});
```

- **React Frontend:**

```javascript
const createNewOrder = async () => {
  const response = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: 1, quantity: 2 }), // Data is safely hidden in the body
  });
  const data = await response.json();
  console.log("Created order:", data.orderId);
};
```

### The Core Difference Between `PUT` and `PATCH`

While both HTTP methods are used to update existing resources on a server, they differ fundamentally in **how the payload is applied**:

- **`PUT` (Complete Replacement):** Replaces the entire resource with the data provided in the request body. If you omit a field in a `PUT` request, the server typically overwrites it, clearing or resetting that field to a default value. `PUT` is **idempotent** (sending the exact same request multiple times has the exact same net effect).
- **`PATCH` (Partial Update):** Applies partial modifications to a resource. It updates _only_ the specific fields included in the request body, leaving all unmentioned properties completely untouched.

---

### Comparison at a Glance

| Feature                 | `PUT`                                                  | `PATCH`                                                                           |
| ----------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **Action**              | Replaces the entire resource.                          | Updates only specified fields.                                                    |
| **Payload Requirement** | Must include the **complete** resource representation. | Can include **only** the fields being changed.                                    |
| **Omitted Fields**      | Cleared, reset to null, or set to defaults.            | Preserved (unchanged on the server).                                              |
| **Idempotency**         | **Idempotent** (safe to repeat).                       | **Not necessarily idempotent** (e.g., appending items in an array on every call). |

---

### Practical Example: React & Node.js

Imagine a user resource with three fields: `id`, `name`, and `email`.

#### 1. `PUT` Example (Replacing the Resource)

If you send a `PUT` request with _only_ a new name and omit the email, the server will replace the entire record, potentially wiping out the email address.

- **Node.js Backend (`PUT`):**

```javascript
app.put("/api/users/1", (req, res) => {
  // Replaces the whole record; email becomes undefined/null if omitted
  users[0] = { id: 1, ...req.body };
  res.status(200).json(users[0]);
});
```

- **React Frontend (`PUT`):**

```javascript
const replaceUser = async () => {
  await fetch("http://localhost:5000/api/users/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alice" }), // Warning: 'email' is wiped out
  });
};
```

#### 2. `PATCH` Example (Partial Update)

If you send a `PATCH` request with _only_ the name, the server updates the name and preserves the existing email address.

- **Node.js Backend (`PATCH`):**

```javascript
app.patch("/api/users/1", (req, res) => {
  // Merges only the provided fields into the existing record
  users[0] = { ...users[0], ...req.body };
  res.status(200).json(users[0]);
});
```

- **React Frontend (`PATCH`):**

```javascript
const updateUserNameOnly = async () => {
  await fetch("http://localhost:5000/api/users/1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alice" }), // Email remains safely untouched
  });
};
```

PUT replaces the full resource at the target URL when the API follows standard REST semantics. If you send a user object with PUT /users/1, the server treats that representation as the new full state.

PATCH applies a partial update. For example, PATCH /users/1 with { "timezone": "Asia/Kolkata" } updates only that field if the API contract says so.

### What Does Idempotent Mean?

In REST APIs and HTTP, an operation is **idempotent** if making multiple identical requests has the **exact same effect on the server state** as making a single request.

- **First Request:** Changes the server state (e.g., deletes a record).
- **Subsequent Identical Requests:** Do not change the state any further, even though they may return a different response code (like a `404 Not Found` on a repeated delete).

---

### Idempotency Across HTTP Methods

| Method       | Idempotent? | Why?                                                                                                                                 |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **`GET`**    | **Yes**     | Reading data never changes server state.                                                                                             |
| **`PUT`**    | **Yes**     | Replacing a resource with the exact same data multiple times leaves it in the same state.                                            |
| **`DELETE`** | **Yes**     | Deleting a resource once removes it; deleting it a second time leaves it gone (though it may return `404`).                          |
| **`PATCH`**  | **Depends** | Standard field updates are usually idempotent, but operations like _appending_ an item to an array on every call are not.            |
| **`POST`**   | **No**      | Every identical `POST` request creates a brand-new resource or triggers a new transaction (e.g., placing multiple identical orders). |

---

### Practical Example

- **Idempotent (`DELETE`):** You send a request to `DELETE /api/orders/5`.
- _Call 1:_ Deletes the order and returns `200 OK` or `204 No Content`.
- _Call 2 (Retry due to bad network):_ The order is already gone, so it returns `404 Not Found`. The server state remains safe (the order isn't deleted twice or causing a crash).

- **Not Idempotent (`POST`):** You send a request to `POST /api/pay` to charge $50.
- _Call 1:_ Charges your card $50.
- _Call 2 (Accidental double-click):_ Charges your card a **second** $50.

**What does safe mean in HTTP?**
A safe method is intended only to retrieve information and not change server state. GET and HEAD are safe.

Safe does not mean "no logs or analytics happen." It means the client did not request a state-changing operation.

### What Does "Safe" Mean in HTTP?

In the context of HTTP, a method is considered **safe** if it is **read-only**.

A safe request does not modify, create, update, or delete any resources on the server. Its only purpose is to **retrieve information** without causing any side effects (such as changing database records, sending emails, or charging credit cards).

---

### Safe vs. Unsafe HTTP Methods

| Method        | Safe?   | Why?                                                                    |
| ------------- | ------- | ----------------------------------------------------------------------- |
| **`GET`**     | **Yes** | Fetches data. It does not alter server state.                           |
| **`HEAD`**    | **Yes** | Fetches only the response headers (no body). Read-only and safe.        |
| **`OPTIONS`** | **Yes** | Asks the server what methods/origins are supported. Read-only and safe. |
| **`POST`**    | **No**  | Creates new resources or triggers actions (side effects).               |
| **`PUT`**     | **No**  | Replaces or overwrites existing resources.                              |
| **`PATCH`**   | **No**  | Modifies existing resources.                                            |
| **`DELETE`**  | **No**  | Removes resources from the server.                                      |

---

### Why "Safe" Methods Matter

1. **Caching & Pre-fetching:** Because safe methods guarantee no state changes, browsers, proxies, and search engine web crawlers can aggressively cache, pre-fetch, or automatically retry requests (like a `GET` request) without worrying about accidentally triggering a database write or executing an order twice.
2. **User Confidence:** Users can safely refresh a page, click back/forward buttons, or bookmark links without fearing that a background action (like submitting a form or buying an item) will re-run unexpectedly.

HTTP status codes are three-digit numbers returned by a server to indicate the outcome of a client's request. They are divided into **five official classes**, categorized by their first digit:

---

### The Five HTTP Status Code Classes

| Class   | Category          | Meaning & Description                                                                                                     | Common Examples    |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **1xx** | **Informational** | The request was received, and the process is continuing. (Rarely handled directly in standard frontend application code). | `100 Continue`<br> |

<br>`101 Switching Protocols` |
| **2xx** | **Success** | The action was successfully received, understood, and accepted by the server. | `200 OK` (Standard success)<br>

<br>`201 Created` (New resource made)<br>

<br>`204 No Content` (Success with no body, e.g., after DELETE) |
| **3xx** | **Redirection** | Further action needs to be taken by the client to complete the request (often automatic redirection to a new URL). | `301 Moved Permanently`<br>

<br>`304 Not Modified` (Cached response) |
| **4xx** | **Client Error** | The request contains bad syntax, invalid data, or the client lacks proper authorization. The fault lies with the sender. | `400 Bad Request`<br>

<br>`401 Unauthorized`<br>

<br>`403 Forbidden`<br>

<br>`404 Not Found`<br>

<br>`409 Conflict` |
| **5xx** | **Server Error** | The server failed to fulfill an apparently valid request due to a crash, database timeout, or unhandled exception on the backend. | `500 Internal Server Error`<br>

<br>`502 Bad Gateway`<br>

<br>`503 Service Unavailable` |

### The Difference Between 200, 201, and 204 Status Codes

While all three belong to the **2xx Success** class, they communicate specific nuances about the outcome of a request to the frontend client:

- **`200 OK`:** The standard success code. The request succeeded, and the server is returning the requested data (or response message) in the body.
- **`201 Created`:** Specifically used after a `POST` request. It tells the frontend that a brand-new resource was successfully created on the server (often accompanied by a `Location` header or the newly created resource object in the body).
- **`204 No Content`:** The request succeeded perfectly, but **the server is intentionally returning an empty body**. This is standard for actions like a `DELETE` request or a profile update where confirmation of success is enough and no response data needs to be parsed.

---

### Practical Example: React & Node.js

Here is how these three status codes are implemented across a Node.js Express backend and handled by a React frontend:

#### 1. `200 OK` Example (Standard Read/Update)

- **Node.js Backend:**

```javascript
app.get("/api/users/1", (req, res) => {
  const user = { id: 1, name: "Alice" };
  res.status(200).json(user); // Returns data with 200 OK
});
```

- **React Frontend:**

```javascript
const fetchUser = async () => {
  const response = await fetch("http://localhost:5000/api/users/1");
  const user = await response.json(); // Parses body because 200 includes data
  console.log(user);
};
```

#### 2. `201 Created` Example (Resource Creation via `POST`)

- **Node.js Backend:**

```javascript
app.post("/api/products", (req, res) => {
  const newProduct = { id: 42, name: req.body.name };
  res.status(201).json(newProduct); // Signals a brand new resource was created
});
```

- **React Frontend:**

```javascript
const createProduct = async () => {
  const response = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Keyboard" }),
  });
  if (response.status === 201) {
    const product = await response.json();
    console.log("Created product ID:", product.id);
  }
};
```

#### 3. `204 No Content` Example (Deletion via `DELETE`)

- **Node.js Backend:**

```javascript
app.delete("/api/products/42", (req, res) => {
  // Delete product logic here...
  res.status(204).send(); // Success, but absolutely zero body content returned
});
```

- **React Frontend:**

```javascript
const deleteProduct = async () => {
  const response = await fetch("http://localhost:5000/api/products/42", {
    method: "DELETE",
  });

  if (response.status === 204) {
    // Do NOT call response.json() here, as the body is empty!
    console.log("Product successfully deleted.");
  }
};
```

### The Difference Between 400, 401, and 403 Status Codes

All three belong to the **4xx Client Error** class, meaning the fault lies with the request sent by the client. However, they diagnose entirely different problems:

- **`400 Bad Request`:** The request is malformed, invalid, or missing required parameters (e.g., a missing email field or invalid JSON syntax). The server doesn't understand what you are asking it to do.
- **`401 Unauthorized`:** (Semantically **Unauthenticated**): The client is not logged in or has provided invalid credentials (e.g., a missing or expired JWT token). The server doesn't know _who_ you are.
- **`403 Forbidden`:** The server knows _who_ you are, but you do not have the necessary permissions to access that resource (e.g., a regular user trying to access an admin dashboard route). Re-authenticating won't help.

---

### Comparison at a Glance

| Status Code            | Core Meaning                            | What the Frontend Should Do                                                      |
| ---------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| **`400 Bad Request`**  | Invalid syntax or validation failure.   | Display field-level validation errors or a descriptive notification to the user. |
| **`401 Unauthorized`** | Missing or expired authentication.      | Clear local session/tokens and redirect the user to the login page.              |
| **`403 Forbidden`**    | Authenticated, but lacking permissions. | Display an "Access Denied" or "Unauthorized Page" error view.                    |

---

### Practical Example: React & Node.js

Here is how these three status codes are handled in a Node.js Express backend and a React frontend:

#### 1. `400 Bad Request` Example (Validation Error)

- **Node.js Backend:**

```javascript
app.post("/api/signup", (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ error: "Email field is required." });
  }
  res.status(201).json({ message: "Success" });
});
```

- **React Frontend:**

```javascript
const handleSignup = async (formData) => {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (response.status === 400) {
    const data = await response.json();
    setFieldError(data.error); // Show error next to input
  }
};
```

#### 2. `401 Unauthorized` Example (Expired Token)

- **Node.js Backend:**

```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token missing. Please log in." });
  }
  next();
};
```

- **React Frontend:**

```javascript
const fetchProtectedData = async () => {
  const response = await fetch("/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login
  }
};
```

#### 3. `403 Forbidden` Example (Insufficient Permissions)

- **Node.js Backend:**

```javascript
app.delete("/api/users/:id", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only." });
  }
  // Delete user logic...
});
```

- **React Frontend:**

```javascript
const deleteUser = async () => {
  const response = await fetch("/api/users/5", { method: "DELETE" });
  if (response.status === 403) {
    alert("You do not have permission to perform this action.");
  }
};
```

### When Should an API Return `404 Not Found`?

An API should return a **`404 Not Found`** status code when the client requests a resource or route that **does not exist on the server**.

While commonly associated with missing web pages, in REST APIs `404` has precise technical meanings across different scenarios:

---

### 1. The Resource Does Not Exist

When an ID or slug in the URL path points to a record that cannot be found in the database.

- **Example:** A user requests profile details for an ID that was deleted or never created.
- **Request:** `GET /api/users/99999`
- **Backend Response:** `404 Not Found` (Body: `{ "error": "User with ID 99999 not found" }`)

### 2. The Route / Endpoint Does Not Exist

When the HTTP client requests a URL path or API route that has not been mapped or defined on the server router.

- **Example:** A typo in the frontend fetch URL or trying to access a deprecated endpoint.
- **Request:** `GET /api/v1/produts` (Notice the typo: `produts`)
- **Backend Response:** `404 Not Found` (Handled automatically by Express/Node router catch-alls).

### 3. Masking Security Risks (Sensitive Resources)

Sometimes APIs intentionally return a `404` instead of a `403 Forbidden` to prevent leaking the existence of a private or restricted resource to unauthorized users.

- **Example:** A regular user tries to view a private document URL that belongs to someone else. Instead of confirming the document exists (via a `403`), the server returns a `404` so the user cannot enumerate or guess valid resource IDs.

---

### Practical Example: React & Node.js

#### Node.js Backend (`404` Handling):

```javascript
app.get("/api/products/:id", (req, res) => {
  const product = database.find((p) => p.id === req.params.id);

  if (!product) {
    // Explicitly return 404 if the resource isn't found
    return res.status(404).json({ error: "Product not found." });
  }

  res.status(200).json(product);
});
```

#### React Frontend (`404` Handling):

```javascript
const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/products/${productId}`,
    );

    if (response.status === 404) {
      // Direct user to a dedicated "Not Found" view or state
      setNotFoundError(true);
      return;
    }

    const product = await response.json();
    setProductData(product);
  } catch (error) {
    console.error("Network or server error:", error);
  }
};
```

### What is `409 Conflict`?

The **`409 Conflict`** status code indicates that the request could not be processed because it conflicts with the **current state of the target resource** on the server.

Unlike a `400 Bad Request` (which means the data itself is malformed or invalid syntax), a `409` means the syntax is fine, but the action violates a business rule or database constraint given the existing data.

---

### Common Scenarios for `409 Conflict`

1. **Unique Constraint Violations:**

- Trying to create a user account or update a profile with an email address or display name that is **already taken** by another user.

2. **Concurrent Edits (Optimistic Locking):**

- Two users attempt to edit the same record at the same time. User A saves their changes first. When User B tries to save, the server detects that User B's version is outdated and rejects it with a `409` conflict to prevent overwriting User A's work.

3. **State Violations:**

- Trying to delete or cancel an order that has already been shipped or completed.

---

### Practical Example: React & Node.js

Imagine a user trying to register or update their account with a display name that already exists in the database.

#### 1. Node.js Backend (`409` Conflict Handling)

```javascript
app.patch("/api/me", (req, res) => {
  const { displayName } = req.body;

  // Check if display name is already taken by someone else
  const existingUser = database.find(
    (u) => u.displayName === displayName && u.id !== req.user.id,
  );

  if (existingUser) {
    return res.status(409).json({
      error: "This display name is already taken. Please choose another.",
    });
  }

  // Update logic...
  res.status(200).json({ message: "Profile updated successfully" });
});
```

#### 2. React Frontend (`409` Conflict Handling)

```javascript
const handleProfileUpdate = async (formData) => {
  const response = await fetch("http://localhost:5000/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (response.status === 409) {
    // Handle the conflict gracefully in the UI
    setConflictError(data.error); // Display inline alert to user
    return;
  }

  if (!response.ok) {
    throw new Error("Something went wrong.");
  }

  setSuccessMessage("Profile saved!");
};
```

### What is `429 Too Many Requests`?

The **`429 Too Many Requests`** status code indicates that the user has sent too many requests in a given amount of time—a practice known as **rate limiting**.

Servers use this status code to protect backend infrastructure, prevent abuse (such as brute-force login attacks or web scraping), and ensure fair resource distribution among API consumers.

---

### Key Characteristics & Best Practices

1. **The `Retry-After` Header:** A proper `429` response should always include a `Retry-After` header specifying how many seconds (or a specific timestamp) the client must wait before sending another request.
2. **Protection Against DoS:** It stops malicious or runaway frontend loops (like an infinite `useEffect` calling an API without dependencies) from crashing the server database.

---

### Practical Example: React & Node.js

Here is how a rate-limiting check looks on a Node.js backend and how a React frontend can handle the cooldown period gracefully.

#### 1. Node.js Backend (`429` & `Retry-After`)

```javascript
// A simple simulated rate limiter middleware
const requestCounts = {};

app.post("/api/login", (req, res) => {
  const ip = req.ip;
  const now = Date.now();

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, startTime: now };
  } else {
    requestCounts[ip].count++;
  }

  // If user makes more than 3 requests within 1 minute
  if (requestCounts[ip].count > 3) {
    res.setHeader("Retry-After", "60"); // Tell client to wait 60 seconds
    return res.status(429).json({
      error: "Too many login attempts. Please try again in 60 seconds.",
    });
  }

  // Normal login logic...
  res.status(200).json({ message: "Login successful" });
});
```

#### 2. React Frontend (`429` Cooldown Handling)

```jsx
import React, { useState } from "react";

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLockedOut, setIsLockedOut] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@example.com",
        password: "password123",
      }),
    });

    const data = await response.json();

    if (response.status === 429) {
      setIsLockedOut(true);
      const retryAfterSeconds = response.headers.get("Retry-After") || 60;
      setErrorMsg(`${data.error} (Wait ${retryAfterSeconds}s)`);

      // Optional: Start a countdown timer here before re-enabling form
      return;
    }

    if (!response.ok) {
      setErrorMsg(data.error || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <button type="submit" disabled={isLockedOut}>
        {isLockedOut ? "Locked Out" : "Log In"}
      </button>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </form>
  );
}
```

429 means the client has hit a rate limit. APIs may include a Retry-After header telling the client when to try again.

The frontend should slow down, disable repeated actions, show a helpful message, or schedule a retry only when appropriate.

### How Does `fetch()` Handle HTTP Errors?

The most common trap when using the native browser `fetch()` API is assuming it behaves like third-party libraries (like Axios) and automatically rejects promises on HTTP error codes. **It does not.**

- **Network-Level Failures Only:** `fetch()` only rejects the promise (triggers the `.catch()` block) if a catastrophic network failure occurs—such as a complete loss of internet connection, a DNS lookup failure, or a strict **CORS blocking** error.
- **HTTP Status Failures (`4xx` and `5xx`):** If the server successfully receives your request and responds with a status code like `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, or `500 Internal Server Error`, **`fetch()` considers this a successful network round-trip**. The promise resolves successfully, and `response.ok` will be set to `false`.

---

### Why This Leads to Silent Bugs

If you write a basic `fetch` call without checking `response.ok`, your code will happily proceed into the `.then()` block or the `try` block, treating an error page or a validation failure as valid data.

---

### Correct Pattern: Explicitly Checking `response.ok`

To handle HTTP errors correctly in React and JavaScript, you must explicitly inspect `response.ok` (which evaluates to `true` for status codes in the `200–299` range) and manually throw an error.

#### Practical Example: React & Node.js

```javascript
const updateUserProfile = async (formData) => {
  try {
    const response = await fetch("http://localhost:5000/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // 1. Parse the JSON body regardless of status (so we can read error messages from the backend)
    const data = await response.json();

    // 2. Explicitly check response.ok for 4xx / 5xx error statuses
    if (!response.ok) {
      // Throw an error with the message provided by the server (e.g., 400 or 409 error)
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    // 3. Handle success state
    console.log("Success:", data.message);
    return data.user;
  } catch (error) {
    // 4. This catches BOTH network errors (from .catch) AND our manually thrown HTTP errors
    console.error("Request failed:", error.message);
    setErrorMessage(error.message);
  }
};
```

### What Does `response.ok` Mean?

`response.ok` is a convenient boolean property on the JavaScript `Response` object returned by a `fetch()` request.

- It evaluates to **`true`** if the HTTP status code is in the successful **2xx range** (specifically from `200` to `299`, such as `200 OK`, `201 Created`, or `204 No Content`).
- It evaluates to **`false`** for any other status code, including **3xx redirects**, **4xx client errors** (`400`, `401`, `404`), and **5xx server errors** (`500`).

---

### Why Use It?

Because `fetch()` does **not** automatically throw an error on `4xx` or `5xx` responses, checking `response.ok` is your primary safety net to determine whether the server actually fulfilled your request before you attempt to process the returned data.

---

### Quick Example

```javascript
const response = await fetch("/api/user");

if (response.ok) {
  // Status is 200–299. Safe to parse data.
  const data = await response.json();
  console.log(data);
} else {
  // Status is outside 200–299 (e.g., 404, 500, etc.)
  console.error(`Request failed with status: ${response.status}`);
}
```

### HTTP Headers: Metadata, Types, and Browser Control

HTTP headers are key-value pairs passed along with HTTP requests and responses. They provide critical metadata—such as content format, authentication tokens, caching instructions, and security policies—allowing the client and server to negotiate how data is transferred.

---

### 1. Request Headers (Client to Server)

Sent by the browser or API client when initiating a request.

- **`Content-Type`:** Specifies the media type of the request body (e.g., `application/json`, `multipart/form-data`).
- **`Accept`:** Tells the server what media types the client is willing to receive back (e.g., `application/json`).
- **`Authorization`:** Carries credentials like a Bearer token or basic auth credentials for verifying identity.

### 2. Response Headers (Server to Client)

Sent back by the server alongside the status code and response body.

- **`Cache-Control`:** Directs how, for how long, and where responses can be cached (e.g., `max-age=3600`, `no-store`).
- **`ETag`:** A unique identifier ("entity tag") used for resource validation and conditional requests to optimize caching.
- **`Set-Cookie`:** Instructs the browser to store cookies securely (often configured with `HttpOnly`, `Secure`, and `SameSite` flags).
- **CORS Headers:** Control cross-origin security rules, such as `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials`.

---

### 3. JavaScript Safety: Browser-Controlled vs. Safe Headers

When writing frontend code using `fetch()` or `XMLHttpRequest`, you cannot modify every header freely. Browsers enforce strict security boundaries, categorizing headers into those you can safely set and those that are strictly **forbidden**.

#### Safe to Set from JavaScript:

You can freely define and append custom headers or standard content headers using the `fetch()` options object:

- `Content-Type`
- `Accept`
- `Authorization`
- Custom headers (e.g., `X-Requested-With`, `Idempotency-Key`)

#### Forbidden (Browser-Controlled) Request Headers:

If you attempt to programmatically set these headers via JavaScript, the browser will either throw a `TypeError` or silently drop them. This prevents malicious scripts from spoofing sensitive metadata or bypassing security controls:

- **`Host`** (Managed automatically based on the domain)
- **`Content-Length`** (Calculated dynamically by the browser based on body size)
- **`Cookie`** (Managed natively by the browser's cookie jar)
- **`Origin`** (Automatically injected by CORS mechanisms)
- **`Referer`** (Managed for privacy and security tracking)
- **`Sec-*` Headers** (Reserved browser metadata headers like `Sec-Fetch-Site` or `Sec-Fetch-Mode`)

### What is `Content-Type`?

The **`Content-Type`** header is a fundamental HTTP header used in both requests and responses to indicate the **media type (MIME type)** of the resource or payload being transmitted.

It acts as a label telling the receiver (whether that's a Node.js backend parsing a frontend request or a React app parsing a server response) exactly how to interpret and decode the raw bytes in the body.

---

### Common Media Types (`Content-Type`)

- **`application/json`:** The modern standard for REST APIs, used to transmit structured JSON objects.
- **`application/x-www-form-urlencoded`:** The default format for traditional HTML form submissions, where key-value pairs are URL-encoded (e.g., `name=John&age=30`).
- **`multipart/form-data`:** Used when uploading files or submitting complex forms containing binary data alongside text inputs.
- **`text/html`** or **`text/plain`:** Used for rendering raw HTML documents or plain text files.

---

### Why It Matters (The Consequence of Getting It Wrong)

If you send data from a React frontend with a JSON payload, but forget to set the `Content-Type: application/json` header:

1. **Backend Ignorance:** The Node.js server (using middleware like `express.json()`) will inspect the headers, see that it isn't labeled as JSON, and skip parsing it.
2. **Undefined Bodies:** `req.body` will evaluate to `undefined` or an empty object, causing your application logic to break or fail validation.

---

### Practical Example: React & Node.js

#### 1. React Frontend (Setting the Header)

```javascript
const sendData = async () => {
  await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Crucial label!
    },
    body: JSON.stringify({ name: "Alice", role: "developer" }),
  });
};
```

#### 2. Node.js Backend (Parsing Based on the Header)

```javascript
const express = require("express");
const app = express();

// This middleware checks for 'Content-Type: application/json'
// and parses the raw stream into a usable JavaScript object (req.body)
app.use(express.json());

app.post("/api/users", (req, res) => {
  console.log(req.body); // { name: 'Alice', role: 'developer' }
  res.status(201).json({ success: true });
});
```

### What is the `Accept` Header?

The **`Accept`** request header tells the server which media types (MIME types) the client is willing and able to process in the response.

While the `Content-Type` header describes the data you are **sending** to the server, the `Accept` header describes the data format you want back.

---

### Key Characteristics & Mechanics

1. **Content Negotiation:** It enables content negotiation, allowing a single API endpoint to return different formats (e.g., `application/json`, `application/xml`, or `text/csv`) depending on what the client requests.
2. **Quality Values (`q`):** Clients can send multiple formats weighted by preference using quality parameters. For example:
   `Accept: application/json, text/html;q=0.9` tells the server, _"I prefer JSON, but HTML is acceptable if JSON isn't available."_
3. **Modern Defaults:** In modern REST API development, most clients simply send `Accept: application/json` to make the contract explicit, though many servers will default to JSON anyway if the header is omitted.

---

### Practical Example: React & Node.js

#### 1. React Frontend (Specifying Expected Format)

```javascript
const fetchUserData = async () => {
  const response = await fetch("http://localhost:5000/api/users/1", {
    method: "GET",
    headers: {
      Accept: "application/json", // Explicitly stating: "I only know how to handle JSON"
    },
  });

  const data = await response.json();
  console.log(data);
};
```

#### 2. Node.js Backend (Responding to `Accept`)

```javascript
app.get("/api/users/:id", (req, res) => {
  const user = { id: 1, name: "Alice" };

  // Optional: Check what the client is willing to accept
  const acceptHeader = req.get("Accept");

  if (acceptHeader && acceptHeader.includes("application/xml")) {
    // Return XML if requested (hypothetical fallback)
    return res
      .status(200)
      .type("application/xml")
      .send("<user><id>1</id><name>Alice</name></user>");
  }

  // Default to JSON response
  res.status(200).json(user);
});
```

### Deep Dive: CORS (Cross-Origin Resource Sharing)

CORS is a security mechanism built into modern web browsers by the **Same-Origin Policy**. It prevents a malicious website loaded in your browser from reading sensitive data from another domain (e.g., if a malicious site tries to fetch data from your logged-in bank account).

---

### How CORS Works (The Mechanics)

1. **The Origin Definition:** An "origin" is a combination of protocol, domain, and port (e.g., `http://localhost:5173` vs `[https://api.example.com](https://api.example.com)`).
2. **Simple vs. Preflight Requests:**

- **Simple Requests:** Standard `GET` or `POST` requests with basic headers (`Content-Type: application/json`) are sent immediately. The browser checks the response headers to see if access is allowed.
- **Preflight Requests (`OPTIONS`):** If your request uses custom methods (`PUT`, `PATCH`, `DELETE`), custom headers (like `Authorization`), or includes credentials, the browser **automatically** fires an invisible `OPTIONS` request first to ask the server for permission. Only if the server approves does the actual request go through.

---

### Key CORS Response Headers

- **`Access-Control-Allow-Origin`:** Specifies which origins are allowed to read the response (e.g., `http://localhost:5173` or `*` for public APIs).
- **`Access-Control-Allow-Methods`:** Lists allowed HTTP methods (e.g., `GET, POST, PUT, PATCH, DELETE`).
- **`Access-Control-Allow-Headers`:** Lists allowed request headers (e.g., `Content-Type, Authorization`).
- **`Access-Control-Allow-Credentials`:** Set to `true` if the server allows cookies or authorization headers to be passed across domains.

---

### Practical Example: Fixing CORS in Node.js & React

#### 1. Node.js Backend Configuration (`server.js`)

Without the `cors` package, Express will reject cross-origin requests from your frontend development server.

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Configure CORS to allow your React app's origin and credentials
app.use(
  cors({
    origin: "http://localhost:5173", // Your React dev server URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required if sending cookies or authorization tokens
  }),
);

app.use(express.json());

app.get("/api/data", (req, res) => {
  res.json({ message: "CORS is properly configured!" });
});

app.listen(5000);
```

#### 2. React Frontend (`App.jsx`)

When configured correctly on the backend, the browser allows React to successfully parse the response:

```javascript
import React, { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/data", {
      credentials: "include", // Required if backend expects cookies/sessions
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("CORS or Network Error:", err));
  }, []);

  return <div>{message}</div>;
}
```

### What is a CORS Preflight Request?

A **CORS preflight request** is an automatic security check performed by the browser behind the scenes. Before sending a cross-origin request that could potentially modify data or use advanced features, the browser sends an **`OPTIONS`** request to the server to ask: _"Are you willing to accept this request?"_

---

### When Does the Browser Trigger a Preflight?

The browser will skip the preflight for "simple requests" (like a standard `GET` or basic `POST` with standard form content types), but it **will** trigger a preflight whenever a request involves any of the following:

1. **Mutating or Custom Methods:** Using methods other than `GET`, `POST`, or `HEAD`—such as `PUT`, `PATCH`, or `DELETE`.
2. **Custom Headers:** Including headers not on the browser's safe list, such as a custom `Authorization` token header or an `Idempotency-Key`.
3. **Non-Simple `Content-Type`:** Sending data formats other than basic form types, such as `application/json`.
4. **Credentials:** Using flags like `credentials: 'include'` in your `fetch()` configuration.

---

### How the Preflight Exchange Works (Step-by-Step)

1. **The Preflight (`OPTIONS`):**
   The browser sends an `OPTIONS` request to the target server containing inspection headers:

- `Access-Control-Request-Method: PUT` (Asking if PUT is allowed)
- `Access-Control-Request-Headers: Content-Type, Authorization` (Asking if these headers are allowed)

2. **The Server Approval:**
   The server checks its CORS configuration and responds with permissions:

- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET, PUT, DELETE`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

3. **The Actual Request:**
   Only if the server's response matches the client's intent does the browser proceed to send the _actual_ `PUT` or `DELETE` request. If the server fails to respond correctly or blocks it, the actual request is cancelled, and a CORS error appears in your console.

### Authentication in REST APIs: Sessions vs. Tokens

Because HTTP is a **stateless protocol** (meaning the server treats every incoming request as brand-new and forgets who sent the previous one), REST APIs rely on authentication mechanisms to verify client identity across multiple requests.

The two dominant approaches are **Cookie-based sessions** and **Token-based authentication (Bearer tokens)**.

---

### 1. Cookie-Based Authentication (Server Sessions)

In this traditional model, the user logs in, and the server creates a server-side session and responds by setting a cookie in the browser.

- **How it works:** The browser automatically attaches the cookie to every subsequent request using the `Cookie` header.
- **Security Highlight (`HttpOnly`):** Cookies can be marked as **`HttpOnly`**, which means JavaScript running in the browser (like your React app) **cannot read or write them**. This completely protects session tokens from being stolen by cross-site scripting (XSS) attacks.

#### Practical Example: Cookie Auth in React & Node.js

- **Node.js Backend (Setting an `HttpOnly` Cookie):**

```javascript
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.post("/api/login", (res, req) => {
  // Authenticate user credentials...
  const sessionId = "sess_abc123";

  res.cookie("sessionId", sessionId, {
    httpOnly: true, // Prevents JS access (XSS defense)
    secure: true, // Requires HTTPS in production
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged in successfully" });
});
```

- **React Frontend (Automatic Inclusion via `credentials: 'include'`):**

```javascript
const fetchDashboard = async () => {
  // The browser automatically attaches the cookie; we just need to enable credentials
  const response = await fetch("http://localhost:5000/api/dashboard", {
    credentials: "include",
  });
  const data = await response.json();
  console.log(data);
};
```

---

### 2. Token-Based Authentication (Bearer Tokens / JWT)

In this stateless model (often using JSON Web Tokens or JWTs), the server validates the user's credentials and returns a signed token string.

- **How it works:** The frontend stores this token and manually attaches it to every request inside the `Authorization` header using the `Bearer` scheme.
- **Storage Trade-offs:** If stored in `localStorage` or `sessionStorage`, JavaScript can read it, making it vulnerable to XSS attacks if the app contains malicious scripts or third-party dependencies.

#### Practical Example: Bearer Token Auth in React & Node.js

- **Node.js Backend (Verifying the `Authorization` Header):**

```javascript
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token after "Bearer"

  if (!token) return res.status(401).json({ error: "Access token missing" });

  // Verify JWT or token validity...
  if (token !== "valid_secret_token_123") {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  next();
};

app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({ secretData: "Welcome to the protected dashboard!" });
});
```

- **React Frontend (Manually Attaching the Header):**

```javascript
const fetchProtectedData = async () => {
  const token = localStorage.getItem("authToken"); // Retrieved from local storage

  const response = await fetch("http://localhost:5000/api/protected", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Manually attaching the token
    },
  });

  const data = await response.json();
  console.log(data);
};
```

What is the difference between cookies and bearer tokens?
Cookies are sent automatically on same-origin browser requests. For cross-origin fetch() calls, the request also needs the right credentials option, cookie attributes, and CORS response headers.

Bearer tokens are sent manually in an Authorization: Bearer ... header. They are flexible for APIs, but frontend storage choices matter because XSS can steal tokens available to JavaScript

You have nailed the operational difference. To expand slightly on that summary, the choice between cookies and bearer tokens ultimately boils down to a classic web security trade-off: **XSS (Cross-Site Scripting) versus CSRF (Cross-Site Request Forgery)**.

---

### The Security Trade-off: Cookies vs. Bearer Tokens

| Feature               | Cookies (`HttpOnly`)                                                                 | Bearer Tokens (`localStorage`)                                                  |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **How it's sent**     | Automatically by the browser.                                                        | Manually attached via `Authorization` header.                                   |
| **Primary Risk**      | **CSRF** (Malicious sites trick the browser into sending requests with your cookie). | **XSS** (Injected JavaScript steals tokens stored in `localStorage`).           |
| **Defense Mechanism** | `SameSite=Strict` or `Lax` flags, plus CSRF tokens.                                  | Content Security Policy (CSP), sanitizing inputs, avoiding XSS vulnerabilities. |
| **Best Suited For**   | Traditional browser-based Single Page Applications (SPAs) and server-rendered apps.  | Mobile apps, multi-client APIs, public APIs, and microservices.                 |

---

### Key Takeaways for Frontend Developers

1. **Cookies are browser-native:** They rely on the browser's cookie jar to manage state, making them ideal for web apps where you want maximum protection against script theft (`HttpOnly`).
2. **Tokens are client-managed:** Storing tokens in `localStorage` gives your frontend code total control over how and when they are attached, but it puts the burden of defending against XSS entirely on your application security practices.

**What is pagination?**
Pagination splits large lists into smaller responses. Page-based pagination uses page and limit. Cursor-based pagination uses a pointer such as nextCursor.

Cursor pagination fits feeds and frequently changing data because it avoids missing or duplicating items when records are inserted between page requests.

Frontend behavior to mention: Keep previous items while loading more, prevent duplicate "load more" clicks, handle the end of the list, and make refresh behavior explicit.

### Deep Dive: Pagination in REST APIs

Pagination is the practice of splitting large datasets into smaller, manageable chunks (pages or batches) rather than dumping thousands of records into a single response. This improves server performance, reduces database load, and accelerates network transfer times for the frontend.

---

### Page-Based vs. Cursor-Based Pagination

| Strategy | How it Works | Pros | Cons / Pitfalls |
| -------- | ------------ | ---- | --------------- |

| **Page-Based**<br>

<br>(`page` & `limit`) | Client requests a specific page number and item count (e.g., `?page=2&limit=10`). | Easy to implement; allows users to jump directly to any page (e.g., page 50). | **Data Drift / Slips:** If items are added or deleted while browsing, records can be skipped or duplicated across pages. Slow performance on deep offsets (`OFFSET 10000`). |
| **Cursor-Based**<br>

<br>(`cursor` / `nextCursor`) | Uses an opaque pointer (like a timestamp, ID, or encoded string) marking the last seen item (e.g., `?cursor=eyJpZCI6NDV9&limit=10`). | Extremely fast; scales efficiently; immune to data drift (perfect for live feeds). | Cannot jump directly to an arbitrary page number (only supports sequential "Next/Previous" navigation). |

---

### Practical Example: Cursor-Based Pagination in React & Node.js

Cursor pagination is the gold standard for social media feeds or infinite-scroll lists because it guarantees consistency even when new records are inserted in real time.

#### 1. Node.js Backend (`Cursor-Based`)

```javascript
app.get("/api/posts", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor; // Typically a base64 encoded string or ID/timestamp

  let query = db.collection("posts").orderBy("createdAt", "desc");

  if (cursor) {
    // Start fetching AFTER the item referenced by the cursor
    const decodedCursor = JSON.parse(
      Buffer.from(cursor, "base64").toString("utf-8"),
    );
    query = query.startAfter(decodedCursor.createdAt);
  }

  const posts = query.limit(limit + 1).get(); // Fetch one extra to check if there's a next page

  let hasMore = false;
  if (posts.length > limit) {
    hasMore = true;
    posts.pop(); // Remove the extra check item
  }

  const lastPost = posts[posts.length - 1];
  const nextCursor = lastPost
    ? Buffer.from(JSON.stringify({ createdAt: lastPost.createdAt })).toString(
        "base64",
      )
    : null;

  res.status(200).json({ posts, nextCursor, hasMore });
});
```

#### 2. React Frontend (`Load More` Pattern)

```jsx
import React, { useState, useEffect } from "react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async (currentCursor = null) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const url = currentCursor
        ? `http://localhost:5000/api/posts?limit=10&cursor=${currentCursor}`
        : "http://localhost:5000/api/posts?limit=10";

      const response = await fetch(url);
      const data = await response.json();

      // Keep previous items and append new ones
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Initial load
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}

      {hasMore ? (
        <button onClick={() => fetchPosts(cursor)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More"}
        </button>
      ) : (
        <p>You have reached the end of the list.</p>
      )}
    </div>
  );
}
```

---

### Crucial Frontend Behaviors for Pagination

1. **State Preservation:** Always append or merge new items with existing state (`[...prevItems, ...newItems]`) rather than overwriting the array, ensuring users don't lose previously scrolled content.
2. **Duplicate Click Protection (`isLoading` guards):** Disable "Load More" buttons or throttle infinite-scroll intersection observers while a request is in flight to prevent accidental double-fetches and race conditions.
3. **End-of-List States:** Gracefully clear loading spinners and display a friendly message (e.g., _"You're all caught up!"_) once the API signals `hasMore: false`.
4. **Explicit Refresh Handling:** Pull-to-refresh or explicit refresh actions should reset the cursor back to `null` and clear the current array to fetch the absolute latest top-of-feed data.

---

Would you like to explore how to implement **infinite scrolling** using the Intersection Observer API alongside cursor-based pagination?

What is filtering and sorting in a REST API?
Filtering narrows the result set, and sorting controls order. A frontend might call:

GET /products?category=shoes&sort=price_asc
Keep query parameter names stable and predictable. The UI should encode user choices into the URL when those choices are shareable.

### Deep Dive: Filtering and Sorting in REST APIs

When dealing with large collections of data (like products, users, or transactions), fetching every record is inefficient and overwhelming for users. **Filtering** and **sorting** allow clients to query specific subsets of data in a precise, orderly fashion using **query parameters** appended to the URL path.

---

### 1. Filtering (Narrowing the Dataset)

Filtering restricts the results returned by the API based on specific criteria or attributes.

- **Simple Equality:** `GET /api/products?category=shoes`
- **Multiple Filters:** `GET /api/products?category=shoes&brand=nike&inStock=true`
- **Range Filters:** `GET /api/products?price_gte=50&price_lte=200` (Greater than or equal to, less than or equal to).

### 2. Sorting (Controlling the Order)

Sorting determines the sequence in which the results are presented.

- **Ascending/Descending Conventions:**
- Explicit suffix: `?sort=price_asc` or `?sort=price_desc`
- Prefix convention: `?sort=price` (default asc) vs `?sort=-price` (descending via minus sign)
- Separate parameters: `?sortBy=price&sortOrder=asc`

---

### Practical Example: React & Node.js Implementation

#### 1. Node.js Backend (Parsing Filters and Sorting)

```javascript
app.get("/api/products", (req, res) => {
  let { category, brand, sort, limit = 10, page = 1 } = req.query;

  // Mock database query builder
  let query = database.products;

  // 1. Apply Filtering
  if (category) {
    query = query.filter((p) => p.category === category);
  }
  if (brand) {
    query = query.filter((p) => p.brand === brand);
  }

  // 2. Apply Sorting
  if (sort) {
    query.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }

  // 3. Apply Pagination
  const startIndex = (page - 1) * limit;
  const paginatedResult = query.slice(startIndex, startIndex + parseInt(limit));

  res.status(200).json({
    total: query.length,
    page: parseInt(page),
    data: paginatedResult,
  });
});
```

#### 2. React Frontend (Syncing Filters with URL Search Params)

```jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  // Read current filters directly from URL (URL as the source of truth)
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      // Build query string dynamically from URL search params
      const response = `http://localhost:5000/api/products?${searchParams.toString()}`;
      const res = await fetch(response);
      const data = await res.json();
      setProducts(data.data);
    };

    fetchFilteredProducts();
  }, [searchParams]);

  // Update URL parameters when user interacts with UI controls
  const handleCategoryChange = (newCategory) => {
    setSearchParams((prev) => {
      prev.set("category", newCategory);
      prev.set("page", "1"); // Reset to page 1 on filter change
      return prev;
    });
  };

  const handleSortChange = (newSort) => {
    setSearchParams((prev) => {
      prev.set("sort", newSort);
      return prev;
    });
  };

  return (
    <div>
      {/* UI Controls */}
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="shoes">Shoes</option>
        <option value="electronics">Electronics</option>
      </select>

      <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>

      {/* Product List */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id}>
            <h4>{p.name}</h4>
            <p>${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Crucial Frontend Best Practices

1. **The URL as the Source of Truth:** Encode user choices (filters, sort orders, page numbers) directly into URL query parameters using tools like React Router's `useSearchParams`. This ensures states are fully **shareable, bookmarkable, and persist across page reloads or browser back/forward navigation**.
2. **Stable Parameter Naming:** Keep query parameter names clean, predictable, and uniform across your application (e.g., consistently using `category` or `status` rather than mixing terms like `cat` or `filter_category`).
3. **Debouncing Text Filters:** If you provide a search input textbox alongside your filters, ensure you **debounce** user keystrokes (e.g., wait 300ms after the user stops typing) before updating the URL search params to prevent flooding the API with requests on every single character change.

### What is API Versioning?

API versioning is a practice used by backend developers to modify, update, or restructure an API contract (such as changing response data structures, modifying endpoint paths, or deprecating fields) **without breaking existing client applications** (like mobile apps, third-party integrations, or older versions of a frontend web app).

Because different clients upgrade at different rates, versioning allows multiple iterations of an API to live side by side on the server.

---

### Common API Versioning Strategies

1. **URI Path Versioning (Most Common & Visible):**

- The version number is embedded directly into the URL path.
- _Example:_ `GET /api/v1/products` vs `GET /api/v2/products`
- _Pros:_ Extremely explicit, easy to test in a browser or tool like Postman, and simple to route on the server.

2. **Header Versioning (Custom Request Headers):**

- The client passes a custom header specifying the desired version.
- _Example:_ `Accept: application/vnd.mycompany.v2+json`
- _Pros:_ Keeps URLs clean and adheres strictly to RESTful resource identification principles.
- _Cons:_ Harder to test quickly in a standard browser tab.

3. **Query Parameter Versioning:**

- Passed as a query flag.
- _Example:_ `GET /api/products?version=2`
- _Cons:_ Rarely used for major breaking changes; more commonly used for minor feature toggles.

---

### Practical Example: Node.js Backend & React Frontend

#### 1. Node.js Backend (Supporting Multiple Versions)

```javascript
const express = require("express");
const app = express();

// Version 1 router (Legacy format)
const v1Router = express.Router();
v1Router.get("/products", (req, res) => {
  res.json([{ id: 1, name: "Shoes", price: 50 }]); // Old flat structure
});

// Version 2 router (Updated format with nested currency/metadata)
const v2Router = express.Router();
v2Router.get("/products", (req, res) => {
  res.json([{ id: 1, name: "Shoes", price: { amount: 50, currency: "USD" } }]);
});

// Mount routes under explicit prefixes
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

app.listen(5000);
```

#### 2. React Frontend (Targeting a Specific Version)

```javascript
const fetchProducts = async () => {
  // Explicitly calling v2 of the API endpoint
  const response = await fetch("http://localhost:5000/api/v2/products");
  const products = await response.json();

  // Safe to parse using the v2 structure (e.g., products[0].price.amount)
  setProductList(products);
};
```

---

### Crucial Frontend Considerations

1. **Explicit Endpoints:** Always configure your base API client (like an Axios instance or a custom `fetch` wrapper) to explicitly point to the required version path so updates don't happen implicitly.
2. **Migration & Deprecation Windows:** Before adopting a new version (e.g., migrating from `v1` to `v2`), confirm the backend team's **sunset policy**—how long old versions will remain active and supported before being permanently shut down.
3. **Handling Breaking Changes:** When a new version alters a data contract, ensure your frontend TypeScript types or validation schemas are updated simultaneously to prevent runtime crashes (e.g., trying to read a property from a rearranged object tree).

### Deep Dive: HTTP Caching

HTTP caching is a mechanism where web browsers, intermediate proxy servers, or CDNs (Content Delivery Networks) store copies of server responses. When a client requests the same resource again, the cache serves the saved copy instantly instead of forcing the server to process a brand-new request from scratch.

---

### Key Caching Mechanisms & Headers

1. **`Cache-Control` (The Directives):**
   The most important header for controlling how and where responses are cached.

- `max-age=seconds`: Specifies how long (in seconds) the response is considered fresh.
- `no-store`: Tells all caches (browser and CDN) **never** to store a copy of the response (vital for sensitive user data).
- `no-cache`: Forces the cache to revalidate with the server using a conditional request _every single time_ before using the cached copy.

2. **`ETag` and Validation (The Fingerprints):**
   Instead of downloading a massive payload again, the server can attach an `ETag` (Entity Tag)—a unique hash or string representing the current version of the data (e.g., `ETag: "33a64df5"`).
3. **Conditional Requests (`If-None-Match`):**
   When the cached response expires, the browser sends a new request containing the stored ETag in an `If-None-Match` header.

- If the data hasn't changed, the server responds with a **`304 Not Modified`** status code with **no body**, telling the browser, _"Keep using your cached copy."_ This saves massive amounts of bandwidth.

---

### Practical Example: Node.js Backend with ETag Validation

```javascript
const crypto = require("crypto");

app.get("/api/profile", (req, res) => {
  const userProfile = { id: 1, name: "Alice", updated_at: "2026-07-22" };

  // Generate a unique ETag based on the data string
  const jsonString = JSON.stringify(userProfile);
  const etag = crypto.createHash("md5").update(jsonString).digest("hex");

  // Check if the client sent an If-None-Match header matching our current ETag
  if (req.headers["if-none-match"] === etag) {
    // Data hasn't changed! Return 304 with an empty body
    return res.status(304).send();
  }

  // Otherwise, set the ETag header and return the full payload with 200 OK
  res.setHeader("ETag", etag);
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
  res.status(200).json(userProfile);
});
```

---

### Crucial Frontend Takeaways & Stale UI Bugs

1. **Where Caching Lives:** Caching can happen at multiple layers—the browser memory, service workers, client data frameworks (like React Query or Redux Toolkit Query cache layers), and edge CDNs (like Cloudflare).
2. **The Stale UI Bug Trap:** Many mysterious frontend bugs where users see outdated data (or mutations that don't immediately reflect on screen) stem from **fighting the cache layer** (e.g., a local query cache holding onto old data while the backend successfully updated).
3. **Smart Data Fetching:** Modern frontend tools manage these caches automatically, but understanding headers like `Cache-Control` and `ETag` ensures your APIs and clients cooperate efficiently without serving stale data.

### How `ETag` and `304 Not Modified` Work Together

`ETag` (Entity Tag) and `304 Not Modified` form a powerful duo for **conditional requests**, allowing browsers and servers to validate cached data without repeatedly downloading the exact same payload.

---

### The Request-Response Lifecycle

1. **The Initial Request (`200 OK`):**

- The client requests a resource.
- The server responds with the data and attaches a unique fingerprint header, such as `ETag: "v1.0.0-abc123"` (often a hash of the file content or database record version).
- The browser stores both the response body and the ETag in its local cache.

2. **The Subsequent Request (Conditional):**

- When the client needs the same resource again (e.g., page reload or component re-render), it sends a new request.
- Instead of just asking for the data, the browser looks up the stored ETag and attaches it to an **`If-None-Match`** request header:

```http
GET /api/profile HTTP/1.1
If-None-Match: "v1.0.0-abc123"

```

3. **The Validation & `304` Response:**

- The server checks the incoming `If-None-Match` value against the resource's _current_ state.
- **If nothing has changed:** The server skips generating the heavy response body and replies with a **`304 Not Modified`** status code and **zero body content**.
- **If it has changed:** The server responds normally with a `200 OK` and the fresh data alongside a new ETag.

---

### Key Benefits

- **Massive Bandwidth Savings:** Since a `304` response contains an empty body, network transfer size drops close to zero for unchanged assets.
- **Reduced Server Load:** The backend avoids costly database queries or heavy rendering processes when cached assets are still completely fresh and valid.

### Comprehensive Frontend API Error Handling Strategy

Effectively managing API errors on the frontend is the cornerstone of building resilient, user-friendly web applications. Instead of treating all errors as generic failures, a mature frontend architecture categorizes errors by their HTTP status codes and responds with precise, contextual user interfaces.

---

### The Error Response Map

| Status Code       | Error Category   | Recommended UI Action & User Experience                                                                                    |
| ----------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **`400` / `422**` | Validation Error | Parse the response body for field-specific error messages and display them directly next to the corresponding form inputs. |
| **`401`**         | Unauthenticated  | Clear local user session/tokens and automatically redirect the user to the login screen with a return path.                |
| **`403`**         | Forbidden        | Explain that the user lacks the required permissions, or gracefully hide/disable the restricted UI action.                 |
| **`404`**         | Not Found        | Render a dedicated "Not Found" state, empty view, or a helpful fallback message.                                           |
| **`409`**         | Conflict         | Prompt the user to refresh their view, choose a unique value (e.g., username/email), or resolve concurrent edits.          |
| **`429`**         | Rate Limited     | Implement back-off logic, respect the `Retry-After` header, slow down automated retries, and display a cooldown message.   |
| **`500` Series**  | Server Error     | Display a friendly fallback UI with a **"Retry"** button while logging the context safely behind the scenes.               |

---

### Core Principles for Frontend Error Handling

1. **Never Expose Raw Stack Traces:**
   Displaying raw backend stack traces or database errors looks unprofessional and introduces severe security risks by leaking internal server architecture. Always show human-readable fallback messages.
2. **Contextual Logging:**
   While users get clean UI notifications, your frontend logging service (e.g., Sentry, Datadog) should capture rich debugging metadata—including the **request endpoint**, **HTTP status code**, **timestamp**, and any **request IDs** returned by the server headers.
3. **Graceful Degradation:**
   Ensure that a failed non-critical request (like fetching widget analytics or user avatar updates) does not crash the entire application layout. Use React Error Boundaries or isolated component-level error states to contain failures gracefully.

### Practical Frontend Error Handling Example (React)

Here is a complete React component implementing a centralized error-handling strategy that maps backend HTTP status codes to user-friendly UI feedback, automatic redirections, and safe debugging logs.

---

### React Component Implementation

```jsx
import React, { useState } from "react";

export default function UserProfileForm() {
  const [username, setUsername] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous states
    setFieldErrors({});
    setGlobalError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      // 1. Handle Successful Response (2xx)
      if (response.ok) {
        alert("Profile updated successfully!");
        return;
      }

      // 2. Categorize and Handle Errors by Status Code
      switch (response.status) {
        case 400:
        case 422:
          // Field-level validation errors (e.g., { errors: { username: "Too short" } })
          setFieldErrors(data.errors || { general: data.message });
          break;

        case 401:
          // Unauthenticated: Clear session and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login?session=expired";
          break;

        case 403:
          // Forbidden: Explain missing permissions
          setGlobalError(
            "Access Denied: You do not have administrator permissions.",
          );
          break;

        case 404:
          // Not Found
          setGlobalError("The requested user profile no longer exists.");
          break;

        case 409:
          // Conflict: e.g., Username already taken
          setFieldErrors({
            username: data.error || "This username is already taken.",
          });
          break;

        case 429:
          // Rate Limited: Respect Retry-After header
          const retryAfter = response.headers.get("Retry-After") || 60;
          setGlobalError(
            `Too many attempts. Please try again in ${retryAfter} seconds.`,
          );
          break;

        case 500:
        default:
          // Server Error: Friendly message + Safe background logging
          setGlobalError(
            "Something went wrong on our servers. Please try again later.",
          );

          console.error({
            level: "error",
            message: "Unhandled server error",
            endpoint: "/api/profile",
            status: response.status,
            requestId: response.headers.get("X-Request-ID"),
            timestamp: new Date().toISOString(),
          });
          break;
      }
    } catch (networkError) {
      // 3. Network-level Failures (Offline, DNS issues, CORS blocking)
      setGlobalError(
        "Network connection lost. Please check your internet connection.",
      );
      console.error("[Network Error]", networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Update Profile</h2>

      {/* Global / Banner Error Message */}
      {globalError && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          {globalError}
        </div>
      )}

      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Field-level Validation Error */}
        {fieldErrors.username && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>
            {fieldErrors.username}
          </p>
        )}
      </div>

      <button type="submit" disabled={isLoading} style={{ marginTop: "10px" }}>
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
```

### The Anatomy of a Frontend-Friendly API Contract

A truly **frontend-friendly API contract** bridges the gap between backend data models and user interface requirements, drastically reducing client-side complexity, bug rates, and unnecessary network chatter.

---

### Core Pillars of a Great API Contract

- **Predictable Error Shapes:** Every error response across the entire API should follow a uniform structure (e.g., `{ error: { code, message, fields: {} } }`), allowing the frontend to build a single, centralized error-handling interceptor.
- **Consistent Naming Conventions:** Sticking strictly to uniform casing (such as camelCase across JSON payloads and URL paths) prevents developer friction and mapping errors.
- **Rich Mutation Responses:** After a `POST`, `PUT`, or `PATCH` request, the server should ideally return the **fully updated resource** (complete with server-generated IDs, timestamps, and relational fields) rather than just a generic `204 No Content` or boolean. This allows the frontend to instantly update its local state without triggering an extra `GET` request.
- **Explicit Nullability & Types:** Documenting which fields can be `null` or missing prevents runtime `TypeError: Cannot read properties of undefined` crashes in UI components.
- **Payload Efficiency:** Providing enough related data in a single response to render a view avoids the dreaded N+1 frontend fetch problem (where a component has to fire dozens of secondary requests just to render a single list item).

---

### The Ultimate Interview Question

> **"Can I assume this endpoint returns the updated resource after mutation, or should the client refetch?"**

Asking this question demonstrates immediate architectural maturity. It clarifies state-management expectations, eliminates ambiguity around optimistic updates versus server synchronization, and prevents entire classes of stale UI bugs before a single line of code is written.

### Common Frontend API Mistakes Made by Freshers (With Examples)

Building a robust frontend that communicates with REST APIs takes practice. Junior developers often fall into common architectural and security traps when handling network requests.

---

### 1. Treating Every Failed Response as a Rejected `Fetch()`

- **The Mistake:** Writing code that assumes a `400 Bad Request` or `500 Server Error` will automatically jump into the `catch` block. Because `fetch()` only rejects on network failures (like being offline), freshers often miss server-side error states completely.
- **The Fix:** Always check `response.ok` or inspect `response.status` before attempting to parse the success body.

**Bad Example:**

```javascript
try {
  // If the server returns 400 Bad Request, fetch() still considers this a "success" round-trip!
  const response = await fetch("/api/user", { method: "POST", body: data });
  const result = await response.json();
  setIsSuccess(true); // Bug: UI tells user success even when API returned a 400!
} catch (error) {
  console.error(error); // This block is NEVER reached on a 400 error.
}
```

---

### 2. Sending Sensitive Data in Query Strings (`GET` Parameters)

- **The Mistake:** Passing passwords, tokens, or personal identifiable information (PII) inside URL query parameters (e.g., `/api/login?password=secret123`).
- **The Fix:** Query strings are visible in browser history, server access logs, proxy logs, and shared links. Always send sensitive credentials or payloads inside the secure **request body** (using `POST` or `PUT`) or via headers.

**Bad Example:**

```javascript
// Security Risk: Password is exposed in browser history and server access logs!
await fetch(`/api/login?email=user@test.com&password=mySecretPassword`);
```

---

### 3. Using `GET` Requests for Mutations

- **The Mistake:** Triggering state-changing operations (like deleting a user, updating a setting, or transferring money) using a `GET` request because it's "easier to write."
- **The Fix:** According to HTTP specifications, `GET` requests must be **safe and idempotent**—meaning they should only retrieve data and never alter server state. Preload fetchers, web crawlers, or browser pre-fetching can accidentally trigger `GET` routes, leading to catastrophic unintended actions (like deleting records on page preload).

**Bad Example:**

```javascript
// Danger: A simple link pre-fetcher or browser extension could accidentally delete a user!
const handleDelete = () => {
  fetch("http://localhost:5000/api/users/delete?id=42"); // Wrong method! Should be DELETE with body/params
};
```

---

### 4. Showing One Generic Error for Every Status

- **The Mistake:** Displaying a single generic popup box like _"Something went wrong"_ for every single error, whether it's a validation error, an expired session, or a rate limit.
- **The Fix:** Map your UI feedback to the specific context of the error (e.g., highlighting form fields for `400`, redirecting to login for `401`, or showing a cooldown timer for `429`).

**Bad Example:**

```javascript
// Lazy error handling: Treating a validation error the same as a server crash
if (!response.ok) {
  alert("Something went wrong!"); // User has no idea if their password was too short or if the server crashed.
}
```

### Profile Settings Page: Full-Stack Contract & Design

This design outlines the complete API contract and frontend implementation for a profile settings page, ensuring robust error handling, state preservation, and smooth UX.

---

### 1. API Contract Definition

#### **GET /api/me** (Load Profile)

- **Response (`200 OK`):**

```json
{
  "displayName": "Jane Doe",
  "timezone": "America/New_York",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

- **Error Responses:** `401 Unauthorized` (Session missing or expired).

#### **PATCH /api/me** (Update Profile)

- **Request Body:**

```json
{
  "displayName": "Jane Smith",
  "timezone": "Europe/London",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

- **Response (`200 OK`):** Returns the fully updated resource so the frontend syncs instantly without extra fetching.

```json
{
  "displayName": "Jane Smith",
  "timezone": "Europe/London",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

- **Error Responses:**
- `400 / 422`: Validation error (`{ "errors": { "displayName": "Too short", "timezone": "Invalid timezone" } }`)
- `401`: Session expired (`{ "error": "Session expired" }`)
- `409`: Conflict (`{ "errors": { "displayName": "This display name is already taken." } }`)

---

### 2. Node.js Backend Implementation (Express)

```javascript
const express = require("express");
const router = express.Router();

// Mock database store
let userProfile = {
  displayName: "Jane Doe",
  timezone: "America/New_York",
  avatarUrl: "https://example.com/avatar.jpg",
};

// GET /api/me
router.get("/me", (req, res) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({ error: "Session expired" });
  }
  res.status(200).json(userProfile);
});

// PATCH /api/me
router.patch("/me", (req, res) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({ error: "Session expired" });
  }

  const { displayName, timezone, avatarUrl } = req.body;

  // Validate fields (400/422)
  if (displayName && displayName.length < 2) {
    return res.status(422).json({
      errors: {
        displayName: "Display name must be at least 2 characters long.",
      },
    });
  }

  // Conflict check (409)
  if (displayName === "TakenName") {
    return res.status(409).json({
      errors: { displayName: "This display name is already taken." },
    });
  }

  // Update record
  if (displayName) userProfile.displayName = displayName;
  if (timezone) userProfile.timezone = timezone;
  if (avatarUrl) userProfile.avatarUrl = avatarUrl;

  res.status(200).json(userProfile);
});
```

---

### 3. React Frontend Implementation

```jsx
import React, { useState, useEffect } from "react";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    displayName: "",
    timezone: "",
    avatarUrl: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 1. Load initial profile data
  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setFormData(data);
      })
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Preserves edited values in local state while typing
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError("");
    setSuccessMsg("");
    setIsSaving(true); // Disable submit while saving

    try {
      const response = await fetch("http://localhost:5000/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(data); // Sync with updated server state
        setSuccessMsg("Profile updated successfully!");
        return;
      }

      // Handle specific error codes
      switch (response.status) {
        case 400:
        case 422:
        case 409:
          // Preserves edited values in inputs; maps errors directly to fields
          setFieldErrors(data.errors || { general: data.error });
          break;
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        default:
          setGlobalError("Something went wrong. Please try again.");
          break;
      }
    } catch (error) {
      setGlobalError("Network error. Please check your connection.");
    } finally {
      setIsSaving(false); // Re-enable submit
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Profile Settings</h2>

      {globalError && (
        <div style={{ color: "red", marginBottom: "10px" }}>{globalError}</div>
      )}
      {successMsg && (
        <div style={{ color: "green", marginBottom: "10px" }}>{successMsg}</div>
      )}

      <div>
        <label>Display Name:</label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
        />
        {fieldErrors.displayName && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>
            {fieldErrors.displayName}
          </p>
        )}
      </div>

      <div>
        <label>Timezone:</label>
        <input
          type="text"
          name="timezone"
          value={formData.timezone}
          onChange={handleChange}
        />
        {fieldErrors.timezone && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>
            {fieldErrors.timezone}
          </p>
        )}
      </div>

      <div>
        <label>Avatar URL:</label>
        <input
          type="text"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
        />
        {fieldErrors.avatarUrl && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>
            {fieldErrors.avatarUrl}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSaving} style={{ marginTop: "15px" }}>
        {isSaving ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}
```

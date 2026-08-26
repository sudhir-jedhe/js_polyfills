**Session Tokens** (stateful) and **JSON Web Tokens (JWTs)** (stateless) are the two primary mechanisms used to maintain user authentication across HTTP requests.

---

### 1. Traditional Session Tokens (Stateful Authentication)

A session token is an opaque, random string (e.g., `sess_9f83a2...`) that contains no data on its own. It acts solely as a database lookup pointer.

```
Client                                      Server                            Database / Redis
  │                                           │                                      │
  ├── 1. POST /login (credentials) ──────────▶│                                      │
  │                                           ├── 2. Generate session ID ───────────▶│ (Store session data)
  │◀── 3. Set-Cookie: session_id=abc ─────────┤                                      │
  │                                           │                                      │
  ├── 4. GET /profile (Cookie: session_id) ──▶│                                      │
  │                                           ├── 5. Lookup session "abc" ──────────▶│ (Verify active & fetch user)
  │◀── 6. 200 OK (User Data) ─────────────────┤◀── 6. Return session data ───────────┘

```

* **How it works:** The server generates a random ID, stores the session data in a central store (like Redis or PostgreSQL), and sends the ID to the client inside an `HttpOnly`, `Secure` cookie.
* **Verification:** On every request, the server reads the cookie and queries the database to verify if the session is valid and who it belongs to.
* **Instant Revocation:** Logging out or banning a user is immediate—the server simply deletes the record from the database.

---

### 2. JWT Tokens (Stateless Authentication)

A JWT is a cryptographically signed, self-contained JSON string containing user claims. It is split into three Base64URL-encoded parts: `Header.Payload.Signature`.

```
Client                                      Server
  │                                           │
  ├── 1. POST /login (credentials) ──────────▶│
  │                                           ├── 2. Generate JWT & sign with SECRET
  │◀── 3. Return JWT (Bearer token / Cookie) ─┤   (No database write needed)
  │                                           │
  ├── 4. GET /profile (Header: Bearer <jwt>) ─▶│
  │                                           ├── 5. Verify cryptographic signature
  │◀── 6. 200 OK (User Data) ─────────────────┤   (Extract userId directly from payload)

```

* **How it works:** The server signs the user’s identity (e.g., `sub: "user_123"`, `role: "admin"`) using a secret key or private/public key pair (HMAC / RSA).
* **Verification:** The server verifies the cryptographic signature mathematically. If the signature matches, the server trusts the data inside the payload without hitting a database.
* **Revocation Challenge:** Because the server does not check a database, a stolen or invalidated JWT remains valid until its expiration timestamp (`exp`) passes.

---

### Direct Comparison

| Feature                       | Session Tokens (Stateful)                                     | JWT Tokens (Stateless)                                                     |
| ----------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **State Storage**             | Server-side (Memory, Redis, DB)                               | Client-side (in the token string itself)                                   |
| **Database Overhead**         | High (1 DB/Redis lookup per incoming request)                 | Zero (Signature verified mathematically on CPU)                            |
| **Revocation / Invalidation** | **Instant** (delete row/key from session store)               | **Difficult** (requires blacklists, blocklists, or short expiry)           |
| **Horizontal Scaling**        | Requires centralized session store (Redis) or sticky sessions | **Effortless** (any microservice with the secret/public key can verify it) |
| **Payload Size**              | Tiny (~32–64 bytes)                                           | Larger (~200–800+ bytes, adds bandwidth overhead)                          |
| **Data Visibility**           | Completely opaque (client sees random string)                 | **Publicly readable** (Base64 decoded, not encrypted by default)           |

---

### Best-Practice Architecture: Short-Lived JWT + Refresh Token

Modern systems often combine the benefits of both using a dual-token strategy:

1. **Access Token (JWT):** Short lifespan (**5 to 15 minutes**). Sent in the `Authorization: Bearer` header or memory to access APIs without database lookups.
2. **Refresh Token (Opaque/Stateful):** Long lifespan (**7 to 30 days**). Stored in an `HttpOnly`, `SameSite=Strict` cookie and persisted in a server-side database.
3. **Flow:** When the access token expires, the client calls `/auth/refresh` with the refresh token. The server performs a database lookup, verifies the user is still active/unbanned, and issues a new short-lived JWT.

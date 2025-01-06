A **JWT (JSON Web Token)** is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used in authentication and authorization systems, where the server generates a token after validating a user's credentials and sends it to the client. The client can then send this token in subsequent requests to prove its identity and authorize access to protected resources.

A JWT typically consists of three parts:
1. **Header**: Information about how the JWT is signed (e.g., the algorithm used).
2. **Payload**: Claims about the user or other data you want to store. It can contain custom user information (e.g., user ID, role).
3. **Signature**: Used to verify the authenticity of the token and ensure it wasn't tampered with.

### JWT Structure:
A JWT is made up of three parts, separated by dots (`.`):
```
<Header>.<Payload>.<Signature>
```

#### 1. Header:
The header typically consists of two parts:
- The **type** of the token, which is JWT.
- The **signing algorithm** (e.g., HMAC SHA256 or RSA).

Example:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload:
The payload contains the claims (statements about an entity, typically the user, and additional data). These claims are divided into three categories:
- **Registered claims**: Predefined claims such as `iat` (issued at), `exp` (expiration time), etc.
- **Public claims**: Custom claims that can be defined freely, such as user roles.
- **Private claims**: Claims shared between parties that agree on their meaning.

Example of payload (for authentication and authorization):
```json
{
  "sub": "1234567890",   // Subject (User ID)
  "name": "John Doe",     // User Name
  "iat": 1516239022,      // Issued At (Time)
  "exp": 1716239022,      // Expiration Time
  "role": "admin"         // User role (can be used for authorization)
}
```

#### 3. Signature:
The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way. It is created using the header and payload, a secret key, and the algorithm specified in the header.

Example of how the signature is created:
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secretKey)
```

### Example of a JWT:
Let's assume the following header, payload, and secret key:
- Header: `{ "alg": "HS256", "typ": "JWT" }`
- Payload: `{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022, "exp": 1716239022, "role": "admin" }`
- Secret Key: `"your-256-bit-secret"`

The encoded JWT might look like this:
```
eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0.eyJzdWIiOiAiMTIzNDU2Nzg5MCIsICJuYW1lIjogIkpvaG4gRG9lIiwgImlhdCI6IDE1MTYyMzkwMjIsICJleHBpcmVkX3RpbWUiOiAxNzE2MjM5MDIyLCAicm9sZSI6ICJhZG1pbiJ9.Y0QfDbQe9h2NVzOCIKjpHfNd2GxwbbvfWBh9Q2cY5aw
```

### Authentication and Authorization with JWT

#### 1. **Authentication**:
Authentication refers to verifying the identity of a user. In the context of JWT:
- A user logs in with their credentials (e.g., username and password).
- The server validates the credentials and generates a JWT that includes the user's information.
- The server sends the JWT to the client, which stores it (usually in `localStorage` or `sessionStorage`).
- The client includes this JWT in subsequent requests to access protected resources.

#### Example: User Login and Token Generation (Backend - Node.js with Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = 'your-256-bit-secret';

// Simulate a database of users
const users = [
  { id: 1, username: 'john', password: 'password123', role: 'admin' },
  { id: 2, username: 'jane', password: 'password456', role: 'user' }
];

app.use(express.json());

// Login endpoint (authentication)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // User found, generate JWT
    const token = jwt.sign(
      { sub: user.id, name: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }  // Token expiration time
    );

    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Protected route
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).send('Token is required');
  }

  // Verify the JWT
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }

    // Token is valid
    res.json({ message: 'Welcome to the protected route!', user: decoded });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
```

#### 2. **Authorization**:
Authorization is the process of checking if the authenticated user has permission to perform a certain action. You can use the information stored in the JWT (e.g., role) to enforce authorization rules.

#### Example: Protecting Routes Based on User Role
You can use the role information from the payload to restrict access to certain routes. For example:

```javascript
// Admin route (authorization)
app.get('/admin', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }

    // Check if the user has the 'admin' role
    if (decoded.role === 'admin') {
      res.json({ message: 'Welcome to the admin dashboard' });
    } else {
      res.status(403).send('You are not authorized to access this route');
    }
  });
});
```

### How JWT Improves Security:
- **Stateless Authentication**: The server doesn't need to store session information. The client stores the JWT and sends it with each request.
- **Data Integrity**: Since the token is signed, it ensures that the token has not been tampered with.
- **Cross-Domain Authorization**: JWTs can be passed between domains (ideal for single-page applications or cross-origin APIs).

### JWT Expiration and Refresh Tokens:
JWTs typically expire after a set period. To maintain a session, you can implement refresh tokens:
- **Refresh Token**: A long-lived token that can be used to get a new access token without requiring the user to log in again.

### Summary:
- **JWT** consists of three parts: Header, Payload, and Signature.
- Used for **authentication** and **authorization** by embedding user information and claims inside the token.
- **Authentication**: Verifying user identity (typically with credentials).
- **Authorization**: Checking if the user has permission to access certain resources (based on claims like role).
- It is **stateless** and **secure**, reducing the need for server-side session management.


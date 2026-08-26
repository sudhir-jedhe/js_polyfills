This architecture implements **Token Rotation with Automatic Reuse Detection**:

1. **Access Token (JWT):** Short-lived (15 min), returned in the response body or stored in memory.
2. **Refresh Token (Opaque/Hashed):** Long-lived (7 days), stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie, and tracked in a database.
3. **Rotation & Reuse Detection:** Every time the refresh token is used, it is invalidated and replaced with a new one. If an old/stolen token is reused, the entire session family is revoked.

---

### 1. Database Schema (Prisma / SQL Example)

```prisma
model User {
  id           String         @id @default(uuid())
  email        String         @unique
  passwordHash String
  tokens       RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  tokenHash String   @unique      // Store hashed token (never plain text)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  family    String                // Groups rotated tokens to detect reuse
  isRevoked Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

```

---

### 2. Token Utilities (`auth.utils.js`)

```javascript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_EXPIRY = '15m';

export function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
}

export function generateRefreshToken() {
  // Generate a cryptographically secure random opaque string
  const plainToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
  return { plainToken, tokenHash };
}

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,                                    // Prevent XSS access
  secure: process.env.NODE_ENV === 'production',     // HTTPS only in prod
  sameSite: 'strict',                                // Prevent CSRF
  path: '/api/auth/refresh',                         // Scoped strictly to refresh endpoint
  maxAge: 7 * 24 * 60 * 60 * 1000                    // 7 days in ms
};

```

---

### 3. Auth Controller Implementation (`auth.controller.js`)

```javascript
import { db } from './db.js';
import crypto from 'crypto';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  REFRESH_COOKIE_OPTIONS 
} from './auth.utils.js';

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await validateUserCredentials(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // 1. Generate Access Token & Refresh Token pair
  const accessToken = generateAccessToken(user);
  const { plainToken, tokenHash } = generateRefreshToken();
  const familyId = crypto.randomUUID();

  // 2. Persist hashed refresh token with family identifier
  await db.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      family: familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  // 3. Set HttpOnly Cookie & Return Access Token in memory
  res.cookie('refreshToken', plainToken, REFRESH_COOKIE_OPTIONS);
  return res.json({ accessToken });
}

// POST /api/auth/refresh
export async function refresh(req, res) {
  const plainToken = req.cookies.refreshToken;
  if (!plainToken) return res.status(401).json({ error: 'Missing refresh token' });

  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');

  // Find token in DB
  const existingToken = await db.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  // 🚨 REUSE DETECTION: Token not found or already revoked -> Compromised session!
  if (!existingToken || existingToken.isRevoked || existingToken.expiresAt < new Date()) {
    if (existingToken) {
      // Invalidate the entire family tree immediately
      await db.refreshToken.updateMany({
        where: { family: existingToken.family },
        data: { isRevoked: true }
      });
    }
    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
    return res.status(403).json({ error: 'Session compromised. Please log in again.' });
  }

  // 1. Invalidate the used refresh token immediately
  await db.refreshToken.update({
    where: { id: existingToken.id },
    data: { isRevoked: true }
  });

  // 2. Issue a new pair in the SAME family
  const newAccessToken = generateAccessToken(existingToken.user);
  const { plainToken: newPlainToken, tokenHash: newTokenHash } = generateRefreshToken();

  await db.refreshToken.create({
    data: {
      tokenHash: newTokenHash,
      userId: existingToken.userId,
      family: existingToken.family, // Preserve family ID
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  // 3. Rotate cookie and return new access token
  res.cookie('refreshToken', newPlainToken, REFRESH_COOKIE_OPTIONS);
  return res.json({ accessToken: newAccessToken });
}

// POST /api/auth/logout
export async function logout(req, res) {
  const plainToken = req.cookies.refreshToken;
  if (plainToken) {
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    await db.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true }
    });
  }

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
  return res.status(204).send();
}

```

---

### 4. Client-Side Silent Refresh (Axios Interceptor)

The frontend keeps the Access Token in JavaScript memory (never in `localStorage`) and uses an interceptor to automatically request a new one when an API call returns `401 Unauthorized`.

```javascript
// apiClient.js
import axios from 'axios';

let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

const api = axios.create({
  baseURL: '/api',
  withCredentials: true // Mandatory for browser to send HttpOnly cookies
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Response Interceptor: Handle 401 & Rotate Token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue concurrent requests while refresh is in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Cookie is sent automatically by the browser
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

```

---

### Security Guarantees of this Architecture

* **XSS Mitigation:** Even if malicious JS runs via an XSS vulnerability, it cannot read the `HttpOnly` refresh cookie. The attacker can only steal the ephemeral access token (valid for $\le 15\text{ mins}$).
* **CSRF Mitigation:** The cookie uses `SameSite=Strict` and is scoped strictly to `/api/auth/refresh` via the `Path` attribute.
* **Token Reuse Defense:** If a malicious party steals a refresh token and uses it *after* the legitimate client has already rotated it, the server flags the reuse, revokes all tokens in that `family`, and forces a complete re-login.

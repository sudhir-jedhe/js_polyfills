# Authentication in React

### Login • Logout • Token Storage • Offline Support • Optimisations

Authentication is one of the most important **Senior React interview topics**.

Modern apps require:

✅ Login form

✅ Login API

✅ JWT / Refresh Tokens

✅ Secure token storage

✅ Persistent authentication

✅ Logout

✅ Route protection

✅ Auto-refresh tokens

✅ Offline support

✅ Multi-tab sync

✅ Optimisations for performance and security

Examples:

```txt
Gmail
LinkedIn
Slack
Notion
Amazon
Facebook
```

---

# 1. System Design

```txt
User
  │
  ▼
Login Form
  │
  ▼
Auth API
  │
  ▼
Access Token + Refresh Token
  │
  ▼
Secure Storage
  │
  ▼
AuthContext (React)
  │
  ▼
Protected Routes
  │
  ▼
API Interceptor (Axios / Fetch)
  │
  ▼
Auto Refresh
  │
  ▼
Multi-Tab Sync
  │
  ▼
Offline Support
```

---

# 2. Authentication Architecture

## Components

```txt
App
│
├── AuthProvider (Context + Service)
│
├── useAuth() Hook
│
├── LoginPage
│
├── PrivateRoute
│
├── DashboardPage
│
└── AuthService (API layer)
```

---

# 3. Data Model

```js
{
  user: {
    id: "u123",
    name: "Sudhir",
    email: "sudhir@test.com",
    role: "admin"
  },

  accessToken: "eyJhbGciOi...",
  refreshToken: "gGh42vI...",

  expiresAt: 1725000000
}
```

---

# 4. Storage Choices

## Options

| Storage         | Persistence | XSS Safe | CSRF Safe |
| --------------- | ----------- | -------- | --------- |
| localStorage    | ✅          | ❌       | ✅        |
| sessionStorage  | Tab-only    | ❌       | ✅        |
| IndexedDB       | ✅          | ❌       | ✅        |
| HttpOnly Cookie | ✅          | ✅       | ❌        |

### Best Practices

✅ Access token → memory (short-lived)

✅ Refresh token → HttpOnly cookie

✅ Never store JWT in localStorage in production apps

For interviews, though, localStorage is commonly used to demonstrate features.

---

# 5. Login API Layer

```js
export async function login(email, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}
```

---

## Logout API

```js
export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
```

---

## Refresh Token API

```js
export async function refresh() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
}
```

---

# 6. AuthProvider (Context)

```jsx
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import {
  login as loginApi,
  logout as logoutApi,
  refresh as refreshApi,
} from "./authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    async function init() {
      const result = await refreshApi();

      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }

      setLoading(false);
    }

    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginApi(email, password);

    setUser(result.user);
    setAccessToken(result.accessToken);
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();

    setUser(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

# 7. Login Component

```jsx
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (error) {
      setError("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Login</button>

      {error && <p>{error}</p>}
    </form>
  );
}
```

---

# 8. Private Route

```jsx
import { useAuth } from "./AuthProvider";
import LoginPage from "./LoginPage";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return children;
}
```

---

# 9. Axios Interceptors for Auto-Refresh

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const result = await refresh();

      if (result) {
        localStorage.setItem("access_token", result.accessToken);

        return api(original);
      }
    }

    return Promise.reject(error);
  },
);
```

---

# 10. Offline Storage Strategy

Modern apps must:

✅ Cache API responses

✅ Store user data offline

✅ Reuse it on next launch

✅ Sync on reconnect

Storage layers:

```txt
Memory   → Fast
localStorage → Persistent (Small)
IndexedDB → Large offline data
Service Worker + Cache → Full offline
```

Example use cases:

```txt
Offline notes
Draft messages
Cached feed
Cached tokens
```

---

## Storing Offline User

```jsx
useEffect(() => {
  if (user) {
    localStorage.setItem("cached_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("cached_user");
  }
}, [user]);
```

Load on init:

```jsx
const cached = localStorage.getItem("cached_user");

if (cached) {
  setUser(JSON.parse(cached));
}
```

---

## Offline Detection

```jsx
useEffect(() => {
  function updateStatus() {
    setOffline(!navigator.onLine);
  }

  window.addEventListener("online", updateStatus);

  window.addEventListener("offline", updateStatus);

  return () => {
    window.removeEventListener("online", updateStatus);
    window.removeEventListener("offline", updateStatus);
  };
}, []);
```

---

# 11. Multi-Tab Sync

Login in one tab should authenticate all tabs.

Use `storage` event:

```jsx
useEffect(() => {
  function onStorage(e) {
    if (e.key === "access_token") {
      const token = localStorage.getItem("access_token");

      if (!token) {
        logout();
      } else {
        setAccessToken(token);
      }
    }
  }

  window.addEventListener("storage", onStorage);

  return () => window.removeEventListener("storage", onStorage);
}, []);
```

Used by Gmail, Notion, LinkedIn.

---

# 12. Optimisations

## ✅ 1. Store Access Token in Memory

Prevents XSS token theft.

---

## ✅ 2. Store Refresh Token in HttpOnly Cookie

Prevents JavaScript access.

---

## ✅ 3. Use Silent Refresh

Refresh token before expiry.

```jsx
setTimeout(async () => {
  await refresh();
}, expiresIn - 60_000);
```

---

## ✅ 4. Use React.memo & useMemo

Prevents provider rerender.

```jsx
const value = useMemo(
  () => ({
    user,
    login,
    logout,
  }),
  [user],
);
```

---

## ✅ 5. Debounced UI Feedback

Show loading only if login > 500ms.

---

## ✅ 6. Skeleton UI

Show layout instantly.

---

## ✅ 7. Prefetch Data On Login

Load essentials immediately.

---

## ✅ 8. Rate-Limit Login Attempts

Prevent brute force.

---

## ✅ 9. HTTPS + HSTS

Prevent MITM.

---

## ✅ 10. Refresh Token Rotation

Prevent token theft reuse.

---

## ✅ 11. Automatic Logout

When token invalid.

---

## ✅ 12. Session Timeout

Logout after inactivity.

---

## ✅ 13. Logout Everywhere

Revoke tokens on backend.

---

## ✅ 14. Cache Layer

React Query for user data.

---

## ✅ 15. Error Boundary

Handle broken UI gracefully.

---

# 13. Best Practices Summary

```txt
✔ Access Token in memory
✔ Refresh Token in HttpOnly Cookie
✔ Silent Refresh
✔ Multi-Tab Sync
✔ Offline Support
✔ Encrypted Storage
✔ Route Protection
✔ Auto Logout
✔ Optimistic UI
✔ Rate Limiting
```

---

# 14. Complete Flow Diagram

```txt
User Logs In
     │
     ▼
API returns Access + Refresh tokens
     │
     ▼
Store Access in Memory
     │
     ▼
Store Refresh in HttpOnly Cookie
     │
     ▼
User Reloads Page
     │
     ▼
Silent Refresh (via cookie)
     │
     ▼
App reconstructs auth state
     │
     ▼
User Uses App
     │
     ▼
On 401 → Refresh Access Token
     │
     ▼
User Logs Out → Revoke Tokens
     │
     ▼
Multi-Tab sync → All tabs logged out
```

---

# 15. Senior React Interview Answer

> Authentication in React is best implemented using a Context-based `AuthProvider` that exposes login, logout, and user state through a `useAuth` hook. Access tokens are stored in memory to prevent XSS, while refresh tokens are stored in HttpOnly cookies to prevent JavaScript access. Silent refresh runs before expiry using an Axios or Fetch interceptor, and 401 responses automatically trigger token refresh before retrying the failed request. For offline support, I use `localStorage` or IndexedDB for caching user data, tokens, and API responses, along with `online/offline` browser events for adjusting behaviour. Multi-tab sync is handled using the `storage` event so logins and logouts propagate everywhere. Additional optimisations include `useMemo` on context values, React.memo on providers, request retries with exponential backoff, prefetching data on login, session timeouts, and refresh token rotation. This design mirrors production implementations used by Gmail, LinkedIn, Slack, and Notion.

# Authentication – Advanced Topics

## Token Refresh • Auto Logout • IndexedDB • AuthProvider Optimisation

These are the **three most common Senior React interview follow-ups** after implementing Authentication.

They convert a normal login system into a **secure, scalable, enterprise-grade authentication engine** similar to Gmail, Slack, and Notion.

---

# 1. Token Refresh & Auto Logout Flow

## Concept

Every access token has an expiry:

```txt
Access Token → short-lived (15 mins)
Refresh Token → long-lived (7 days)
```

Flow:

```txt
1. Login → returns access + refresh tokens
2. Access token expires
3. Use refresh token silently to get new access token
4. If refresh token expires OR fails → auto logout
```

---

## Why?

✅ Prevent token theft

✅ Reduce login frequency

✅ Maintain security

✅ Keep sessions active seamlessly

---

## Auto-Refresh Strategies

### Option A: Reactive (Retry on 401)

Every API returns 401 → retry refresh → then reissue request.

Used in most enterprise apps.

---

### Option B: Proactive (Silent Timer)

Refresh **before** expiry.

Better UX.

---

### Option C: Hybrid (Best)

Combines both.

---

## Reactive Refresh (Axios Interceptor)

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;

let queue = [];

function processQueue(token, error = null) {
  queue.forEach((cb) => {
    if (error) {
      cb.reject(error);
    } else {
      cb.resolve(token);
    }
  });

  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;

          return api(original);
        });
      }

      original._retry = true;

      isRefreshing = true;

      try {
        const { accessToken } = await refresh();

        processQueue(accessToken);

        original.headers.Authorization = `Bearer ${accessToken}`;

        return api(original);
      } catch (error) {
        processQueue(null, error);

        // Auto Logout
        await logout();

        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);
```

This prevents:

✅ Duplicate refresh requests

✅ Broken UI due to concurrent 401s

✅ Race conditions

---

## Proactive Refresh (Silent Timer)

Decode access token expiry:

```js
function getExpiry(token) {
  const decoded = JSON.parse(atob(token.split(".")[1]));

  return decoded.exp * 1000;
}
```

Schedule refresh 60s before expiry:

```jsx
useEffect(() => {
  if (!accessToken) return;

  const expiry = getExpiry(accessToken);

  const timeLeft = expiry - Date.now() - 60_000;

  const timer = setTimeout(async () => {
    const result = await refresh();

    if (result) {
      setAccessToken(result.accessToken);
    } else {
      await logout();
    }
  }, timeLeft);

  return () => clearTimeout(timer);
}, [accessToken]);
```

---

## Auto Logout Rules

Auto logout occurs when:

✅ Refresh token expired

✅ Refresh API returns 401 or 403

✅ Multi-tab logout event

✅ Inactivity timeout

✅ Server revokes session

---

## Inactivity Auto Logout

```jsx
useEffect(() => {
  let timer;

  function resetTimer() {
    clearTimeout(timer);

    timer = setTimeout(
      () => {
        logout();
      },
      15 * 60 * 1000,
    );
  }

  window.addEventListener("mousemove", resetTimer);

  window.addEventListener("keydown", resetTimer);

  resetTimer();

  return () => {
    clearTimeout(timer);

    window.removeEventListener("mousemove", resetTimer);

    window.removeEventListener("keydown", resetTimer);
  };
}, []);
```

---

## Multi-Tab Logout

If user logs out in one tab, all tabs should logout.

```jsx
useEffect(() => {
  function handleStorage(event) {
    if (event.key === "logout-event") {
      logout();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => window.removeEventListener("storage", handleStorage);
}, []);
```

Trigger:

```js
localStorage.setItem("logout-event", Date.now());
```

Used by Google, Twitter, LinkedIn.

---

## Full Token Lifecycle

```txt
Login → tokens issued
   │
   ▼
Access Token used
   │
   ▼
401 or expiry
   │
   ▼
Silent Refresh
   │
   ▼
New Access Token
   │
   ▼
Continue Session

   │
   ▼
Refresh Fails
   │
   ▼
Auto Logout
```

---

# 2. Offline Storage With IndexedDB

## Why IndexedDB Over localStorage?

| Feature         | localStorage | IndexedDB    |
| --------------- | ------------ | ------------ |
| Async           | ❌           | ✅           |
| Large Storage   | ❌ (5 MB)    | ✅ (100 MB+) |
| Structured Data | ❌           | ✅           |
| Complex Queries | ❌           | ✅           |
| Blob Storage    | ❌           | ✅           |
| Encryption      | Manual       | Yes          |

Use IndexedDB for:

```txt
Offline notes
Cached feed
Chat history
User profile
Auth session data
```

---

## Use Modern Library `idb`

```bash
npm install idb
```

---

## Setup DB

```js
import { openDB } from "idb";

export async function initDB() {
  return openDB("AppDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("session")) {
        db.createObjectStore("session");
      }

      if (!db.objectStoreNames.contains("cache")) {
        db.createObjectStore("cache");
      }
    },
  });
}
```

---

## Save Session

```js
export async function saveSession(data) {
  const db = await initDB();

  await db.put("session", data, "current");
}
```

---

## Get Session

```js
export async function getSession() {
  const db = await initDB();

  return db.get("session", "current");
}
```

---

## Cache API Response

```js
export async function cacheData(key, data) {
  const db = await initDB();

  await db.put("cache", data, key);
}
```

---

## Retrieve Cached Data

```js
export async function getCache(key) {
  const db = await initDB();

  return db.get("cache", key);
}
```

---

## Use in AuthProvider

```jsx
useEffect(() => {
  async function init() {
    const session = await getSession();

    if (session) {
      setUser(session.user);
      setAccessToken(session.accessToken);
    }

    setLoading(false);
  }

  init();
}, []);
```

Save on login:

```js
await saveSession({
  user: result.user,
  accessToken: result.accessToken,
});
```

Clear on logout:

```js
const db = await initDB();

await db.clear("session");
```

---

## Offline Feature Support

Detect offline:

```jsx
useEffect(() => {
  function updateStatus() {
    setOffline(!navigator.onLine);
  }

  window.addEventListener("online", updateStatus);

  window.addEventListener("offline", updateStatus);

  return () => {
    window.removeEventListener("online", updateStatus);

    window.removeEventListener("offline", updateStatus);
  };
}, []);
```

---

Show offline notice:

```jsx
{
  offline && <div className="banner">You are offline</div>;
}
```

---

Combine with Service Worker for full PWA offline support.

---

# 3. Performance Optimisations for AuthProvider

## Why?

If AuthProvider re-renders unnecessarily:

```txt
❌ All child components rerender
❌ Layout jank
❌ Broken protected routes
❌ Wasteful renders
```

---

## Optimisation 1: useMemo Context Value

Prevents context consumers from unnecessary rerenders.

```jsx
const value = useMemo(
  () => ({
    user,
    accessToken,
    login,
    logout,
    loading,
  }),
  [user, accessToken, loading],
);
```

Now consumers only rerender when values actually change.

---

## Optimisation 2: useCallback for Handlers

Ensures login/logout functions don't change on every render.

```jsx
const login =
  useCallback(async (
    email,
    password
  ) => {
    ...
  }, []);
```

---

## Optimisation 3: Suspense Boundary

Avoid layout shift when app initializes.

```jsx
<Suspense fallback={<AppSkeleton />}>
  <AuthProvider>
    <App />
  </AuthProvider>
</Suspense>
```

---

## Optimisation 4: Lazy Load Auth Pages

Split login page from main bundle:

```jsx
const LoginPage = React.lazy(() => import("./LoginPage"));
```

---

## Optimisation 5: Split Contexts

Instead of one big context:

```jsx
UserContext;
AccessTokenContext;
LoadingContext;
```

This prevents unrelated components from rerendering when only a single value changes.

Used in production-grade auth systems.

---

## Optimisation 6: React.memo Protected Routes

Prevent unnecessary rerenders of route wrappers.

```jsx
export default React.memo(PrivateRoute);
```

---

## Optimisation 7: Selectors Pattern

If using Zustand/Redux:

```js
const user = useAuthStore((state) => state.user);
```

Only re-render when user changes.

---

## Optimisation 8: Preload Data After Login

Reduce loading spinners.

```jsx
async function login(
  ...
) {

  await loginApi(...);

  await Promise.all([
    fetchDashboard(),
    fetchNotifications(),
    fetchSettings()
  ]);
}
```

Feels instant to user.

---

## Optimisation 9: Concurrent Rendering

React 18+:

Use:

```jsx
startTransition(() => {
  setUser(...);
});
```

Non-urgent state updates run smoother.

---

## Optimisation 10: Silent Refresh Background

Run in background without blocking UI.

```jsx
setTimeout(async () => {
  await refresh();
}, expiresIn - 60_000);
```

---

# Complete Auth Architecture

```txt
User → Login
   │
   ▼
Access + Refresh Tokens
   │
   ▼
Save Session
   │
   ▼
AuthProvider (Context)
   │
   ▼
useAuth Hook
   │
   ▼
Protected Route
   │
   ▼
API Interceptor
   │
   ▼
Auto Refresh
   │
   ▼
Multi-Tab Sync
   │
   ▼
Inactivity Timeout
   │
   ▼
Offline Support (IndexedDB)
   │
   ▼
Optimisations
   │
   ▼
Enterprise-Ready Authentication
```

---

# Senior React Interview Answer

> Token refresh is best handled using a combination of proactive silent refresh (scheduled 60 seconds before expiry) and reactive interceptors that catch 401 responses, refresh the token, and retry the failed request. A queue mechanism ensures only one refresh is in-flight while other requests wait. Auto logout is triggered when the refresh token fails, when the session expires, when inactivity exceeds a defined threshold, or when a multi-tab logout event is fired via `localStorage`. For offline support, I use IndexedDB (via the `idb` library) to cache user sessions, access tokens, and API responses since it supports async access, larger data sizes, and structured stores unlike localStorage. AuthProvider is optimised using `useMemo` on the context value, `useCallback` on handlers, splitting contexts by concern, lazy-loading pages, React.memo on protected routes, and running silent refresh in the background. This architecture is scalable, secure, and mirrors what enterprise applications like Gmail, LinkedIn, Slack, and Notion use in production.

# Token Refresh with Axios Interceptor + Multi-Tab Logout Sync

## Senior React Interview Deep Dive

Real-world apps like **Gmail, LinkedIn, Slack, Notion, Netflix** implement:

✅ Silent token refresh

✅ Retry failed 401 requests

✅ Handle concurrent refresh calls (queueing)

✅ Auto logout on refresh failure

✅ Multi-tab logout/login synchronization

Let's implement all of this in a **production-grade way**.

---

# 1. Token Refresh with Axios Interceptor

## Concept

Every API request may fail with `401 Unauthorized`.

Flow:

```txt
User sends request
       ↓
API returns 401
       ↓
Interceptor catches error
       ↓
Fetch new access token
       ↓
Retry failed request
       ↓
Continue silently
```

---

## Axios Instance

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default api;
```

`withCredentials: true` ensures cookies (refresh token) are sent.

---

## Attach Access Token

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

## Auto Refresh + Retry Interceptor

```js
let isRefreshing = false;

let queue = [];

function processQueue(token, error = null) {
  queue.forEach((cb) => {
    if (error) {
      cb.reject(error);
    } else {
      cb.resolve(token);
    }
  });

  queue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve,
            reject,
          });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;

          return api(original);
        });
      }

      original._retry = true;

      isRefreshing = true;

      try {
        const response = await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          },
        );

        const newToken = response.data.accessToken;

        localStorage.setItem("access_token", newToken);

        processQueue(newToken);

        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch (refreshError) {
        processQueue(null, refreshError);

        // Force logout
        localStorage.removeItem("access_token");

        window.dispatchEvent(new Event("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
```

---

## Why Queue Requests?

If 5 API calls hit 401 simultaneously:

Without queue:

```txt
API 1 → Refresh
API 2 → Refresh
API 3 → Refresh
```

5 refresh calls → server overload.

With queue:

```txt
API 1 triggers refresh
API 2, 3, 4, 5 wait in queue
Refresh completes
All retried with new token
```

Only one refresh network call.

---

## Auto Logout Trigger

Emit event when logout needed:

```js
window.dispatchEvent(new Event("auth:logout"));
```

React app listens and clears state:

```jsx
useEffect(() => {
  function handleLogout() {
    logout();
  }

  window.addEventListener("auth:logout", handleLogout);

  return () => window.removeEventListener("auth:logout", handleLogout);
}, []);
```

---

## Silent Refresh Timer (Optional)

Refresh before expiry:

```jsx
useEffect(() => {
  if (!accessToken) return;

  const decoded = JSON.parse(atob(accessToken.split(".")[1]));

  const expiry = decoded.exp * 1000;

  const timeLeft = expiry - Date.now() - 60_000;

  const timer = setTimeout(refreshTokens, timeLeft);

  return () => clearTimeout(timer);
}, [accessToken]);
```

Combines proactive + reactive refresh.

---

# 2. Multi-Tab Logout Synchronization

## Problem

If user logs out in Tab A:

```txt
Tab B → still shows dashboard
Tab C → still calls APIs
```

Insecure and inconsistent.

Solution:

```txt
All tabs → auto logout together
```

Used by Google, Twitter, LinkedIn.

---

## Approach: LocalStorage `storage` Event

Only fires **in other tabs**, not the tab where it was set.

Perfect for synchronization.

---

## When Logout Happens

Trigger:

```js
localStorage.setItem("logout-event", Date.now().toString());
```

Then clear session:

```js
localStorage.removeItem("access_token");
```

---

## Listen in Every Tab

```jsx
useEffect(() => {
  function handleStorage(event) {
    if (event.key === "logout-event") {
      logout();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => window.removeEventListener("storage", handleStorage);
}, []);
```

---

## Flow

```txt
Tab A → logout()
        ↓
LocalStorage sets logout-event
        ↓
Tab B, C, D receive "storage" event
        ↓
All tabs run logout()
        ↓
All tabs return to login screen
```

Every tab is synchronized instantly.

---

## Multi-Tab Login Sync (Bonus)

Similarly sync login:

Trigger in Tab A:

```js
localStorage.setItem("login-event", Date.now().toString());
```

Listen in other tabs:

```jsx
if (event.key === "login-event") {
  initSessionFromServer();
}
```

Refetches session from `/refresh` endpoint.

Used by Notion and LinkedIn.

---

## BroadcastChannel API (Modern Alternative)

```js
const channel = new BroadcastChannel("auth");

// Send
channel.postMessage({
  type: "logout",
});

// Receive
channel.onmessage = (event) => {
  if (event.data.type === "logout") {
    logout();
  }
};
```

Advantages:

✅ Cleaner API

✅ Structured data

✅ Better performance

✅ No localStorage abuse

Supported in Chrome, Firefox, Edge, Safari.

---

# 3. Auto Logout on Refresh Failure

Interceptor already dispatches:

```js
window.dispatchEvent(new Event("auth:logout"));
```

Then propagate across tabs:

```js
localStorage.setItem("logout-event", Date.now().toString());
```

Ensures:

✅ Local logout

✅ Cross-tab logout

✅ Consistent session

---

# 4. Full Architecture

```txt
User Request
      │
      ▼
Axios Interceptor
      │
      ▼
Access Token Attached
      │
      ▼
401 Unauthorized
      │
      ▼
Refresh Token API
      │
      ▼
Success → Retry
      │
      ▼
Failure → Auto Logout
      │
      ▼
LocalStorage Event Fires
      │
      ▼
Other Tabs Detect Event
      │
      ▼
All Tabs Logout Together
      │
      ▼
User Redirected to Login
```

---

# 5. Best Practices Summary

## ✅ Token Refresh

- Use interceptors
- Queue concurrent 401s
- Combine silent + reactive refresh
- Rotate refresh tokens (backend)
- Handle race conditions

## ✅ Auto Logout

- On refresh fail
- On inactivity
- On revoked session
- On cross-tab event

## ✅ Multi-Tab Sync

- Use `storage` event
- Or use `BroadcastChannel`
- Sync login/logout events
- Refresh session on new tab

## ✅ Security

- Access token in memory
- Refresh token in HttpOnly cookie
- Rotate refresh tokens
- Rate-limit refresh endpoint
- Enforce short expiry

---

# 6. Senior React Interview Answer

> For token refresh, I attach access tokens via an Axios request interceptor and use a response interceptor to detect 401 errors. On 401, I trigger a refresh call, but if multiple requests fail simultaneously, they are queued so only one refresh network request runs at a time. Successful refresh retries all queued requests with the new token, while failed refresh triggers auto logout. For multi-tab synchronization, I use the `storage` event (or `BroadcastChannel` for modern browsers) so that when a user logs out in one tab, all other tabs receive the event and log out simultaneously, ensuring session consistency. This is combined with silent refresh timers, inactivity-based auto logout, refresh token rotation, and secure HttpOnly cookies to mirror the enterprise-grade authentication flows used by Gmail, LinkedIn, Slack, and Notion.

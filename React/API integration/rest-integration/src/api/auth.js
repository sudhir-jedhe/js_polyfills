/**
 * Authentication: attaching tokens, and refreshing them exactly once.
 *
 * THE classic bug in this area: ten requests fire, all get 401, and all ten
 * kick off a token refresh. Nine of them then fail because the first refresh
 * already rotated the refresh token. The fix is a single in-flight refresh
 * promise that every 401 awaits.
 *
 * On token storage — the honest version:
 *   httpOnly cookie   : safest. XSS cannot read it. Needs CSRF protection.
 *   memory (a module) : safe from XSS persistence, lost on refresh/tab.
 *   localStorage      : convenient, and readable by ANY injected script.
 *
 * Prefer httpOnly cookies. Where you must hold a token in JS, keep the
 * ACCESS token in memory and let a refresh cookie restore the session.
 */

import { apiClient } from './client.js';

/* ------------------------------------------------------------------ *
 * Token store — in memory, with a subscribe hook for React
 * ------------------------------------------------------------------ */

let accessToken = null;
const listeners = new Set();

export const tokenStore = {
  get: () => accessToken,

  set(token) {
    accessToken = token;
    listeners.forEach((fn) => fn(token));
  },

  clear() {
    accessToken = null;
    listeners.forEach((fn) => fn(null));
  },

  /** For useSyncExternalStore. */
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/** Decode a JWT payload WITHOUT verifying it (verification is the server's job). */
export function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

/** Is the token expired, or about to be? Refresh early to avoid a 401 round trip. */
export function isExpired(token, skewSeconds = 30) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}

/* ------------------------------------------------------------------ *
 * Single-flight refresh
 * ------------------------------------------------------------------ */

let refreshPromise = null;

/**
 * Refresh the access token. Concurrent callers all await the SAME promise,
 * so the refresh endpoint is hit exactly once.
 */
export function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      // The refresh token travels as an httpOnly cookie, so there is nothing
      // to put in the body — `credentials: 'include'` does the work.
      const data = await apiClient.post('/auth/refresh', undefined, {
        retries: 0,   // never retry a refresh; a failure means "log out"
        skipAuth: true, // don't let the request interceptor add a stale token
      });

      tokenStore.set(data.accessToken);
      return data.accessToken;
    } catch (error) {
      tokenStore.clear();
      onSessionExpired();
      throw error;
    } finally {
      // Release the lock whether it worked or not.
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/** Called once when the session is unrecoverable. Wire this to your router. */
let sessionExpiredHandler = () => {
  if (typeof window !== 'undefined') window.location.assign('/login');
};

export function onSessionExpiredDo(handler) {
  sessionExpiredHandler = handler;
}

function onSessionExpired() {
  sessionExpiredHandler();
}

/* ------------------------------------------------------------------ *
 * Wiring it into the client
 * ------------------------------------------------------------------ */

export function installAuthInterceptors(client = apiClient) {
  // 1. Attach the bearer token, refreshing PRE-EMPTIVELY when it is stale.
  client.interceptors.request.use(async (config) => {
    if (config.skipAuth) return config;

    let token = tokenStore.get();
    if (token && isExpired(token)) token = await refreshAccessToken();

    return token
      ? { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } }
      : config;
  });

  // 2. Recover from a 401 that slipped through: refresh once, then replay.
  client.interceptors.error.use(async (error, config, retry) => {
    if (error.status !== 401) return undefined; // not ours
    if (config.skipAuth || config._retriedAfterRefresh) return undefined; // give up

    try {
      await refreshAccessToken();
    } catch {
      return undefined; // refresh failed — let the original 401 propagate
    }

    // Returning a value from an error interceptor RECOVERS the request.
    config._retriedAfterRefresh = true;
    return retry();
  });

  // 3. CSRF: send the cookie-issued token back on state-changing requests.
  client.interceptors.request.use((config) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(config.method)) return config;

    const csrf = readCookie('XSRF-TOKEN');
    return csrf ? { ...config, headers: { ...config.headers, 'X-XSRF-TOKEN': csrf } } : config;
  });
}

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/* ------------------------------------------------------------------ *
 * Auth endpoints
 * ------------------------------------------------------------------ */

export const auth = {
  async login(credentials) {
    const data = await apiClient.post('/auth/login', credentials, { skipAuth: true, retries: 0 });
    tokenStore.set(data.accessToken);
    return data.user;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout', undefined, { retries: 0 });
    } finally {
      // Clear locally even if the server call fails — the user asked to leave.
      tokenStore.clear();
    }
  },

  me: () => apiClient.get('/auth/me'),

  /** Restore a session on page load using the refresh cookie. */
  async bootstrap() {
    try {
      await refreshAccessToken();
      return await auth.me();
    } catch {
      return null;
    }
  },
};

/**
 * The same client, built on axios.
 *
 * What axios genuinely gives you over fetch:
 *   - interceptors are built in
 *   - it rejects on 4xx/5xx (fetch resolves — the #1 fetch bug)
 *   - JSON encode/decode is automatic
 *   - upload/download progress
 *   - timeouts without wiring an AbortController yourself
 *
 * What it costs: ~13 kB gzipped, and a dependency to keep current.
 * For a small app, the fetch wrapper in client.js is enough.
 */

import axios from 'axios';
import { HttpError, NetworkError, TimeoutError, AbortError } from './errors.js';
import { tokenStore, refreshAccessToken } from './auth.js';

export const http = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL ?? '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

/* ---- request: attach auth ---- */

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token && !config.skipAuth) config.headers.Authorization = `Bearer ${token}`;

  // Handy for logging slow calls.
  config.metadata = { startedAt: Date.now() };
  return config;
});

/* ---- response: unwrap, and normalise every error ---- */

http.interceptors.response.use(
  (response) => {
    const ms = Date.now() - (response.config.metadata?.startedAt ?? Date.now());
    if (ms > 2000) console.warn(`[api] slow: ${response.config.url} took ${ms}ms`);

    // If your API wraps everything in { data: ... }, unwrap it once here.
    return response.data;
  },
  async (error) => {
    // Cancelled by us.
    if (axios.isCancel?.(error) || error.code === 'ERR_CANCELED') {
      throw new AbortError('Request was cancelled', { cause: error });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new TimeoutError('Request timed out', { cause: error, timeoutMs: error.config?.timeout });
    }

    // No response object at all means the request never completed.
    if (!error.response) {
      throw new NetworkError('Network request failed — check your connection', { cause: error });
    }

    const { status, statusText, data, headers, config } = error.response;

    // 401: refresh once, then replay the original request.
    if (status === 401 && !config._retry && !config.skipAuth) {
      config._retry = true;
      try {
        await refreshAccessToken();
        return http(config); // replay with the new token
      } catch {
        // fall through to the HttpError below
      }
    }

    throw new HttpError(data?.message ?? `${status} ${statusText}`, {
      status,
      statusText,
      body: data,
      headers: new Headers(headers ?? {}),
      url: config?.url,
      method: config?.method?.toUpperCase(),
      cause: error,
      requestId: headers?.['x-request-id'],
    });
  }
);

/* ---- retry with backoff (axios has no built-in retry) ---- */

http.interceptors.response.use(undefined, async (error) => {
  const config = error.config ?? {};
  const max = config.retries ?? 2;

  config._attempt = config._attempt ?? 0;

  if (config._attempt >= max || !error.isRetryable) throw error;

  config._attempt += 1;
  const delay = error.retryAfterMs ?? Math.random() * 500 * 2 ** config._attempt;

  await new Promise((resolve) => setTimeout(resolve, delay));
  return http(config);
});

/* ---- cancellation ---- */

/**
 * axios accepts a standard AbortSignal, so cancellation looks identical to
 * the fetch version:
 *
 *   const controller = new AbortController();
 *   http.get('/users', { signal: controller.signal });
 *   controller.abort();
 */

export const api = {
  get: (url, config) => http.get(url, config),
  post: (url, body, config) => http.post(url, body, config),
  put: (url, body, config) => http.put(url, body, config),
  patch: (url, body, config) => http.patch(url, body, config),
  delete: (url, config) => http.delete(url, config),

  /** Upload with progress — one of axios's real conveniences. */
  upload(url, file, onProgress) {
    const form = new FormData();
    form.append('file', file);

    return http.post(url, form, {
      onUploadProgress: (event) => {
        if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
      },
    });
  },
};

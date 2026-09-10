/**
 * The API client — one place that knows how to talk to the server.
 *
 * Everything a real app needs and a bare `fetch` call does not have:
 *   base URL, JSON encode/decode, timeouts, cancellation, retries with
 *   exponential backoff + jitter, request/response interceptors, and a
 *   single normalised error type.
 *
 * The rule this enforces: NO component ever calls fetch() directly.
 * Components call endpoint functions; endpoint functions call this.
 */

import { HttpError, TimeoutError, normaliseError, AbortError } from './errors.js';

const DEFAULTS = {
  baseURL: '',
  timeout: 15000,
  retries: 2,
  retryDelay: 500,        // base for exponential backoff
  credentials: 'same-origin',
  headers: { Accept: 'application/json' },
};

export function createClient(config = {}) {
  const options = { ...DEFAULTS, ...config, headers: { ...DEFAULTS.headers, ...config.headers } };

  /**
   * Interceptors let you add cross-cutting behaviour (auth headers, logging,
   * 401 refresh) without touching call sites.
   *   request:  (config) => config | Promise<config>
   *   response: (data, response, config) => data | Promise<data>
   *   error:    (error, config, retry) => throws, or returns data to recover
   */
  const interceptors = { request: [], response: [], error: [] };

  /** Build the final URL, appending query params and dropping nullish ones. */
  function buildUrl(path, params) {
    const base = options.baseURL.replace(/\/+$/, '');
    const rel = String(path).replace(/^\/+/, '');
    const url = new URL(base ? `${base}/${rel}` : `/${rel}`, base || globalThis.location?.origin || 'http://localhost');

    for (const [key, value] of Object.entries(params ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      // Arrays become repeated keys: ?tag=a&tag=b
      if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, String(v)));
      else url.searchParams.set(key, String(value));
    }

    return url.toString();
  }

  /** Parse by content type — never assume JSON, or a 204 will throw. */
  async function parseBody(response) {
    if (response.status === 204 || response.headers.get('Content-Length') === '0') return null;

    const type = response.headers.get('Content-Type') ?? '';
    if (type.includes('application/json') || type.includes('+json')) {
      // A body can still be empty despite the header.
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    if (type.startsWith('text/')) return response.text();
    return response.blob();
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /** Exponential backoff with full jitter, so retries don't stampede. */
  function backoffDelay(attempt, base) {
    const exponential = base * 2 ** attempt;
    return Math.random() * Math.min(exponential, 30000);
  }

  async function request(path, requestConfig = {}) {
    let config = {
      method: 'GET',
      path,
      params: undefined,
      body: undefined,
      headers: {},
      timeout: options.timeout,
      retries: options.retries,
      signal: undefined,
      ...requestConfig,
    };

    // --- request interceptors (auth headers, tracing, etc.) ---
    for (const interceptor of interceptors.request) {
      config = await interceptor(config);
    }

    const url = buildUrl(config.path, config.params);
    const isFormData = typeof FormData !== 'undefined' && config.body instanceof FormData;

    const headers = {
      ...options.headers,
      // Let the browser set the multipart boundary itself — setting
      // Content-Type manually on FormData breaks the upload.
      ...(config.body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...config.headers,
    };

    const maxAttempts = (config.retries ?? 0) + 1;
    let lastError;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // A fresh controller per attempt; the caller's signal aborts all of them.
      const controller = new AbortController();
      const onCallerAbort = () => controller.abort(config.signal?.reason);

      if (config.signal) {
        if (config.signal.aborted) throw new AbortError('Request was cancelled');
        config.signal.addEventListener('abort', onCallerAbort, { once: true });
      }

      const timer = config.timeout
        ? setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), config.timeout)
        : null;

      try {
        const response = await fetch(url, {
          method: config.method,
          headers,
          credentials: options.credentials,
          signal: controller.signal,
          body: config.body === undefined ? undefined : isFormData ? config.body : JSON.stringify(config.body),
        });

        if (!response.ok) {
          const errorBody = await parseBody(response).catch(() => null);

          throw new HttpError(
            errorBody?.message ?? `${response.status} ${response.statusText}`,
            {
              status: response.status,
              statusText: response.statusText,
              body: errorBody,
              headers: response.headers,
              url,
              method: config.method,
              requestId: response.headers.get('X-Request-Id') ?? undefined,
            }
          );
        }

        let data = await parseBody(response);

        // --- response interceptors (unwrap envelopes, camelise, etc.) ---
        for (const interceptor of interceptors.response) {
          data = await interceptor(data, response, config);
        }

        return data;
      } catch (rawError) {
        // The caller cancelled: propagate immediately, never retry.
        if (config.signal?.aborted) throw new AbortError('Request was cancelled', { cause: rawError });

        const error = normaliseError(rawError, { url, method: config.method });
        lastError = error;

        // --- error interceptors: a 401 handler can refresh and recover here ---
        let recovered;
        let didRecover = false;

        for (const interceptor of interceptors.error) {
          const result = await interceptor(error, config, () => request(path, { ...config, retries: 0 }));
          if (result !== undefined) {
            recovered = result;
            didRecover = true;
            break;
          }
        }

        if (didRecover) return recovered;

        const isLastAttempt = attempt === maxAttempts - 1;
        if (isLastAttempt || !error.isRetryable) throw error;

        // Honour Retry-After when the server sent one (429 / 503).
        const delay = error.retryAfterMs ?? backoffDelay(attempt, options.retryDelay);
        await sleep(delay);
      } finally {
        if (timer) clearTimeout(timer);
        config.signal?.removeEventListener('abort', onCallerAbort);
      }
    }

    throw lastError;
  }

  return {
    request,
    get: (path, config) => request(path, { ...config, method: 'GET' }),
    post: (path, body, config) => request(path, { ...config, method: 'POST', body }),
    put: (path, body, config) => request(path, { ...config, method: 'PUT', body }),
    patch: (path, body, config) => request(path, { ...config, method: 'PATCH', body }),
    delete: (path, config) => request(path, { ...config, method: 'DELETE' }),

    interceptors: {
      request: { use: (fn) => (interceptors.request.push(fn), () => remove(interceptors.request, fn)) },
      response: { use: (fn) => (interceptors.response.push(fn), () => remove(interceptors.response, fn)) },
      error: { use: (fn) => (interceptors.error.push(fn), () => remove(interceptors.error, fn)) },
    },
  };
}

function remove(list, fn) {
  const index = list.indexOf(fn);
  if (index !== -1) list.splice(index, 1);
}

/** The app-wide singleton. */
export const apiClient = createClient({
  baseURL: import.meta?.env?.VITE_API_URL ?? process.env?.REACT_APP_API_URL ?? '/api',
  timeout: 15000,
  retries: 2,
  credentials: 'include', // send the httpOnly session cookie
});

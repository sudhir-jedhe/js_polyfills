/**
 * Error taxonomy for a REST layer.
 *
 * The single most useful thing an API layer does is turn every possible
 * failure into ONE predictable shape. Without this, every component ends up
 * writing `err.response?.data?.message ?? err.message ?? 'Something failed'`.
 *
 * Four things can go wrong, and the UI reacts differently to each:
 *   - the request never left / never came back   -> NetworkError   (retry)
 *   - it took too long                            -> TimeoutError   (retry)
 *   - we deliberately cancelled it                -> AbortError     (ignore!)
 *   - the server answered with a non-2xx          -> HttpError      (branch on status)
 */

export class ApiError extends Error {
  constructor(message, { cause, requestId } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
    this.requestId = requestId;
    // Keeps the stack pointing at the caller rather than this constructor.
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }

  /** Should the caller retry this on its own? */
  get isRetryable() {
    return false;
  }

  /** Safe to show a user verbatim? Server validation text usually is; stack traces are not. */
  get isUserFacing() {
    return false;
  }
}

/** DNS failure, offline, CORS rejection, connection reset. */
export class NetworkError extends ApiError {
  get isRetryable() {
    return true;
  }
}

/** Our own deadline elapsed before the server answered. */
export class TimeoutError extends ApiError {
  constructor(message, { timeoutMs, ...rest } = {}) {
    super(message, rest);
    this.timeoutMs = timeoutMs;
  }
  get isRetryable() {
    return true;
  }
}

/**
 * WE cancelled the request (unmount, superseded search keystroke).
 * This is not a failure — never surface it as an error state.
 */
export class AbortError extends ApiError {}

/** The server responded, but with a non-2xx status. */
export class HttpError extends ApiError {
  constructor(message, { status, statusText, body, headers, url, method, ...rest } = {}) {
    super(message, rest);
    this.status = status;
    this.statusText = statusText;
    this.body = body;       // the parsed error payload, when there was one
    this.headers = headers;
    this.url = url;
    this.method = method;
  }

  get isRetryable() {
    // 408 Request Timeout, 429 Too Many Requests, and 5xx are worth retrying.
    // 4xx generally are not — the same request will fail the same way.
    return this.status === 408 || this.status === 429 || this.status >= 500;
  }

  get isUserFacing() {
    // Server-authored 4xx messages are meant for humans; 5xx text is not.
    return this.status >= 400 && this.status < 500;
  }

  get isAuthError() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidationError() {
    return this.status === 400 || this.status === 422;
  }

  /**
   * Field-level validation errors, normalised to { field: message }.
   * Handles the three shapes APIs actually ship.
   */
  get fieldErrors() {
    const body = this.body;
    if (!body || typeof body !== 'object') return {};

    // Shape A (RFC 9457 problem+json): { errors: { email: ["is taken"] } }
    if (body.errors && !Array.isArray(body.errors)) {
      return Object.fromEntries(
        Object.entries(body.errors).map(([field, msgs]) => [
          field,
          Array.isArray(msgs) ? msgs[0] : String(msgs),
        ])
      );
    }

    // Shape B: { errors: [{ field: 'email', message: 'is taken' }] }
    if (Array.isArray(body.errors)) {
      return Object.fromEntries(
        body.errors
          .filter((e) => e && (e.field || e.path))
          .map((e) => [e.field ?? e.path, e.message ?? e.detail ?? 'Invalid'])
      );
    }

    // Shape C: { email: 'is taken' }
    const entries = Object.entries(body).filter(([, v]) => typeof v === 'string');
    return entries.length ? Object.fromEntries(entries) : {};
  }

  /** How long to wait before retrying, if the server told us. */
  get retryAfterMs() {
    const header = this.headers?.get?.('Retry-After');
    if (!header) return null;

    // Retry-After is either seconds or an HTTP date.
    const seconds = Number(header);
    if (Number.isFinite(seconds)) return seconds * 1000;

    const date = Date.parse(header);
    return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
  }
}

/**
 * Turn ANY thrown value into an ApiError subclass.
 * Call this at exactly one place — the client's catch — so nothing else
 * in the app has to guess what it caught.
 */
export function normaliseError(error, context = {}) {
  if (error instanceof ApiError) return error;

  // fetch + AbortController: a cancelled request throws a DOMException.
  if (error?.name === 'AbortError') {
    return new AbortError('Request was cancelled', { cause: error, ...context });
  }

  if (error?.name === 'TimeoutError') {
    return new TimeoutError('Request timed out', { cause: error, ...context });
  }

  // fetch rejects with a bare TypeError for every transport-level failure.
  if (error instanceof TypeError) {
    return new NetworkError('Network request failed — check your connection', {
      cause: error,
      ...context,
    });
  }

  return new ApiError(error?.message || 'Unexpected error', { cause: error, ...context });
}

/**
 * The one function your UI calls. Never returns a stack trace or a raw 5xx body.
 */
export function toUserMessage(error) {
  if (error instanceof AbortError) return null; // nothing to show
  if (error instanceof NetworkError) return "You appear to be offline. Check your connection and try again.";
  if (error instanceof TimeoutError) return 'That took too long. Please try again.';

  if (error instanceof HttpError) {
    if (error.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.status === 403) return "You don't have permission to do that.";
    if (error.status === 404) return "We couldn't find what you were looking for.";
    if (error.status === 429) return 'Too many requests. Please wait a moment.';
    if (error.status >= 500) return 'Something went wrong on our end. Please try again.';

    // 4xx: prefer the server's own wording, which is written for users.
    return error.body?.message ?? error.body?.detail ?? error.message;
  }

  return 'Something went wrong. Please try again.';
}

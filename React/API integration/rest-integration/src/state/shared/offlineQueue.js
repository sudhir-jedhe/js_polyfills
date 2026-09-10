/**
 * Offline mutation queue.
 *
 * Reads degrade gracefully offline — you show the cache. WRITES do not: the
 * request fails and the user's work is gone. The fix is to queue mutations
 * while offline and replay them when the connection returns.
 *
 * Four things this has to get right, and each one is a bug if you skip it:
 *
 *   1. IDEMPOTENCY. A replay may duplicate a write the server already
 *      received (the response was lost, not the request). Every queued
 *      mutation carries a client-generated key the server dedupes on.
 *
 *   2. ORDER. "create post" then "edit post" must replay in that order, and
 *      the edit needs the id the create returned. Hence sequential replay
 *      with a variable-rewrite step.
 *
 *   3. PERSISTENCE. A queue in memory dies with the tab. It lives in
 *      IndexedDB (via localStorage here for brevity).
 *
 *   4. GIVING UP. A mutation that fails with a 4xx will never succeed on
 *      replay. Drop it and tell the user, rather than retrying forever.
 */

const STORAGE_KEY = 'app:mutation-queue';
const MAX_ATTEMPTS = 5;

/** RFC 4122 v4, or a good-enough fallback. */
const uuid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(queue) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Quota exceeded — drop the oldest half rather than losing everything.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(-Math.ceil(queue.length / 2))));
    } catch {
      /* give up silently; the in-memory queue still works this session */
    }
  }
}

export function createOfflineQueue({ handlers, onChange, isOnline = () => navigator.onLine } = {}) {
  let queue = load();
  let replaying = false;

  const notify = () => onChange?.(list());

  /** What the UI renders: pending count, and anything that gave up. */
  const list = () => queue.map(({ id, type, attempts, error }) => ({ id, type, attempts, error }));

  /**
   * Enqueue a mutation.
   * @param {string} type      a key into `handlers`
   * @param {object} variables serialisable arguments
   */
  function enqueue(type, variables) {
    const entry = {
      id: uuid(),
      idempotencyKey: uuid(), // the server dedupes on this
      type,
      variables,
      attempts: 0,
      queuedAt: Date.now(),
      error: null,
    };

    queue.push(entry);
    save(queue);
    notify();

    // If we're online, try immediately — the queue is not offline-only.
    if (isOnline()) replay();

    return entry.id;
  }

  /**
   * Replay sequentially. Sequential matters: parallel replay reorders
   * dependent writes and can create duplicates.
   */
  async function replay() {
    if (replaying || !isOnline()) return;

    replaying = true;

    try {
      while (queue.length > 0 && isOnline()) {
        const entry = queue[0];
        const handler = handlers[entry.type];

        if (!handler) {
          // The app shipped a new version and this type no longer exists.
          queue.shift();
          save(queue);
          continue;
        }

        try {
          const result = await handler(entry.variables, {
            idempotencyKey: entry.idempotencyKey,
          });

          // Let a completed mutation rewrite the ones behind it — e.g. the
          // temp id from an offline "create" becomes the real id.
          if (result?.idMapping) applyIdMapping(result.idMapping);

          queue.shift();
          save(queue);
          notify();
        } catch (error) {
          entry.attempts += 1;

          // A 4xx will fail identically forever. Stop.
          const permanent = error?.status >= 400 && error?.status < 500 && error?.status !== 429;

          if (permanent || entry.attempts >= MAX_ATTEMPTS) {
            entry.error = error?.message ?? 'Failed';
            queue.shift();
            failed.push(entry);
            save(queue);
            notify();
            continue;
          }

          // Transient: stop the loop and wait for the next online event or
          // backoff timer. Do NOT drop the entry.
          save(queue);
          notify();

          await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** entry.attempts, 30_000)));
          break;
        }
      }
    } finally {
      replaying = false;
    }
  }

  const failed = [];

  /** Rewrite temp ids across every queued entry after a create succeeds. */
  function applyIdMapping(mapping) {
    const json = JSON.stringify(queue);
    const rewritten = Object.entries(mapping).reduce(
      (acc, [tempId, realId]) => acc.split(`"${tempId}"`).join(`"${realId}"`),
      json
    );
    queue = JSON.parse(rewritten);
    save(queue);
  }

  function remove(id) {
    queue = queue.filter((e) => e.id !== id);
    save(queue);
    notify();
  }

  function clear() {
    queue = [];
    save(queue);
    notify();
  }

  /** Replay whenever the browser says we're back. */
  function install() {
    const onOnline = () => replay();
    window.addEventListener('online', onOnline);

    // `online` lies sometimes (captive portals), so also retry on focus.
    const onFocus = () => isOnline() && replay();
    window.addEventListener('focus', onFocus);

    if (isOnline()) replay();

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('focus', onFocus);
    };
  }

  return { enqueue, replay, list, remove, clear, install, failed, get size() { return queue.length; } };
}

/**
 * Wrap a mutation so it queues instead of failing when offline.
 *
 *   const save = withOfflineFallback('updateUser', users.update, queue);
 *   save({ id, changes });   // online -> request; offline -> queued
 */
export function withOfflineFallback(type, mutationFn, queue) {
  return async (variables) => {
    if (!navigator.onLine) {
      queue.enqueue(type, variables);
      // Return a shape the optimistic update can use, so the UI still moves.
      return { queued: true, ...variables };
    }

    try {
      return await mutationFn(variables);
    } catch (error) {
      // The connection dropped mid-flight — queue rather than lose the write.
      if (error?.name === 'NetworkError' || !navigator.onLine) {
        queue.enqueue(type, variables);
        return { queued: true, ...variables };
      }
      throw error;
    }
  };
}

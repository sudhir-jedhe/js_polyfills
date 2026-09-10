/**
 * The API surface: one function per endpoint, grouped by resource.
 *
 * Why bother instead of calling the client inline?
 *   - the URL shape lives in ONE place, so a route change is a one-line edit
 *   - request/response mapping (snake_case <-> camelCase, dates) is centralised
 *   - components import `users.list` and never think about HTTP at all
 *   - it is trivially mockable in tests
 */

import { apiClient } from './client.js';

/* ---- mappers: keep server shapes out of your components ---- */

const toUser = (dto) => ({
  id: dto.id,
  name: dto.full_name ?? dto.name,
  email: dto.email,
  avatarUrl: dto.avatar_url ?? null,
  role: dto.role ?? 'member',
  createdAt: dto.created_at ? new Date(dto.created_at) : null,
});

const fromUser = (user) => ({
  full_name: user.name,
  email: user.email,
  role: user.role,
});

/** Normalise the three pagination envelopes APIs actually use. */
const toPage = (dto, mapItem) => ({
  items: (dto.items ?? dto.data ?? dto.results ?? []).map(mapItem),
  total: dto.total ?? dto.count ?? dto.meta?.total ?? 0,
  page: dto.page ?? dto.meta?.page ?? 1,
  pageSize: dto.page_size ?? dto.per_page ?? dto.meta?.per_page ?? 20,
  nextCursor: dto.next_cursor ?? dto.meta?.next_cursor ?? null,
  hasMore: dto.has_more ?? Boolean(dto.next_cursor ?? dto.next),
});

/* ---- resources ---- */

export const users = {
  list: ({ page = 1, pageSize = 20, search, signal } = {}) =>
    apiClient
      .get('/users', { params: { page, page_size: pageSize, q: search }, signal })
      .then((dto) => toPage(dto, toUser)),

  byId: (id, { signal } = {}) => apiClient.get(`/users/${id}`, { signal }).then(toUser),

  create: (user) => apiClient.post('/users', fromUser(user)).then(toUser),

  update: (id, changes) => apiClient.patch(`/users/${id}`, fromUser(changes)).then(toUser),

  remove: (id) => apiClient.delete(`/users/${id}`),

  /** Cursor pagination, for infinite lists. */
  feed: ({ cursor, limit = 20, signal } = {}) =>
    apiClient
      .get('/users/feed', { params: { cursor, limit }, signal })
      .then((dto) => toPage(dto, toUser)),

  /** Upload with progress needs XHR — fetch cannot report upload progress. */
  uploadAvatar: (id, file, onProgress) => uploadFile(`/users/${id}/avatar`, file, onProgress),
};

export const posts = {
  list: ({ authorId, signal } = {}) =>
    apiClient.get('/posts', { params: { author_id: authorId }, signal }),

  byId: (id, { signal } = {}) => apiClient.get(`/posts/${id}`, { signal }),

  create: (post) => apiClient.post('/posts', post),

  update: (id, changes) => apiClient.patch(`/posts/${id}`, changes),

  remove: (id) => apiClient.delete(`/posts/${id}`),
};

/**
 * File upload with progress.
 *
 * `fetch` still cannot report UPLOAD progress in browsers, so this is the one
 * place XMLHttpRequest is genuinely the right tool.
 */
export function uploadFile(path, file, onProgress) {
  const xhr = new XMLHttpRequest();

  const promise = new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);

    xhr.open('POST', path);
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(xhr.responseText ? JSON.parse(xhr.responseText) : null);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.send(form);
  });

  // Attach the canceller to the promise, so callers can abort an upload:
  //   const p = uploadFile(...); p.cancel();
  promise.cancel = () => xhr.abort();
  return promise;
}

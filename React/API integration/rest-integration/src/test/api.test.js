/**
 * Tests for the API layer and the hooks built on it.
 *
 * Run with Vitest + @testing-library/react + jsdom.
 */

import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

import { server, failOnce } from './handlers.js';
import { createClient } from '../api/client.js';
import { HttpError, NetworkError, AbortError, toUserMessage } from '../api/errors.js';
import { useApi } from '../hooks/useApi.js';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const client = createClient({ baseURL: 'http://localhost/api', retries: 0 });

describe('client', () => {
  it('parses a JSON response', async () => {
    const page = await client.get('/users');
    expect(page.items).toHaveLength(2);
  });

  it('appends query params and drops nullish ones', async () => {
    const page = await client.get('/users', { params: { q: 'ada', page: null } });
    expect(page.items).toHaveLength(1);
  });

  it('throws HttpError with the parsed body on 4xx', async () => {
    // fetch does NOT reject on 404 — this asserts our wrapper does.
    await expect(client.get('/users/999')).rejects.toThrow(HttpError);

    const error = await client.get('/users/999').catch((e) => e);
    expect(error.status).toBe(404);
    expect(error.isNotFound).toBe(true);
    expect(error.isRetryable).toBe(false);
  });

  it('exposes field errors from a 422', async () => {
    const error = await client.post('/users', { email: 'nope' }).catch((e) => e);

    expect(error.isValidationError).toBe(true);
    expect(error.fieldErrors).toEqual({ email: 'must be a valid email' });
  });

  it('retries retryable failures then succeeds', async () => {
    const retrying = createClient({ baseURL: 'http://localhost/api', retries: 2, retryDelay: 1 });

    failOnce('/users'); // first call 500s, the retry hits the normal handler
    const page = await retrying.get('/users');

    expect(page.items).toHaveLength(2);
  });

  it('does NOT retry a 404', async () => {
    const retrying = createClient({ baseURL: 'http://localhost/api', retries: 3, retryDelay: 1 });
    const start = Date.now();

    await expect(retrying.get('/users/999')).rejects.toThrow(HttpError);

    // If it had retried three times with backoff this would take much longer.
    expect(Date.now() - start).toBeLessThan(200);
  });

  it('times out', async () => {
    const impatient = createClient({ baseURL: 'http://localhost/api', timeout: 50, retries: 0 });
    await expect(impatient.get('/slow')).rejects.toThrow(/timed out/i);
  });

  it('aborts when the caller cancels', async () => {
    const controller = new AbortController();
    const promise = client.get('/slow', { signal: controller.signal });

    controller.abort();
    await expect(promise).rejects.toThrow(AbortError);
  });

  it('returns null for a 204', async () => {
    expect(await client.delete('/users/2')).toBeNull();
  });
});

describe('toUserMessage', () => {
  it('never surfaces a 5xx body to the user', () => {
    const error = new HttpError('kaboom', { status: 500, body: { stack: 'secret' } });
    expect(toUserMessage(error)).toBe('Something went wrong on our end. Please try again.');
  });

  it('prefers the server wording for 4xx', () => {
    const error = new HttpError('x', { status: 400, body: { message: 'Name is required' } });
    expect(toUserMessage(error)).toBe('Name is required');
  });

  it('returns null for an abort, so nothing is rendered', () => {
    expect(toUserMessage(new AbortError('cancelled'))).toBeNull();
  });
});

describe('useApi', () => {
  it('moves from loading to data', async () => {
    const { result } = renderHook(() => useApi(({ signal }) => client.get('/users', { signal }), []));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data.items).toHaveLength(2);
  });

  it('exposes a user-facing message on failure', async () => {
    const { result } = renderHook(() =>
      useApi(({ signal }) => client.get('/users/999', { signal }), [])
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.errorMessage).toMatch(/couldn't find/i);
  });

  it('does not set state after unmount', async () => {
    const spy = vi.spyOn(console, 'error');
    const { unmount } = renderHook(() => useApi(({ signal }) => client.get('/slow', { signal }), []));

    unmount(); // aborts the in-flight request
    await new Promise((r) => setTimeout(r, 50));

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('ignores a stale response when deps change (race condition)', async () => {
    let resolveFirst;
    const fetcher = vi
      .fn()
      .mockImplementationOnce(() => new Promise((r) => { resolveFirst = () => r('SLOW-FIRST'); }))
      .mockImplementationOnce(() => Promise.resolve('FAST-SECOND'));

    const { result, rerender } = renderHook(({ q }) => useApi(() => fetcher(q), [q]), {
      initialProps: { q: 'a' },
    });

    rerender({ q: 'ab' });                       // second request supersedes the first
    await waitFor(() => expect(result.current.data).toBe('FAST-SECOND'));

    act(() => resolveFirst());                    // the slow first one lands late
    await new Promise((r) => setTimeout(r, 20));

    // It must NOT overwrite the newer result.
    expect(result.current.data).toBe('FAST-SECOND');
  });
});

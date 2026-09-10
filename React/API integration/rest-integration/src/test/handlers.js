/**
 * Mocking the API with MSW (Mock Service Worker).
 *
 * Why MSW rather than jest.mock('axios') or a stubbed fetch:
 *   - it intercepts at the NETWORK layer, so your real client code runs —
 *     interceptors, error normalisation, retries and all
 *   - the same handlers work in tests, Storybook and local dev
 *   - swapping fetch for axios later does not touch a single test
 *
 * Mocking the module means you are testing your mock, not your code.
 */

import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';

const BASE = 'http://localhost/api';

const db = {
  users: [
    { id: 1, full_name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin' },
    { id: 2, full_name: 'Alan Turing', email: 'alan@example.com', role: 'member' },
  ],
};

export const handlers = [
  http.get(`${BASE}/users`, async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('q')?.toLowerCase();
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('page_size') ?? 20);

    let items = db.users;
    if (search) items = items.filter((u) => u.full_name.toLowerCase().includes(search));

    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      page_size: pageSize,
    });
  }),

  http.get(`${BASE}/users/:id`, ({ params }) => {
    const user = db.users.find((u) => u.id === Number(params.id));
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  http.post(`${BASE}/users`, async ({ request }) => {
    const body = await request.json();

    if (!body.email?.includes('@')) {
      // Exercise the validation-error path.
      return HttpResponse.json(
        { message: 'Validation failed', errors: { email: ['must be a valid email'] } },
        { status: 422 }
      );
    }

    const created = { id: db.users.length + 1, ...body };
    db.users.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${BASE}/users/:id`, async ({ params, request }) => {
    const body = await request.json();
    const user = db.users.find((u) => u.id === Number(params.id));
    Object.assign(user, body);
    return HttpResponse.json(user);
  }),

  http.delete(`${BASE}/users/:id`, ({ params }) => {
    db.users = db.users.filter((u) => u.id !== Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),

  /* ---- failure scenarios, opted into per test ---- */

  http.get(`${BASE}/flaky`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Server error' }, { status: 500 });
  }),

  http.get(`${BASE}/slow`, async () => {
    await delay('infinite'); // never resolves — exercises timeouts and aborts
  }),
];

export const server = setupServer(...handlers);

/** Per-test override: force one endpoint to fail. */
export const failOnce = (path, status = 500, body = { message: 'Boom' }) =>
  server.use(http.get(`${BASE}${path}`, () => HttpResponse.json(body, { status }), { once: true }));

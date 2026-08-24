# Scenario: A Mobile App Needs Your Product Data

Your team ships a Next.js web storefront. Now the company is building a React Native mobile app that needs to read and search the same product catalog, and eventually a partner wants to integrate via API too. Someone on the team suggests "just reuse the Server Actions we already wrote for the web cart."

**Approach:**

Server Actions are out for this — they're an internal RPC mechanism tied to React's action-calling convention and aren't designed to be a stable, externally documented contract. A React Native app and a third-party partner both need a real HTTP API: predictable URLs, standard JSON request/response shapes, versioning, and documented status codes.

Build Route Handlers under `app/api/`:

```js
// app/api/products/route.js
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q');
  const category = searchParams.get('category');

  const products = await productService.search({ q, category });
  return Response.json({ data: products, count: products.length });
}
```

```js
// app/api/products/[id]/route.js
export async function GET(request, { params }) {
  const product = await productService.getById(params.id);
  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }
  return Response.json({ data: product });
}
```

Key decisions to call out in an interview:

1. **Extract shared logic into a service layer** (`productService`) so both the Route Handler *and* any internal Server Component data-fetching call the same functions — no duplicated query logic.
2. **Add API versioning early** if partner integration is planned: `app/api/v1/products/route.js`, so breaking changes later don't break existing mobile clients.
3. **Rate limiting and auth** belong at this layer too (e.g., an API key check reading `request.headers.get('x-api-key')`), since external consumers aren't protected by same-origin cookies the way your own web app is.
4. **Caching**: since this `GET` doesn't read cookies, it's eligible for Next.js's static/ISR caching if the catalog doesn't change every second — consider `export const revalidate = 60` rather than hitting the DB on every request.

The web cart's Server Actions stay untouched — they continue to serve the internal "add to cart" form mutation efficiently, with no reason to route through this public API internally.

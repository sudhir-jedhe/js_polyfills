# When to Use a Route Handler vs. a Server Action

This is the single most common senior-level question on this topic, because picking wrong shows up as either a security hole or unnecessary complexity in production code.

**Use a Route Handler when the consumer isn't your own React tree.** If a mobile app, a third-party integration, a webhook sender (Stripe, GitHub), a public API consumer, or `curl` needs to hit an endpoint, it needs a real, stable, URL-addressable HTTP contract with documented methods and status codes. Server Actions are not meant to be called by arbitrary external clients — although they *do* create an HTTP endpoint under the hood, that endpoint's "API" is an internal serialized action reference, not a stable REST/JSON contract you'd want to document or version for outside consumers.

```js
// app/api/webhooks/stripe/route.js — MUST be a Route Handler
export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text(); // Stripe needs the raw, unparsed body
  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  // ...handle event
  return new Response(null, { status: 200 });
}
```

**Use a Server Action when the mutation is internal to your own UI** — a form on your site submitting to your own backend, with no need for a versioned public contract. Server Actions win here because they eliminate an entire layer of boilerplate: no manually writing `fetch('/api/notes', { method: 'POST', body: JSON.stringify(...) })` on the client, no manually parsing the response, no separate route file to keep in sync with the form's shape. Progressive enhancement (forms that work before hydration) is essentially free.

```jsx
// This has no reason to be a Route Handler — it's a same-app form mutation
'use server';
export async function updateProfile(formData) {
  const name = formData.get('name');
  await db.user.update({ where: { id: getCurrentUserId() }, data: { name } });
  revalidatePath('/profile');
}
```

A useful heuristic table to have ready verbally in an interview:

| Signal | Route Handler | Server Action |
|---|---|---|
| Consumed by external clients / mobile app | Yes | No |
| Needs specific HTTP status codes, custom headers, streaming | Yes | Awkward |
| Webhook receiver (needs raw body, signature verification) | Yes | No |
| Form submission on your own site | Overkill | Yes |
| Needs GraphQL-like flexible querying by many methods | Yes | No |
| Wants automatic pending/optimistic UI via `useFormStatus` | No | Yes |
| Needs caching as a public `GET` resource | Yes | N/A (actions are mutations) |

One more wrinkle worth naming: nothing stops you from using **both** — a Server Action for the internal form UX, and a Route Handler exposing the same underlying logic for external consumers, both calling into a shared service/repository function so the actual business logic (validation, DB writes) isn't duplicated. That's the pattern senior engineers reach for once an internal form's mutation logic needs to also be exposed publicly: extract the logic, keep two thin entry points.

Also worth remembering: Server Actions are strictly `POST`-shaped mutations invoked through React's action mechanism — they have no concept of `GET`/caching semantics the way a Route Handler does, so "should I fetch data with a Server Action" is almost always the wrong question; data fetching in Server Components uses plain `async`/`await` with `fetch` or a DB client directly, not Server Actions.

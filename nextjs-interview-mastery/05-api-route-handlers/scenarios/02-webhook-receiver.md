# Scenario: Receiving Stripe Webhooks

Your app needs to listen for Stripe payment events (`checkout.session.completed`, `invoice.paid`, etc.) so it can update order status in your database. Stripe will POST an event payload to a URL you register, and requires verifying a signature header against the *raw, unparsed* request body.

**Approach:**

This must be a Route Handler — it's an external, unauthenticated-by-cookies consumer hitting a public URL on a schedule you don't control. It also needs the raw body bytes, not a parsed JSON object, because Stripe's signature is computed over the exact byte string sent.

```js
// app/api/webhooks/stripe/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text(); // must NOT use request.json() here

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await orderService.markPaid(session.metadata.orderId);
      break;
    }
    case 'invoice.paid': {
      await subscriptionService.recordPayment(event.data.object);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always 200 quickly once handled — Stripe retries on non-2xx.
  return new Response(null, { status: 200 });
}

export const runtime = 'nodejs'; // Stripe's SDK needs Node APIs, not Edge
```

Key points to raise:

1. **Raw body, not parsed JSON** — calling `request.json()` first would prevent you from reconstructing the exact byte string Stripe signed, breaking verification.
2. **Always respond fast and with 2xx** once the event is safely queued/processed — Stripe retries with backoff on non-2xx responses, and slow handlers cause duplicate retries.
3. **Idempotency**: webhook delivery isn't exactly-once, so `markPaid`/`recordPayment` should be idempotent (e.g., check if the order is already marked paid before re-processing).
4. **Runtime choice**: this explicitly opts into the Node.js runtime because the Stripe SDK (and often crypto operations under the hood) rely on Node APIs unavailable on Edge.

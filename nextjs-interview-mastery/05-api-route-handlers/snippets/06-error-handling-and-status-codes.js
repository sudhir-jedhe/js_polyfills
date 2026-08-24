// app/api/orders/route.js
// Consistent error handling pattern with try/catch and proper status codes.

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Malformed JSON body' }, { status: 400 });
  }

  const { items } = body;
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json(
      { error: 'items must be a non-empty array' },
      { status: 422 }
    );
  }

  try {
    const order = await createOrder(items); // pretend DB call
    return Response.json(order, { status: 201 });
  } catch (err) {
    console.error('Failed to create order:', err);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createOrder(items) {
  return { id: 'ord_123', items, total: items.length * 10 };
}

# Problem: Distinguish a Server Component from a Client Component

## Task

Show a minimal, realistic example of a page split into a Server Component and a Client Component, with comments explaining what runs where. This is conceptual/file-based — it can't be fully executed outside an RSC-enabled framework (like Next.js App Router), since plain client-rendered React (Vite/CRA) has no server-component runtime.

## Solution

```jsx
// ============================================================
// app/products/[id]/page.jsx
// SERVER COMPONENT — this is the default for any file in an
// RSC-enabled framework's app directory that does NOT start
// with "use client".
//
// - Runs ONLY on the server, once per request.
// - Can be `async` and `await` server-only resources directly
//   (a database call here) — no API route needed.
// - Its JSX is turned into a description of DOM sent to the
//   client; NONE of this function's own code is included in
//   the client JS bundle.
// - Cannot use useState, useEffect, onClick, or any browser API
//   — there is no "instance" of it running in the browser to
//   hold that state.
// ============================================================
async function ProductPage({ params }) {
  // Direct server-side data access: no fetch() to your own API,
  // no client-side loading state — this literally blocks server
  // rendering of this component until the query resolves.
  const product = await db.products.findById(params.id);
  const relatedProducts = await db.products.findRelated(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>

      {/* AddToCartButton needs interactivity (a click handler and
          local state), so it's delegated to a Client Component.
          Only plain, serializable data (productId, a number) can
          cross this server→client boundary as props — you cannot
          pass a server-only function or a class instance down. */}
      <AddToCartButton productId={product.id} />

      <section>
        <h2>Related products</h2>
        {/* Still a Server Component — rendering more static,
            server-fetched content ships zero extra client JS. */}
        <ul>
          {relatedProducts.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ProductPage;

// ============================================================
// app/products/[id]/AddToCartButton.jsx
// CLIENT COMPONENT — opted in via the "use client" directive
// at the very top of the file.
//
// - Runs on the client (after being pre-rendered to HTML on the
//   server for the initial page load, like traditional SSR).
// - Its JS bundle IS shipped to the browser and hydrates here.
// - Can use useState, event handlers, effects, browser APIs —
//   all the "normal" React you already know.
// - Cannot directly call `db.products...` — it has no access to
//   server-only resources; it would need to call an API route or
//   a Server Action instead.
// ============================================================
"use client";

import { useState } from "react";

function AddToCartButton({ productId }) {
  const [status, setStatus] = useState("idle"); // idle | adding | added

  async function handleClick() {
    setStatus("adding");
    // Client-side network call to an API route (or a Server Action) —
    // this is how a Client Component reaches server-only resources.
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    setStatus("added");
  }

  return (
    <button onClick={handleClick} disabled={status === "adding"}>
      {status === "added" ? "Added to cart!" : "Add to cart"}
    </button>
  );
}

export default AddToCartButton;
```

## Why this split works

- `ProductPage` never ships its own code to the browser — its output is markup (and a description React can reconcile), computed once on the server per request. A user with a slow connection or an old device pays zero JS cost for the product description and related-products list.
- `AddToCartButton` is the one piece of the page that genuinely needs to run in the browser (to respond to a click and show interim state), so it — and only it — is marked `"use client"` and ships its JS.
- Props crossing the Server → Client boundary (`productId`) must be plain serializable data; you can't pass a function reference or a database connection down into a Client Component, which is why `AddToCartButton` makes its own `fetch` call rather than receiving a server function as a prop.

## Things to watch out for

- Marking a whole page `"use client"` "just to be safe" is the most common mistake — it silently opts the entire subtree back into shipping JS, losing the zero-bundle-cost benefit for content that never needed interactivity.
- This pattern only works inside a framework that implements the RSC contract (build-time compiler, server runtime, and bundler support) — you cannot add `"use client"`/Server Components to a plain Vite/CRA client-only app and expect this to run.

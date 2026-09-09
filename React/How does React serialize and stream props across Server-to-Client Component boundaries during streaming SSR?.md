***  How does React serialize and stream props across Server-to-Client Component boundaries during streaming SSR?.md ***

When rendering React Server Components (RSC) during streaming Server-Side Rendering (SSR), the server outputs two interleaved streams over the single HTTP response:

1. **The HTML Stream:** Rendered markup for fast initial paint.
2. **The RSC Flight Data Stream:** A compact, line-delimited JSON-like representation of the Virtual DOM tree, module metadata, and serialized prop payloads.

When a Server Component renders a Client Component (a component marked with `'use client'`), React cannot execute the Client Component on the server in the same way. Instead, it places a **Client Reference placeholder** in the Flight stream and serializes its props into that stream.

---

### 1. The Serialization Protocol (React Flight)

React does not use standard `JSON.stringify()` because standard JSON cannot represent circular structures, `undefined`, promises, dates, or binary buffers.

Instead, React Flight uses a custom serialization format with special type-tag prefixes:

```
M1:{"id":"./src/Button.tsx","name":"Button","chunks":["client-chunk-1"]}
J0:["$","$L1",null,{"label":"Click me","count":42,"date":"$D2026-08-26T12:00:00.000Z"}]

```

* **`M1:...` (Module Reference):** Declares a Client Component import (file path, export name, and client bundle chunk URL).
* **`J0:...` (Element Tree):** Represents a React Element (`$`) referencing the module `$L1` and holding the serialized props object.

#### Supported Serialized Data Types

| Data Type                        | Flight Protocol Representation                            | Client Reconstruction                                                |
| -------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| **Primitives & Plain Objects**   | Standard JSON syntax (`"text"`, `123`, `{}`)              | Regular JS types                                                     |
| **`undefined`**                  | `$undefined`                                              | Converted back to `undefined`                                        |
| **`Date`**                       | `$D<ISO-8601-string>`                                     | Instantiated via `new Date(...)`                                     |
| **`BigInt`**                     | `$n<string>`                                              | Instantiated via `BigInt(...)`                                       |
| **`Map` / `Set**`                | `$Q[...]` / `$W[...]`                                     | Instantiated via `new Map()` / `new Set()`                           |
| **`TypedArray` / `ArrayBuffer**` | Hex-encoded or base64 binary chunks                       | Converted back to typed buffers                                      |
| **Promises (`Promise<T>`)**      | Serialized as an asynchronous chunk ID reference (`$@id`) | Delivered on the client as a native `Promise` consumable via `use()` |
| **Server Actions**               | `$F<action-id>`                                           | Instantiated as executable callable proxy functions                  |
| **Functions / Classes**          | **❌ Not Serializable** (Throws a serialization error)     | N/A                                                                  |

---

### 2. Streaming Asynchronous Props (Promises & Suspense)

One of the most powerful features of RSC prop serialization is **streaming unresolved Promises** across the boundary.

A Server Component can pass an unresolved promise directly to a Client Component as a prop without `await`ing it on the server:

```tsx
// ServerComponent.server.tsx
import { ClientChat } from './ClientChat'; // 'use client'

export default function Page() {
  // Starts data fetch on the server, but does NOT block rendering
  const messagePromise = fetchRecentMessages();

  return <ClientChat messagesPromise={messagePromise} />;
}

```

```tsx
// ClientChat.tsx ('use client')
import { use } from 'react';

export function ClientChat({ messagesPromise }: { messagesPromise: Promise<string[]> }) {
  // React Suspense unwraps the streamed server promise on the client
  const messages = use(messagesPromise);

  return (
    <ul>
      {messages.map((m, i) => <li key={i}>{m}</li>)}
    </ul>
  );
}

```

#### How the Stream Handles This Under the Hood

1. **Immediate Flight Chunk (Row 0):** React streams the client component boundary immediately with a pointer to a future chunk ID:

```
J0:["$","$L1",null,{"messagesPromise":"$@2"}]

```

1. **Client Initializes Promise:** The browser runtime sees `$@2` and instantiates a pending `Promise` passed into `messagesPromise`. `<ClientChat>` suspends.
2. **Delayed Flight Chunk (Row 2):** When `fetchRecentMessages()` resolves on the server, React writes the resolved payload directly into the open stream:

```
2:[{"id":1,"text":"Hello from the server"}]

```

1. **Resolution:** The browser runtime receives chunk `2`, resolves the pending `Promise`, and React re-renders `<ClientChat>` without any additional network roundtrips.

---

### 3. Server Actions Serialization Across the Boundary

When a Server Action (a function marked with `'use server'`) is passed as a prop to a Client Component:

```tsx
// Server Component
async function updateUser(formData: FormData) {
  'use server';
  await db.user.update(...);
}

return <UserForm action={updateUser} />;

```

* React **does not serialize the function code**.
* It creates a unique cryptographic action ID referencing the server endpoint and serializes a function descriptor:

```json
{"action": "$F1"}

```

* On the client, React inflates `$F1` into an `async` function that sends a `POST` request back to the server with the action ID and arguments when invoked.

---

### 4. Client-Side Hydration and Reconciliation

During initial page load, the browser executes the following steps:

```
[Browser receives HTML stream]
   └── Paints static UI fast (First Contentful Paint)
          │
[Browser parses Flight Stream chunks concurrently]
   ├── 1. Downloads client JS module chunks referenced in `M` records
   ├── 2. Re-hydrates Client Components using props extracted from `J` records
   └── 3. Resolves in-flight `$@id` promises as streaming chunks arrive

```

Because the Flight stream contains the exact serialized props used to render the HTML on the server, the client hydrates the DOM tree with zero prop mismatch warnings and without needing extra `window.__INITIAL_DATA__` JSON blobs.

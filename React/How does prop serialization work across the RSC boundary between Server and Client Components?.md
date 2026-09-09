***  How does prop serialization work across the RSC boundary between Server and Client Components?.md ***

When a Server Component renders a Client Component (`'use client'`), it crosses the **Server-Client Component boundary**.

Because Server Components run in Node.js/Edge environments while Client Components hydrate and execute in the browser, props passed across this boundary cannot simply be shared in memory. Instead, React serializes the props into the **React Flight Data stream (RSC Payload)**, transmits them across the network, and deserializes them on the client.

---

### The React Flight Wire Protocol

Unlike standard `JSON.stringify`, React’s Flight serializer encodes a structured, streamed string format using special prefix identifiers:

```
[ Server Component ]
        │
        ▼  Serializes Props & Virtual DOM to Flight Stream
[ RSC Flight Payload (Chunked Text Stream) ]
  1:I["./Button.client.js", ["default"], ""]
  2:{"title":"Save","count":42,"date":"$D2026-08-21T05:53:15.000Z"}
        │
        ▼  Browser Deserializer reconstructs props & tree
[ Client Component ]

```

---

### What CAN Be Passed Across the Boundary (Serializable)

React Flight supports a richer set of data types than standard JSON:

| Supported Data Type                                                 | Serialized Format in Flight Stream                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Primitives** (`string`, `number`, `boolean`, `null`, `undefined`) | Standard JSON encoding (`"hello"`, `42`, `true`)                                     |
| **Plain Objects & Arrays**                                          | Nested JSON objects and arrays                                                       |
| **`Date` objects**                                                  | Serialized as a date string prefixed with `$D`: `"$D2026-08-21T..."`                 |
| **`BigInt`**                                                        | Serialized with `$n` prefix: `"$n9007199254740991"`                                  |
| **`Map` and `Set**`                                                 | Serialized as `$Q` (Map) or `$W` (Set) entries                                       |
| **`TypedArray` / `ArrayBuffer**`                                    | Serialized as Base64 or typed buffers (`$B`)                                         |
| **Promises**                                                        | Transmitted as stream chunk references (resolved via `use()` on the client)          |
| **React Elements / Children (`JSX`)**                               | Serialized as Flight component tree descriptors                                      |
| **Server Actions (`'use server'`)**                                 | Serialized as RPC endpoint metadata IDs (`$$typeof: Symbol(react.server.reference)`) |

---

### What CANNOT Be Passed (And Why It Throws)

Attempting to pass any of the following as a prop to a Client Component results in a **Serialization Error**:

#### 1. Regular Client Functions & Event Handlers

```jsx
// ❌ FAILS: Server Component cannot pass closures/event handlers to Client Components
import { ClientButton } from './ClientButton';

export default function ServerPage() {
  const handleClick = () => console.log('Clicked!'); // Cannot serialize JS closure
  
  return <ClientButton onClick={handleClick} />;
}

```

* **Why:** Functions carry closures and lexical environments that cannot be serialized across network boundaries.
* **Exception:** Server Actions defined with `'use server'` can be passed because React serializes them as remote callable endpoint IDs rather than transmitting the function body.

#### 2. Class Instances with Prototype Methods

```jsx
class UserEntity {
  constructor(name) { this.name = name; }
  getFullName() { return `User: ${this.name}`; }
}

// ❌ FAILS: Prototype methods are lost in serialization
<ClientCard user={new UserEntity('Alice')} />

```

* **Why:** Flight does not reconstruct prototype chains (`user.getFullName()` will be `undefined` on the client). Convert class instances to plain JavaScript objects (`{ name: 'Alice' }`) before passing them.

#### 3. DOM Nodes or Browser-Only Objects

```jsx
// ❌ FAILS: DOM nodes, Window, Canvas elements, WebSockets
<ClientViewer windowRef={globalThis.window} />

```

---

### Passing Children: The "Hole" Slot Optimization

A major pattern in RSC architecture is passing a Server Component *as the `children` prop* to a Client Component:

```jsx
// ServerPage.server.jsx
import { ClientContainer } from './ClientContainer'; // 'use client'
import { ServerFeed } from './ServerFeed';           // Server Component

export default function ServerPage() {
  return (
    <ClientContainer>
      {/* ServerFeed runs entirely on the server! */}
      <ServerFeed />
    </ClientContainer>
  );
}

```

#### How Flight handles this

1. React executes `<ServerFeed/>` on the server and serializes its rendered output directly into the Flight stream.
2. `ClientContainer` receives the pre-rendered JSX elements in its `children` prop.
3. **Result:** `ServerFeed`'s code bundle is **never sent to the client browser**, keeping client JS bundles minimal while allowing `ClientContainer` to manage client-side state (e.g., toggle state or scroll position).

---

### Passing Promises (Streamed Props with React 19 `use()`)

You can pass an unresolved Promise from a Server Component directly to a Client Component without awaiting it on the server:

```jsx
// 1. Server Component: Creates promise and passes it immediately (non-blocking)
import { ClientProfile } from './ClientProfile';

export default function ServerPage() {
  // Promise starts executing immediately in Node.js
  const userDataPromise = fetchUserData(123);

  return <ClientProfile userPromise={userDataPromise} />;
}

```

```jsx
// 2. Client Component ('use client'): Unwraps the streamed promise
'use client';
import { use } from 'react';

export function ClientProfile({ userPromise }) {
  // Reads the promise directly; suspends until resolved over the Flight stream
  const user = use(userPromise);

  return <div>Welcome, {user.name}</div>;
}

```

* **How Flight handles this:** The server sends a stream reference ID for the prop. When the promise resolves on the server, it streams the resolved value in a subsequent Flight chunk. The client's `use()` hook automatically receives the resolved data.

The **React Flight protocol** is React’s internal, line-delimited streaming wire format for **React Server Components (RSC)**. It enables the server to serialize an arbitrary Virtual DOM tree, module metadata, async promises, and binary data into an incremental stream that the client reconstructs into live React elements.

Unlike standard JSON, Flight supports circular references, deferred/out-of-order resolution, and types like `Date`, `BigInt`, `Map`, `Set`, `Promise`, and Server Actions.

---

### 1. High-Level Framing & Line Structure

A Flight stream consists of individual, newline-separated chunks (`\n`). Each row adheres to a strict prefix structure:

```
<HEX_ID>:<ROW_TYPE_OR_PAYLOAD>\n

```

* **`<HEX_ID>`**: A hexadecimal chunk identifier (e.g., `0`, `1`, `a`, `1f`). It acts as a reference pointer that can be referenced from other chunks before or after it has been sent.
* **`:`**: The separator delimiter.
* **`<ROW_TYPE_OR_PAYLOAD>`**: Either a typed descriptor (like a module or server action reference) or a serialized JSON-like Virtual DOM structure.

---

### 2. Primary Row Identifiers (Row Types)

Rows in the Flight stream are categorized by their single-letter or symbol prefixes:

| Row Prefix         | Name                     | Purpose                                                                 | Example Payload                                                    |
| ------------------ | ------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **`M`**            | **Module Reference**     | Declares an imported Client Component chunk to load.                    | `M1:{"id":"./src/Button.js","name":"Button","chunks":["client1"]}` |
| **`J` / `(none)**` | **Model Chunk**          | Represents a serialized React element tree, component, or prop payload. | `0:["$","div",null,{"className":"container","children":"$1"}]`     |
| **`S`**            | **Symbol**               | Declares a shared Symbol (e.g., React elements, fragments).             | `S1:Symbol(react.element)`                                         |
| **`E`**            | **Error**                | Emits a server rendering error without breaking the entire stream.      | `E2:{"message":"Database timeout","digest":"ERR_123"}`             |
| **`T`**            | **Text Stream**          | Streams raw text chunks into a text placeholder.                        | `T3:Hello world chunked text`                                      |
| **`W`**            | **Typed Array / Buffer** | Streams binary data (ArrayBuffers, Uint8Array).                         | `W4:base64_encoded_binary_string...`                               |

---

### 3. Special Value Tags (The `$` Type System)

Inside JSON payloads within Model Chunks (`J`), React uses string prefix tags starting with `$` to represent non-JSON types, references, and React primitives:

#### A. React Elements (`$`)

A React Element (`jsx(...)` / `React.createElement(...)`) is serialized as a 4-element tuple:

```
["$", <type>, <key>, <props>]

```

* **`"$" = Symbol(react.element)`** (or `"$L1"` referencing a Client Component module `$L1`).
* **HTML Element Example:**

```json
["$","h1",null,{"children":"Hello World"}]

```

* **Client Component Example:**

```json
["$","$L1",null,{"label":"Click Me"}]

```

#### B. Type Prefixes

| Prefix           | Serialized Example             | Reconstructed Client Value                               |
| ---------------- | ------------------------------ | -------------------------------------------------------- |
| **`$L<id>`**     | `"$L1"`                        | Lazy Client Component module reference (points to `M1`). |
| **`$@<id>`**     | `"$@2"`                        | **Async Promise reference** (deferred chunk resolution). |
| **`$D<iso>`**    | `"$D2026-08-26T12:45:00.000Z"` | `new Date(...)` instance.                                |
| **`$n<num>`**    | `"$n9007199254740993"`         | `BigInt(9007199254740993)`                               |
| **`$undefined`** | `"$undefined"`                 | `undefined` (which JSON normally omits).                 |
| **`$Q[...]`**    | `"$Q[[1, "a"], [2, "b"]]"`     | `new Map(...)` instance.                                 |
| **`$W[...]`**    | `"$W[1, 2, 3]"`                | `new Set(...)` instance.                                 |
| **`$F<id>`**     | `"$F3"`                        | **Server Action / Bound Function reference**.            |
| **`$$`**         | `"$$"`                         | Escaped literal `$` character in strings.                |

---

### 4. Wire Walkthrough: Resolving Streaming Promises & Suspense

Here is an end-to-end example of what the Flight stream looks like when rendering a Server Component that renders a static shell, a Client Component, and an async suspended data fetch.

#### Component Code

```tsx
// ServerComponent.server.tsx
import { Suspense } from 'react';
import { ClientAvatar } from './ClientAvatar'; // 'use client'

export default async function Page() {
  const profilePromise = fetchProfile(); // Async Promise

  return (
    <div>
      <ClientAvatar />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileDetails profilePromise={profilePromise} />
      </Suspense>
    </div>
  );
}

```

#### Emitted Flight Stream (Row by Row)

```http
M1:{"id":"./src/ClientAvatar.tsx","name":"ClientAvatar","chunks":["client-avatar.js"],"async":true}
0:["$","div",null,{"children":[["$","$L1",null,{}],["$","$Sreact.suspense",null,{"fallback":["$","div",null,{"children":"Loading..."}],"children":"$@2"}]]}]
2:{"name":"Alex","bio":"Software Engineer","joinedDate":"$D2026-01-15T00:00:00.000Z"}

```

#### Protocol Execution Breakdown

1. **Row 1 (`M1:...`):**

* Declares module reference `1` pointing to `./src/ClientAvatar.tsx` located in chunk `client-avatar.js`.
* The client immediately begins prefetching `client-avatar.js` in the background.

1. **Row 2 (`0:...`):**

* Emits the root element `0`: a `<div>` element.
* Inside the `children` array:
* Child 1: `["$","$L1",null,{}]` renders the lazy client component from module `1`.
* Child 2: `["$","$Sreact.suspense",...]` renders the `<Suspense>` boundary.
* The `children` of Suspense points to **`"$@2"`** (a pending Promise for chunk ID `2`).

* **Client Action:** The client displays the fallback `<div>Loading...</div>` while awaiting chunk `2`.

1. **Row 3 (`2:...`):**

* The database query on the server finishes and outputs chunk ID `2`.
* **Client Action:** The client resolves the internal Promise for ID `2`, instantiates the `$D` date object, and swaps the Suspense fallback for the resolved component tree.

---

### 5. Server Actions Wire Format (`$F`)

When passing a Server Action or bound function from server to client:

```
0:["$","$L1",null,{"onSubmit":"$F2"}]

```

* The client deserializes `"$F2"` into an executable stub function.
* When called (e.g., in an `onClick` or `<form action>`):
* The browser sends a `POST` request to the server with `Next-Action: 2` (or the framework equivalent action identifier) along with serialized arguments.
* The server runs the action and returns a new Flight stream containing the revalidated state.

---

### Key Design Benefits of the Flight Wire Format

* **Streaming & Out-of-Order Execution:** Chunks can arrive in any order. The root tree can reference chunks `3`, `7`, and `a`, and React binds them progressively as the network delivers them.
* **Deduplication:** A reused object, data structure, or client component is referenced by its chunk ID (`$L1`, `$3`) instead of being serialized multiple times.
* **Low Memory Footprint:** The format uses plain text and raw JSON segments that modern browser JavaScript engines (`JSON.parse`) parse at native speeds.

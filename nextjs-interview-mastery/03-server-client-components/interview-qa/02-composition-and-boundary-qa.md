# Interview Q&A: Composition and the Serialization Boundary

**Q: Why can't a Client Component import a Server Component directly?**
A: Once inside a `"use client"` module's import graph, everything gets bundled for the browser — but Server Component code often depends on server-only resources (database clients, secret env vars, filesystem access) that can't run in a browser and shouldn't be shipped there. Rather than allow an import that would either break at runtime or leak server-only code to the client, the framework disallows it outright.

**Q: How do you render Server Component content inside a Client Component then?**
A: Via the "pass as children/props" pattern. A Server Component (higher up the tree) imports and renders the Server Component, then passes the resulting JSX as `children` (or another prop) into the Client Component. The Client Component never imports the Server Component's module — it just receives already-rendered React elements and places them in its own output. This works because the import and render happen in the Server Component doing the composing, not inside the Client Component itself.

**Q: What makes a prop "not serializable," concretely?**
A: Functions without a `'use server'` directive, class instances (their prototype/methods don't survive — only plain data properties do, if anything), React refs, Symbols, and anything holding a live server-side resource (an open DB connection, a stream). Plain objects/arrays of primitives, and specifically-supported built-ins like `Date`, generally do cross the boundary fine.

**Q: Why do Server Actions work as props even though they're functions?**
A: A function marked with `'use server'` isn't serialized as executable code — Next.js instead serializes a reference (effectively an ID) to that server-side function. When the client invokes it, that triggers a network request back to the server, which looks up and runs the real function there with the arguments provided, then returns the result. It behaves like a normal callback prop syntactically, but under the hood it's fundamentally a network call, not a local function invocation.

**Q: If you need a live-updating value from a Server Component to reach a Client Component, what pattern do you use since Context doesn't cross the boundary?**
A: Pass the server-known value as a plain prop into a Client Component, and have that Client Component itself set up a Context Provider (if the value needs to be consumed by several nested Client Components) using the prop as the initial/seed value. The Context Provider and all its consumers live entirely within the client tree from that point on — Context itself is never something a Server Component participates in directly.

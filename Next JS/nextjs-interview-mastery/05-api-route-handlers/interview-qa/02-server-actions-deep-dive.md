# Interview Q&A: Server Actions Deep Dive

**Q: What does `"use server"` actually do?**
A: It's a directive that marks a function (or every export in a module, if placed at the top of the file) as a Server Action — code that only ever executes on the server, and which the framework makes callable from Client Components via a generated reference rather than by shipping the function's implementation to the browser. It's the mirror image of `"use client"`: `"use client"` marks a boundary where code starts running in the browser, `"use server"` marks a boundary where a specific function always runs on the server regardless of where it's called from.

**Q: Can a Server Action be called from an `onClick` handler, or does it only work with `<form action={...}>`?**
A: Both work. `<form action={myAction}>` is the idiomatic pattern for mutations tied to form submission — it gets progressive enhancement (works without JS) and integrates with `useFormState`/`useFormStatus` for pending/error UI. But a Server Action is still just an async function, so calling it directly — `onClick={() => deleteItem(id)}` — is equally valid for actions not tied to a form (like a delete button in a list).

**Q: How does the client know which server function to call without shipping its source code?**
A: At build time, Next.js replaces each `"use server"` function's body, on the client bundle side, with a small reference — an opaque ID plus a network-call shim. When the Client Component "calls" the action, it actually triggers a POST to Next's internal action-handling endpoint carrying that reference and the serialized arguments; the real function body only ever executes server-side. This is why Server Action arguments must be serializable (primitives, plain objects/arrays, `FormData`) — you can't pass a class instance or a function as an argument.

**Q: If a Server Action mutates data, how does the UI reflect the change without a manual refetch?**
A: By calling `revalidatePath('/some/path')` or `revalidateTag('some-tag')` inside the action after the mutation completes. This invalidates Next's Full Route Cache / Data Cache for that path or tag, so the next render (which Next automatically triggers after the action resolves) picks up fresh data. Forgetting this call is one of the most common "why isn't my UI updating after I submit the form" bugs.

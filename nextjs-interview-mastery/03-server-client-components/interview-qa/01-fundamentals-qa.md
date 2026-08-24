# Interview Q&A: Server/Client Fundamentals

**Q: What's the default component type in the App Router, and how do you opt out of it?**
A: Server Component is the default for every file under `app/` — no directive needed. You opt into a Client Component by adding `"use client"` as the very first line of the file, which marks that module and its transitive imports (unless separately boundaried) as part of the client bundle.

**Q: Name three things a Server Component can do that a Client Component cannot.**
A: Directly query a database or call internal-only services without going through a public API; use secret environment variables (non-`NEXT_PUBLIC_`) directly; ship zero JavaScript to the browser for its own logic. A Client Component would need a Route Handler/Server Action to access a database, can only use public env vars, and always contributes its code to the client bundle.

**Q: Does `"use client"` prevent a component from being server-rendered for the initial HTML response?**
A: No. Client Components are still rendered to HTML on the server (or at build time) for the initial page load — `"use client"` only determines whether the component's JavaScript ships to the browser and hydrates for interactivity. The distinction is about where the code executes for interactivity, not about whether an initial server render happens at all.

**Q: What happens if a custom hook internally calls `useState`, and a Server Component tries to use that hook?**
A: It throws — hooks require a client rendering context regardless of whether the *calling* component or the hook's own module declares `"use client"`. If the hook or anything it depends on uses `useState`/`useEffect`/etc., the component that calls it must itself be a Client Component (or the hook usage needs to be moved into a Client Component further down the tree).

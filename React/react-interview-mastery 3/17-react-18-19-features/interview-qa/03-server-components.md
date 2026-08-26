# Interview Q&A: Server Components

**Q: What is a React Server Component, conceptually, and how is it different from server-side rendering (SSR)?**
A Server Component renders exclusively on the server and never ships its JavaScript to the client at all — there's no hydration for it, and it can directly access server-only resources like a database. Traditional SSR still renders the *same* client component code on the server for the initial HTML, but that component's JS is still sent to the browser afterward to hydrate and become interactive; RSC components skip that entirely because they have no client-side behavior to hydrate.

**Q: What does the `"use client"` directive do?**
Placed at the top of a file in an RSC-enabled framework, it marks that module (and everything it imports) as a Client Component boundary — it opts into client-side rendering, enabling hooks like `useState`, event handlers, and browser APIs, at the cost of shipping JS to the browser. Without it, components default to Server Components in that framework's convention.

**Q: What is `"use server"` for, and how is it different from a normal API route?**
It marks a function as a Server Action — callable directly from client-side code (e.g., a form's `action`) but guaranteed to execute on the server, letting you perform server-only work (database writes, secrets access) without manually defining and wiring a separate REST/API endpoint. The framework handles serializing the call across the network boundary.

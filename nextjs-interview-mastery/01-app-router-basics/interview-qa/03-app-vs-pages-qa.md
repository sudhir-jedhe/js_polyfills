# Interview Q&A: App Router vs Pages Router

**Q: Can `app/` and `pages/` coexist in the same Next.js project?**
A: Yes. Next.js checks `app/` first for a matching route, and falls back to `pages/` if no match is found there. This is the officially supported migration path — teams move routes over incrementally rather than doing a big-bang rewrite. A given URL, however, must not be defined in both simultaneously; that's ambiguous and Next.js will warn or error.

**Q: What's the single biggest rendering-model difference between the two routers?**
A: In the Pages Router, every page component is a Client Component by default — it hydrates like a traditional React SPA page, and data fetching happens in special exported functions (`getServerSideProps`, `getStaticProps`) that run separately from the component. In the App Router, components are Server Components by default — they render on the server (or at build time), can `await` data directly inline with no special exported function, and ship no JS to the client unless explicitly marked `"use client"`.

**Q: If asked in an interview "should I still use the Pages Router for a new project?" — what's the concise correct answer?**
A: No — for new Next.js projects, the App Router is the recommended default as of Next.js 13.4+, since it's where active feature development (Server Components, streaming, layouts, parallel/intercepting routes) is focused. The Pages Router remains fully supported for existing codebases and isn't going away overnight, but new projects shouldn't start there without a specific reason (e.g., a dependency that hasn't been updated for Server Components yet).

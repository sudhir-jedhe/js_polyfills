# Interview Q&A: Runtime and Execution Model

**Q: What runtime does Next.js middleware execute on by default, and why does that matter?**
A: The Edge Runtime, not Node.js. It's a minimal, Web-API-based environment without `fs`, native TCP (`net`), most Node-only npm packages, and Node's `crypto` module (Edge has the Web Crypto API instead). It matters because code that works fine in a Route Handler or Server Component — a Node-based Postgres driver, a filesystem read — can fail to build or throw at runtime inside `middleware.js` unless it's written against Web-standard APIs (`fetch`, Web Crypto, `URL`).

**Q: Middleware runs "before a request is completed" — before what, specifically?**
A: Before Next.js resolves routing — i.e., before it decides which page, layout, or Route Handler will actually generate the response. Middleware sits ahead of that resolution and can redirect, rewrite, or pass through with modified headers/cookies, all before any component or handler code for the eventual destination executes.

**Q: Can middleware make a request to your own database directly?**
A: Only if you're using an Edge-compatible client — most traditional Node database drivers (raw `pg`, `mysql2`, Prisma's default Node engine) don't work in the Edge Runtime. The common workaround is either an HTTP-based driver built for edge environments, or avoiding the DB hit in middleware altogether by encoding what you need (auth status, role) in a signed cookie/JWT that middleware can verify locally without a network round trip.

**Q: Is there a way to run middleware on the Node.js runtime instead of Edge?**
A: In recent Next.js versions, yes, via runtime configuration — but it's the exception, and not all deployment platforms support Node-runtime middleware identically to Edge middleware. The default assumption to work from, and the one interviewers expect, is that middleware code should be Edge-safe unless you have a specific, deliberate reason and platform support for opting out.
